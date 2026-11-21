import React, { useState } from 'react';
import { ExternalLink, RefreshCw, Swords, Maximize2 } from 'lucide-react';

const VIBE_FIGHTER_URL = 'https://supere-strete-fightere.vercel.app/';

export const VibeFighterGame: React.FC = () => {
  const [reloadKey, setReloadKey] = useState<number>(0);

  return (
    <div className="bg-black/90 border border-white/10 cosmic-grid rounded-3xl p-4 sm:p-6 lg:p-8 text-white relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.85)]">
      {/* Ambient glow */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-rose-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-12 -left-12 w-56 h-56 bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-rose-400 font-mono text-xs tracking-widest uppercase">
            <Swords className="w-3.5 h-3.5" />
            <span>МИНИ ТОГЛООМ</span>
            <span>·</span>
            <span>ТУЛААНЫ АРКАД</span>
            <span>·</span>
            <span>VERCEL LIVE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white mt-1">
            Vibe Fighter 🥊
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl font-light">
            Оргилуунтэнгисийн бүтээсэн гудамжны тулааны тоглоом! Шууд эндээс тоглох эсвэл бүтэн дэлгэцээр нээж тоглоорой.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setReloadKey((k) => k + 1)}
            className="min-h-[44px] px-4 py-2 bg-white/5 hover:bg-white/15 border border-white/15 text-slate-200 text-xs font-heading font-bold tracking-wider uppercase rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-cyan-400" />
            <span>Дахин ачаалах</span>
          </button>

          <a
            href={VIBE_FIGHTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] px-5 py-2.5 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white text-xs font-heading font-bold tracking-wider uppercase rounded-xl shadow-[0_0_25px_rgba(244,63,94,0.35)] transition-all flex items-center justify-center gap-2"
          >
            <Maximize2 className="w-4 h-4" />
            <span>Шинэ цонхоор нээх</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Embedded Game Frame */}
      <div className="relative z-10 rounded-2xl overflow-hidden border border-rose-500/30 bg-black shadow-inner">
        <iframe
          key={reloadKey}
          src={VIBE_FIGHTER_URL}
          title="Vibe Fighter Тоглоом"
          className="w-full h-[460px] sm:h-[600px] lg:h-[660px] border-0 bg-black"
          allow="fullscreen; autoplay; gamepad"
        />
      </div>

      {/* Helpful tip */}
      <div className="relative z-10 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400 font-mono">
        <span>
          💡 Хэрэв тоглоом гар дээр жижиг эсвэл гарын товчлуур ашиглах бол «Шинэ цонхоор нээх» дээр дарж бүтэн дэлгэцээр тоглоно уу.
        </span>
        <a
          href={VIBE_FIGHTER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-rose-400 hover:text-rose-300 underline shrink-0"
        >
          supere-strete-fightere.vercel.app ↗
        </a>
      </div>
    </div>
  );
};
