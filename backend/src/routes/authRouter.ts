import Cookie from '@fastify/cookie';
import Csrf from '@fastify/csrf-protection';
import { UserRegistrationData, UserRegistrationSchema } from '../schemas/authSchema';
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

  const controllers = authControllers(fastify);

  fastify.decorate('bcrypt', bcrypt);

  fastify.post<{ Body: UserRegistrationData }>(
    '/register',
    {
      schema: {
        body: UserRegistrationSchema,
      },
    },
    controllers.registerUser,
  );
};

export default authRouter;
