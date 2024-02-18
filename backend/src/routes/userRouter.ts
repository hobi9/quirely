import { SanitizedUserSchema } from '../schemas/authSchema';
import userControllers from '../controllers/userControllers';
import { FastifyInstance } from 'fastify';

import { Type } from '@sinclair/typebox';
import { QueryUser, QueryUserSchema } from '../schemas/userSchema';

const userRouter = async (fastify: FastifyInstance) => {
  const { isAuthenticated, isEmailVerified, csrfProtection } = fastify;

  const controllers = userControllers(fastify);

  //TODO: understand how to display the file in swagger documentation
  fastify.patch(
    '/avatar',
    {
      onRequest: [isAuthenticated, isEmailVerified, csrfProtection],
      schema: {
        tags: ['User'],
        consumes: ['multipart/form-data'],
        response: {
          200: Type.Pick(SanitizedUserSchema, ['avatarUrl']),
        },
      },
    },
    controllers.uploadAvatar,
  );

  fastify.get<{ Querystring: QueryUser }>(
    '/',
    {
      onRequest: isAuthenticated,
      schema: {
        tags: ['User'],
        querystring: QueryUserSchema,
        response: {
          200: Type.Array(SanitizedUserSchema),
        },
      },
    },
    controllers.queryUsers,
  );
};

export default userRouter;
