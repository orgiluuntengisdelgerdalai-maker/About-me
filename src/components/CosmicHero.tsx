import React, { useState } from 'react';
import { ArrowRight, ExternalLink, Sparkles, VolumeX, Code, Play } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BlackHoleVisual } from './BlackHoleVisual';

interface SlideItem {
  id: string;
  number: string;
  titleLight: string;
  titleBold: string;
  description: string;
  stat1Label: string;
  stat1Value: string;
  stat2Label: string;
  stat2Value: string;
  targetSection: string;
  badgeLabel: string;
  thumbImg?: string;
  thumbColor: string;
}

const SLIDES: SlideItem[] = [
  {
    id: 'basketball',
    number: '01',
    titleLight: 'The',
    titleBold: 'BASKETBALL FOCUS',
    description:
      'Чөлөөт цагаа үргэлж сагсан бөмбөгийн талбайд өнгөрүүлдэг. Дуу хөгжим сонсох нэг их дургүй — зөвхөн бөмбөгний ойх чимээ, цагирагт "свүүш" хийх тэр цэвэр авиа л миний хувьд хамгийн гоё аялгуу.',
    stat1Label: 'Дуртай спорт',
    stat1Value: 'САГСАН БӨМБӨГ',
    stat2Label: 'Хөгжмийн сонголт',
    stat2Value: 'СОНСДОГГҮЙ / ТӨВЛӨРӨЛ',
    targetSection: 'basketball',
    badgeLabel: 'Сагсан бөмбөг & Хобби',
    thumbColor: 'from-amber-600 to-orange-500',
  },
  {
    id: 'dream',
    number: '02',
    titleLight: 'The',
    titleBold: 'CODE ENGINEER',
    description:
      'Намайг Оргилуунтэнгис гэдэг. Би 12 настай. Миний хамгийн том мөрөөдөл бол дэлхийн хэмжээний чадварлаг код инженер болж, хүн төрөлхтөнд хэрэгтэй агуу системийг бүтээх явдал юм.',
    stat1Label: 'Нас / Төлөв',
    stat1Value: '12 НАСТАЙ',
    stat2Label: 'Ирээдүйн зорилго',
    stat2Value: 'КОД ИНЖЕНЕР',
    targetSection: 'dream-section',
    badgeLabel: 'Мөрөөдөл: Инженер болох',
    thumbColor: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'minecraft',
    number: '03',
    titleLight: 'The',
    titleBold: 'MINECRAFT & HUUSHUUR',
    description:
      'Minecraft-д Redstone цахилгаан схем, барилга бүтээх дуртай нь намайг анх код бичих сонирхолтой болгосон. Харин хамгийн дуртай хоол бол амтат халуун, шаржигнасан монгол хуушуур!',
    stat1Label: 'Дуртай тоглоом',
    stat1Value: 'MINECRAFT',
    stat2Label: 'Дуртай хоол',
    stat2Value: 'ХАЛУУН ХУУШУУР',
    targetSection: 'minecraft-food',
    badgeLabel: 'Minecraft ба Амтат Хоол',
    thumbColor: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'projects',
    number: '04',
    titleLight: 'The',
    titleBold: 'UUTUBE & WEB APPS',
    description:
      'Би өөрийн сурсан мэдлэгээрээ Uutube видео стриминг вэб, My Dream төсөл болон шинэ Тооцоолуур вэбээ амжилттай кодлож интернетэд байршуулсан. Төслүүд рүүгээ шууд зочлох боломжтой.',
    stat1Label: 'Хийсэн төсөл',
    stat1Value: '3 ШУУД ВЭБСАЙТ',
    stat2Label: 'Байршил',
    stat2Value: 'NETLIFY LIVE',
    targetSection: 'projects-section',
    badgeLabel: 'Хийж бүтээсэн вэбүүд',
    thumbColor: 'from-rose-500 to-pink-600',
  },
];

interface CosmicHeroProps {
  onNavigateSection: (sectionId: string) => void;
}

export const CosmicHero: React.FC<CosmicHeroProps> = ({ onNavigateSection }) => {
  const [activeIdx, setActiveIdx] = useState<number>(1); // Default to "02 / The Code Engineer" like in user image!
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const currentSlide = SLIDES[activeIdx];

  const handleZoomChange = (delta: number) => {
    setZoomLevel((prev) => {
      const next = prev + delta;
      return Math.min(Math.max(next, 0.75), 1.35);
    });
  };

  const handleActionClick = () => {
    onNavigateSection(currentSlide.targetSection);
    confetti({
      particleCount: 50,
      spread: 70,
      colors: ['#06b6d4', '#f59e0b', '#3b82f6', '#ffffff'],
    });
  };

  return (
    <div className="relative min-h-0 lg:min-h-[700px] w-full flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-black cosmic-grid stars-bg p-4 pt-8 sm:p-8 lg:p-12 mb-8 sm:mb-12 shadow-[0_0_80px_rgba(0,0,0,0.9)]">
      {/* Background Deep Cosmic Gradients */}
      <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black pointer-events-none"></div>

      {/* Center Cosmic Phenomenon: INTERACTIVE ROTATING BLACK HOLE (Хар нүх) */}
      <div className="absolute top-36 sm:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-85 sm:opacity-100">
        <BlackHoleVisual zoomLevel={zoomLevel} />
      </div>

      {/* Main Content Grid: Left Details + Right Related Carousel */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center my-auto">
        {/* Left Column: Big Typographic Info */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          {/* Slide Number Index */}
          <div className="relative select-none pointer-events-none">
            <span
              className="text-6xl sm:text-8xl lg:text-9xl font-black font-heading text-white/[0.08] absolute -top-7 sm:-top-14 -left-1 sm:-left-2 tracking-tighter"
              aria-hidden="true"
            >
              {currentSlide.number}
            </span>
          </div>

          {/* Slide Title */}
          <div className="relative z-10 pt-2 sm:pt-0">
            <h1 className="text-2xl sm:text-5xl lg:text-6xl text-white font-heading font-light tracking-wide leading-tight break-words">
              {currentSlide.titleLight}{' '}
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-amber-200">
                {currentSlide.titleBold}
              </span>
            </h1>

            {/* Description */}
            <p className="text-slate-300 text-sm sm:text-base mt-3 sm:mt-4 max-w-xl leading-relaxed font-light">
              {currentSlide.description}
            </p>

            {/* HUD Stat Boxes */}
            <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/10 p-px rounded-xl max-w-md backdrop-blur-md border border-white/10 overflow-hidden shadow-2xl">
              <div className="bg-black/85 px-4 py-3 min-w-0">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-0.5">
                  {currentSlide.stat1Label}
                </span>
                <span className="text-xs sm:text-sm font-heading font-bold text-white tracking-wider block truncate">
                  {currentSlide.stat1Value}
                </span>
              </div>

              <div className="bg-black/85 px-4 py-3 min-w-0">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-0.5">
                  {currentSlide.stat2Label}
                </span>
                <span className="text-xs sm:text-sm font-heading font-bold text-white tracking-wider block truncate">
                  {currentSlide.stat2Value}
                </span>
              </div>
            </div>

            {/* SHOW MORE _ Action Link */}
            <div className="mt-6 sm:mt-7 flex flex-wrap items-center gap-4 sm:gap-6">
              <button
                onClick={handleActionClick}
                className="group min-h-[44px] flex items-center gap-2 text-xs sm:text-sm font-heading tracking-widest uppercase text-cyan-400 hover:text-white transition-colors cursor-pointer border-b border-cyan-400/60 py-1.5"
              >
                <span>ДЭЛГЭРЭНГҮЙ ҮЗЭХ _</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span>Оргилуунтэнгисийн Ертөнц</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: "RELATED" / Categories Carousel Cards */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-3 sm:mb-4 px-1">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
              СЭДВҮҮД (RELATED)
            </span>
            <span className="text-xs text-slate-500 font-mono tracking-wider tabular-nums">
              {activeIdx + 1} / {SLIDES.length} →
            </span>
          </div>

          <div className="space-y-2.5 sm:space-y-3">
            {SLIDES.map((slide, idx) => {
              const isActive = idx === activeIdx;
              return (
                <div
                  key={slide.id}
                  onClick={() => setActiveIdx(idx)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveIdx(idx);
                    }
                  }}
                  className={`cursor-pointer transition-all duration-300 p-3.5 sm:p-4 rounded-xl relative ${
                    isActive
                      ? 'bg-black/85 border border-cyan-400/90 shadow-[0_0_25px_rgba(6,182,212,0.25)] hud-cut-card'
                      : 'bg-black/60 border border-dashed border-white/20 hover:border-white/50 hover:bg-black/75'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-xs font-heading font-bold px-1.5 py-0.5 rounded shrink-0 ${
                            isActive
                              ? 'bg-cyan-500 text-black font-mono'
                              : 'text-slate-400 font-mono'
                          }`}
                        >
                          {slide.number}
                        </span>
                        <h4
                          className={`text-xs sm:text-sm font-heading font-bold truncate ${
                            isActive ? 'text-white' : 'text-slate-200'
                          }`}
                        >
                          {slide.titleBold.replace('THE ', '')}
                        </h4>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {slide.description}
                      </p>
                    </div>

                    {/* Circular Planet / Galaxy Orb Preview */}
                    <div className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-white/30 bg-slate-900 p-0.5 relative group">
                      <div
                        className={`w-full h-full rounded-full bg-gradient-to-tr ${slide.thumbColor} opacity-90 flex items-center justify-center shadow-inner`}
                      >
                        {slide.id === 'basketball' && <span>🏀</span>}
                        {slide.id === 'dream' && <span className="text-white text-xs font-mono">&lt;/&gt;</span>}
                        {slide.id === 'minecraft' && <span>⛏️</span>}
                        {slide.id === 'projects' && <span>🚀</span>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom HUD Dial / Zoom Slider Control */}
      <div className="relative z-10 flex items-center justify-center pt-5 sm:pt-8 border-t border-white/10 mt-5 sm:mt-6">
        <div className="flex items-center gap-3 sm:gap-4 bg-black/70 backdrop-blur-md px-3 sm:px-5 py-1.5 rounded-full border border-white/10 text-slate-400 font-mono text-xs">
          <button
            onClick={() => handleZoomChange(-0.1)}
            title="Томруулалтыг багасгах"
            aria-label="Хар нүхийг жижигрүүлэх"
            className="hover:text-white transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full hover:bg-white/10 text-base"
          >
            -
          </button>

          {/* Interactive Tick Marks */}
          <div className="flex items-center gap-1 select-none">
            {[...Array(14)].map((_, i) => {
              const isCenter = i === 7;
              return (
                <div
                  key={i}
                  className={`w-0.5 rounded-full transition-all ${
                    isCenter
                      ? 'h-5 bg-white shadow-[0_0_8px_#fff]'
                      : i % 3 === 0
                      ? 'h-3 bg-white/40'
                      : 'h-2 bg-white/15'
                  }`}
                />
              );
            })}
          </div>

          <button
            onClick={() => handleZoomChange(0.1)}
            title="Томруулалтыг ихэсгэх"
            aria-label="Хар нүхийг томруулах"
            className="hover:text-white transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full hover:bg-white/10 text-base"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};
