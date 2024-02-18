import fp from 'fastify-plugin';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '../utils/constants';
import { User, Prisma } from '@prisma/client';

declare module 'fastify' {
  interface FastifyInstance {
    isAuthenticated: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    isEmailVerified: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    refreshTokens: (id: number, ip: string, reply: FastifyReply) => Promise<void>;
  }

  interface FastifyRequest {
    user: User;
  }
}

const authPlugin = fp(async (fastify) => {
  const { prisma, config, createToken, verifyToken } = fastify;

  const refreshTokens = async (userId: number, ip: string, reply: FastifyReply) => {
    const accessToken = createToken({
      payload: { id: userId },
      secret: config.JWT_AUTH_SECRET,
      duration: '15m',
    });
    const refreshToken = createToken({
      payload: { id: userId },
      secret: config.JWT_AUTH_SECRET,
      duration: '7d',
    });

    try {
      await prisma.refreshToken.create({
        data: {
          userId,
          token: refreshToken,
          ip,
          updatedAt: null,
        },
      });
    } catch (err) {
      /*
        the following is added because in development mode the initial useEffect runs twice so the tokens generated
        by the two executions are identical, so in order to prevent a non necessary 401, the error is caught.
      */
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        reply.log.error(err, 'Error during refreshTokens');
      } else {
        throw err;
      }
    }

    reply.setCookie(ACCESS_TOKEN_COOKIE, accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      signed: true,
      path: '/',
    });

    reply.setCookie(REFRESH_TOKEN_COOKIE, refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      signed: true,
      path: '/',
    });
  };

  fastify.decorate('refreshTokens', refreshTokens);

  fastify.decorateRequest('user');

  const isAuthenticated = async (request: FastifyRequest, reply: FastifyReply) => {
    const accessTokenCookie = request.cookies[ACCESS_TOKEN_COOKIE];

    if (!accessTokenCookie) {
      return reply.sendError(401, 'Access token not present');
    }

    const verifiedAccessTokenCookie = request.unsignCookie(accessTokenCookie);

    if (!verifiedAccessTokenCookie.valid) {
      return reply.sendError(401, 'Invalid cookie signature');
    }

    try {
      const { id } = verifyToken<{ id: number }>({
        token: verifiedAccessTokenCookie.value!,
        secret: config.JWT_AUTH_SECRET,
      });

      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        return reply.sendError(401, 'Unauthorized, user not found.');
      }

      request.user = user;
    } catch (err) {
      request.log.error(err, 'Error during isAuthenticated');
      return reply.sendError(401, 'Unauthorized, user not found.');
    }
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
