import Cookie from '@fastify/cookie';
import Csrf from '@fastify/csrf-protection';
import {
  UserLoginData,
  UserLoginSchema,
  UserRegistrationData,
  UserRegistrationSchema,
  UserResponseSchema,
} from '../schemas/authSchema';
import authControllers from '../controllers/authControllers';
import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import Auth from '../plugins/authPlugin';
import { Type } from '@sinclair/typebox';

declare module 'fastify' {
  interface FastifyInstance {
    bcrypt: typeof bcrypt;
  }
}

const authRouter = async (fastify: FastifyInstance) => {
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

  await fastify.register(Auth);

  fastify.decorate('bcrypt', bcrypt);

  const controllers = authControllers(fastify);

  fastify.post<{ Body: UserRegistrationData }>(
    '/register',
    {
      schema: {
        tags: ['Auth'],
        body: UserRegistrationSchema,
      },
    },
    controllers.registerUser,
  );

  fastify.post<{ Body: UserLoginData }>(
    '/login',
    {
      schema: {
        tags: ['Auth'],
        body: UserLoginSchema,
        response: {
          200: UserResponseSchema,
        },
      },
    },
    controllers.login,
  );

  fastify.post<{ Body: UserLoginData }>(
    '/signout',
    {
      onRequest: [fastify.isAuthenticated, fastify.csrfProtection],
      schema: {
        tags: ['Auth'],
      },
    },
    controllers.signout,
  );

  fastify.get(
    '/csrf-refresh',
    {
      schema: {
        tags: ['Auth'],
        response: {
          200: Type.Object({
            csrfToken: Type.String(),
          }),
        },
      },
    },
    controllers.csrfRefresh,
  );
};

export default authRouter;
