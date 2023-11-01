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

declare module 'fastify' {
  interface FastifyInstance {
    bcrypt: typeof bcrypt;
  }
}

const authRouter = async (fastify: FastifyInstance) => {
  await fastify.register(Cookie, {
    secret: fastify.config.COOKIE_SECRET,
  });

  await fastify.register(Csrf);

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
      onRequest: fastify.isAuthenticated,
      schema: {
        tags: ['Auth'],
      },
    },
    controllers.signout,
  );
};

export default authRouter;
