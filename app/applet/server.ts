import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, 'data', 'articles.json');

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '50mb' }));

  // Ensure data dir exists
  if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
  }

  // API Routes for persistent database sync
  app.get('/api/articles', (req, res) => {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const data = fs.readFileSync(DATA_FILE, 'utf-8');
        return res.json(JSON.parse(data));
      }
    } catch (e) {
      console.error('Error reading articles.json:', e);
    }
    res.json([]);
  });

  app.post('/api/articles', (req, res) => {
    try {
      const articles = req.body;
      fs.writeFileSync(DATA_FILE, JSON.stringify(articles, null, 2), 'utf-8');
      return res.json({ success: true });
    } catch (e) {
      console.error('Error saving articles.json:', e);
      return res.status(500).json({ error: 'Failed to save articles' });
    }
  });

  // Vite middleware for development
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
