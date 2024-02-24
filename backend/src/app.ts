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
import userRouter from './routes/userRouter';
import Mailer from './plugins/mailer';
import MiscDecorators from './plugins/decorators';
import Supabase from './plugins/supabase';
import Multipart from '@fastify/multipart';
import Session from '@fastify/session';
import Redis from 'ioredis';
import RedisStore from 'connect-redis';

declare module 'fastify' {
  interface Session {
    userId?: number;
  }
}

const app = async (fastify: FastifyInstance) => {
  await fastify.register(Config);

  const { CLIENT_BASE_URL, COOKIE_SECRET, ENV, SESSION_SECRET, REDIS_URL } = fastify.config;

  if (ENV !== 'production') {
    await fastify.register(Swagger);
    await fastify.register(SwaggerUi);
  }

  await fastify.register(MiscDecorators);

  await fastify.register(Cors, {
    origin: CLIENT_BASE_URL,
    credentials: true,
  });

  await fastify.register(Cookie, {
    secret: COOKIE_SECRET,
  });

  await fastify.register(Session, {
    secret: SESSION_SECRET,
    cookieName: 'x-session-id',
    saveUninitialized: false,
    cookie: {
      secure: ENV === 'production',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'strict',
    },
    store: new RedisStore({
      client: new Redis(REDIS_URL, { enableAutoPipelining: true, keyPrefix: 'quirely:' }),
      prefix: 'session:',
      ttl: 60 * 60 * 24 * 365,
    }),
  });

  await fastify.register(Csrf, {
    sessionPlugin: '@fastify/cookie',
    cookieOpts: {
      signed: true,
      path: '/',
      sameSite: 'strict',
      secure: true,
      httpOnly: true,
    },
  }); //TODO: fix before deploing

  await fastify.register(Prisma);
  await fastify.register(Mailer);
  await fastify.register(Auth);
  await fastify.register(Supabase);
  await fastify.register(Multipart);

  fastify.addHook('onSend', async (req, reply, payload) => {
    reply.header('x-request-id', req.id);
    return payload;
  });

  await fastify.register(authRouter, { prefix: '/api/v1/auth' });
  await fastify.register(workspaceRouter, { prefix: '/api/v1/workspaces' });
  await fastify.register(userRouter, { prefix: '/api/v1/users' });
};

export default app;
