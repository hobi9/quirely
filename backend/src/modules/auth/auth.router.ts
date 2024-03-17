import type { FastifyInstance } from 'fastify';
import z from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';
import * as controller from './auth.controller';
import {
  SanitizedUserSchema,
  type UserLogin,
  UserLoginSchema,
  type UserRegistration,
  UserRegistrationSchema,
} from './auth.schema';

const authRouter = async (fastify: FastifyInstance) => {
  const { isAuthenticated, csrfProtection } = fastify;

  fastify.post<{ Body: UserRegistration }>(
    '/register',
    {
      schema: {
        tags: ['Auth'],
        body: zodToJsonSchema(UserRegistrationSchema),
        response: {
          201: zodToJsonSchema(z.null()),
        },
      },
    },
    controller.registerUser,
  );

  fastify.post<{ Params: { token: string } }>(
    '/verify/:token',
    {
      schema: {
        tags: ['Auth'],
        params: zodToJsonSchema(
          z.object({
            token: z.string(),
          }),
        ),
        response: {
          204: zodToJsonSchema(z.null()),
        },
      },
    },
    controller.verifyEmail,
  );

  fastify.post<{ Body: UserLogin }>(
    '/login',
    {
      schema: {
        tags: ['Auth'],
        body: zodToJsonSchema(UserLoginSchema),
        response: {
          204: zodToJsonSchema(z.null()),
        },
      },
    },
    controller.login,
  );

  fastify.post(
    '/signout',
    {
      onRequest: [isAuthenticated, csrfProtection],
      schema: {
        tags: ['Auth'],
        response: {
          204: zodToJsonSchema(z.null()),
        },
      },
    },
    controller.signout,
  );

  fastify.get(
    '/csrf-refresh',
    {
      onRequest: isAuthenticated,
      schema: {
        tags: ['Auth'],
        response: {
          200: zodToJsonSchema(
            z.object({
              csrfToken: z.string(),
            }),
          ),
        },
      },
    },
    controller.csrfRefresh,
  );

  fastify.get(
    '/me',
    {
      schema: {
        tags: ['Auth'],
        response: {
          200: zodToJsonSchema(SanitizedUserSchema),
          204: zodToJsonSchema(z.null()),
        },
      },
    },
    controller.getMe,
  );
};

export default authRouter;
