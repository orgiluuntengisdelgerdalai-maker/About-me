import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  setDoc,
  addDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate connection to Firestore on initial boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

export type GameId = 'basketball' | 'anime-quiz';
export type DifficultyMode = 'standard' | 'easy' | 'medium' | 'hard' | 'god';

export interface GameScoreRecord {
  id: string;
  userId: string;
  playerName: string;
  gameId: GameId;
  difficulty: DifficultyMode;
  score: number;
  streak: number;
  timeLeftSeconds: number;
  won: boolean;
  createdAt?: Timestamp | null;
}

export async function signInWithGoogle(): Promise<User | null> {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  if (user) {
    await syncUserProfile(user);
  }
  return user;
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

export async function syncUserProfile(user: User): Promise<void> {
  const profilePath = `users/${user.uid}`;
  const ref = doc(db, 'users', user.uid);
  const safeName = (user.displayName || 'Тоглогч').trim().slice(0, 60) || 'Тоглогч';

  try {
    const existingSnap = await getDocFromServer(ref).catch(() => null);
    if (existingSnap && existingSnap.exists()) {
      await setDoc(
        ref,
        {
          displayName: safeName,
          ...(user.photoURL ? { photoURL: user.photoURL.slice(0, 500) } : {}),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } else {
      await setDoc(ref, {
        uid: user.uid,
        displayName: safeName,
        ...(user.photoURL ? { photoURL: user.photoURL.slice(0, 500) } : {}),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, profilePath);
  }
}

export async function saveGameScore(params: {
  gameId: GameId;
  difficulty: DifficultyMode;
  score: number;
  streak: number;
  timeLeftSeconds: number;
  won: boolean;
  customPlayerName?: string;
}): Promise<string> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Оноо хадгалахын тулд эхлээд Google хаягаар нэвтэрнэ үү.');
  }

  const rawName = (params.customPlayerName || user.displayName || 'Тоглогч').trim();
  const playerName = rawName.slice(0, 60) || 'Тоглогч';
  const clampedScore = Math.max(0, Math.min(10000, Math.round(params.score)));
  const clampedStreak = Math.max(0, Math.min(1000, Math.round(params.streak)));
  const clampedTime = Math.max(0, Math.min(3600, Number(params.timeLeftSeconds.toFixed(1))));

  const path = 'game_scores';
  try {
    const docRef = await addDoc(collection(db, path), {
      userId: user.uid,
      playerName,
      gameId: params.gameId,
      difficulty: params.difficulty,
      score: clampedScore,
      streak: clampedStreak,
      timeLeftSeconds: clampedTime,
      won: Boolean(params.won),
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deleteGameScore(scoreId: string): Promise<void> {
  const path = `game_scores/${scoreId}`;
  try {
    await deleteDoc(doc(db, 'game_scores', scoreId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeToGameScores(
  gameId: GameId | 'all',
  onData: (scores: GameScoreRecord[]) => void,
  onError?: (err: Error) => void
): () => void {
  const path = 'game_scores';
  const colRef = collection(db, path);
  const q =
    gameId === 'all'
      ? query(colRef, where('gameId', 'in', ['basketball', 'anime-quiz']), limit(60))
      : query(colRef, where('gameId', '==', gameId), limit(50));

  return onSnapshot(
    q,
    (snapshot) => {
      const list: GameScoreRecord[] = snapshot.docs
        .map((d) => {
          const data = d.data();
          return {
            id: d.id,
            userId: String(data.userId || ''),
            playerName: String(data.playerName || 'Тоглогч'),
            gameId: data.gameId as GameId,
            difficulty: data.difficulty as DifficultyMode,
            score: Number(data.score || 0),
            streak: Number(data.streak || 0),
            timeLeftSeconds: Number(data.timeLeftSeconds || 0),
            won: Boolean(data.won),
            createdAt: data.createdAt || null,
          };
        })
        .sort((a, b) => b.score - a.score || b.streak - a.streak)
        .slice(0, 20);
      onData(list);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (wrappedErr) {
        if (onError && wrappedErr instanceof Error) {
          onError(wrappedErr);
        }
      }
    }
  );
}
