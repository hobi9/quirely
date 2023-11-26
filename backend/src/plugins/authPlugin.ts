import fp from 'fastify-plugin';
import { FastifyReply, FastifyRequest } from 'fastify';
import Jwt from '@fastify/jwt';
import { TOKEN_COOKIE_NAME } from '../utils/constants';
import { Prisma } from '@prisma/client';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { id: number };
    user: Prisma.UserGetPayload<{ include: { token: true } }>;
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    isAuthenticated: (request: FastifyRequest, reply: FastifyReply) => Promise<undefined>;
    refreshTokens: (id: number, reply: FastifyReply) => Promise<void>;
  }
}

const jwtConfig = fp(async (fastify) => {
  await fastify.register(Jwt, {
    secret: fastify.config.JWT_SECRET,
    cookie: {
      cookieName: TOKEN_COOKIE_NAME,
      signed: true,
    },
  });

  const { prisma, jwt } = fastify;

  const findUserById = async (id: number) => {
    return prisma.user.findUnique({
      where: { id },
      include: { token: true },
    });
  };

  const refreshTokens = async (id: number, reply: FastifyReply) => {
    const accessToken = jwt.sign({ id }, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id }, { expiresIn: '7d' });

    await prisma.token.upsert({
      where: { userId: id },
      update: { accessToken, refreshToken },
      create: { userId: id, accessToken, refreshToken },
    });

    reply.setCookie(TOKEN_COOKIE_NAME, accessToken, {
      httpOnly: true,
      sameSite: true,
      secure: true,
      signed: true,
      path: '/api',
      maxAge: 604800, //one week
    });
  };

  fastify.decorate('refreshTokens', refreshTokens);

  const isAuthenticated = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = await request.jwtVerify<{ id: number }>();

      const user = await findUserById(id);
      if (!user || !user.token?.accessToken) {
        return reply.code(401).send();
      }

      if (!user.isVerified) {
        return reply.code(403).send({ error: 'Email not verified' });
      }

      request.user = user;
    } catch (err) {
      if (typeof err === 'object' && err && 'code' in err && err.code !== 'FST_JWT_AUTHORIZATION_TOKEN_EXPIRED') {
        return reply.code(401).send();
      }

      const { id } = await request.jwtDecode<{ id: number }>();
      const user = await findUserById(id);

      // checking for revoked tokens
      if (!user || !user.token?.accessToken || !user.token.refreshToken) {
        return reply.code(401).send();
      }

      // acces token is expired we validate the refresh token
      const refreshToken = user.token.refreshToken;
      try {
        jwt.verify(refreshToken);
      } catch (error) {
        return reply.code(401).send();
      }

      // refresh token is valid, we create a new pair
      await refreshTokens(id, reply);

      if (!user.isVerified) {
        return reply.code(403).send({ error: 'Email not verified' });
      }

      request.user = user;
    }
  };

  fastify.decorate('isAuthenticated', isAuthenticated);
});

export default jwtConfig;
