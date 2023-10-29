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
import JwtConfig from '../plugins/jwtConfig';

declare module 'fastify' {
  interface FastifyInstance {
    bcrypt: typeof bcrypt;
  }
}

const authRouter = async (fastify: FastifyInstance) => {
  fastify.register(Cookie, {
    secret: fastify.config.COOKIE_SECRET,
  });

  fastify.register(Csrf);
  fastify.register(JwtConfig);

  fastify.decorate('bcrypt', bcrypt);

  const controllers = authControllers(fastify);

  fastify.post<{ Body: UserRegistrationData }>(
    '/register',
    {
      schema: {
        body: UserRegistrationSchema,
        response: {
          201: UserResponseSchema,
        },
      },
    },
    controllers.registerUser,
  );

  fastify.post<{ Body: UserLoginData }>(
    '/login',
    {
      schema: {
        body: UserLoginSchema,
        response: {
          200: UserResponseSchema,
        },
      },
    },
    controllers.login,
  );
};

export default authRouter;
