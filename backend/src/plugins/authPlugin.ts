import type { FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import type { SelectUser } from '../db/schema';
import { findUserById } from '../modules/users/user.service';

declare module 'fastify' {
  interface FastifyInstance {
    isAuthenticated: (request: FastifyRequest, reply: FastifyReply) => Promise<FastifyReply | undefined>;
    isEmailVerified: (request: FastifyRequest, reply: FastifyReply) => Promise<FastifyReply | undefined>;
  }

  interface FastifyRequest {
    user: SelectUser;
  }
}

const authPlugin = fp(async (fastify) => {
  const isAuthenticated = async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.session.userId) {
      return reply.sendError(401, 'SessionId not present');
    }

    const { userId } = request.session;

    const user = await findUserById(userId);

    if (!user) {
      return reply.sendError(401, 'User not found');
    }

    request.user = user;
  };

  const isEmailVerified = async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user;

    if (!user.isVerified) {
      return reply.sendError(403, 'Unauthorized, email not verified');
    }
  };

  fastify.decorateRequest('user');
  fastify.decorate('isAuthenticated', isAuthenticated);
  fastify.decorate('isEmailVerified', isEmailVerified);
});

export default authPlugin;
