import React, { useState } from 'react';
import { Terminal, Play, Code2, Cpu, Check, Copy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PresetCode {
  id: string;
  name: string;
  code: string;
  output: string[];
}

const PRESET_SCRIPTS: PresetCode[] = [
  {
    id: 'future',
    name: 'Мөрөөдлийн код',
    code: `function becomeSoftwareEngineer(name, age) {
  const dream = "Дэлхийн шилдэг инженер";
  const passion = ["Сагсан бөмбөг", "Minecraft", "Хуушуур"];
  
  console.log(\`🚀 \${name} (\${age} настай) ирээдүйд \${dream} болно!\`);
  return "Амжилт ойрхон байна!";
}

becomeSoftwareEngineer("Оргилүүн-Тэнгис", 12);`,
    output: [
      '🚀 Оргилүүн-Тэнгис (12 настай) ирээдүйд Дэлхийн шилдэг инженер болно!',
      '✨ Систем ачааллаа: Зорилго 100% тодорхойлогдлоо.',
      '⭐ Гаралт: "Амжилт ойрхон байна!"',
    ],
  },
  {
    id: 'minecraft',
    name: 'Minecraft Спавн',
    code: `const player = "Orgiluuntengis";
const world = new MinecraftWorld();

world.spawnIronGolem({ x: 100, y: 64, z: -250 });
world.giveItem(player, "diamond_sword", 1);
console.log("🛡️ Төмөр Голем хамгаалалтад гарлаа!");`,
    output: [
      '🧱 Minecraft ертөнцөд холбогдлоо...',
      '🛡️ Төмөр Голем [100, 64, -250] цэгт хамгаалалтад гарлаа!',
      '⚔️ Оргилүүн-Тэнгист очир эрдэнийн сэлэм олголоо!',
    ],
  },
  {
    id: 'basketball',
    name: '3-Онооны Шидэлт',
    code: `function shootThreePointer(accuracy) {
  const trajectory = Math.sin(Math.PI / 4) * 10;
  if (accuracy > 0.8) {
    return "🔥 SWISH! Бөмбөг яг цагирагт орлоо!";
  }
  return "🏀 Дахиад шидээд үзье!";
}

console.log(shootThreePointer(0.95));`,
    output: [
      '🏀 Бөмбөг агаарт нумарлаа (Өнцөг: 45°)...',
      '🔥 SWISH! Бөмбөг яг цагирагт орлоо!',
      '👏 Үзэгчид баяр хүргэж байна!',
    ],
  },
  {
    id: 'huushuur',
    name: 'Хуушуур Тооцоолуур',
    code: `const appetite = 100; // Эрч хүч
const huushuurCount = 5;
const crispyLevel = "Хамгийн шаржигнасан";

console.log(\`🥟 \${huushuurCount} ширхэг \${crispyLevel} хуушуур идлээ.\`);
console.log(\`⚡ Эрч хүчний түвшин: \${appetite + 150}%\`);`,
    output: [
      '🥟 5 ширхэг Хамгийн шаржигнасан хуушуур идлээ.',
      '⚡ Эрч хүчний түвшин: 250%',
      '💻 Код бичихэд 100% бэлэн боллоо!',
    ],
  },
];

export const CodeTerminal: React.FC = () => {
  const [selectedScript, setSelectedScript] = useState<PresetCode>(PRESET_SCRIPTS[0]);
  const [customCode, setCustomCode] = useState<string>(PRESET_SCRIPTS[0].code);
  const [logs, setLogs] = useState<string[]>(PRESET_SCRIPTS[0].output);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleSelectPreset = (preset: PresetCode) => {
    setSelectedScript(preset);
    setCustomCode(preset.code);
    setLogs(preset.output);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setLogs(['⚙️ Кодыг хөрвүүлж байна...', '⚡ Оргилүүн-Тэнгисийн орчинд ажиллаж байна...']);

    setTimeout(() => {
      setLogs(selectedScript.output);
      setIsRunning(false);
      confetti({
        particleCount: 30,
        spread: 50,
        colors: ['#06b6d4', '#3b82f6', '#a855f7'],
      });
    }, 450);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(customCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="dream-section" className="my-10">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-widest uppercase">
            <span>02</span>
            <span>·</span>
            <span>МИНИЙ МӨРӨӨДӨЛ</span>
            <span>·</span>
            <span>ИРЭЭДҮЙН ИНЖЕНЕР</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white mt-1">
            Мөрөөдөл: Код Инженер Болох 💻
          </h2>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl font-light leading-relaxed">
            Би 12 настай бөгөөд миний хамгийн том мөрөөдөл бол дэлхийн хэмжээний чадварлаг
            программ хангамжийн инженер болох явдал юм. Хүмүүсийн амьдралыг хөнгөвчилсөн ухаалаг
            аппликейшн бүтээхийг зорьж байна.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-3.5 py-1.5 rounded-xl flex items-center gap-2 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            Суралцаж байна: HTML, CSS, JS, Python
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Original Image & Dream Card */}
        <div className="lg:col-span-5 bg-black/90 border border-white/10 cosmic-grid rounded-3xl p-6 flex flex-col justify-between shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          <div>
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-slate-950 aspect-[4/3] relative group shadow-2xl">
              <img
                src="https://imgs.search.brave.com/Y7cYi2GYx5Q2fJ7oCbTSKO93qOV7Q_vBLBWrw9E-3VU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/bWFnbmlmaWMuY29t/L3ByZW1pdW0tcGhv/dG8vcG9ydHJhaXQt/c29mdHdhcmUtZW5n/aW5lZXItd3JpdGlu/Zy1jb2RlLXdvcmtw/bGFjZS1vZmZpY2Ut/d2l0aC1tdWx0aXBs/ZS1kZXZpY2VzXzIz/Njg1NC00NDE1NS5q/cGc_c2VtdD1haXNf/aHlicmlkJnc9NzQw/JnE9ODA"
                alt="Software engineer workspace"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?auto=format&fit=crop&w=800&q=80';
                }}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent flex items-end p-4">
                <div>
                  <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest block">
                    Мөрөөдлийн Ажлын Байр
                  </span>
                  <p className="text-sm font-heading font-semibold text-white">
                    Дэлгэц дүүрэн код, бүтээлч шийдлүүд
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-start gap-3 p-3.5 bg-white/5 border border-white/10 rounded-2xl">
                <div className="w-8 h-8 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center shrink-0 text-cyan-400 font-heading font-bold text-xs">
                  01
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-heading font-bold text-white">Шинэ технологи сурах</h4>
                  <p className="text-xs text-slate-400 mt-0.5 font-light">
                    Өдөр бүр код бичих арга барил, алгоритм, вэб хөгжүүлэлтийн суурийг суралцаж байна.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-white/5 border border-white/10 rounded-2xl">
                <div className="w-8 h-8 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center shrink-0 text-emerald-400 font-heading font-bold text-xs">
                  02
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-heading font-bold text-white">Өөрийн төслүүд бүтээх</h4>
                  <p className="text-xs text-slate-400 mt-0.5 font-light">
                    Uutube, My Dream зэрэг вэбсайтуудыг өөрийн гараар хийж интернэтэд нийтэлсэн.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-white/5 border border-white/10 rounded-2xl">
                <div className="w-8 h-8 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-400 font-heading font-bold text-xs">
                  03
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-heading font-bold text-white">Дэлхийн тавцанд гарах</h4>
                  <p className="text-xs text-slate-400 mt-0.5 font-light">
                    Цаашдаа дэлхийн томоохон технологийн компанид код инженерийн чиглэлээр ажиллах хүсэлтэй.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Interactive Code Editor & Terminal */}
        <div className="lg:col-span-7 bg-black/95 border border-white/10 rounded-3xl flex flex-col overflow-hidden shadow-2xl">
          {/* Terminal Title Bar */}
          <div className="bg-white/5 border-b border-white/10 px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              <span className="text-xs font-mono text-slate-400 ml-2 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-cyan-400" /> orgiluuntengis-dev-env.js
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleCopyCode}
                className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-white/10 text-xs flex items-center gap-1 font-mono transition-colors cursor-pointer"
                title="Код хуулах"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Preset Script Selection Tabs */}
          <div className="flex items-center gap-1.5 p-2 bg-black/60 border-b border-white/10 overflow-x-auto text-xs">
            {PRESET_SCRIPTS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`px-3 py-1.5 rounded-lg font-mono transition-colors shrink-0 cursor-pointer ${
                  selectedScript.id === preset.id
                    ? 'bg-cyan-500 text-black font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>

          {/* Code Editor Body */}
          <div className="p-5 bg-black font-mono-code text-xs sm:text-sm overflow-x-auto flex-1">
            <textarea
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              rows={8}
              spellCheck={false}
              className="w-full bg-transparent text-emerald-300 focus:outline-none resize-none font-mono text-xs sm:text-sm leading-relaxed"
            />
          </div>

          {/* Action Bar */}
          <div className="p-3.5 bg-white/5 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono">
              ▶ Туршиж ажиллуулах:
            </span>
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-heading font-bold tracking-wider uppercase rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunning ? 'Ажиллаж байна...' : 'Код ажиллуулах (Run)'}</span>
            </button>
          </div>

          {/* Terminal Output */}
          <div className="bg-black p-5 border-t border-white/10 font-mono text-xs">
            <div className="flex items-center gap-2 text-slate-500 mb-2.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span className="tracking-widest uppercase">КОНСОЛ ГАРАЛТ (OUTPUT)</span>
            </div>
            <div className="space-y-1.5 min-h-[72px]">
              {logs.map((log, idx) => (
                <div key={idx} className="text-slate-300 flex items-start gap-2">
                  <span className="text-cyan-400 select-none">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
