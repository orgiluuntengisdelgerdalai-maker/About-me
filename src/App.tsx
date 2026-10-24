import React from 'react';
import { Navbar } from './components/Navbar';
import { CosmicHero } from './components/CosmicHero';
import { BasketballGame } from './components/BasketballGame';
import { MinecraftAndFood } from './components/MinecraftAndFood';
import { CodeTerminal } from './components/CodeTerminal';
import { ProjectsSection } from './components/ProjectsSection';
import { Guestbook } from './components/Guestbook';
import { Flame, Sparkles, ArrowUpRight, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const scrollToSection = (id: string) => {
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
      {/* Ambient Celestial Glows in the background */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="fixed bottom-10 right-10 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Top Navbar */}
      <Navbar onNavClick={scrollToSection} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {/* HERO SECTION: Cosmic Galaxy Nebula UI exactly like the user's reference image */}
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
                ОРГИЛҮҮН-ТЭНГИСИЙН СТАТУС
              </span>
              <span className="text-sm font-heading font-bold text-white tracking-wide">
                12 Настай · Сагсан бөмбөг & Minecraft · Ирээдүйн Код Инженер
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
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
              <span>Uutube Үзэх</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* SECTION 1: BASKETBALL GAME & MUSIC NOTE */}
        <section id="basketball" className="scroll-mt-24 my-10">
          <BasketballGame />
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
              ОРГИЛҮҮН-ТЭНГИС
            </span>
            <span className="text-slate-600">|</span>
            <span className="font-mono text-[11px] text-slate-400">
              12 НАСТАЙ · ИРЭЭДҮЙН ПРОГРАММ ХАНГАМЖИЙН ИНЖЕНЕР
            </span>
          </div>

          <div className="flex items-center gap-6 font-heading tracking-widest uppercase text-[11px] text-slate-400">
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
