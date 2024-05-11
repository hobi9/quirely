import crypto from 'node:crypto';
import Cookie from '@fastify/cookie';
import Cors from '@fastify/cors';
import Csrf from '@fastify/csrf-protection';
import Multipart from '@fastify/multipart';
import Session from '@fastify/session';
import Swagger from '@fastify/swagger';
import SwaggerUi from '@fastify/swagger-ui';
import RedisStore from 'connect-redis';
import type { FastifyInstance } from 'fastify';
import Redis from 'ioredis';
import { logger } from './lib/logger';
import authRouter from './modules/auth/auth.router';
import userRouter from './modules/users/user.router';
import workspaceRouter from './modules/workspaces/workspace.router';
import authPlugin from './plugins/authPlugin';
import decoratorsPlugin from './plugins/decoratorsPlugin';
import { type RequestContext, executionContext } from './utils/executionContext';

declare module 'fastify' {
  interface Session {
    userId?: number;
  }
}

const app = async (fastify: FastifyInstance) => {
  const { CLIENT_BASE_URL, COOKIE_SECRET, ENV, SESSION_SECRET, REDIS_URL } = process.env;

  if (ENV !== 'production') {
    await fastify.register(Swagger);
    await fastify.register(SwaggerUi);
  }

  await fastify.register(decoratorsPlugin);

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
      maxAge: 1000 * 60 * 60 * 24 * 30,
      sameSite: 'strict',
    },
    store: new RedisStore({
      client: new Redis(REDIS_URL, { enableAutoPipelining: true, keyPrefix: 'quirely:' }),
      prefix: 'session:',
      ttl: 60 * 60 * 24 * 30,
    }),
    idGenerator: (request) => {
      const userId = request?.session.userId || 0;
      const randomId = crypto.randomUUID();
      return `${userId}:${randomId}`;
    },
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

  await fastify.register(authPlugin);
  await fastify.register(Multipart);

  fastify.addHook('onRequest', (request, reply, done) => {
    reply.header('requestId', request.id);
    const requestContext: RequestContext = { requestId: request.id, sessionId: request.session.sessionId };
    executionContext.run(requestContext, done);
  });

  fastify.addHook('preHandler', async (request) => {
    const { method, url, body } = request;
    logger.info({ method, url, body }, 'API REQUEST');
  });

  fastify.addHook('onSend', async (request, reply, payload) => {
    const { method, url } = request;
    const { statusCode } = reply;
    logger.info({ method, url, body: payload, statusCode }, 'API RESPONSE');

    return payload;
  });

  await fastify.register(authRouter, { prefix: '/api/v1/auth' });
  await fastify.register(workspaceRouter, { prefix: '/api/v1/workspaces' });
  await fastify.register(userRouter, { prefix: '/api/v1/users' });
};

export default app;
