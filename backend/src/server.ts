import crypto from 'node:crypto';
import Fastify from 'fastify';
import App from './app';
import { validateEnvironment } from './config/config';
import { logger } from './lib/logger';

validateEnvironment();

const fastify = Fastify({
  logger,
  genReqId: () => crypto.randomUUID(),
  maxParamLength: 10000,
  disableRequestLogging: true,
});

fastify.register(App);

fastify.listen({ port: process.env.SERVER_PORT }, (error, address) => {
  if (error) {
    logger.error(error, 'Error during server startup');
    process.exit(1);
  }
  logger.info(`Server listening at hello ${address}`);
});
