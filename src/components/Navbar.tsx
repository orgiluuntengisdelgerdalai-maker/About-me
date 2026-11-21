import React, { useState } from 'react';
import {
  ExternalLink,
  Gamepad2,
  Menu,
  X,
  Home,
  Pickaxe,
  Code2,
  Rocket,
  MessageSquare,
} from 'lucide-react';

interface NavbarProps {
  isGamesActive?: boolean;
  onNavClick: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isGamesActive = false, onNavClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const handleMobileNav = (id: string) => {
    setMobileMenuOpen(false);
    onNavClick(id);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/85 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-3">
        {/* Brand: Dual-orb logo */}
        <button
          type="button"
          onClick={() => handleMobileNav('hero')}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group min-w-0 text-left"
        >
          <div className="relative w-6 sm:w-7 h-5 flex items-center shrink-0">
            <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-cyan-400 opacity-90 shadow-[0_0_12px_#38bdf8] transition-transform group-hover:scale-110"></div>
            <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-blue-600 -ml-1.5 opacity-90 shadow-[0_0_12px_#2563eb] transition-transform group-hover:scale-110"></div>
          </div>

          <div className="flex flex-col min-w-0">
            <span className="font-heading text-xs sm:text-sm font-bold tracking-wider sm:tracking-widest text-white uppercase group-hover:text-cyan-300 transition-colors truncate">
              ОРГИЛУУНТЭНГИС
              <span className="hidden xs:inline sm:inline"> · GALAXY</span>
            </span>
            <span className="hidden sm:block text-[10px] font-mono text-slate-400 tracking-wider truncate">
              12 НАСТАЙ · ИРЭЭДҮЙН ИНЖЕНЕР
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-[11px] font-heading font-medium tracking-widest text-slate-400 uppercase">
          <button
            onClick={() => onNavClick('hero')}
            className={`transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              !isGamesActive ? 'text-white' : 'hover:text-white'
            }`}
          >
            Нүүр
          </button>
          <button
            onClick={() => onNavClick('games')}
            className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
              isGamesActive
                ? 'bg-purple-500/20 border-purple-400 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                : 'bg-white/5 border-white/10 text-purple-300 hover:bg-purple-500/15 hover:border-purple-400/60 hover:text-white'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Тоглоом</span>
          </button>
          <button
            onClick={() => onNavClick('minecraft-food')}
            className="hover:text-emerald-400 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Minecraft & Хоол
          </button>
          <button
            onClick={() => onNavClick('dream-section')}
            className="hover:text-cyan-400 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Мөрөөдөл
          </button>
          <button
            onClick={() => onNavClick('projects-section')}
            className="hover:text-rose-400 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Төслүүд
          </button>
          <button
            onClick={() => onNavClick('guestbook-section')}
            className="hover:text-pink-400 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Зочны дэвтэр
          </button>
        </nav>

        {/* Right CTA Links + Mobile Menu Trigger */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Mobile Games Quick Button */}
          <button
            onClick={() => handleMobileNav('games')}
            className={`lg:hidden min-h-[40px] px-3 py-1.5 rounded-xl border text-[11px] font-heading tracking-wider font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              isGamesActive
                ? 'bg-purple-600 text-white border-purple-400'
                : 'bg-purple-950/50 text-purple-200 border-purple-500/35 hover:bg-purple-900/60'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>ТОГЛООМ</span>
          </button>

          <a
            href="https://vocal-truffle-8c33e5.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex px-3.5 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 text-[11px] font-heading tracking-wider font-semibold rounded-lg transition-all items-center gap-1.5 whitespace-nowrap"
            title="Uutube вэбсайт руу зочлох"
          >
            <span>UUTUBE</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <a
            href="https://lustrous-malasada-f15aaf.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex px-3.5 py-1.5 bg-blue-950/40 hover:bg-blue-900/60 text-cyan-300 border border-cyan-500/30 text-[11px] font-heading tracking-wider font-semibold rounded-lg transition-all items-center gap-1.5 whitespace-nowrap"
            title="My Dream вэбсайт руу зочлох"
          >
            <span>MY DREAM</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <a
            href="https://adorable-lokum-0ba4ae.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex px-3.5 py-1.5 bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-500/30 text-[11px] font-heading tracking-wider font-semibold rounded-lg transition-all items-center gap-1.5 whitespace-nowrap"
            title="Тооцоолуур вэбсайт руу зочлох"
          >
            <span>ТООЦООЛУУР</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Цэс хаах' : 'Цэс нээх'}
            aria-expanded={mobileMenuOpen}
            className="lg:hidden min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-black/95 backdrop-blur-2xl px-4 py-4 space-y-4 shadow-2xl max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleMobileNav('hero')}
              className="min-h-[44px] px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left text-xs font-heading font-semibold text-white flex items-center gap-2 cursor-pointer"
            >
              <Home className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Нүүр хуудас</span>
            </button>
            <button
              onClick={() => handleMobileNav('games')}
              className="min-h-[44px] px-3.5 py-2.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-400/35 text-left text-xs font-heading font-semibold text-purple-200 flex items-center gap-2 cursor-pointer"
            >
              <Gamepad2 className="w-4 h-4 text-purple-300 shrink-0" />
              <span>Тоглоомын цонх</span>
            </button>
            <button
              onClick={() => handleMobileNav('minecraft-food')}
              className="min-h-[44px] px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left text-xs font-heading font-semibold text-slate-200 flex items-center gap-2 cursor-pointer"
            >
              <Pickaxe className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Minecraft & Хоол</span>
            </button>
            <button
              onClick={() => handleMobileNav('dream-section')}
              className="min-h-[44px] px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left text-xs font-heading font-semibold text-slate-200 flex items-center gap-2 cursor-pointer"
            >
              <Code2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Мөрөөдөл & Код</span>
            </button>
            <button
              onClick={() => handleMobileNav('projects-section')}
              className="min-h-[44px] px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left text-xs font-heading font-semibold text-slate-200 flex items-center gap-2 cursor-pointer"
            >
              <Rocket className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Хийсэн төслүүд</span>
            </button>
            <button
              onClick={() => handleMobileNav('guestbook-section')}
              className="min-h-[44px] px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left text-xs font-heading font-semibold text-slate-200 flex items-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-pink-400 shrink-0" />
              <span>Зочны дэвтэр</span>
            </button>
          </div>

          <div className="pt-3 border-t border-white/10">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-2">
              Шууд вэбсайтууд
            </span>
            <div className="grid grid-cols-2 gap-2">
              <a
                href="https://vocal-truffle-8c33e5.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-2 py-2 bg-red-950/50 text-red-200 border border-red-500/35 text-[11px] font-heading font-semibold rounded-xl flex items-center justify-center gap-1"
              >
                <span>Uutube</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
              <a
                href="https://lustrous-malasada-f15aaf.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-2 py-2 bg-blue-950/50 text-cyan-200 border border-cyan-500/35 text-[11px] font-heading font-semibold rounded-xl flex items-center justify-center gap-1"
              >
                <span>My Dream</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
              <a
                href="https://adorable-lokum-0ba4ae.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-2 py-2 bg-amber-950/50 text-amber-200 border border-amber-500/35 text-[11px] font-heading font-semibold rounded-xl flex items-center justify-center gap-1"
              >
                <span>Тооцоолуур</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
              <a
                href="https://supere-strete-fightere.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-2 py-2 bg-rose-950/50 text-rose-200 border border-rose-500/35 text-[11px] font-heading font-semibold rounded-xl flex items-center justify-center gap-1"
              >
                <span>Vibe Fighter</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
