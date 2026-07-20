import app from './app';
import logger from './utils/logger';

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  logger.info(`API server running on port ${PORT}`);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection', { reason });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { error });
  process.exit(1);
});

export default server;
