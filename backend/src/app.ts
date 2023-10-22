import { FastifyInstance } from 'fastify';
import Swagger from '@fastify/swagger';
import SwaggerUi from '@fastify/swagger-ui';
import Cors from '@fastify/cors';
import authRouter from './routes/authRouter';

const app = async (fastify: FastifyInstance) => {
  fastify.register(Swagger);
  fastify.register(SwaggerUi);
  fastify.register(Cors, {
    origin: true,
  }); // TODO: add options

  fastify.register(authRouter, { prefix: '/api/v1/auth' });
};

export default app;
