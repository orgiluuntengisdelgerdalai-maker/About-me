import React, { useState, useRef, useEffect } from 'react';
import { User } from 'firebase/auth';
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
  LogIn,
  LogOut,
  ChevronDown,
  Trophy,
} from 'lucide-react';
import { signOutUser } from '../firebase';

interface NavbarProps {
  isGamesActive?: boolean;
  onNavClick: (id: string) => void;
  currentUser: User | null;
  onOpenSignIn: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isGamesActive = false,
  onNavClick,
  currentUser,
  onOpenSignIn,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState<boolean>(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMobileNav = (id: string) => {
    setMobileMenuOpen(false);
    setAccountMenuOpen(false);
    onNavClick(id);
  };

  const handleSignOut = async () => {
    setAccountMenuOpen(false);
    setMobileMenuOpen(false);
    try {
      await signOutUser();
    } catch (err) {
      console.error('Sign out failed:', err);
    }
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
              <span className="hidden sm:inline"> · GALAXY</span>
            </span>
            <span className="hidden sm:block text-[10px] font-mono text-slate-400 tracking-wider truncate">
              12 НАСТАЙ · ИРЭЭДҮЙН ИНЖЕНЕР
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-[11px] font-heading font-medium tracking-widest text-slate-400 uppercase">
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

        {/* Right Actions: External Links + Sign In / Account Menu + Mobile Menu Trigger */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Mobile Games Quick Button */}
          <button
            onClick={() => handleMobileNav('games')}
            className={`lg:hidden min-h-[40px] px-2.5 sm:px-3 py-1.5 rounded-xl border text-[11px] font-heading tracking-wider font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              isGamesActive
                ? 'bg-purple-600 text-white border-purple-400'
                : 'bg-purple-950/50 text-purple-200 border-purple-500/35 hover:bg-purple-900/60'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span className="hidden xs:inline sm:inline">ТОГЛООМ</span>
          </button>

          <a
            href="https://vocal-truffle-8c33e5.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden xl:flex px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 text-[11px] font-heading tracking-wider font-semibold rounded-lg transition-all items-center gap-1.5 whitespace-nowrap"
            title="Uutube вэбсайт руу зочлох"
          >
            <span>UUTUBE</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <a
            href="https://adorable-lokum-0ba4ae.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden xl:flex px-3 py-1.5 bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-500/30 text-[11px] font-heading tracking-wider font-semibold rounded-lg transition-all items-center gap-1.5 whitespace-nowrap"
            title="Тооцоолуур вэбсайт руу зочлох"
          >
            <span>ТООЦООЛУУР</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          {/* Sign In / Account Dropdown Menu */}
          {currentUser ? (
            <div className="relative" ref={accountMenuRef}>
              <button
                type="button"
                onClick={() => setAccountMenuOpen((prev) => !prev)}
                aria-expanded={accountMenuOpen}
                aria-haspopup="menu"
                className="min-h-[40px] pl-2 pr-2.5 py-1 bg-white/5 hover:bg-white/10 border border-cyan-500/35 rounded-xl flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Хэрэглэгч'}
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded-full border border-cyan-400/50 object-cover shrink-0"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-cyan-500/25 border border-cyan-400/50 flex items-center justify-center text-[11px] font-bold text-cyan-200 shrink-0">
                    {(currentUser.displayName || 'Х').slice(0, 1).toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:inline max-w-[110px] truncate text-[11px] font-heading font-semibold text-white">
                  {currentUser.displayName || 'Хэрэглэгч'}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                    accountMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {accountMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-64 bg-[#070912]/98 border border-white/15 rounded-2xl shadow-2xl p-2 z-50 backdrop-blur-2xl"
                >
                  <div className="px-3 py-2.5 border-b border-white/10">
                    <span className="text-xs font-heading font-bold text-white block truncate">
                      {currentUser.displayName || 'Тоглогч'}
                    </span>
                    {currentUser.email && (
                      <span className="text-[11px] font-mono text-slate-400 block truncate mt-0.5">
                        {currentUser.email}
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-emerald-400 block mt-1">
                      Google · Холбогдсон
                    </span>
                  </div>

                  <div className="py-1.5 space-y-0.5">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => handleMobileNav('games')}
                      className="w-full min-h-[40px] px-3 py-2 rounded-xl text-left text-xs font-heading text-slate-200 hover:bg-white/10 hover:text-white flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Тоглоомын оноо & Самбар</span>
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => handleMobileNav('guestbook-section')}
                      className="w-full min-h-[40px] px-3 py-2 rounded-xl text-left text-xs font-heading text-slate-200 hover:bg-white/10 hover:text-white flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>Зочны дэвтэр</span>
                    </button>
                  </div>

                  <div className="pt-1.5 border-t border-white/10">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleSignOut}
                      className="w-full min-h-[40px] px-3 py-2 rounded-xl text-left text-xs font-heading font-semibold text-rose-300 hover:bg-rose-500/15 hover:text-rose-200 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 shrink-0" />
                      <span>Системээс гарах</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenSignIn}
              className="min-h-[40px] px-3 sm:px-4 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-[11px] font-heading tracking-wider font-bold rounded-xl shadow-[0_0_16px_rgba(6,182,212,0.3)] transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              <LogIn className="w-3.5 h-3.5 shrink-0" />
              <span>НЭВТРЭХ</span>
            </button>
          )}

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
          {/* Mobile Account Box */}
          {currentUser ? (
            <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-white/5 border border-cyan-500/30">
              <div className="flex items-center gap-2.5 min-w-0">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Хэрэглэгч'}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full border border-cyan-400/50 object-cover shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-xs font-bold text-cyan-300 shrink-0">
                    {(currentUser.displayName || 'Х').slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <span className="text-xs font-heading font-bold text-white block truncate">
                    {currentUser.displayName || 'Хэрэглэгч'}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 block truncate">
                    {currentUser.email || 'Google холбогдсон'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="min-h-[40px] px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[11px] font-heading font-semibold flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Гарах</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSignIn();
              }}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs font-heading font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Google хаягаар нэвтрэх</span>
            </button>
          )}

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
