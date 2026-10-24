import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Award, RotateCcw, VolumeX, Flame, Sparkles } from 'lucide-react';

export const BasketballGame: React.FC = () => {
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [isShooting, setIsShooting] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [ballPosition, setBallPosition] = useState<{ x: number; y: number }>({ x: 50, y: 80 });

  const shootBall = (power: 'normal' | 'three_pointer' = 'normal') => {
    if (isShooting) return;
    setIsShooting(true);
    setLastResult(null);

    const isSuccess = Math.random() > 0.15;
    const points = power === 'three_pointer' ? 3 : 2;

    setTimeout(() => {
      setBallPosition({ x: 50, y: 25 });
    }, 100);

    setTimeout(() => {
      if (isSuccess) {
        setScore((prev) => prev + points);
        setStreak((prev) => {
          const next = prev + 1;
          if (next % 3 === 0) {
            confetti({
              particleCount: 60,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#f97316', '#fbbf24', '#38bdf8', '#06b6d4'],
            });
          }
          return next;
        });
        setLastResult(power === 'three_pointer' ? '🔥 3 ОНОО! Төгс шидэлт!' : '🎯 СВҮҮШ! 2 Оноо орлоо!');
      } else {
        setStreak(0);
        setLastResult('🏀 Цагираг мөргөөд ойлоо! Дахиад шидээд үз!');
      }

      setTimeout(() => {
        setBallPosition({ x: 50, y: 80 });
        setIsShooting(false);
      }, 500);
    }, 600);
  };

  const resetGame = () => {
    setScore(0);
    setStreak(0);
    setLastResult(null);
    setBallPosition({ x: 50, y: 80 });
  };

  return (
    <div className="bg-black/90 border border-white/10 cosmic-grid rounded-3xl p-6 lg:p-8 text-white relative shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
      {/* Subtle corner HUD accents */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs tracking-widest uppercase">
            <span>01</span>
            <span>·</span>
            <span>МИНИЙ ХОББИ</span>
            <span>·</span>
            <span>САГСАН БӨМБӨГ</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-heading font-bold mt-1 text-white">
            Оргилүүн-Тэнгисийн Сагсны Талбай 🏀
          </h3>
          <p className="text-slate-400 text-sm mt-1 max-w-lg font-light leading-relaxed">
            Миний хамгийн дуртай хобби бол сагсан бөмбөг тоглох! Цагираг руу бөмбөг шидэж оноо аваарай.
          </p>
        </div>

        {/* Scoreboard HUD */}
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-6 py-3.5 backdrop-blur-md">
          <div className="text-center">
            <span className="text-[10px] text-slate-400 font-mono block tracking-widest uppercase">
              НИЙТ ОНОО
            </span>
            <span className="text-3xl font-heading font-extrabold text-amber-400">{score}</span>
          </div>
          <div className="h-8 w-px bg-white/10"></div>
          <div className="text-center">
            <span className="text-[10px] text-slate-400 font-mono block tracking-widest uppercase flex items-center justify-center gap-1">
              <Flame className="w-3 h-3 text-orange-400" /> СТРЕАК
            </span>
            <span className="text-3xl font-heading font-extrabold text-orange-400">{streak}</span>
          </div>
          <button
            onClick={resetGame}
            title="Тоглоом шинэчлэх"
            className="ml-2 p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/10 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mini Interactive Court Canvas */}
      <div className="relative bg-gradient-to-b from-black via-slate-950 to-black border border-white/10 rounded-2xl h-68 overflow-hidden flex flex-col justify-between p-4 shadow-inner">
        {/* Basketball Hoop */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
          {/* Backboard */}
          <div className="w-28 h-18 border-2 border-white/30 bg-white/5 backdrop-blur-md rounded-sm flex items-center justify-center relative shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <div className="w-12 h-8 border-2 border-orange-500/80 rounded-xs"></div>
          </div>
          {/* Rim & Net */}
          <div className="w-14 h-3.5 border-2 border-orange-500 rounded-full bg-transparent -mt-1 shadow-[0_0_15px_rgba(249,115,22,0.8)]"></div>
          <div className="w-12 h-7 border-b-2 border-x border-dashed border-white/40 rounded-b-md flex justify-around"></div>
        </div>

        {/* Free throw & 3-point court markings */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-56 border-x border-white/5 pointer-events-none"></div>
        <div className="absolute top-30 left-1/2 -translate-x-1/2 w-48 h-48 border border-dashed border-cyan-500/20 rounded-full pointer-events-none"></div>

        {/* Result notification */}
        <div className="h-8 flex items-center justify-center">
          {lastResult && (
            <div className="bg-black/90 border border-amber-500/50 text-amber-300 text-xs font-heading font-medium px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-bounce">
              {lastResult}
            </div>
          )}
        </div>

        {/* Animated Basketball */}
        <div
          className="absolute transition-all duration-500 ease-out z-20 pointer-events-none"
          style={{
            left: `${ballPosition.x}%`,
            top: `${ballPosition.y}%`,
            transform: `translate(-50%, -50%) ${isShooting ? 'scale(0.85) rotate(720deg)' : 'scale(1)'}`,
          }}
        >
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-700 via-orange-500 to-amber-300 border border-orange-200 shadow-[0_0_20px_rgba(249,115,22,0.8)] flex items-center justify-center text-sm font-bold select-none">
            🏀
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 relative z-10 pt-2">
          <button
            onClick={() => shootBall('normal')}
            disabled={isShooting}
            className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 active:scale-95 disabled:opacity-50 text-white font-heading font-bold text-xs tracking-wider uppercase rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>🏀 2 Онооны шидэлт</span>
          </button>
          <button
            onClick={() => shootBall('three_pointer')}
            disabled={isShooting}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 active:scale-95 disabled:opacity-50 text-white font-heading font-bold text-xs tracking-wider uppercase rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all flex items-center gap-2 cursor-pointer"
          >
            <Award className="w-4 h-4 text-amber-200" />
            <span>🔥 3 Онооны алсын шидэлт</span>
          </button>
        </div>
      </div>

      {/* Music note box from user's brief: "I do not really like listening music" */}
      <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-2xl flex items-start gap-3 text-xs text-slate-300">
        <VolumeX className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-heading font-bold text-white block mb-0.5 tracking-wide">
            Дуу хөгжмийн талаар сонирхолтой баримт:
          </span>
          "Би дуу хөгжим сонсох нэг их дургүй. Харин чимээгүй төвлөрөх эсвэл сагсны бөмбөг шалан дээр ойх, цагирагт орж 'свүүш' хийх тэр цэвэр чимээ л миний хувьд хамгийн гоё хөгжим!"
        </div>
      </div>
    </div>
  );
};
