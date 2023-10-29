import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import Jwt from '@fastify/jwt';
import type { Prisma } from '@prisma/client';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { id: number };
    user: Prisma.UserGetPayload<{ include: { token: true } }>;
  }
}

const jwtConfig: FastifyPluginAsync = fp(async (fastify) => {
  fastify.register(Jwt, { secret: fastify.config.JWT_SECRET });
});

export default jwtConfig;
