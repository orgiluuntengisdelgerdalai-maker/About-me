import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  addDoc,
  collection,
  query,
  where,
  limit,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  writeBatch,
  increment,
  Timestamp,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

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

function getAuthErrorCode(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    return String((error as { code?: unknown }).code || '');
  }
  return '';
}

export function formatFirebaseAuthError(error: unknown): string {
  const code = getAuthErrorCode(error);
  const host = typeof window !== 'undefined' ? window.location.hostname : '';

  switch (code) {
    case 'auth/unauthorized-domain':
      return `Энэ домэйн (${host || 'одоогийн хаяг'}) Firebase-ийн зөвшөөрөгдсөн домэйнд бүртгэгдээгүй байна. Firebase Console → Authentication → Settings → Authorized domains хэсэгт «${host}» хаягийг нэмнэ үү.`;
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Та Google нэвтрэх цонхыг хаасан байна. Дахин оролдоно уу.';
    case 'auth/popup-blocked':
      return 'Хөтөч Pop-up цонхыг блоклосон байна. Хөтчийн тохиргооноос Pop-up зөвшөөрөөд дахин оролдоно уу.';
    case 'auth/operation-not-supported-in-this-environment':
      return 'Энэ хөтчийн орчинд Pop-up нэвтрэлт дэмжигдэхгүй байна. Chrome эсвэл Safari хөтчөөр нээж оролдоно уу.';
    case 'auth/network-request-failed':
      return 'Интернэт холболтоо шалгаад дахин оролдоно уу.';
    default:
      return code
        ? `Google хаягаар нэвтрэхэд алдаа гарлаа (${code}). Дахин оролдоно уу.`
        : 'Google хаягаар нэвтрэхэд алдаа гарлаа. Дахин оролдоно уу.';
  }
}

export async function completeRedirectSignIn(): Promise<User | null> {
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      await syncUserProfile(result.user);
      return result.user;
    }
    return null;
  } catch (err) {
    console.error('Redirect sign-in result error:', err);
    return null;
  }
}

export async function signInWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    if (user) {
      await syncUserProfile(user);
    }
    return user;
  } catch (error) {
    const code = getAuthErrorCode(error);
    const isStandaloneWindow = typeof window !== 'undefined' && window.self === window.top;
    if (
      isStandaloneWindow &&
      (code === 'auth/popup-blocked' || code === 'auth/operation-not-supported-in-this-environment')
    ) {
      await signInWithRedirect(auth, googleProvider);
      return null;
    }
    throw error;
  }
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

export const GUESTBOOK_BADGES = [
  '🚀 Ирээдүйн Инженер',
  '🏀 Сагсан бөмбөг',
  '🥟 Хуушуур',
  '⛏️ Minecraft',
] as const;

export type GuestbookBadge = (typeof GUESTBOOK_BADGES)[number];

export interface GuestbookCommentRecord {
  id: string;
  userId: string;
  authorName: string;
  message: string;
  badge: GuestbookBadge;
  likesCount: number;
  createdAt?: Timestamp | null;
}

export function subscribeToGuestbookComments(
  onData: (comments: GuestbookCommentRecord[]) => void,
  onError?: (err: Error) => void
): () => void {
  const path = 'guestbook_comments';
  const colRef = collection(db, path);
  const q = query(colRef, where('badge', 'in', [...GUESTBOOK_BADGES]), limit(100));

  return onSnapshot(
    q,
    (snapshot) => {
      const list: GuestbookCommentRecord[] = snapshot.docs
        .map((d) => {
          const data = d.data();
          const rawBadge = String(data.badge || '');
          const badge = (GUESTBOOK_BADGES.includes(rawBadge as GuestbookBadge)
            ? rawBadge
            : GUESTBOOK_BADGES[0]) as GuestbookBadge;
          return {
            id: d.id,
            userId: String(data.userId || ''),
            authorName: String(data.authorName || 'Зочин'),
            message: String(data.message || ''),
            badge,
            likesCount: Number(data.likesCount || 0),
            createdAt: data.createdAt || null,
          };
        })
        .sort((a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0));
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

export async function addGuestbookComment(params: {
  authorName: string;
  message: string;
  badge: GuestbookBadge;
}): Promise<string> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Сэтгэгдэл үлдээхийн тулд эхлээд Google хаягаар нэвтэрнэ үү.');
  }

  const authorName = params.authorName.trim().slice(0, 50) || (user.displayName || 'Зочин').trim().slice(0, 50) || 'Зочин';
  const message = params.message.trim().slice(0, 500);
  if (!message) {
    throw new Error('Сэтгэгдлийн хэсгийг бөглөнө үү.');
  }
  const badge: GuestbookBadge = GUESTBOOK_BADGES.includes(params.badge)
    ? params.badge
    : GUESTBOOK_BADGES[0];

  const path = 'guestbook_comments';
  try {
    const docRef = await addDoc(collection(db, path), {
      userId: user.uid,
      authorName,
      message,
      badge,
      likesCount: 0,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function toggleGuestbookCommentLike(commentId: string): Promise<boolean> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Зүрх дарахын тулд эхлээд Google хаягаар нэвтэрнэ үү.');
  }

  const commentRef = doc(db, 'guestbook_comments', commentId);
  const likeRef = doc(db, 'guestbook_comments', commentId, 'likes', user.uid);
  const path = `guestbook_comments/${commentId}/likes/${user.uid}`;

  try {
    const likeSnap = await getDoc(likeRef);
    const batch = writeBatch(db);
    if (likeSnap.exists()) {
      batch.delete(likeRef);
      batch.update(commentRef, { likesCount: increment(-1) });
      await batch.commit();
      return false;
    } else {
      batch.set(likeRef, {
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
      batch.update(commentRef, { likesCount: increment(1) });
      await batch.commit();
      return true;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fetchUserLikedCommentIds(commentIds: string[]): Promise<Set<string>> {
  const user = auth.currentUser;
  if (!user || commentIds.length === 0) return new Set();

  const liked = new Set<string>();
  await Promise.all(
    commentIds.slice(0, 50).map(async (commentId) => {
      try {
        const snap = await getDoc(doc(db, 'guestbook_comments', commentId, 'likes', user.uid));
        if (snap.exists()) {
          liked.add(commentId);
        }
      } catch {
        // Ignore individual read failures so UI remains responsive
      }
    })
  );
  return liked;
}

export async function deleteGuestbookComment(commentId: string): Promise<void> {
  const path = `guestbook_comments/${commentId}`;
  try {
    await deleteDoc(doc(db, 'guestbook_comments', commentId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

