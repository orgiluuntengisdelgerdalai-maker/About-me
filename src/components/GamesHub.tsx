import React from 'react';
import {
  Gamepad2,
  ArrowLeft,
  ArrowRight,
  Trophy,
  Timer,
  Flame,
  Sparkles,
  Home,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { BasketballGame } from './BasketballGame';
import { AnimeQuiz } from './AnimeQuiz';
import { GameLeaderboard } from './GameLeaderboard';

export type GameId = 'basketball' | 'anime-quiz';

interface GameMeta {
  id: GameId;
  code: string;
  emoji: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  accentBorder: string;
  accentText: string;
  accentGlow: string;
  buttonBg: string;
}

export const GAMES_LIST: GameMeta[] = [
  {
    id: 'basketball',
    code: 'GAME 01',
    emoji: '🏀',
    title: 'Сагсан бөмбөгийн талбай',
    subtitle: '2 ба 3 онооны шидэлтийн тоглоом',
    description:
      'Оргилуунтэнгисийн хамгийн дуртай хобби болох сагсан бөмбөгийн талбайд орж, 2 болон 3 онооны шидэлтээр оноо цуглуулаарай!',
    tags: ['2 ба 3 оноо', 'Дараалсан стреак', 'Конфетти'],
    accentBorder: 'border-amber-500/35 hover:border-amber-400',
    accentText: 'text-amber-400',
    accentGlow: 'hover:shadow-[0_0_40px_rgba(245,158,11,0.2)]',
    buttonBg: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500',
  },
  {
    id: 'anime-quiz',
    code: 'GAME 02',
    emoji: '🍥',
    title: 'Ultimate Anime Quiz',
    subtitle: 'Цагтай 15 асуултын сорилт',
    description:
      'Easy, Medium, Hard, God түвшингээс сонгон 5–15 секундийн хугацаанд 15 анимэ асуултад хариулж ялалт байгуулаарай!',
    tags: ['Easy · Medium · Hard · God', '5–15 сек цаг', '115+ Anime Pool'],
    accentBorder: 'border-purple-500/35 hover:border-purple-400',
    accentText: 'text-purple-400',
    accentGlow: 'hover:shadow-[0_0_40px_rgba(168,85,247,0.22)]',
    buttonBg: 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500',
  },
];

interface GamesHubProps {
  activeGame: GameId | null;
  onSelectGame: (gameId: GameId | null) => void;
  onBackHome: () => void;
  currentUser: User | null;
}

export const GamesHub: React.FC<GamesHubProps> = ({
  activeGame,
  onSelectGame,
  onBackHome,
  currentUser,
}) => {
  // INDIVIDUAL GAME WINDOW
  if (activeGame) {
    const currentMeta = GAMES_LIST.find((g) => g.id === activeGame);

    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Top Window Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-black/85 border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectGame(null)}
              className="px-4 py-2 bg-white/5 hover:bg-white/15 border border-white/15 text-white text-xs font-heading font-bold tracking-wider uppercase rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400" />
              <span>Тоглоом цонх руу буцах</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>/</span>
              <span className={currentMeta?.accentText || 'text-white'}>
                {currentMeta?.emoji} {currentMeta?.title}
              </span>
            </div>
          </div>

          <button
            onClick={onBackHome}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-heading tracking-wider uppercase rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Нүүр хуудас</span>
          </button>
        </div>

        {/* Dedicated Game Screen */}
        <div>
          {activeGame === 'basketball' && <BasketballGame currentUser={currentUser} />}
          {activeGame === 'anime-quiz' && <AnimeQuiz currentUser={currentUser} />}
        </div>

        {/* Live Firestore Leaderboard for this game */}
        <GameLeaderboard currentUser={currentUser} defaultFilter={activeGame} />
      </div>
    );
  }

  // GAMES HUB WINDOW ("ТОГЛООМ" ЦОНХ)
  return (
    <div className="space-y-8">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-3xl bg-black/85 border border-white/10 cosmic-grid backdrop-blur-md shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600/30 to-cyan-500/30 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-[11px] tracking-widest uppercase">
              <span>GAME ARCADE</span>
              <span>·</span>
              <span>{GAMES_LIST.length} ТОГЛООМ БЭЛЭН</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
              🎮 Тоглоомын Цонх
            </h1>
          </div>
        </div>

        <button
          onClick={onBackHome}
          className="px-5 py-2.5 bg-white/5 hover:bg-white/15 border border-white/15 text-white text-xs font-heading font-bold tracking-wider uppercase rounded-xl transition-all flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span>Нүүр цонх руу буцах</span>
        </button>
      </div>

      {/* Intro Banner */}
      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm text-slate-300 font-light">
          Доорх тоглоомуудаас хүссэн тоглоом дээрээ дарж тусдаа тоглоомын цонх руу орж тоглоорой!
        </p>
        <div className="flex items-center gap-4 text-xs font-mono text-slate-400 shrink-0">
          <span className="flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-400" /> Өрсөлдөөн
          </span>
          <span className="flex items-center gap-1.5">
            <Timer className="w-3.5 h-3.5 text-cyan-400" /> Цагтай сорилт
          </span>
          <span className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-rose-400" /> Рекорд
          </span>
        </div>
      </div>

      {/* Clickable Game Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {GAMES_LIST.map((game) => (
          <div
            key={game.id}
            onClick={() => onSelectGame(game.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectGame(game.id);
              }
            }}
            className={`group text-left bg-black/90 border cosmic-grid rounded-3xl p-6 lg:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 cursor-pointer relative overflow-hidden ${game.accentBorder} ${game.accentGlow}`}
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  {game.emoji}
                </div>
                <span className="text-[11px] font-mono px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 tracking-widest">
                  {game.code}
                </span>
              </div>

              <h2 className="text-2xl font-heading font-extrabold text-white group-hover:text-cyan-200 transition-colors">
                {game.title}
              </h2>
              <p className={`text-xs font-mono mt-1 ${game.accentText}`}>{game.subtitle}</p>

              <p className="text-sm text-slate-300 mt-3 leading-relaxed font-light">
                {game.description}
              </p>

              {/* Plain typographic feature list */}
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
                {game.tags.map((tag, idx) => (
                  <React.Fragment key={tag}>
                    {idx > 0 && <span aria-hidden="true">·</span>}
                    <span>{tag}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="mt-7 pt-5 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Тусдаа цонхонд нээгдэнэ
              </span>
              <span
                className={`px-5 py-2.5 ${game.buttonBg} text-white font-heading font-bold text-xs tracking-wider uppercase rounded-xl shadow-lg flex items-center gap-2 transition-all`}
              >
                <span>Тоглох</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Live Firestore Leaderboard across all games */}
      <GameLeaderboard currentUser={currentUser} defaultFilter="all" />
    </div>
  );
};
