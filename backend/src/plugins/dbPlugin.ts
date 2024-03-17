import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

export const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
  log: [
    {
      emit: 'event',
      level: 'query',
    },
  ],
});

export const prismaPlugin: FastifyPluginAsync = fp(async (fastify) => {
  prisma.$on('query', (e) => {
    logger.info(`PRISMAQuery: ${e.query} \n Params: ${e.params} \n Duration: ${e.duration} ms`);
  });

  await prisma.$connect();

  fastify.addHook('onClose', async () => {
    await prisma.$disconnect();
  });
});

export default prismaPlugin;
