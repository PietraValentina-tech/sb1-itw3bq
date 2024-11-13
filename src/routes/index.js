import authRoutes from './auth.routes.js';
import documentRoutes from './document.routes.js';
import ruleRoutes from './rule.routes.js';
import paymentRoutes from './payment.routes.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

export function setupRoutes(app) {
  app.use('/auth', authRoutes);
  app.use('/documents', authenticateToken, documentRoutes);
  app.use('/rules', authenticateToken, ruleRoutes);
  app.use('/payments', authenticateToken, paymentRoutes);
}