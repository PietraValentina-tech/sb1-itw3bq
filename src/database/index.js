import { Sequelize } from 'sequelize';
import { config } from '../config/config.js';
import { logger } from '../utils/logger.js';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
  username: config.db.username,
  password: config.db.password,
  logging: msg => logger.debug(msg)
});

export async function setupDatabase() {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully');
    await sequelize.sync();
    logger.info('Database models synchronized');
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    throw error;
  }
}

export { sequelize };