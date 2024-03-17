import type { FastifyInstance } from 'fastify';
import { SanitizedUserSchema } from '../auth/auth.schema';
import * as controller from './user.controller';

import z from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';
import { type QueryUser, QueryUserSchema } from './user.schema';

const userRouter = async (fastify: FastifyInstance) => {
  const { isAuthenticated, isEmailVerified, csrfProtection } = fastify;

  //TODO: understand how to display the file in swagger documentation
  fastify.patch(
    '/avatar',
    {
      onRequest: [isAuthenticated, isEmailVerified, csrfProtection],
      schema: {
        tags: ['User'],
        consumes: ['multipart/form-data'],
        response: {
          200: zodToJsonSchema(SanitizedUserSchema.pick({ avatarUrl: true })),
        },
      },
    },
    controller.uploadAvatar,
  );

  fastify.get<{ Querystring: QueryUser }>(
    '/',
    {
      onRequest: isAuthenticated,
      schema: {
        tags: ['User'],
        querystring: zodToJsonSchema(QueryUserSchema),
        response: {
          200: zodToJsonSchema(z.array(SanitizedUserSchema)),
        },
      },
    },
    controller.queryUsers,
  );
};

export default userRouter;
