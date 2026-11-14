import React, { useState, useEffect, useRef } from 'react';
import {
  Timer,
  Trophy,
  Skull,
  Zap,
  Shield,
  Flame,
  Crown,
  RotateCcw,
  Play,
  CheckCircle2,
  XCircle,
  Sparkles,
  Tv,
  Save,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { User } from 'firebase/auth';
import { saveGameScore, signInWithGoogle } from '../firebase';

interface AnimeQuestion {
  emoji: string;
  question: string;
  answer: string;
  options: string[];
}

const ANIME_QUIZ_DATA: {
  title: string;
  totalQuestions: number;
  questions: AnimeQuestion[];
  animePool: string[];
} = {
  title: 'Ultimate Anime Quiz',
  totalQuestions: 15,
  questions: [
    {
      emoji: '🍥🍜🦊',
      question: 'Which anime features Naruto Uzumaki?',
      answer: 'Naruto',
      options: ['Naruto', 'Bleach', 'One Piece', 'Death Note'],
    },
    {
      emoji: '🏴‍☠️🍖👒',
      question: 'Which anime follows Monkey D. Luffy on his journey to become the Pirate King?',
      answer: 'One Piece',
      options: ['Fairy Tail', 'One Piece', 'Black Clover', 'Toriko'],
    },
    {
      emoji: '⚔️👹🔥',
      question: 'Which anime features Tanjiro Kamado?',
      answer: 'Demon Slayer',
      options: ['Blue Exorcist', 'Bleach', 'Demon Slayer', 'Jujutsu Kaisen'],
    },
    {
      emoji: '📓💀🍎',
      question: 'Which anime features a notebook that can kill anyone whose name is written in it?',
      answer: 'Death Note',
      options: ['Death Note', 'Monster', 'Code Geass', 'Another'],
    },
    {
      emoji: '🗡️🩸🌙',
      question: 'Which anime features Ichigo Kurosaki?',
      answer: 'Bleach',
      options: ['Bleach', 'Soul Eater', 'Naruto', 'Black Clover'],
    },
    {
      emoji: '🧱⚔️🕊️',
      question: 'Which anime features humanity fighting against giant humanoid creatures called Titans?',
      answer: 'Attack on Titan',
      options: ['Claymore', 'Berserk', 'Attack on Titan', 'Tokyo Ghoul'],
    },
    {
      emoji: '👊💥🦸',
      question: 'Which anime features Saitama, a hero who defeats enemies with one punch?',
      answer: 'One Punch Man',
      options: ['Mob Psycho 100', 'One Punch Man', 'My Hero Academia', 'Dragon Ball'],
    },
    {
      emoji: '🐉🔥💪',
      question: 'Which anime features Goku and the Dragon Balls?',
      answer: 'Dragon Ball',
      options: ['Yu Yu Hakusho', 'Fairy Tail', 'Dragon Ball', 'Saint Seiya'],
    },
    {
      emoji: '🏫💥🦸',
      question: 'Which anime features Izuku Midoriya, also known as Deku?',
      answer: 'My Hero Academia',
      options: ['My Hero Academia', 'Haikyuu!!', 'Fire Force', 'Blue Lock'],
    },
    {
      emoji: '👁️🔮👊',
      question: 'Which anime features Yuji Itadori and Satoru Gojo?',
      answer: 'Jujutsu Kaisen',
      options: ['Noragami', 'Jujutsu Kaisen', 'D.Gray-man', 'Bleach'],
    },
    {
      emoji: '🏀⛹️🔥',
      question: 'Which anime follows the basketball team at Shohoku High School?',
      answer: 'Slam Dunk',
      options: ["Kuroko's Basketball", 'Haikyuu!!', 'Slam Dunk', 'Blue Lock'],
    },
    {
      emoji: '⚽🔥🥅',
      question: "Which anime features Yoichi Isagi competing to become the world's greatest striker?",
      answer: 'Blue Lock',
      options: ['Captain Tsubasa', 'Ao Ashi', 'Inazuma Eleven', 'Blue Lock'],
    },
    {
      emoji: '🧪⚗️🌍',
      question: 'Which anime follows Senku as he tries to rebuild civilization using science?',
      answer: 'Dr. Stone',
      options: ['Dr. Stone', 'Steins;Gate', 'Cells at Work!', 'Pluto'],
    },
    {
      emoji: '🕵️‍♂️👨‍👩‍👧',
      question: 'Which anime features the Forger family?',
      answer: 'Spy x Family',
      options: ['Buddy Daddies', 'Detective Conan', 'Spy x Family', 'Hinamatsuri'],
    },
    {
      emoji: '⚡🐭🔴',
      question: 'Which anime features Ash Ketchum and Pikachu?',
      answer: 'Pokémon',
      options: ['Digimon', 'Beyblade', 'Yo-kai Watch', 'Pokémon'],
    },
  ],
  animePool: [
    'Naruto',
    'One Piece',
    'Bleach',
    'Death Note',
    'Demon Slayer',
    'Attack on Titan',
    'Dragon Ball',
    'Dragon Ball Z',
    'Dragon Ball Super',
    'Jujutsu Kaisen',
    'My Hero Academia',
    'One Punch Man',
    'Mob Psycho 100',
    'Black Clover',
    'Fairy Tail',
    'Hunter x Hunter',
    'Fullmetal Alchemist',
    'Fullmetal Alchemist Brotherhood',
    'Tokyo Ghoul',
    'Sword Art Online',
    'Re:Zero',
    'Steins;Gate',
    'Code Geass',
    'Cowboy Bebop',
    'Neon Genesis Evangelion',
    'Vinland Saga',
    'Berserk',
    "JoJo's Bizarre Adventure",
    'Chainsaw Man',
    'Spy x Family',
    'Dr. Stone',
    'Blue Lock',
    'Haikyuu!!',
    "Kuroko's Basketball",
    'Slam Dunk',
    'Captain Tsubasa',
    'Inazuma Eleven',
    'Pokémon',
    'Digimon',
    'Yu-Gi-Oh!',
    'Beyblade',
    'Fruits Basket',
    'Your Lie in April',
    'Clannad',
    'Toradora!',
    'Horimiya',
    'Kaguya-sama: Love Is War',
    'The Quintessential Quintuplets',
    'Rent-a-Girlfriend',
    'Oregairu',
    'Anohana',
    'Violet Evergarden',
    'Your Name',
    'Weathering with You',
    'A Silent Voice',
    'Suzume',
    'Spirited Away',
    "Howl's Moving Castle",
    'Princess Mononoke',
    'My Neighbor Totoro',
    "Kiki's Delivery Service",
    'Akira',
    'Ghost in the Shell',
    'Psycho-Pass',
    'Monster',
    'Erased',
    'Parasyte',
    'Another',
    'Hellsing Ultimate',
    'Black Lagoon',
    'Trigun',
    'Samurai Champloo',
    'Gintama',
    'The Seven Deadly Sins',
    'Magi',
    'Soul Eater',
    'Fire Force',
    'Blue Exorcist',
    'Noragami',
    'D.Gray-man',
    'Katekyo Hitman Reborn!',
    'Assassination Classroom',
    'The Promised Neverland',
    'Made in Abyss',
    'To Your Eternity',
    'Overlord',
    'That Time I Got Reincarnated as a Slime',
    'Mushoku Tensei',
    'Konosuba',
    'No Game No Life',
    'The Rising of the Shield Hero',
    'Log Horizon',
    'Sword Art Online Alternative: Gun Gale Online',
    'Classroom of the Elite',
    'Food Wars!',
    'The Disastrous Life of Saiki K.',
    'Bocchi the Rock!',
    'K-On!',
    'Nichijou',
    'Lucky Star',
    'Initial D',
    'MF Ghost',
    'Wangan Midnight',
    'Hajime no Ippo',
    'Ashita no Joe',
    'Chihayafuru',
    'Run with the Wind',
    'Free!',
    'Yuri on Ice',
    'The Apothecary Diaries',
    "Frieren: Beyond Journey's End",
    'Oshi no Ko',
    'Solo Leveling',
    'Mashle',
    'Kaiju No. 8',
    'Dandadan',
  ],
};

type DifficultyKey = 'easy' | 'medium' | 'hard' | 'god';

interface DifficultyConfig {
  key: DifficultyKey;
  label: string;
  subLabel: string;
  timeSeconds: number;
  optionCount: number;
  minCorrectToWin: number;
  shuffleQuestions: boolean;
  description: string;
  colorClass: string;
  borderClass: string;
  badgeBg: string;
  icon: React.FC<{ className?: string }>;
}

const DIFFICULTIES: Record<DifficultyKey, DifficultyConfig> = {
  easy: {
    key: 'easy',
    label: 'EASY',
    subLabel: 'Амархан',
    timeSeconds: 15,
    optionCount: 4,
    minCorrectToWin: 8,
    shuffleQuestions: false,
    description: 'Асуулт бүрт 15 сек · 4 сонголт · 8+ зөв хариулбал ялна',
    colorClass: 'text-emerald-400',
    borderClass: 'border-emerald-500/30 hover:border-emerald-400',
    badgeBg: 'bg-emerald-500/15 text-emerald-300',
    icon: Shield,
  },
  medium: {
    key: 'medium',
    label: 'MEDIUM',
    subLabel: 'Дунд',
    timeSeconds: 10,
    optionCount: 4,
    minCorrectToWin: 10,
    shuffleQuestions: true,
    description: 'Асуулт бүрт 10 сек · 4 холимог сонголт · 10+ зөв хариулт',
    colorClass: 'text-cyan-400',
    borderClass: 'border-cyan-500/30 hover:border-cyan-400',
    badgeBg: 'bg-cyan-500/15 text-cyan-300',
    icon: Zap,
  },
  hard: {
    key: 'hard',
    label: 'HARD',
    subLabel: 'Хүнд',
    timeSeconds: 7,
    optionCount: 6,
    minCorrectToWin: 12,
    shuffleQuestions: true,
    description: 'Асуулт бүрт 7 сек · 6 сонголт (Anime Pool) · 12+ зөв хариулт',
    colorClass: 'text-amber-400',
    borderClass: 'border-amber-500/30 hover:border-amber-400',
    badgeBg: 'bg-amber-500/15 text-amber-300',
    icon: Flame,
  },
  god: {
    key: 'god',
    label: 'GOD',
    subLabel: 'Бурхан түвшин',
    timeSeconds: 5,
    optionCount: 8,
    minCorrectToWin: 14,
    shuffleQuestions: true,
    description: 'Асуулт бүрт 5 сек · 8 сонголт · 14+ зөв хариулт — жинхэнэ сорилт!',
    colorClass: 'text-rose-400',
    borderClass: 'border-rose-500/40 hover:border-rose-400',
    badgeBg: 'bg-rose-500/15 text-rose-300',
    icon: Crown,
  },
};

interface PreparedQuestion {
  emoji: string;
  question: string;
  answer: string;
  options: string[];
}

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function prepareQuestionsForLevel(config: DifficultyConfig): PreparedQuestion[] {
  const baseQuestions = config.shuffleQuestions
    ? shuffleArray(ANIME_QUIZ_DATA.questions)
    : [...ANIME_QUIZ_DATA.questions];

  return baseQuestions.map((q) => {
    let opts = [...q.options];

    if (config.optionCount > opts.length) {
      const needed = config.optionCount - opts.length;
      const poolCandidates = shuffleArray(
        ANIME_QUIZ_DATA.animePool.filter((title) => !opts.includes(title) && title !== q.answer)
      );
      opts = [...opts, ...poolCandidates.slice(0, needed)];
    }

    return {
      emoji: q.emoji,
      question: q.question,
      answer: q.answer,
      options: config.key === 'easy' ? opts : shuffleArray(opts),
    };
  });
}

type GamePhase = 'menu' | 'playing' | 'won' | 'lost_timeout' | 'lost_score';

interface AnimeQuizProps {
  currentUser?: User | null;
}

export const AnimeQuiz: React.FC<AnimeQuizProps> = ({ currentUser }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyKey>('easy');
  const [secondsPerQuestion, setSecondsPerQuestion] = useState<number>(15);
  const [phase, setPhase] = useState<GamePhase>('menu');
  const [questions, setQuestions] = useState<PreparedQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [timeLeftMs, setTimeLeftMs] = useState<number>(15000);
  const [chosenOption, setChosenOption] = useState<string | null>(null);
  const [savingScore, setSavingScore] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [bestScores, setBestScores] = useState<Record<DifficultyKey, number>>(() => {
    try {
      const saved = localStorage.getItem('ot_anime_quiz_best');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return { easy: 0, medium: 0, hard: 0, god: 0 };
  });

  const advanceTimeoutRef = useRef<number | null>(null);
  const config = DIFFICULTIES[selectedDifficulty];

  useEffect(() => {
    try {
      localStorage.setItem('ot_anime_quiz_best', JSON.stringify(bestScores));
    } catch (e) {
      console.error(e);
    }
  }, [bestScores]);

  const handleSelectDifficulty = (key: DifficultyKey) => {
    setSelectedDifficulty(key);
    setSecondsPerQuestion(DIFFICULTIES[key].timeSeconds);
  };

  useEffect(() => {
    if (phase !== 'playing' || chosenOption !== null) return;

    const timer = window.setInterval(() => {
      setTimeLeftMs((prev) => {
        if (prev <= 100) {
          window.clearInterval(timer);
          if (advanceTimeoutRef.current) {
            window.clearTimeout(advanceTimeoutRef.current);
          }
          setPhase('lost_timeout');
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    return () => window.clearInterval(timer);
  }, [phase, chosenOption, currentIdx]);

  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current) {
        window.clearTimeout(advanceTimeoutRef.current);
      }
    };
  }, []);

  const startGame = (diffKey: DifficultyKey = selectedDifficulty) => {
    if (advanceTimeoutRef.current) {
      window.clearTimeout(advanceTimeoutRef.current);
    }
    const diffConfig = DIFFICULTIES[diffKey];
    const clampedSec = Math.min(15, Math.max(5, secondsPerQuestion));
    setSelectedDifficulty(diffKey);
    setSecondsPerQuestion(clampedSec);
    setQuestions(prepareQuestionsForLevel(diffConfig));
    setCurrentIdx(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setChosenOption(null);
    setSaveMessage(null);
    setTimeLeftMs(clampedSec * 1000);
    setPhase('playing');
  };

  const handleSaveScoreToDb = async () => {
    if (savingScore) return;
    setSavingScore(true);
    setSaveMessage(null);
    try {
      if (!currentUser) {
        await signInWithGoogle();
      }
      await saveGameScore({
        gameId: 'anime-quiz',
        difficulty: selectedDifficulty,
        score,
        streak: bestStreak,
        timeLeftSeconds: Math.round(timeLeftMs / 1000),
        won: phase === 'won',
      });
      setSaveMessage('✅ DB-д амжилттай хадгалагдлаа!');
    } catch (err) {
      console.error('Failed to save anime quiz score:', err);
      setSaveMessage('Хадгалж чадсангүй. Дахин оролдоно уу.');
    } finally {
      setSavingScore(false);
    }
  };

  const handleSelectOption = (option: string) => {
    if (phase !== 'playing' || chosenOption !== null) return;

    const currentQ = questions[currentIdx];
    const isCorrect = option === currentQ.answer;
    setChosenOption(option);

    const nextScore = isCorrect ? score + 1 : score;
    if (isCorrect) {
      setScore(nextScore);
      setStreak((prev) => {
        const next = prev + 1;
        setBestStreak((b) => Math.max(b, next));
        return next;
      });
    } else {
      setStreak(0);
    }

    const delay = config.key === 'god' ? 220 : 380;

    advanceTimeoutRef.current = window.setTimeout(() => {
      const nextIndex = currentIdx + 1;
      if (nextIndex >= questions.length) {
        if (nextScore >= config.minCorrectToWin) {
          setPhase('won');
          setBestScores((prev) => ({
            ...prev,
            [config.key]: Math.max(prev[config.key], nextScore),
          }));
          confetti({
            particleCount: config.key === 'god' ? 120 : 70,
            spread: 85,
            origin: { y: 0.6 },
            colors: ['#06b6d4', '#f59e0b', '#10b981', '#ec4899'],
          });
        } else {
          setPhase('lost_score');
          setBestScores((prev) => ({
            ...prev,
            [config.key]: Math.max(prev[config.key], nextScore),
          }));
        }
      } else {
        setCurrentIdx(nextIndex);
        setChosenOption(null);
        setTimeLeftMs(secondsPerQuestion * 1000);
      }
    }, delay);
  };

  const totalQuestionMs = secondsPerQuestion * 1000;
  const timeLeftSecondsDisplay = (timeLeftMs / 1000).toFixed(1);
  const timeProgressPercent = Math.max(0, Math.min(100, (timeLeftMs / totalQuestionMs) * 100));
  const isDangerTime = timeLeftMs <= 3000;

  return (
    <div
      id="anime-quiz"
      className="bg-black/90 border border-white/10 cosmic-grid rounded-3xl p-6 lg:p-8 text-white relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]"
    >
      {/* Ambient glow */}
      <div className="absolute -top-10 -right-10 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-purple-400 font-mono text-xs tracking-widest uppercase">
            <Tv className="w-3.5 h-3.5" />
            <span>МИНИ ТОГЛООМ</span>
            <span>·</span>
            <span>15 АСУУЛТ</span>
            <span>·</span>
            <span>{ANIME_QUIZ_DATA.animePool.length} ANIME POOL</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white mt-1">
            {ANIME_QUIZ_DATA.title} — Цагтай Сорилт 🍥
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl font-light">
            Easy, Medium, Hard, God түвшингээс сонгоод асуулт бүрт 5–15 секундийн хугацаанд хариулаарай.
            Цагтаа багтахгүй бол шууд хожигдоно!
          </p>
        </div>

        {phase === 'playing' && (
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 backdrop-blur-md">
            <div className="text-center pr-3 border-r border-white/10">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">ТҮВШИН</span>
              <span className={`text-xs font-heading font-bold ${config.colorClass}`}>
                {config.label}
              </span>
            </div>
            <div className="text-center pr-3 border-r border-white/10">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">ОНОО</span>
              <span className="text-lg font-heading font-bold text-white">
                {score}/{questions.length}
              </span>
            </div>
            <div className="text-center min-w-[78px]">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">ҮЛДСЭН ЦАГ</span>
              <span
                className={`text-xl font-heading font-extrabold font-mono flex items-center justify-center gap-1 ${
                  isDangerTime ? 'text-rose-500 animate-pulse' : 'text-cyan-400'
                }`}
              >
                <Timer className="w-4 h-4" />
                {timeLeftSecondsDisplay}с
              </span>
            </div>
          </div>
        )}
      </div>

      {/* PHASE 1: MENU / DIFFICULTY SELECT */}
      {phase === 'menu' && (
        <div className="relative z-10 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(Object.keys(DIFFICULTIES) as DifficultyKey[]).map((key) => {
              const item = DIFFICULTIES[key];
              const Icon = item.icon;
              const isSelected = selectedDifficulty === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSelectDifficulty(key)}
                  className={`text-left p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? `bg-white/10 ${item.borderClass} shadow-[0_0_25px_rgba(255,255,255,0.08)]`
                      : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-xl ${item.badgeBg}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      Дээд: {bestScores[key] || 0}/15
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <h3 className={`text-lg font-heading font-extrabold ${item.colorClass}`}>
                      {item.label}
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">({item.subLabel})</span>
                  </div>

                  <p className="text-xs text-slate-300 mt-2 leading-relaxed font-light">
                    {item.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* 5-15 Second Per-Question Timer Selector */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 block">
                ⏱️ Асуулт бүрийн хугацаа тохируулах (5 – 15 сек)
              </span>
              <p className="text-xs text-slate-400 mt-0.5">
                Түвшин сонгоход автоматаар тохирох ба та хүссэнээрээ 5–15 секундийн хооронд өөрчилж болно.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                {[5, 7, 10, 12, 15].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setSecondsPerQuestion(sec)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                      secondsPerQuestion === sec
                        ? 'bg-cyan-500 text-black font-bold border-cyan-400'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {sec}с
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 bg-black/50 border border-white/10 rounded-xl px-3 py-1.5">
                <input
                  type="range"
                  min={5}
                  max={15}
                  step={1}
                  value={secondsPerQuestion}
                  onChange={(e) => setSecondsPerQuestion(Number(e.target.value))}
                  className="w-24 accent-cyan-400 cursor-pointer"
                  aria-label="Асуулт бүрийн секунд"
                />
                <span className="text-sm font-heading font-bold text-cyan-300 min-w-[36px] text-right">
                  {secondsPerQuestion}с
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-white/[0.04] border border-white/10">
            <div className="flex items-center gap-3 text-sm">
              <Sparkles className="w-5 h-5 text-purple-400 shrink-0" />
              <div>
                <span className="font-heading font-bold text-white block">
                  Сонгосон түвшин: <span className={config.colorClass}>{config.label} ({config.subLabel})</span> ·{' '}
                  <span className="text-cyan-300">{secondsPerQuestion} сек/асуулт</span>
                </span>
                <span className="text-xs text-slate-400">
                  Асуулт бүрт {secondsPerQuestion} секунд дотор хариулж, 15 асуултаас дор хаяж{' '}
                  {config.minCorrectToWin}-г нь зөв хариулбал ялна.
                </span>
              </div>
            </div>

            <button
              onClick={() => startGame(selectedDifficulty)}
              className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 active:scale-95 text-white font-heading font-bold text-xs tracking-wider uppercase rounded-xl shadow-[0_0_25px_rgba(147,51,234,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Тоглоом эхлүүлэх</span>
            </button>
          </div>
        </div>
      )}

      {/* PHASE 2: PLAYING */}
      {phase === 'playing' && questions[currentIdx] && (
        <div className="relative z-10 space-y-5">
          {/* Timer & Question Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>
                Асуулт {currentIdx + 1} / {questions.length}
              </span>
              <span className="flex items-center gap-3">
                {streak >= 2 && (
                  <span className="text-amber-400 font-bold">🔥 {streak} дарааллаа!</span>
                )}
                <button
                  onClick={() => setPhase('menu')}
                  className="text-slate-400 hover:text-white underline cursor-pointer"
                >
                  Гарах
                </button>
              </span>
            </div>

            <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  isDangerTime
                    ? 'bg-gradient-to-r from-rose-600 to-red-400'
                    : 'bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-500'
                }`}
                style={{ width: `${timeProgressPercent}%` }}
              />
            </div>
          </div>

          {/* Question Box */}
          <div className="p-6 rounded-2xl bg-black/70 border border-white/15 text-center space-y-3">
            <div className="text-4xl sm:text-5xl tracking-widest select-none">
              {questions[currentIdx].emoji}
            </div>
            <h3 className="text-lg sm:text-2xl font-bold text-white leading-snug max-w-2xl mx-auto">
              {questions[currentIdx].question}
            </h3>
          </div>

          {/* Options Grid */}
          <div
            className={`grid gap-3 ${
              config.optionCount >= 6
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                : 'grid-cols-1 sm:grid-cols-2'
            }`}
          >
            {questions[currentIdx].options.map((opt) => {
              const isChosen = chosenOption === opt;
              const isCorrectAnswer = opt === questions[currentIdx].answer;

              let btnStyle =
                'bg-white/5 hover:bg-white/10 border-white/15 hover:border-cyan-400/60 text-slate-100';

              if (chosenOption !== null) {
                if (isCorrectAnswer) {
                  btnStyle = 'bg-emerald-500/25 border-emerald-400 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.3)]';
                } else if (isChosen && !isCorrectAnswer) {
                  btnStyle = 'bg-rose-500/25 border-rose-500 text-rose-200';
                } else {
                  btnStyle = 'bg-white/[0.02] border-white/5 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleSelectOption(opt)}
                  disabled={chosenOption !== null}
                  className={`p-4 rounded-xl border text-left font-medium text-sm transition-all flex items-center justify-between gap-2 cursor-pointer disabled:cursor-default ${btnStyle}`}
                >
                  <span className="truncate">{opt}</span>
                  {chosenOption !== null && isCorrectAnswer && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                  {chosenOption !== null && isChosen && !isCorrectAnswer && (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* PHASE 3: LOST BY TIMEOUT */}
      {phase === 'lost_timeout' && (
        <div className="relative z-10 p-8 rounded-2xl bg-rose-950/30 border border-rose-500/40 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <Skull className="w-9 h-9 animate-bounce" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-rose-400">
            ЦАГ ДУУСЛАА — ТА ХОЖИГДЛОО! ⏳
          </h3>
          <p className="text-slate-300 text-sm max-w-md mx-auto">
            <span className="font-bold text-white">{config.label}</span> түвшний асуулт бүрийн{' '}
            <span className="text-rose-300 font-bold">{secondsPerQuestion} секундийн</span> хугацаанд багтаж
            чадсангүй. Та {currentIdx + 1}-р асуулт дээр зогсож{' '}
            <span className="text-amber-300 font-bold">{score}</span> зөв хариуллаа.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleSaveScoreToDb}
              disabled={savingScore || saveMessage?.startsWith('✅')}
              className="px-6 py-3 bg-cyan-600/25 hover:bg-cyan-600/40 disabled:opacity-50 border border-cyan-400/40 text-cyan-200 font-heading font-bold text-xs tracking-wider uppercase rounded-xl transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {saveMessage?.startsWith('✅') ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>
                {savingScore
                  ? 'Хадгалж байна...'
                  : currentUser
                  ? 'Оноог DB-д хадгалах'
                  : 'Google-ээр нэвтэрч хадгалах'}
              </span>
            </button>
            <button
              onClick={() => startGame(selectedDifficulty)}
              className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-heading font-bold text-xs tracking-wider uppercase rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Дахин оролдох</span>
            </button>
            <button
              onClick={() => setPhase('menu')}
              className="px-6 py-3 bg-white/10 hover:bg-white/15 text-slate-200 font-heading font-bold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer"
            >
              Түвшин солих
            </button>
          </div>
          {saveMessage && (
            <p className="text-xs font-mono text-emerald-400 pt-1">{saveMessage}</p>
          )}
        </div>
      )}

      {/* PHASE 4: FINISHED IN TIME BUT LOW SCORE */}
      {phase === 'lost_score' && (
        <div className="relative z-10 p-8 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <XCircle className="w-9 h-9" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-amber-400">
            ОНОО ДУТЛАА — ХОЖИГДЛОО!
          </h3>
          <p className="text-slate-300 text-sm max-w-md mx-auto">
            Хугацаандаа багтсан ч <span className="font-bold text-white">{config.label}</span> түвшинг давахад{' '}
            <span className="text-white font-bold">{config.minCorrectToWin}</span> зөв хариулт хэрэгтэй. Та{' '}
            <span className="text-amber-300 font-bold">
              {score} / {questions.length}
            </span>{' '}
            авлаа.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleSaveScoreToDb}
              disabled={savingScore || saveMessage?.startsWith('✅')}
              className="px-6 py-3 bg-cyan-600/25 hover:bg-cyan-600/40 disabled:opacity-50 border border-cyan-400/40 text-cyan-200 font-heading font-bold text-xs tracking-wider uppercase rounded-xl transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {saveMessage?.startsWith('✅') ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>
                {savingScore
                  ? 'Хадгалж байна...'
                  : currentUser
                  ? 'Оноог DB-д хадгалах'
                  : 'Google-ээр нэвтэрч хадгалах'}
              </span>
            </button>
            <button
              onClick={() => startGame(selectedDifficulty)}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-heading font-bold text-xs tracking-wider uppercase rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Дахин тоглох</span>
            </button>
            <button
              onClick={() => setPhase('menu')}
              className="px-6 py-3 bg-white/10 hover:bg-white/15 text-slate-200 font-heading font-bold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer"
            >
              Түвшин солих
            </button>
          </div>
          {saveMessage && (
            <p className="text-xs font-mono text-emerald-400 pt-1">{saveMessage}</p>
          )}
        </div>
      )}

      {/* PHASE 5: WON */}
      {phase === 'won' && (
        <div className="relative z-10 p-8 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Trophy className="w-9 h-9 animate-bounce" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-emerald-400">
            БАЯР ХҮРГЭЕ — ТА ЯЛЛАА! 🏆
          </h3>
          <p className="text-slate-300 text-sm max-w-md mx-auto">
            Та <span className={`font-bold ${config.colorClass}`}>{config.label}</span> түвшинг ({secondsPerQuestion}с/асуулт) амжилттай давж{' '}
            <span className="text-white font-bold">
              {score} / {questions.length}
            </span>{' '}
            оноо авлаа!
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleSaveScoreToDb}
              disabled={savingScore || saveMessage?.startsWith('✅')}
              className="px-6 py-3 bg-cyan-600/25 hover:bg-cyan-600/40 disabled:opacity-50 border border-cyan-400/40 text-cyan-200 font-heading font-bold text-xs tracking-wider uppercase rounded-xl transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {saveMessage?.startsWith('✅') ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>
                {savingScore
                  ? 'Хадгалж байна...'
                  : currentUser
                  ? 'Оноог DB-д хадгалах'
                  : 'Google-ээр нэвтэрч хадгалах'}
              </span>
            </button>
            <button
              onClick={() => startGame(selectedDifficulty)}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-bold text-xs tracking-wider uppercase rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Дахин тоглох</span>
            </button>
            <button
              onClick={() => setPhase('menu')}
              className="px-6 py-3 bg-white/10 hover:bg-white/15 text-slate-200 font-heading font-bold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer"
            >
              Дараагийн түвшин сонгох
            </button>
          </div>
          {saveMessage && (
            <p className="text-xs font-mono text-emerald-400 pt-1">{saveMessage}</p>
          )}
        </div>
      )}
    </div>
  );
};
