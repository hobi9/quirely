import { FastifyInstance } from 'fastify';
import Swagger from '@fastify/swagger';
import SwaggerUi from '@fastify/swagger-ui';
import Cors from '@fastify/cors';
import authRouter from './routes/authRouter';
import Prisma from './plugins/prisma';
import Config from './plugins/config';
import Cookie from '@fastify/cookie';
import Csrf from '@fastify/csrf-protection';
import Auth from './plugins/authPlugin';
import workspaceRouter from './routes/workspaceRouter';
import Mailer from './plugins/mailer';

const app = async (fastify: FastifyInstance) => {
  await fastify.register(Config);

  if (fastify.config.ENV !== 'production') {
    await fastify.register(Swagger);
    await fastify.register(SwaggerUi);
  }

  await fastify.register(Cors, {
    origin: true,
    credentials: true,
  }); // TODO: add options

  await fastify.register(Prisma);

  await fastify.register(Cookie, {
    secret: fastify.config.COOKIE_SECRET,
  });

  await fastify.register(Csrf, {
    sessionPlugin: '@fastify/cookie',
    cookieOpts: {
      signed: true,
      path: '/api',
    },
  });

  await fastify.register(Mailer);
  await fastify.register(Auth);

  fastify.addHook('onSend', async (req, reply, payload) => {
    reply.header('x-request-id', req.id);
    return payload;
  });

  await fastify.register(authRouter, { prefix: '/api/v1/auth' });
  await fastify.register(workspaceRouter, { prefix: '/api/v1/workspaces' });
};

export default app;
