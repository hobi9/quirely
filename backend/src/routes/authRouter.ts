import {
  UserLoginData,
  UserLoginSchema,
  UserRegistrationData,
  UserRegistrationSchema,
  UserSchema,
} from '../schemas/authSchema';
import authControllers from '../controllers/authControllers';
import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import { Type } from '@sinclair/typebox';

declare module 'fastify' {
  interface FastifyInstance {
    bcrypt: typeof bcrypt;
  }
}

const authRouter = async (fastify: FastifyInstance) => {
  const { isAuthenticated, csrfProtection } = fastify;
  fastify.decorate('bcrypt', bcrypt);

  const controllers = authControllers(fastify);

  fastify.post<{ Body: UserRegistrationData }>(
    '/register',
    {
      schema: {
        tags: ['Auth'],
        body: UserRegistrationSchema,
        response: {
          201: Type.Null(),
        },
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
          200: UserSchema,
        },
      },
    },
    controllers.login,
  );

  fastify.post<{ Body: UserLoginData }>(
    '/signout',
    {
      onRequest: [isAuthenticated, csrfProtection],
      schema: {
        tags: ['Auth'],
      },
    },
    controllers.signout,
  );

  fastify.get(
    '/csrf-refresh',
    {
      onRequest: isAuthenticated,
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
