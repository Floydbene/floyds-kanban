import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/error.js';

import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/project.routes.js';
import boardRoutes from './routes/board.routes.js';
import columnRoutes from './routes/column.routes.js';
import taskRoutes from './routes/task.routes.js';
import labelRoutes from './routes/label.routes.js';
import subtaskRoutes from './routes/subtask.routes.js';
import commentRoutes from './routes/comment.routes.js';
import timeEntryRoutes from './routes/time-entry.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import projectTagRoutes from './routes/project-tag.routes.js';
import taskResourceRoutes from './routes/task-resource.routes.js';

export function createApp() {
  const app = express();

  // Middleware
  const allowedOrigins = [
    'http://localhost:5173',
    process.env.CORS_ORIGIN,
  ].filter(Boolean) as string[];
  app.use(cors({ origin: allowedOrigins, credentials: true }));
  app.use(helmet());
  app.use(morgan('dev'));
  app.use(express.json());

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api', boardRoutes);
  app.use('/api', columnRoutes);
  app.use('/api', taskRoutes);
  app.use('/api', labelRoutes);
  app.use('/api', subtaskRoutes);
  app.use('/api', commentRoutes);
  app.use('/api', timeEntryRoutes);
  app.use('/api', dashboardRoutes);
  app.use('/api', projectTagRoutes);
  app.use('/api', taskResourceRoutes);

  // Global error handler
  app.use(errorHandler);

  return app;
}
