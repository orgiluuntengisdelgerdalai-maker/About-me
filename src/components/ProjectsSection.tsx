import React from 'react';
import { ExternalLink, PlaySquare, Compass, Rocket, Sparkles, FolderGit2, ArrowRight } from 'lucide-react';

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
      id: 'minecraft-project',
      title: 'Minecraft Redstone Цайз',
      subtitle: 'Автомат ферм ба хамгаалалтын систем',
      description:
        'Minecraft тоглоом дотор бүтээсэн 100% автомат ургац хураагч болон дайснуудаас хамгаалах Redstone логик цайз.',
      url: '#minecraft-food',
      tag: '04-C / ТОГЛООМЫН СИСТЕМ',
      icon: Rocket,
      color: 'border-emerald-500/30 text-emerald-400 bg-emerald-950/20',
      btnColor: 'bg-emerald-600 hover:bg-emerald-500',
      isInternal: true,
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
            Би өөрийн сурсан мэдлэгээрээ эдгээр вэб хуудсуудыг кодлож интернетэд нийтэлсэн байгаа.
            Дарж шууд орж үзээрэй!
          </p>
        </div>

        <span className="text-xs font-mono text-slate-400 tracking-wider">
          НИЙТ: 2 ШУУД ЛИНК + ШИНЭ ТӨСЛҮҮД
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => {
          const Icon = proj.icon;
          return (
            <div
              key={proj.id}
              className={`bg-black/90 border cosmic-grid rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_35px_rgba(255,255,255,0.1)] ${proj.color}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono px-3 py-1 rounded-md bg-black/80 border border-white/10 text-slate-300 uppercase tracking-wider">
                    {proj.tag}
                  </span>
                </div>

                <h3 className="text-xl font-heading font-bold text-white mb-1">{proj.title}</h3>
                <p className="text-xs font-medium text-slate-400 mb-3">{proj.subtitle}</p>
                <p className="text-slate-300 text-sm leading-relaxed mb-6 font-light">
                  {proj.description}
                </p>
              </div>

              <div>
                {proj.isInternal ? (
                  <a
                    href={proj.url}
                    className={`w-full py-3 px-4 ${proj.btnColor} text-white font-heading font-bold text-xs tracking-wider uppercase rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer`}
                  >
                    <span>Дэлгэрэнгүй үзэх</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <a
                    href={proj.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-3 px-4 ${proj.btnColor} text-white font-heading font-bold text-xs tracking-wider uppercase rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer group`}
                  >
                    <span>Вэбсайт руу зочлох</span>
                    <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
