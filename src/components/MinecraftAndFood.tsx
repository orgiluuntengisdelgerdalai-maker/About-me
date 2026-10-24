import React, { useState } from 'react';
import { Pickaxe, Sparkles, Utensils, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

export const MinecraftAndFood: React.FC = () => {
  const [minedDiamonds, setMinedDiamonds] = useState<number>(12);
  const [huushuurCount, setHuushuurCount] = useState<number>(5);
  const [huushuurFeedback, setHuushuurFeedback] = useState<string>('Хамгийн амттай нь халуун, шаржигнасан хуушуур!');

  const handleMineBlock = () => {
    setMinedDiamonds((prev) => prev + 1);
    if ((minedDiamonds + 1) % 5 === 0) {
      confetti({
        particleCount: 40,
        spread: 60,
        colors: ['#06b6d4', '#38bdf8', '#bae6fd'],
      });
    }
  };

  const handleEatHuushuur = () => {
    const nextCount = huushuurCount + 1;
    setHuushuurCount(nextCount);
    if (nextCount === 6) setHuushuurFeedback('😋 Амтат хуушуур идээд эрч хүч дүүрлээ!');
    else if (nextCount === 10) setHuushuurFeedback('🔥 10 Хуушуур! Жинхэнэ Монгол хүч!');
    else if (nextCount > 10) setHuushuurFeedback('👑 Хуушуурын аварга тодорлоо!');
    else setHuushuurFeedback('Шаржигнасан, халуун амтат хуушуур хамгийн шилдэг нь!');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
      {/* Minecraft Card */}
      <div className="bg-black/90 border border-white/10 cosmic-grid rounded-3xl p-6 lg:p-8 text-white relative overflow-hidden flex flex-col justify-between shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs tracking-widest uppercase">
            <span>03-A</span>
            <span>·</span>
            <span>ТОГЛООМ</span>
            <span>·</span>
            <span>MINECRAFT ХОРХОЙТОН</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-heading font-bold mt-2 text-white flex items-center gap-2">
            Minecraft-д дуртай! ⛏️
          </h3>

          <p className="text-slate-300 text-sm mt-2 leading-relaxed font-light">
            Би чөлөөт цагаараа Minecraft тоглох маш их дуртай. Энд зүгээр л тоглоод зогсохгүй
            Redstone механизм, цахилгаан логик схемүүд угсарч, асар том хот цайзууд бүтээдэг нь
            намайг анх код бичих сонирхолтой болгосон!
          </p>

          {/* Minecraft Image from original HTML */}
          <div className="mt-5 rounded-2xl overflow-hidden border border-white/10 bg-slate-950 aspect-video relative group shadow-2xl">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFBBZP_AcU7ec-C1rwPa9ZhR_q9IlHb5Ay2tT0DxdmJA&s=10"
              alt="Minecraft Gaming"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?auto=format&fit=crop&w=800&q=80';
              }}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex items-end p-3">
              <span className="text-[11px] font-mono text-emerald-300 bg-black/80 px-3 py-1 rounded-lg border border-emerald-500/30">
                ⛏️ Pixel World & Logic Building
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Diamond Mining HUD */}
        <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-mono block tracking-widest uppercase">
              ОЛБОРЛОСОН АЛМААЗ
            </span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-heading font-extrabold text-cyan-400">
                💎 {minedDiamonds}
              </span>
              <span className="text-xs text-slate-400 font-mono">ширхэг</span>
            </div>
          </div>

          <button
            onClick={handleMineBlock}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-heading font-bold text-xs tracking-wider uppercase rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Pickaxe className="w-3.5 h-3.5" />
            <span>Алмааз ухах!</span>
          </button>
        </div>
      </div>

      {/* Favorite Food: Huushuur Card */}
      <div className="bg-black/90 border border-white/10 cosmic-grid rounded-3xl p-6 lg:p-8 text-white relative overflow-hidden flex flex-col justify-between shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div>
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs tracking-widest uppercase">
            <span>03-B</span>
            <span>·</span>
            <span>ДУРТАЙ ЗҮЙЛС</span>
            <span>·</span>
            <span>ХАМГИЙН ДУРТАЙ ХООЛ</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-heading font-bold mt-2 text-white flex items-center gap-2">
            Амтат Хуушуур 🥟
          </h3>

          <p className="text-slate-300 text-sm mt-2 leading-relaxed font-light">
            Миний хамгийн дуртай хоол бол шаржигнасан, халуун амттай монгол хуушуур!
            Хөлбөмбөг, сагс тоглоод эсвэл код бичээд сууж байхад ээжийн хийсэн шинэхэн хуушуур
            хамгийн их эрч хүч өгдөг.
          </p>

          {/* Huushuur Image from original HTML */}
          <div className="mt-5 rounded-2xl overflow-hidden border border-white/10 bg-slate-950 aspect-video relative group shadow-2xl">
            <img
              src="https://imgs.search.brave.com/2HCZaA2L_vV5EHSfnaaBLsQA7X3sdnexdRhi5ligowk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy85/Lzk3L0todXVzaHV1/cixNb25nb2xpYW5f/VWxhYW5iYWF0YXJf/c3R5bGUuSlBH"
              alt="Mongolian Huushuur"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://upload.wikimedia.org/wikipedia/commons/9/97/Khuushuur%2CMongolian_Ulaanbaatar_style.JPG';
              }}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex items-end p-3">
              <span className="text-[11px] font-mono text-amber-300 bg-black/80 px-3 py-1 rounded-lg border border-amber-500/30">
                🥟 Халуун шаржигнасан Улаанбаатар хуушуур
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Huushuur counter HUD */}
        <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-mono block tracking-widest uppercase">
              ОРГИЛҮҮН-ТЭНГИСИЙН СТАТУС
            </span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-heading font-extrabold text-amber-400">
                {huushuurCount} 🥟
              </span>
              <span className="text-xs text-slate-400 font-mono">хуушуур идсэн!</span>
            </div>
            <p className="text-[11px] text-amber-300/80 mt-0.5 font-light">{huushuurFeedback}</p>
          </div>

          <button
            onClick={handleEatHuushuur}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 active:scale-95 text-white font-heading font-bold text-xs tracking-wider uppercase rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Хуушуур идэх!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
