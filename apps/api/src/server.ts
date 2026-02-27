import dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../../../../.env') });

import { createApp } from './app.js';
import { logger } from './utils/logger.js';

const port = parseInt(process.env.API_PORT || '3001', 10);

const app = createApp();

app.listen(port, () => {
  logger.info(`API server running on http://localhost:${port}`);
  logger.info(`Health check: http://localhost:${port}/api/health`);
});
