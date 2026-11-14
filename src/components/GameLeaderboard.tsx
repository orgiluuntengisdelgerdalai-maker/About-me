import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  Trophy,
  Database,
  LogIn,
  LogOut,
  Trash2,
  Medal,
  Flame,
  AlertCircle,
} from 'lucide-react';
import {
  GameId,
  GameScoreRecord,
  subscribeToGameScores,
  signInWithGoogle,
  signOutUser,
  deleteGameScore,
} from '../firebase';

interface GameLeaderboardProps {
  currentUser: User | null;
  defaultFilter?: GameId | 'all';
}

export const GameLeaderboard: React.FC<GameLeaderboardProps> = ({
  currentUser,
  defaultFilter = 'all',
}) => {
  const [filter, setFilter] = useState<GameId | 'all'>(defaultFilter);
  const [scores, setScores] = useState<GameScoreRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(false);

  useEffect(() => {
    setFilter(defaultFilter);
  }, [defaultFilter]);

  useEffect(() => {
    setLoading(true);
    setErrorMsg(null);

    const unsubscribe = subscribeToGameScores(
      filter,
      (list) => {
        setScores(list);
        setLoading(false);
      },
      (err) => {
        console.error('Leaderboard subscription error:', err);
        setErrorMsg('Өгөгдлийн сангаас оноо татахад алдаа гарлаа.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [filter]);

  const handleSignIn = async () => {
    if (authLoading) return;
    setAuthLoading(true);
    setErrorMsg(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Sign in failed:', err);
      setErrorMsg('Google хаягаар нэвтрэхэд алдаа гарлаа. Дахин оролдоно уу.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteGameScore(id);
    } catch (err) {
      console.error('Delete score failed:', err);
      setErrorMsg('Энэ оноог устгах эрх хүрсэнгүй.');
    }
  };

  const formatGameName = (gameId: GameId) =>
    gameId === 'basketball' ? '🏀 Сагсан бөмбөг' : '🍥 Anime Quiz';

  const formatDifficulty = (diff: string) => {
    switch (diff) {
      case 'easy':
        return 'Easy';
      case 'medium':
        return 'Medium';
      case 'hard':
        return 'Hard';
      case 'god':
        return 'God';
      default:
        return 'Standard';
    }
  };

  return (
    <div className="bg-black/90 border border-white/10 cosmic-grid rounded-3xl p-6 lg:p-8 text-white shadow-[0_0_50px_rgba(0,0,0,0.85)] relative overflow-hidden">
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header & Auth Control */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-widest uppercase">
            <Database className="w-3.5 h-3.5" />
            <span>FIREBASE FIRESTORE DB</span>
            <span>·</span>
            <span>БОДИТ ӨГӨГДЛИЙН САН</span>
          </div>
          <h3 className="text-2xl font-heading font-extrabold text-white mt-1 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <span>Шилдэг Тоглогчдын Самбар</span>
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 font-light">
            Google хаягаараа нэвтэрч тоглосон оноогоо үүлэн өгөгдлийн санд мөнх хадгалаарай.
          </p>
        </div>

        {/* User Auth Bar */}
        <div className="flex flex-wrap items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3 bg-white/5 border border-white/15 rounded-2xl px-4 py-2">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'User'}
                  className="w-8 h-8 rounded-full border border-cyan-400/50 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-xs font-bold text-cyan-300">
                  {(currentUser.displayName || 'Т').slice(0, 1)}
                </div>
              )}
              <div className="text-left">
                <span className="text-xs font-heading font-bold text-white block leading-tight">
                  {currentUser.displayName || 'Тоглогч'}
                </span>
                <span className="text-[10px] font-mono text-emerald-400">
                  DB Холбогдсон
                </span>
              </div>
              <button
                onClick={handleSignOut}
                title="Гарах"
                className="ml-2 p-2 text-slate-400 hover:text-rose-400 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleSignIn}
              disabled={authLoading}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 active:scale-95 disabled:opacity-50 text-white font-heading font-bold text-xs tracking-wider uppercase rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>{authLoading ? 'Нэвтэрч байна...' : 'Google-ээр нэвтрэх'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 my-5">
        <div className="flex items-center gap-1.5 p-1 bg-white/5 border border-white/10 rounded-xl">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 text-xs font-heading font-bold tracking-wider rounded-lg transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-cyan-500 text-black shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Бүх тоглоом
          </button>
          <button
            onClick={() => setFilter('basketball')}
            className={`px-3.5 py-1.5 text-xs font-heading font-bold tracking-wider rounded-lg transition-all cursor-pointer ${
              filter === 'basketball'
                ? 'bg-amber-500 text-black shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            🏀 Сагсан бөмбөг
          </button>
          <button
            onClick={() => setFilter('anime-quiz')}
            className={`px-3.5 py-1.5 text-xs font-heading font-bold tracking-wider rounded-lg transition-all cursor-pointer ${
              filter === 'anime-quiz'
                ? 'bg-purple-500 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            🍥 Anime Quiz
          </button>
        </div>

        <span className="text-xs font-mono text-slate-400">
          Нийт бүртгэл: {scores.length}
        </span>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Scores List */}
      <div className="relative z-10 space-y-2.5">
        {loading ? (
          <div className="py-10 text-center text-xs font-mono text-slate-400">
            Өгөгдлийн сангаас оноо татаж байна...
          </div>
        ) : scores.length === 0 ? (
          <div className="py-10 px-4 text-center border border-dashed border-white/15 rounded-2xl text-slate-400 text-sm">
            Одоогоор хадгалагдсан оноо байхгүй байна. Эхний рекордыг та тогтоож DB-д хадгалаарай!
          </div>
        ) : (
          scores.map((item, idx) => {
            const isMine = currentUser?.uid === item.userId;
            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 transition-colors ${
                  isMine
                    ? 'bg-cyan-950/25 border-cyan-500/40'
                    : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-heading font-extrabold text-sm shrink-0 ${
                      idx === 0
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50'
                        : idx === 1
                        ? 'bg-slate-300/20 text-slate-200 border border-slate-300/40'
                        : idx === 2
                        ? 'bg-orange-700/25 text-orange-300 border border-orange-500/40'
                        : 'bg-white/5 text-slate-400 border border-white/10'
                    }`}
                  >
                    {idx < 3 ? <Medal className="w-4 h-4" /> : `#${idx + 1}`}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-sm text-white truncate">
                        {item.playerName}
                      </span>
                      {isMine && (
                        <span className="text-[10px] font-mono text-cyan-400">· Та</span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-400 mt-0.5">
                      <span>{formatGameName(item.gameId)}</span>
                      <span aria-hidden="true">·</span>
                      <span>{formatDifficulty(item.difficulty)}</span>
                      {item.streak > 0 && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-orange-300 inline-flex items-center gap-0.5">
                            <Flame className="w-3 h-3" /> {item.streak} стреак
                          </span>
                        </>
                      )}
                      {item.gameId === 'anime-quiz' && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className={item.won ? 'text-emerald-400' : 'text-rose-400'}>
                            {item.won ? 'Ялсан' : 'Дутуу'}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xl font-heading font-extrabold text-amber-400 block leading-none">
                      {item.score}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">
                      {item.gameId === 'basketball' ? 'оноо' : '/ 15 зөв'}
                    </span>
                  </div>

                  {isMine && (
                    <button
                      onClick={() => handleDelete(item.id)}
                      title="Өөрийн оноог устгах"
                      className="p-2 text-slate-500 hover:text-rose-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
