import fp from 'fastify-plugin';
import { FastifyReply, FastifyRequest } from 'fastify';
import { User } from '@prisma/client';

declare module 'fastify' {
  interface FastifyInstance {
    isAuthenticated: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    isEmailVerified: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }

  interface FastifyRequest {
    user: User;
  }
}

const authPlugin = fp(async (fastify) => {
  const { prisma } = fastify;

  fastify.decorateRequest('user', Object.create(null));

  const isAuthenticated = async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.session.userId) {
      return reply.sendError(401, 'SessionId not present');
    }

    const { userId } = request.session;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

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
