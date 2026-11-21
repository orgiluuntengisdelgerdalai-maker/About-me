import React, { useState, useEffect } from 'react';
import {
  Send,
  Heart,
  Flame,
  Sparkles,
  Users,
  Globe2,
  Database,
  LogIn,
  LogOut,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { User } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import {
  GUESTBOOK_BADGES,
  GuestbookBadge,
  GuestbookCommentRecord,
  subscribeToGuestbookComments,
  addGuestbookComment,
  toggleGuestbookCommentLike,
  fetchUserLikedCommentIds,
  deleteGuestbookComment,
  signInWithGoogle,
  signOutUser,
} from '../firebase';

interface GuestbookProps {
  currentUser: User | null;
}

function formatCommentTime(ts?: Timestamp | null): string {
  if (!ts) return 'Дөнгөж сая';
  const date = ts.toDate();
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  if (diffMs < 60_000) return 'Дөнгөж сая';

  const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;

  const isSameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isSameDay) {
    return `Өнөөдөр, ${timeStr}`;
  }

  return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date
    .getDate()
    .toString()
    .padStart(2, '0')} ${timeStr}`;
}

export const Guestbook: React.FC<GuestbookProps> = ({ currentUser }) => {
  const [comments, setComments] = useState<GuestbookCommentRecord[]>([]);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [cheerCount, setCheerCount] = useState<number>(136);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [likingId, setLikingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [name, setName] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [selectedBadge, setSelectedBadge] = useState<GuestbookBadge>(GUESTBOOK_BADGES[0]);

  // Pre-fill display name once signed in if input is still empty
  useEffect(() => {
    if (currentUser?.displayName && !name.trim()) {
      setName(currentUser.displayName.slice(0, 50));
    }
  }, [currentUser]);

  // Subscribe to real-time Firestore guestbook comments
  useEffect(() => {
    setLoading(true);
    setErrorMsg(null);

    const unsubscribe = subscribeToGuestbookComments(
      (list) => {
        setComments(list);
        setLoading(false);
      },
      (err) => {
        console.error('Guestbook Firestore subscription error:', err);
        setErrorMsg('Өгөгдлийн сангаас сэтгэгдэл татахад алдаа гарлаа.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Load which comments the signed-in user has already liked
  useEffect(() => {
    if (!currentUser || comments.length === 0) {
      setLikedIds(new Set());
      return;
    }

    let cancelled = false;
    fetchUserLikedCommentIds(comments.map((c) => c.id)).then((likedSet) => {
      if (!cancelled) {
        setLikedIds(likedSet);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [currentUser?.uid, comments.length]);

  // Load initial global cheer counter
  useEffect(() => {
    fetch('/api/guestbook')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.cheerCount === 'number') {
          setCheerCount(data.cheerCount);
        }
      })
      .catch(() => {
        // Non-critical cheer counter fallback
      });
  }, []);

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

  const handleGiveCheer = async () => {
    setCheerCount((prev) => prev + 1);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#06b6d4', '#f59e0b', '#ec4899', '#3b82f6'],
    });

    try {
      const res = await fetch('/api/cheer', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.cheerCount === 'number') {
          setCheerCount(data.cheerCount);
        }
      }
    } catch {
      // Optimistic count already updated
    }
  };

  const handleLikeMessage = async (commentId: string) => {
    if (likingId === commentId) return;
    setErrorMsg(null);

    let activeUser = currentUser;
    if (!activeUser) {
      try {
        setAuthLoading(true);
        activeUser = await signInWithGoogle();
      } catch {
        setErrorMsg('Зүрх дарахын тулд эхлээд Google хаягаар нэвтэрнэ үү.');
        setAuthLoading(false);
        return;
      } finally {
        setAuthLoading(false);
      }
    }

    if (!activeUser) return;

    setLikingId(commentId);
    try {
      const nowLiked = await toggleGuestbookCommentLike(commentId);
      setLikedIds((prev) => {
        const next = new Set(prev);
        if (nowLiked) next.add(commentId);
        else next.delete(commentId);
        return next;
      });
    } catch (err) {
      console.error('Like toggle failed:', err);
      setErrorMsg('Лайк хадгалахад алдаа гарлаа.');
    } finally {
      setLikingId(null);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    setErrorMsg(null);
    try {
      await deleteGuestbookComment(commentId);
    } catch (err) {
      console.error('Delete comment failed:', err);
      setErrorMsg('Энэ сэтгэгдлийг устгах эрх хүрсэнгүй.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim() || isSubmitting) return;

    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      let activeUser = currentUser;
      if (!activeUser) {
        activeUser = await signInWithGoogle();
      }
      if (!activeUser) {
        setErrorMsg('Сэтгэгдэл хадгалахын тулд Google хаягаар нэвтэрнэ үү.');
        return;
      }

      await addGuestbookComment({
        authorName: name.trim(),
        message: message.trim(),
        badge: selectedBadge,
      });

      setMessage('');

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#10b981', '#3b82f6', '#f59e0b'],
      });
    } catch (err) {
      console.error('Error posting comment to Firestore:', err);
      setErrorMsg('Сэтгэгдлийг өгөгдлийн санд хадгалахад алдаа гарлаа. Та Google-ээр нэвтэрсэн эсэхээ шалгана уу.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="guestbook-section" className="my-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-cyan-400 font-mono text-xs tracking-widest uppercase">
            <span>05</span>
            <span>·</span>
            <span>ЗОЧНЫ ДЭВТЭР</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <Database className="w-3.5 h-3.5" />
              FIRESTORE DB
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white mt-1">
            Оргилуунтэнгист Урам Хайрлаарай! 💬
          </h2>
          <p className="text-slate-300 text-sm mt-1 max-w-xl font-light leading-relaxed">
            Таны бичсэн сэтгэгдэл Firebase Firestore өгөгдлийн санд мөнх хадгалагдаж,
            бүх зочдод бодит цаг хугацаанд шууд харагдах болно.
          </p>
        </div>

        {/* Big Cheer Button & Auth Control */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full md:w-auto">
          <button
            onClick={handleGiveCheer}
            className="min-h-[44px] flex-1 md:flex-initial px-4 sm:px-6 py-3 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 active:scale-95 text-white font-heading font-bold text-xs tracking-wider uppercase rounded-2xl shadow-[0_0_25px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-200 fill-current shrink-0" />
            <span className="truncate">Урам өгөх! ({cheerCount})</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Form to leave a message */}
        <div className="lg:col-span-5 bg-black/90 border border-white/10 cosmic-grid rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Сэтгэгдэл бичих</span>
              </h3>
              <span className="text-[11px] font-mono text-emerald-400">
                Үүлэн санд хадгалагдана
              </span>
            </div>

            {/* Google Auth Bar for Guestbook */}
            {currentUser ? (
              <div className="flex items-center justify-between gap-3 bg-white/5 border border-emerald-500/30 rounded-2xl px-3.5 py-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'User'}
                      className="w-7 h-7 rounded-full border border-cyan-400/50 object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-xs font-bold text-cyan-300 shrink-0">
                      {(currentUser.displayName || 'З').slice(0, 1)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <span className="text-xs font-heading font-bold text-white block leading-tight truncate">
                      {currentUser.displayName || 'Зочин'}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">
                      DB Холбогдсон
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  title="Гарах"
                  aria-label="Гарах"
                  className="min-w-[36px] min-h-[36px] flex items-center justify-center p-1.5 text-slate-400 hover:text-rose-400 hover:bg-white/10 rounded-xl transition-colors cursor-pointer shrink-0"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-cyan-950/25 border border-cyan-500/30 rounded-2xl px-3.5 py-2.5">
                <span className="text-[11px] text-slate-300 font-light leading-snug">
                  Өгөгдлийн санд сэтгэгдэл бичихийн тулд Google-ээр нэвтэрнэ үү.
                </span>
                <button
                  type="button"
                  onClick={handleSignIn}
                  disabled={authLoading}
                  className="min-h-[40px] px-3.5 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 font-heading font-bold text-[11px] tracking-wider uppercase rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-50"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{authLoading ? 'Түр...' : 'Нэвтрэх'}</span>
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1 tracking-wider uppercase">
                  Таны нэр:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={50}
                  placeholder="Жишээ: Анударь эгч, Бат найз, Зочин..."
                  required
                  className="w-full min-h-[44px] px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-base sm:text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1 tracking-wider uppercase">
                  Сонгох сэдэв:
                </label>
                <div className="flex flex-wrap gap-2">
                  {GUESTBOOK_BADGES.map((badge) => (
                    <button
                      type="button"
                      key={badge}
                      onClick={() => setSelectedBadge(badge)}
                      className={`min-h-[40px] text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        selectedBadge === badge
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-medium'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {badge}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-mono text-slate-400 tracking-wider uppercase">
                    Урмын үг / Сэтгэгдэл:
                  </label>
                  <span className="text-[10px] font-mono text-slate-500 tabular-nums">
                    {message.length}/500
                  </span>
                </div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={500}
                  rows={3}
                  placeholder="Оргилуунтэнгист хандаж сайхан үг, сэтгэгдлээ бичээрэй..."
                  required
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-base sm:text-sm focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || authLoading}
                className="w-full min-h-[48px] py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 active:scale-98 disabled:opacity-50 text-white font-heading font-bold text-xs tracking-wider uppercase rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? 'Хадгалж байна...'
                    : currentUser
                    ? 'Өгөгдлийн санд нийтлэх'
                    : 'Google-ээр нэвтэрч нийтлэх'}
                </span>
              </button>
            </form>
          </div>

          {/* Quick reactions */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <span className="text-xs text-slate-400 block mb-2 font-mono uppercase tracking-wider">
              Шууд урам өгөх:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (!name.trim()) setName(currentUser?.displayName?.slice(0, 50) || 'Зочин');
                  setMessage('🔥 12 настай гэхэд үнэхээр мундаг байна! Амжилт хүсье!');
                  setSelectedBadge('🚀 Ирээдүйн Инженер');
                }}
                className="min-h-[40px] px-3 py-1.5 bg-white/5 border border-white/10 hover:border-white/20 text-slate-300 text-xs rounded-xl transition-colors cursor-pointer"
              >
                🔥 Шилдэг нь!
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!name.trim()) setName(currentUser?.displayName?.slice(0, 50) || 'Сагсны хорхойтон');
                  setMessage('🏀 Сагсаа ч сайн тоглоод, кодоо ч сайн бичээрэй!');
                  setSelectedBadge('🏀 Сагсан бөмбөг');
                }}
                className="min-h-[40px] px-3 py-1.5 bg-white/5 border border-white/10 hover:border-white/20 text-slate-300 text-xs rounded-xl transition-colors cursor-pointer"
              >
                🏀 Сагсаа амжилттай тоглоорой!
              </button>
            </div>
          </div>
        </div>

        {/* Live Visitor Comments Message Feed */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3 px-1">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>ЗОЧДЫН СЭТГЭГДЛҮҮД ({comments.length})</span>
            </span>
            <span className="text-[11px] font-mono text-cyan-400/90 flex items-center gap-1.5">
              <Globe2 className="w-3 h-3 animate-spin" style={{ animationDuration: '10s' }} />
              Бодит цагийн Firestore
            </span>
          </div>

          <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
            {loading ? (
              <div className="p-8 text-center text-xs font-mono text-slate-400 border border-white/10 rounded-2xl bg-black/60">
                Өгөгдлийн сангаас сэтгэгдлүүдийг татаж байна...
              </div>
            ) : comments.length === 0 ? (
              <div className="p-8 text-center text-slate-400 border border-dashed border-white/15 rounded-2xl bg-black/60 text-sm">
                Одоогоор өгөгдлийн санд сэтгэгдэл ороогүй байна. Та анхны сэтгэгдлийг үлдээгээрэй!
              </div>
            ) : (
              comments.map((msg) => {
                const isMine = currentUser?.uid === msg.userId;
                const isLiked = likedIds.has(msg.id);
                return (
                  <div
                    key={msg.id}
                    className={`bg-black/90 border rounded-2xl p-4 transition-colors shadow-lg ${
                      isMine
                        ? 'border-cyan-500/35 hover:border-cyan-400/50'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-heading font-bold text-xs shadow-md shrink-0">
                          {msg.authorName.slice(0, 1).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-heading font-bold text-white leading-tight truncate">
                              {msg.authorName}
                            </span>
                            {isMine && (
                              <span className="text-[10px] font-mono text-cyan-400 shrink-0">
                                · Та
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono block">
                            {formatCommentTime(msg.createdAt)}
                          </span>
                        </div>
                      </div>

                      {msg.badge && (
                        <span className="text-[10px] font-mono text-slate-300 uppercase tracking-wider">
                          {msg.badge}
                        </span>
                      )}
                    </div>

                    <p className="text-slate-300 text-sm leading-relaxed mb-2 font-light break-words whitespace-pre-wrap">
                      {msg.message}
                    </p>

                    <div className="flex items-center justify-end gap-1.5">
                      {isMine && (
                        <button
                          type="button"
                          onClick={() => handleDeleteComment(msg.id)}
                          title="Сэтгэгдэл устгах"
                          aria-label="Сэтгэгдэл устгах"
                          className="min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-500 hover:text-rose-400 transition-colors p-2 rounded-lg hover:bg-white/5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleLikeMessage(msg.id)}
                        disabled={likingId === msg.id}
                        aria-label="Таалагдлаа"
                        className={`min-h-[40px] min-w-[44px] flex items-center justify-center gap-1.5 text-xs transition-colors px-3 py-1 rounded-lg hover:bg-white/5 cursor-pointer disabled:opacity-50 ${
                          isLiked
                            ? 'text-pink-400'
                            : 'text-slate-400 hover:text-cyan-400'
                        }`}
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            isLiked ? 'text-pink-400 fill-current' : 'text-cyan-400'
                          }`}
                        />
                        <span className="tabular-nums">{msg.likesCount}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
