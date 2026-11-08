import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

interface CommentItem {
  id: string;
  name: string;
  message: string;
  badge?: string;
  timestamp: string;
  createdAt: number;
  likes: number;
}

const DATA_FILE = path.resolve(__dirname, 'guestbook_comments.json');

const DEFAULT_COMMENTS: CommentItem[] = [
  {
    id: '1',
    name: 'Болд ах',
    message: '12 настайдаа вэб хийгээд сурчихсан үнэхээр мундаг байна! Ирээдүйн шилдэг инженер болоорой! 🔥',
    badge: '🚀 Ирээдүйн Инженер',
    timestamp: 'Өнөөдөр, 14:20',
    createdAt: Date.now() - 3600000 * 5,
    likes: 18,
  },
  {
    id: '2',
    name: 'Сарнай эгч',
    message: 'Хуушууранд дуртай нь бас яг адилхан байна! Амжилт хүсье, сагсаа бас сайн тоглоорой 🏀',
    badge: '🥟 Хуушуур Fan',
    timestamp: 'Өнөөдөр, 16:05',
    createdAt: Date.now() - 3600000 * 3,
    likes: 12,
  },
  {
    id: '3',
    name: 'Ангийн найз Тэмүүлэн',
    message: 'Оргилоо хоёулаа өнөө орой Minecraft сервер дээр орж шинэ байшингаа барьцгаая!',
    badge: '⛏️ Minecraft Баг',
    timestamp: 'Өнөөдөр, 18:45',
    createdAt: Date.now() - 3600000 * 1,
    likes: 9,
  },
];

// Read comments from persistent server JSON file
function readComments(): CommentItem[] {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_COMMENTS, null, 2), 'utf-8');
      return DEFAULT_COMMENTS;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_COMMENTS;
  } catch (err) {
    console.error('Error reading comments file:', err);
    return DEFAULT_COMMENTS;
  }
}

// Write comments to persistent server JSON file
function writeComments(comments: CommentItem[]): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(comments, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing comments file:', err);
  }
}

// Global cheer count
let cheerCount = 136;

// API: Get all visitors comments
app.get('/api/guestbook', (_req, res) => {
  const comments = readComments();
  res.json({ comments, cheerCount });
});

// API: Post new comment by visitors
app.post('/api/guestbook', (req, res) => {
  const { name, message, badge } = req.body;
  if (!name || !message || typeof name !== 'string' || typeof message !== 'string') {
    res.status(400).json({ error: 'Нэр болон сэтгэгдэл оруулна уу.' });
    return;
  }

  const now = new Date();
  const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const newComment: CommentItem = {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: name.trim().slice(0, 50),
    message: message.trim().slice(0, 500),
    badge: badge ? String(badge).slice(0, 40) : '🚀 Ирээдүйн Инженер',
    timestamp: `Өнөөдөр, ${timeString}`,
    createdAt: Date.now(),
    likes: 1,
  };

  const comments = readComments();
  const updated = [newComment, ...comments];
  writeComments(updated);

  res.status(201).json({ comment: newComment });
});

// API: Like a comment
app.post('/api/guestbook/:id/like', (req, res) => {
  const { id } = req.params;
  const comments = readComments();
  const target = comments.find((c) => c.id === id);
  if (target) {
    target.likes = (target.likes || 0) + 1;
    writeComments(comments);
    res.json({ success: true, likes: target.likes });
  } else {
    res.status(404).json({ error: 'Comment not found' });
  }
});

// API: Add cheer
app.post('/api/cheer', (_req, res) => {
  cheerCount++;
  res.json({ cheerCount });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
