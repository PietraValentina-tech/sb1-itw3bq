import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { WebSocketServer } from 'ws';
import { config } from './config/config.js';
import { setupRoutes } from './routes/index.js';
import { setupDatabase } from './database/index.js';
import { logger } from './utils/logger.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Setup routes
setupRoutes(app);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
});

// Initialize database
setupDatabase()
  .then(() => {
    const server = app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
    });

    // Setup WebSocket server
    const wss = new WebSocketServer({ server });
    wss.on('connection', (ws) => {
      ws.on('message', (message) => {
        // Handle real-time messages
        logger.info('Received message:', message);
      });
    });
  })
  .catch(err => {
    logger.error('Failed to initialize database:', err);
    process.exit(1);
  });