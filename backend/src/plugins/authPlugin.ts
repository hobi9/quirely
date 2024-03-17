import fp from 'fastify-plugin';
import { FastifyReply, FastifyRequest } from 'fastify';
import { findUserById } from '../modules/users/user.service';
import { SelectUser } from '../db/schema';

declare module 'fastify' {
  interface FastifyInstance {
    isAuthenticated: (request: FastifyRequest, reply: FastifyReply) => Promise<FastifyReply | void>;
    isEmailVerified: (request: FastifyRequest, reply: FastifyReply) => Promise<FastifyReply | void>;
  }

  interface FastifyRequest {
    user: SelectUser;
  }
}

const authPlugin = fp(async (fastify) => {
  fastify.decorateRequest('user');

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

  fastify.decorate('isAuthenticated', isAuthenticated);

  const isEmailVerified = async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user;

    if (!user.isVerified) {
      return reply.sendError(403, 'Unauthorized, email not verified');
    }
  };

  fastify.decorate('isEmailVerified', isEmailVerified);
});

export default authPlugin;
