import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';

interface NavbarProps {
  onNavClick: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavClick }) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/80 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-18 flex items-center justify-between">
        {/* Brand: Dual-orb logo matching user reference image */}
        <div
          onClick={() => onNavClick('hero')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          {/* Dual overlapping gradient orbs like in the reference image */}
          <div className="relative w-7 h-5 flex items-center">
            <div className="w-4 h-4 rounded-full bg-cyan-400 opacity-90 shadow-[0_0_12px_#38bdf8] transition-transform group-hover:scale-110"></div>
            <div className="w-4 h-4 rounded-full bg-blue-600 -ml-1.5 opacity-90 shadow-[0_0_12px_#2563eb] transition-transform group-hover:scale-110"></div>
          </div>

          <div className="flex flex-col">
            <span className="font-heading text-xs sm:text-sm font-bold tracking-widest text-white uppercase group-hover:text-cyan-300 transition-colors">
              ОРГИЛҮҮН-ТЭНГИС · GALAXY
            </span>
            <span className="text-[10px] font-mono text-slate-400 tracking-wider">
              12 НАСТАЙ · ИРЭЭДҮЙН ИНЖЕНЕР
            </span>
          </div>
        </div>

        {/* Navigation Links with reference style typography */}
        <nav className="hidden lg:flex items-center gap-8 text-[11px] font-heading font-medium tracking-widest text-slate-400 uppercase">
          <button
            onClick={() => onNavClick('hero')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Нүүр
          </button>
          <button
            onClick={() => onNavClick('basketball')}
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            Сагсан бөмбөг
          </button>
          <button
            onClick={() => onNavClick('minecraft-food')}
            className="hover:text-emerald-400 transition-colors cursor-pointer"
          >
            Minecraft & Хоол
          </button>
          <button
            onClick={() => onNavClick('dream-section')}
            className="hover:text-cyan-400 transition-colors cursor-pointer"
          >
            Мөрөөдөл
          </button>
          <button
            onClick={() => onNavClick('projects-section')}
            className="hover:text-rose-400 transition-colors cursor-pointer"
          >
            Төслүүд
          </button>
          <button
            onClick={() => onNavClick('guestbook-section')}
            className="hover:text-pink-400 transition-colors cursor-pointer"
          >
            Зочны дэвтэр
          </button>
        </nav>

        {/* Right CTA Links (Original User Projects) */}
        <div className="flex items-center gap-2.5">
          <a
            href="https://vocal-truffle-8c33e5.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 text-[11px] font-heading tracking-wider font-semibold rounded-lg transition-all flex items-center gap-1.5"
            title="Uutube вэбсайт руу зочлох"
          >
            <span>UUTUBE</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <a
            href="https://lustrous-malasada-f15aaf.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 bg-blue-950/40 hover:bg-blue-900/60 text-cyan-300 border border-cyan-500/30 text-[11px] font-heading tracking-wider font-semibold rounded-lg transition-all flex items-center gap-1.5"
            title="My Dream вэбсайт руу зочлох"
          >
            <span>MY DREAM</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </header>
  );
};
