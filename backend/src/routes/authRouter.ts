import Cookie from '@fastify/cookie';
import Csrf from '@fastify/csrf-protection';
import {
  UserRegistrationData,
  UserRegistrationSchema,
  UserResponseSchema,
} from '../schemas/authSchema';
import authControllers from '../controllers/authControllers';
import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';

declare module 'fastify' {
  interface FastifyInstance {
    bcrypt: typeof bcrypt;
  }
}

const authRouter = async (fastify: FastifyInstance) => {
  fastify.register(Cookie, {
    secret: 'test',
  });

  fastify.register(Csrf);
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
};

export default authRouter;
