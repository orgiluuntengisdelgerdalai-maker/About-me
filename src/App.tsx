import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CosmicHero } from './components/CosmicHero';
import { MinecraftAndFood } from './components/MinecraftAndFood';
import { CodeTerminal } from './components/CodeTerminal';
import { ProjectsSection } from './components/ProjectsSection';
import { Guestbook } from './components/Guestbook';
import { GamesHub, GameId, GAMES_LIST } from './components/GamesHub';
import { AnimatedGalaxyCanvas } from './components/AnimatedGalaxyCanvas';
import { Sparkles, ArrowUpRight, Compass, Gamepad2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, syncUserProfile } from './firebase';

type ActiveView = 'home' | 'games';

function parseHashRoute(): { view: ActiveView; game: GameId | null } {
  const hash = window.location.hash;
  if (hash === '#games/basketball') {
    return { view: 'games', game: 'basketball' };
  }
  if (hash === '#games/anime-quiz') {
    return { view: 'games', game: 'anime-quiz' };
  }
  if (hash === '#games') {
    return { view: 'games', game: null };
  }
  return { view: 'home', game: null };
}

export default function App() {
  const initialRoute = parseHashRoute();
  const [activeView, setActiveView] = useState<ActiveView>(initialRoute.view);
  const [activeGame, setActiveGame] = useState<GameId | null>(initialRoute.game);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        syncUserProfile(user).catch((err) => {
          console.error('Failed to sync user profile:', err);
        });
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const next = parseHashRoute();
      setActiveView(next.view);
      setActiveGame(next.game);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const openGamesWindow = (gameId: GameId | null = null) => {
    setActiveView('games');
    setActiveGame(gameId);
    const targetHash = gameId ? `#games/${gameId}` : '#games';
    if (window.location.hash !== targetHash) {
      window.history.pushState(null, '', targetHash);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openHomeWindow = () => {
    setActiveView('home');
    setActiveGame(null);
    if (window.location.hash) {
      window.history.pushState(null, '', '#');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    if (id === 'games') {
      openGamesWindow(null);
      return;
    }
    if (id === 'basketball') {
      openGamesWindow('basketball');
      return;
    }
    if (id === 'anime-quiz') {
      openGamesWindow('anime-quiz');
      return;
    }

    if (activeView !== 'home') {
      setActiveView('home');
      setActiveGame(null);
      if (window.location.hash) {
        window.history.pushState(null, '', '#');
      }
      setTimeout(() => {
        if (id === 'hero') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 60);
      return;
    }

    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCelebrate = () => {
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#06b6d4', '#f59e0b', '#3b82f6', '#ec4899', '#ffffff'],
    });
  };

  return (
    <div className="min-h-screen bg-[#030306] text-slate-100 flex flex-col font-sans selection:bg-cyan-400 selection:text-black relative">
      {/* Dynamic Animated Galaxy Starfield & Cosmic Swirl Background */}
      <AnimatedGalaxyCanvas />

      {/* Ambient Celestial Glows in the background */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="fixed bottom-10 right-10 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none z-0"></div>

      {/* Top Navbar */}
      <Navbar isGamesActive={activeView === 'games'} onNavClick={scrollToSection} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {activeView === 'games' ? (
          <GamesHub
            activeGame={activeGame}
            onSelectGame={(gameId) => openGamesWindow(gameId)}
            onBackHome={openHomeWindow}
            currentUser={currentUser}
          />
        ) : (
          <>
            {/* HERO SECTION: Cosmic Galaxy Nebula UI */}
            <section id="hero" className="scroll-mt-24">
              <CosmicHero onNavigateSection={scrollToSection} />
            </section>

            {/* Quick Tech Specs / HUD Banner */}
            <div className="my-8 p-4 sm:p-5 rounded-2xl bg-black/80 border border-white/10 cosmic-grid flex flex-wrap items-center justify-between gap-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '20s' }} />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                    ОРГИЛУУНТЭНГИСИЙН СТАТУС
                  </span>
                  <span className="text-sm font-heading font-bold text-white tracking-wide">
                    12 Настай · Сагсан бөмбөг & Minecraft · Ирээдүйн Код Инженер
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => openGamesWindow(null)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-heading font-bold tracking-wider uppercase text-white rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Gamepad2 className="w-4 h-4" />
                  <span>Тоглоом цонх нээх</span>
                </button>
                <button
                  onClick={handleCelebrate}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-heading tracking-wider uppercase text-cyan-300 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Баяр хүргэх!</span>
                </button>
                <a
                  href="https://vocal-truffle-8c33e5.netlify.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-red-600/80 hover:bg-red-500 text-xs font-heading tracking-wider uppercase text-white rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <span>Uutube</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://adorable-lokum-0ba4ae.netlify.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-xs font-heading tracking-wider uppercase text-white rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <span>Тооцоолуур</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* SECTION 1: ТОГЛООМ ЦОНХ (GAMES PORTAL WINDOW ON HOME PAGE) */}
            <section id="games-portal" className="scroll-mt-24 my-10">
              <div
                onClick={() => openGamesWindow(null)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openGamesWindow(null);
                  }
                }}
                className="group bg-black/90 border border-purple-500/30 hover:border-purple-400 cosmic-grid rounded-3xl p-6 lg:p-8 relative overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-[0_0_50px_rgba(0,0,0,0.85)] hover:shadow-[0_0_50px_rgba(168,85,247,0.22)]"
              >
                <div className="absolute -top-12 -right-12 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-2 text-purple-400 font-mono text-xs tracking-widest uppercase">
                      <Gamepad2 className="w-4 h-4" />
                      <span>01</span>
                      <span>·</span>
                      <span>ТОГЛООМЫН ТӨВ</span>
                      <span>·</span>
                      <span>{GAMES_LIST.length} ТОГЛООМ</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white group-hover:text-purple-200 transition-colors">
                      🎮 Тоглоом
                    </h2>
                    <p className="text-slate-300 text-sm leading-relaxed font-light">
                      Энд дарж тусдаа <span className="text-white font-medium">«Тоглоом»</span> цонх руу орно уу!
                      Дотор нь <span className="text-amber-300">🏀 Сагсан бөмбөг</span> болон{' '}
                      <span className="text-purple-300">🍥 Ultimate Anime Quiz</span> тоглоомууд бий — тоглоом
                      бүр дээр дараад өөрийнх нь цонх руу орж тоглоно.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                    <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
                      {GAMES_LIST.map((g, i) => (
                        <React.Fragment key={g.id}>
                          {i > 0 && <span className="text-slate-600">·</span>}
                          <span>
                            {g.emoji} {g.title.split(' ')[0]}
                          </span>
                        </React.Fragment>
                      ))}
                    </div>

                    <span className="px-6 py-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 group-hover:from-purple-500 group-hover:to-cyan-500 text-white font-heading font-bold text-xs tracking-wider uppercase rounded-2xl shadow-[0_0_25px_rgba(147,51,234,0.35)] flex items-center justify-center gap-2 transition-all">
                      <span>Тоглоом руу орох</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 2: MINECRAFT & HUUSHUUR */}
            <section id="minecraft-food" className="scroll-mt-24 my-10">
              <MinecraftAndFood />
            </section>

            {/* SECTION 3: MY DREAM (BECOME A CODE ENGINEER) + CODE TERMINAL */}
            <section id="dream-section" className="scroll-mt-24 my-10">
              <CodeTerminal />
            </section>

            {/* SECTION 4: PROJECTS (UUTUBE & MY DREAM) */}
            <section id="projects-section" className="scroll-mt-24 my-10">
              <ProjectsSection />
            </section>

            {/* SECTION 5: GUESTBOOK & CHEERS */}
            <section id="guestbook-section" className="scroll-mt-24 my-10">
              <Guestbook />
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/90 cosmic-grid py-10 px-4 text-xs text-slate-400 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            {/* Dual mini pills */}
            <div className="relative w-5 h-4 flex items-center">
              <div className="w-3 h-3 rounded-full bg-cyan-400 opacity-90 shadow-[0_0_8px_#38bdf8]"></div>
              <div className="w-3 h-3 rounded-full bg-blue-600 -ml-1 opacity-90 shadow-[0_0_8px_#2563eb]"></div>
            </div>
            <span className="font-heading font-bold text-white tracking-widest uppercase">
              ОРГИЛУУНТЭНГИС
            </span>
            <span className="text-slate-600">|</span>
            <span className="font-mono text-[11px] text-slate-400">
              12 НАСТАЙ · ИРЭЭДҮЙН ПРОГРАММ ХАНГАМЖИЙН ИНЖЕНЕР
            </span>
          </div>

          <div className="flex items-center gap-6 font-heading tracking-widest uppercase text-[11px] text-slate-400">
            <button
              onClick={() => openGamesWindow(null)}
              className="hover:text-purple-400 transition-colors cursor-pointer"
            >
              Тоглоом
            </button>
            <span className="text-slate-700">·</span>
            <a
              href="https://vocal-truffle-8c33e5.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-400 transition-colors"
            >
              Uutube
            </a>
            <span className="text-slate-700">·</span>
            <a
              href="https://lustrous-malasada-f15aaf.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors"
            >
              My Dream
            </a>
            <span className="text-slate-700">·</span>
            <a
              href="https://adorable-lokum-0ba4ae.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-400 transition-colors"
            >
              Тооцоолуур
            </a>
            <span className="text-slate-700">·</span>
            <button
              onClick={() => scrollToSection('hero')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Дээшээ буцах ↑
            </button>
          </div>
        </div>
        <p className="max-w-7xl mx-auto mt-6 text-center md:text-left text-[11px] text-slate-600 font-mono">
          "Код бичих нь зүгээр л тоглоом биш — орчлон ертөнцийг өөрийн гараар бүтээх шидэт урлаг юм." 🇲🇳 🚀
        </p>
      </footer>
    </div>
  );
}
