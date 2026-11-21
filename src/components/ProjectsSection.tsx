import React from 'react';
import { ExternalLink, PlaySquare, Compass, Rocket, Sparkles, Swords } from 'lucide-react';

export const ProjectsSection: React.FC = () => {
  const projects = [
    {
      id: 'uutube',
      title: 'Uutube',
      subtitle: 'Миний бүтээсэн видео стриминг вэбсайт',
      description:
        'YouTube-ээс санаа авч өөрийн сонирхолд нийцүүлэн хийсэн видео үзэх, хуваалцах платформ төсөл. Netlify дээр байршсан.',
      url: 'https://vocal-truffle-8c33e5.netlify.app',
      tag: '04-A / ВЭБ ТӨСӨЛ',
      icon: PlaySquare,
      color: 'border-red-500/30 text-red-400 bg-red-950/20',
      btnColor: 'bg-red-600 hover:bg-red-500',
    },
    {
      id: 'my-dream',
      title: 'My Dream (Миний Мөрөөдөл)',
      subtitle: 'Ирээдүйн хүсэл зорилгын тухай вэб хуудас',
      description:
        'Программ хангамжийн инженер болох зорилго, алхам бүрийн төлөвлөгөөг танилцуулсан хувийн төслийн вэбсайт.',
      url: 'https://lustrous-malasada-f15aaf.netlify.app',
      tag: '04-B / ХУВИЙН ТӨСӨЛ',
      icon: Compass,
      color: 'border-cyan-500/30 text-cyan-400 bg-cyan-950/20',
      btnColor: 'bg-cyan-600 hover:bg-cyan-500',
    },
    {
      id: 'calculator-project',
      title: 'Тооцоолуур',
      subtitle: 'Миний хийсэн онлайн тооцоолуур вэб',
      description:
        'Оргилуунтэнгисийн кодлож бүтээсэн ухаалаг математик тооцоолуур вэбсайт. Netlify дээр байршсан.',
      url: 'https://adorable-lokum-0ba4ae.netlify.app',
      tag: '04-C / ВЭБ ХЭРЭГСЭЛ',
      icon: Rocket,
      color: 'border-amber-500/30 text-amber-400 bg-amber-950/20',
      btnColor: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400',
    },
    {
      id: 'vibe-fighter-project',
      title: 'Vibe Fighter 🥊',
      subtitle: 'Миний бүтээсэн тулааны тоглоом',
      description:
        'Супер гудамжны тулааны аркад тоглоом — өрсөлдөгчөө ялж аварга болоорой! Vercel дээр амжилттай байршсан.',
      url: 'https://supere-strete-fightere.vercel.app/',
      tag: '04-D / ТОГЛООМ ТӨСӨЛ',
      icon: Swords,
      color: 'border-rose-500/30 text-rose-400 bg-rose-950/20',
      btnColor: 'bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500',
    },
  ];

  return (
    <div id="projects-section" className="my-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-rose-400 font-mono text-xs tracking-widest uppercase">
            <span>04</span>
            <span>·</span>
            <span>БҮТЭЭЛҮҮД</span>
            <span>·</span>
            <span>МИНИЙ ТӨСЛҮҮД</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white mt-1">
            Хийж Бүтээсэн Вэбүүд 🚀
          </h2>
          <p className="text-slate-300 text-sm mt-1 max-w-xl font-light leading-relaxed">
            Би өөрийн сурсан мэдлэгээрээ эдгээр вэб хуудсууд болон тоглоомуудыг кодлож интернетэд нийтэлсэн байгаа.
            Дарж шууд орж үзээрэй!
          </p>
        </div>

        <span className="text-xs font-mono text-slate-400 tracking-wider">
          НИЙТ: 4 ШУУД ЛИНК + БҮТЭЭЛҮҮД
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {projects.map((proj) => {
          const Icon = proj.icon;
          return (
            <div
              key={proj.id}
              className={`bg-black/90 border cosmic-grid rounded-3xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_35px_rgba(255,255,255,0.1)] ${proj.color}`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-black/80 border border-white/10 text-slate-300 uppercase tracking-wider truncate">
                    {proj.tag}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-heading font-bold text-white mb-1">{proj.title}</h3>
                <p className="text-xs font-medium text-slate-400 mb-3">{proj.subtitle}</p>
                <p className="text-slate-300 text-sm leading-relaxed mb-5 sm:mb-6 font-light">
                  {proj.description}
                </p>
              </div>

              <div>
                <a
                  href={proj.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`min-h-[44px] w-full py-3 px-4 ${proj.btnColor} text-white font-heading font-bold text-xs tracking-wider uppercase rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer group`}
                >
                  <span>Вэбсайт руу зочлох</span>
                  <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Highlight: Minecraft Redstone System */}
      <div className="mt-5 bg-black/90 border border-emerald-500/30 text-emerald-400 cosmic-grid rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block">
              04-E / ТОГЛООМЫН СИСТЕМ
            </span>
            <h3 className="text-lg font-heading font-bold text-white">Minecraft Redstone Цайз</h3>
            <p className="text-slate-300 text-xs sm:text-sm font-light mt-0.5">
              100% автомат ургац хураагч болон дайснуудаас хамгаалах Redstone логик цайз.
            </p>
          </div>
        </div>

        <a
          href="#minecraft-food"
          className="min-h-[44px] w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-bold text-xs tracking-wider uppercase rounded-xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <span>Дэлгэрэнгүй үзэх</span>
          <Sparkles className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
