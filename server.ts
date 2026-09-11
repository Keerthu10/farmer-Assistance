import express from 'express';
import path from 'path';
import fs from 'fs';
import apiRoutes from './server/routes';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON & URL-encoded body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Health check endpoints for container and load balancer probes
  app.get(['/api/health', '/health', '/healthz'], (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString(), platform: 'AgroAssist Farmer Platform' });
  });

  // API Routes
  app.use('/api', apiRoutes);

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Resolve dist folder whether executed from project root or inside dist/
    let distPath = path.join(process.cwd(), 'dist');
    if (!fs.existsSync(path.join(distPath, 'index.html')) && fs.existsSync(path.join(__dirname, 'index.html'))) {
      distPath = __dirname;
    }
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Global error handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('AgroAssist server error:', err);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: err?.message || 'Internal server error' });
    }
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AgroAssist Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start AgroAssist server:', err);
  process.exit(1);
});
