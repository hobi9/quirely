import { FastifyInstance } from 'fastify';
import Swagger from '@fastify/swagger';
import SwaggerUi from '@fastify/swagger-ui';
import Cors from '@fastify/cors';
import authRouter from './routes/authRouter';
import Prisma from './plugins/prisma';
import Config from './plugins/config';

const app = async (fastify: FastifyInstance) => {
  await fastify.register(Config);
  await fastify.register(Swagger);
  await fastify.register(SwaggerUi);
  await fastify.register(Cors, {
    origin: true,
  }); // TODO: add options

  await fastify.register(Prisma);

  await fastify.register(authRouter, { prefix: '/api/v1/auth' });
};

export default app;
