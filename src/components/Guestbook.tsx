import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Heart, Flame, Sparkles, RefreshCw, Users, Globe2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CheerMessage } from '../types';

const INITIAL_LOCAL_FALLBACK: CheerMessage[] = [
  {
    id: '1',
    name: 'Болд ах',
    message: '12 настайдаа вэб хийгээд сурчихсан үнэхээр мундаг байна! Ирээдүйн шилдэг инженер болоорой! 🔥',
    badge: '🚀 Ирээдүйн Инженер',
    timestamp: 'Өнөөдөр, 14:20',
    likes: 18,
  },
  {
    id: '2',
    name: 'Сарнай эгч',
    message: 'Хуушууранд дуртай нь бас яг адилхан байна! Амжилт хүсье, сагсаа бас сайн тоглоорой 🏀',
    badge: '🥟 Хуушуур Fan',
    timestamp: 'Өнөөдөр, 16:05',
    likes: 12,
  },
  {
    id: '3',
    name: 'Ангийн найз Тэмүүлэн',
    message: 'Оргилоо хоёулаа өнөө орой Minecraft сервер дээр орж шинэ байшингаа барьцгаая!',
    badge: '⛏️ Minecraft Баг',
    timestamp: 'Өнөөдөр, 18:45',
    likes: 9,
  },
];

export const Guestbook: React.FC = () => {
  const [messages, setMessages] = useState<CheerMessage[]>(INITIAL_LOCAL_FALLBACK);
  const [cheerCount, setCheerCount] = useState<number>(136);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [name, setName] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [selectedBadge, setSelectedBadge] = useState<string>('🚀 Ирээдүйн Инженер');

  // Fetch live comments left by all visitors from backend API
  const fetchGuestbook = async () => {
    try {
      const res = await fetch('/api/guestbook');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.comments)) {
          setMessages(data.comments);
        }
        if (typeof data.cheerCount === 'number') {
          setCheerCount(data.cheerCount);
        }
      }
    } catch (err) {
      console.warn('Backend guestbook fetch fallback to localStorage:', err);
      try {
        const saved = localStorage.getItem('ot_guestbook_messages');
        if (saved) setMessages(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuestbook();

    // Auto refresh comments every 12 seconds so visitors see new comments live
    const interval = setInterval(() => {
      fetchGuestbook();
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const handleGiveCheer = async () => {
    setCheerCount((prev) => prev + 1);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#06b6d4', '#f59e0b', '#ec4899', '#3b82f6'],
    });

    try {
      await fetch('/api/cheer', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
  };

  const handleLikeMessage = async (id: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, likes: (msg.likes || 0) + 1 } : msg))
    );

    try {
      await fetch(`/api/guestbook/${id}/like`, { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          message: message.trim(),
          badge: selectedBadge,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.comment) {
          setMessages((prev) => [data.comment, ...prev]);
        } else {
          await fetchGuestbook();
        }
      } else {
        // Fallback locally
        const fallbackComment: CheerMessage = {
          id: Date.now().toString(),
          name: name.trim(),
          message: message.trim(),
          badge: selectedBadge,
          timestamp: 'Дөнгөж сая',
          likes: 1,
        };
        setMessages((prev) => [fallbackComment, ...prev]);
      }

      setName('');
      setMessage('');

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#10b981', '#3b82f6', '#f59e0b'],
      });
    } catch (err) {
      console.error('Error posting comment:', err);
      const fallbackComment: CheerMessage = {
        id: Date.now().toString(),
        name: name.trim(),
        message: message.trim(),
        badge: selectedBadge,
        timestamp: 'Дөнгөж сая',
        likes: 1,
      };
      setMessages((prev) => [fallbackComment, ...prev]);
      setName('');
      setMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="guestbook-section" className="my-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-widest uppercase">
            <span>05</span>
            <span>·</span>
            <span>ЗОЧНЫ ДЭВТЭР</span>
            <span>·</span>
            <span>УРМЫН ҮГ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white mt-1">
            Оргилуунтэнгист Урам Хайрлаарай! 💬
          </h2>
          <p className="text-slate-300 text-sm mt-1 max-w-xl font-light leading-relaxed">
            Та энэхүү вэбсайтаар зочлон сэтгэгдэл үлдээвэл энд бодит цаг хугацаанд шууд нийтлэгдэж,
            бусад бүх хүмүүст харагдах болно.
          </p>
        </div>

        {/* Big Cheer Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={fetchGuestbook}
            title="Шинэ сэтгэгдлүүдийг татах"
            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          <button
            onClick={handleGiveCheer}
            className="px-6 py-3.5 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 active:scale-95 text-white font-heading font-bold text-xs tracking-wider uppercase rounded-2xl shadow-[0_0_25px_rgba(6,182,212,0.3)] transition-all flex items-center gap-2.5 cursor-pointer"
          >
            <Flame className="w-5 h-5 text-cyan-200 fill-current animate-pulse" />
            <span>Урам өгөх! ({cheerCount} гал асаалаа)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form to leave a message */}
        <div className="lg:col-span-5 bg-black/90 border border-white/10 cosmic-grid rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Сэтгэгдэл бичих</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Нийтэд нээлттэй шууд харагдана
              </span>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1 tracking-wider uppercase">
                Таны нэр:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Жишээ: Анударь эгч, Бат найз, Зочин..."
                required
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1 tracking-wider uppercase">
                Сонгох сэдэв:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['🚀 Ирээдүйн Инженер', '🏀 Сагсан бөмбөг', '🥟 Хуушуур', '⛏️ Minecraft'].map(
                  (badge) => (
                    <button
                      type="button"
                      key={badge}
                      onClick={() => setSelectedBadge(badge)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        selectedBadge === badge
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-medium'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {badge}
                    </button>
                  )
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1 tracking-wider uppercase">
                Урмын үг / Сэтгэгдэл:
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Оргилуунтэнгист хандаж сайхан үг, сэтгэгдлээ бичээрэй..."
                required
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 active:scale-98 disabled:opacity-50 text-white font-heading font-bold text-xs tracking-wider uppercase rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Илгээж байна...' : 'Нийтэд нийтлэх'}</span>
            </button>
          </form>

          {/* Quick reactions */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <span className="text-xs text-slate-400 block mb-2 font-mono uppercase tracking-wider">
              Шууд урам өгөх:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setName('Зочин');
                  setMessage('🔥 12 настай гэхэд үнэхээр мундаг байна! Амжилт хүсье!');
                  setSelectedBadge('🚀 Ирээдүйн Инженер');
                }}
                className="px-3 py-1.5 bg-white/5 border border-white/10 hover:border-white/20 text-slate-300 text-xs rounded-xl transition-colors cursor-pointer"
              >
                🔥 Шилдэг нь!
              </button>
              <button
                onClick={() => {
                  setName('Сагсны хорхойтон');
                  setMessage('🏀 Сагсаа ч сайн тоглоод, кодоо ч сайн бичээрэй!');
                  setSelectedBadge('🏀 Сагсан бөмбөг');
                }}
                className="px-3 py-1.5 bg-white/5 border border-white/10 hover:border-white/20 text-slate-300 text-xs rounded-xl transition-colors cursor-pointer"
              >
                🏀 Сагсаа амжилттай тоглоорой!
              </button>
            </div>
          </div>
        </div>

        {/* Live Visitor Comments Message Feed */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>ЗОЧДЫН БОДИТ СЭТГЭГДЛҮҮД ({messages.length})</span>
            </span>
            <span className="text-[11px] font-mono text-cyan-400/90 flex items-center gap-1.5">
              <Globe2 className="w-3 h-3 animate-spin" style={{ animationDuration: '10s' }} />
              Шууд шинэчлэгдэнэ
            </span>
          </div>

          <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
            {messages.length === 0 ? (
              <div className="p-8 text-center text-slate-400 border border-dashed border-white/10 rounded-2xl">
                Одоогоор сэтгэгдэл ороогүй байна. Та анхны сэтгэгдлийг үлдээгээрэй!
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className="bg-black/90 border border-white/10 rounded-2xl p-4.5 hover:border-white/20 transition-colors shadow-lg"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-heading font-bold text-xs shadow-md">
                        {msg.name.slice(0, 1)}
                      </div>
                      <div>
                        <span className="text-sm font-heading font-bold text-white block leading-tight">
                          {msg.name}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">{msg.timestamp}</span>
                      </div>
                    </div>

                    {msg.badge && (
                      <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-white/5 text-slate-300 border border-white/10 uppercase tracking-wider">
                        {msg.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed mb-3 font-light">
                    {msg.message}
                  </p>

                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => handleLikeMessage(msg.id)}
                      className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors px-3 py-1 rounded-lg hover:bg-white/5 cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{msg.likes}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
