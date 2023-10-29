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

interface JwtError extends Error {
  code: string;
  message: string;
  data: { id: number };
}

declare module 'fastify' {
  interface FastifyInstance {
    isAuthenticated: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
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
      where: {
        id,
      },
      include: {
        token: true,
      },
    });
  };

  const refreshTokens = async (id: number, reply: FastifyReply) => {
    const accessToken = jwt.sign({ id }, { expiresIn: '1s' });
    const refreshToken = jwt.sign({ id }, { expiresIn: '7d' });
    await prisma.token.upsert({
      where: {
        userId: id,
      },
      update: {
        accessToken,
        refreshToken,
      },
      create: {
        userId: id,
        accessToken,
        refreshToken,
      },
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
        return reply.code(401).send({ error: 'Invalid token.' });
      }

      request.user = user;
    } catch (err) {
      const error = err as JwtError;
      if (error.code !== 'FST_JWT_AUTHORIZATION_TOKEN_EXPIRED') {
        return reply.code(401).send({ error: 'Invalid token.' });
      }

      // acces token is expired we validate the refresh token
      const { id } = await request.jwtDecode<{ id: number }>();
      const user = await findUserById(id);
      if (!user || !user.token?.accessToken) {
        return reply.code(401).send({ error: 'Invalid token.' });
      }

      const refreshToken = user.token.refreshToken;
      if (!refreshToken) {
        return reply.code(401).send({ error: 'Invalid token.' });
      }

      try {
        jwt.verify(refreshToken);
      } catch (error) {
        return reply.code(401).send({ error: 'Invalid token.' });
      }

      // refresh token is valid, we create a new pair
      await refreshTokens(id, reply);

      request.user = user;
    }
  };

  fastify.decorate('isAuthenticated', isAuthenticated);
});

export default jwtConfig;
