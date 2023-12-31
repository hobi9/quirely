import {
  SanitizedUserSchema,
  UserLoginData,
  UserLoginSchema,
  UserRegistrationData,
  UserRegistrationSchema,
} from '../schemas/authSchema';
import authControllers from '../controllers/authControllers';
import { FastifyInstance } from 'fastify';

import { Type } from '@sinclair/typebox';

const authRouter = async (fastify: FastifyInstance) => {
  const { isAuthenticated, csrfProtection } = fastify;

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

  fastify.get<{ Params: { id: number; token: string } }>(
    '/verify/:id/:token',
    {
      schema: {
        tags: ['Auth'],
        params: Type.Object({
          id: Type.Number(),
          token: Type.String(),
        }),
        response: {
          200: Type.Null(),
        },
      },
    },
    controllers.verifyEmail,
  );

  fastify.post<{ Body: UserLoginData }>(
    '/login',
    {
      schema: {
        tags: ['Auth'],
        body: UserLoginSchema,
        response: {
          200: Type.Null(),
        },
      },
    },
    controllers.login,
  );

  fastify.post(
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

  fastify.get(
    '/me',
    {
      schema: {
        tags: ['Auth'],
        response: {
          200: Type.Union([SanitizedUserSchema, Type.Null()]),
        },
      },
    },
    controllers.me,
  );

  //TODO: understand how to display the file in swagger documentation
  fastify.put(
    '/avatar',
    {
      onRequest: [isAuthenticated, csrfProtection],
      schema: {
        tags: ['Auth'],
        consumes: ['multipart/form-data'],
        response: {
          200: Type.Pick(SanitizedUserSchema, ['avatarUrl']),
        },
      },
    },
    controllers.uploadAvatar,
  );
};

export default authRouter;
