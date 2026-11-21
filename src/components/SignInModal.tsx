import React, { useState, useEffect } from 'react';
import { LogIn, ArrowRight, Gamepad2, MessageSquare, Trophy, X, AlertCircle } from 'lucide-react';
import { signInWithGoogle, formatFirebaseAuthError } from '../firebase';

interface SignInModalProps {
  isOpen: boolean;
  canDismiss?: boolean;
  onContinueAsGuest: () => void;
  onSuccess?: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  canDismiss = true,
  onContinueAsGuest,
  onSuccess,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !canDismiss) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onContinueAsGuest();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, canDismiss, onContinueAsGuest]);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    if (loading) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const user = await signInWithGoogle();
      if (user && onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Entry sign-in failed:', err);
      setErrorMsg(formatFirebaseAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="signin-entry-title"
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
    >
      <div className="relative w-full max-w-md bg-[#070912]/95 border border-white/15 cosmic-grid rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(6,182,212,0.22)] text-white">
        {canDismiss && (
          <button
            type="button"
            onClick={onContinueAsGuest}
            aria-label="Хаах"
            className="absolute top-4 right-4 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Dual-orb Brand Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative w-8 h-6 flex items-center shrink-0">
            <div className="w-4 h-4 rounded-full bg-cyan-400 opacity-90 shadow-[0_0_14px_#38bdf8]"></div>
            <div className="w-4 h-4 rounded-full bg-blue-600 -ml-1.5 opacity-90 shadow-[0_0_14px_#2563eb]"></div>
          </div>
          <div className="text-xs font-mono tracking-widest uppercase text-cyan-400">
            <span>ОРГИЛУУНТЭНГИС</span>
            <span className="mx-1.5 text-slate-600" aria-hidden="true">·</span>
            <span className="text-slate-300">GALAXY PORTAL</span>
          </div>
        </div>

        <h2
          id="signin-entry-title"
          className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight leading-tight"
        >
          Тавтай морилно уу!
        </h2>
        <p className="text-slate-300 text-sm mt-2 leading-relaxed font-light">
          Google хаягаараа нэвтэрч Оргилуунтэнгисийн вэбсайт руу ороод бүх боломжийг нээгээрэй.
        </p>

        {/* Feature highlights (clean unboxed list) */}
        <div className="mt-5 pt-4 border-t border-white/10 space-y-2.5 text-xs text-slate-300">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Тоглоомын оноогоо үүлэн санд хадгалж, шилдэгт бичигдэх</span>
          </div>
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Зочны дэвтэрт сэтгэгдэл бичиж, зүрх дарах</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Gamepad2 className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Сагсан бөмбөг, Anime Quiz, Vibe Fighter тоглох</span>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Primary & Secondary Actions */}
        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full min-h-[48px] px-5 py-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 active:scale-[0.99] disabled:opacity-60 text-white font-heading font-bold text-xs tracking-wider uppercase rounded-2xl shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81Z"
              />
            </svg>
            <span>{loading ? 'Нэвтэрч байна...' : 'Google хаягаар нэвтрэх'}</span>
            {!loading && <LogIn className="w-4 h-4 shrink-0" />}
          </button>

          <button
            type="button"
            onClick={onContinueAsGuest}
            disabled={loading}
            className="w-full min-h-[44px] px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 text-slate-300 hover:text-white font-heading font-semibold text-xs tracking-wider uppercase rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Зочноор үргэлжлүүлэх</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};
