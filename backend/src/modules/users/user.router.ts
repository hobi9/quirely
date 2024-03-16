import { SanitizedUserSchema } from '../auth/auth.schema';
import * as controller from './user.controller';
import { FastifyInstance } from 'fastify';

import { QueryUser, QueryUserSchema } from './user.schema';
import zodToJsonSchema from 'zod-to-json-schema';
import z from 'zod';

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
