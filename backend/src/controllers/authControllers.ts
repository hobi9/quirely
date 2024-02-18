import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { UserLoginData, UserRegistrationData } from '../schemas/authSchema';
import crypto from 'crypto';
import { REFRESH_TOKEN_COOKIE, ACCESS_TOKEN_COOKIE } from '../utils/constants';

const authControllers = (fastify: FastifyInstance) => {
  const { prisma } = fastify;

  const registerUser = async (request: FastifyRequest<{ Body: UserRegistrationData }>, reply: FastifyReply) => {
    const { email, fullName, password } = request.body;
    const { sendMail, genSalt, hash, createToken } = fastify;
    const { CLIENT_BASE_URL, JWT_EMAIL_SECRET } = fastify.config;

    const lowercaseEmail = email.toLowerCase();

    const userInDb = await prisma.user.findUnique({
      where: { email: lowercaseEmail },
    });

    if (userInDb) {
      return reply.sendValidationError<UserRegistrationData>(409, {
        message: 'User with the given email already exists.',
        field: 'email',
      });
    }

    const salt = await genSalt(10);
    const passwordHash = await hash(password, salt);

    const createdUser = await prisma.user.create({
      data: {
        fullName: fullName.trim(),
        password: passwordHash,
        email: lowercaseEmail,
        updatedAt: null,
      },
    });

    const confirmationToken = createToken({
      payload: { id: createdUser.id },
      secret: JWT_EMAIL_SECRET,
      duration: 60 * 60 * 24,
    });

    await sendMail({
      email: lowercaseEmail,
      subject: 'Quirely - Verify email',
      message: `<!doctype html>
      <html>
        <body>
          <p>Verify your email <a href="${CLIENT_BASE_URL}/verify-email/${confirmationToken}">here</a></p>
        </body>
      </html>
      `,
    });

    return reply.code(201).send();
  };

  const verifyEmail = async (request: FastifyRequest<{ Params: { token: string } }>, reply: FastifyReply) => {
    try {
      const { token } = request.params;
      const { verifyToken, config } = fastify;
      const { id } = verifyToken<{ id: number }>({ token, secret: config.JWT_EMAIL_SECRET });

      await prisma.user.update({
        where: { id },
        data: { isVerified: true, updatedAt: null },
      });

      return reply.code(204).send();
    } catch (err) {
      fastify.log.error(err, 'Error during verifyEmail');
      return reply.sendError(400, 'Invalid token');
    }
  };

  const login = async (request: FastifyRequest<{ Body: UserLoginData }>, reply: FastifyReply) => {
    const { email, password } = request.body;
    const { compareHash } = fastify;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // instead of returning early we compare with a random string in order to prevent timing attacks
      const randomString = crypto.randomBytes(24).toString('hex');
      await compareHash(password, randomString);
      return reply.sendValidationError<UserLoginData>(400, { message: 'Invalid email or password.', field: 'email' });
    }

    const isValidPassword = await compareHash(password, user.password);

    if (!isValidPassword) {
      return reply.sendValidationError<UserLoginData>(400, { message: 'Invalid email or password.', field: 'email' });
    }

    await fastify.refreshTokens(user.id, request.ip, reply);

    return reply.code(204).send();
  };

  const signout = async (request: FastifyRequest, reply: FastifyReply) => {
    const refreshTokenCookie = request.cookies[REFRESH_TOKEN_COOKIE];

    if (!refreshTokenCookie) {
      return reply.sendError(401, 'Refresh token is not present');
    }

    const verifiedRefreshTokenCookie = request.unsignCookie(refreshTokenCookie);

    if (!verifiedRefreshTokenCookie.valid) {
      return reply.sendError(401, 'Invalid cookie signature');
    }

    await prisma.refreshToken.delete({
      where: {
        token: verifiedRefreshTokenCookie.value!,
      },
    });

    reply.clearCookie(ACCESS_TOKEN_COOKIE, { path: '/' });
    reply.clearCookie(REFRESH_TOKEN_COOKIE, { path: '/' });

    return reply.code(204).send();
  };

  const getMe = async (request: FastifyRequest, reply: FastifyReply) => {
    const { refreshTokens, verifyToken, isTokenExpiredError, config } = fastify;

    const refreshTokenCookie = request.cookies[REFRESH_TOKEN_COOKIE];

    if (!refreshTokenCookie) {
      //return reply.sendError(401, 'Refresh token is not present');
      return null;
    }

    const verifiedRefreshTokenCookie = request.unsignCookie(refreshTokenCookie);

    if (!verifiedRefreshTokenCookie.valid) {
      //return reply.sendError(401, 'Invalid cookie signature');
      return null;
    }

    try {
      const { id } = verifyToken<{ id: number }>({
        token: verifiedRefreshTokenCookie.value!,
        secret: config.JWT_AUTH_SECRET,
      });

      const user = await prisma.user.findUnique({ where: { id } });

      if (!user) {
        // return reply.sendError(401, 'Unauthorized, user not found');
        return null;
      }

      const revokedToken = await prisma.refreshToken.findUnique({
        where: {
          token: verifiedRefreshTokenCookie.value!,
          revoked: true,
        },
      });

      if (revokedToken) {
        // return reply.sendError(401, 'Unauthorized, token is revoked');
        return null;
      }

      await prisma.refreshToken.deleteMany({
        where: {
          token: verifiedRefreshTokenCookie.value!,
        },
      });

      await refreshTokens(user.id, request.ip, reply);

      return user;
    } catch (err) {
      if (isTokenExpiredError(err)) {
        return reply.sendError(401, 'Token is expired');
      }
      request.log.error(err, 'Error during getMe.refresh');
      return reply.code(401).send();
    }
  };

  const csrfRefresh = async (_request: FastifyRequest, reply: FastifyReply) => {
    const csrfToken = reply.generateCsrf();
    return { csrfToken };
  };

  const refreshTokens = async (request: FastifyRequest, reply: FastifyReply) => {
    const { refreshTokens, verifyToken, isTokenExpiredError, config } = fastify;
    const refreshTokenCookie = request.cookies[REFRESH_TOKEN_COOKIE];

    if (!refreshTokenCookie) {
      return reply.sendError(401, 'Refresh token is not present');
    }

    const verifiedRefreshTokenCookie = request.unsignCookie(refreshTokenCookie);

    if (!verifiedRefreshTokenCookie.valid) {
      return reply.sendError(401, 'Invalid cookie signature');
    }

    try {
      const { id } = verifyToken<{ id: number }>({
        token: verifiedRefreshTokenCookie.value!,
        secret: config.JWT_AUTH_SECRET,
      });

      const user = await prisma.user.findUnique({ where: { id } });

      if (!user) {
        return reply.sendError(401, 'Unauthorized, user not found');
      }

      const revokedToken = await prisma.refreshToken.findUnique({
        where: {
          token: verifiedRefreshTokenCookie.value!,
          revoked: true,
        },
      });

      if (revokedToken) {
        return reply.sendError(401, 'Unauthorized, token is revoked');
      }

      await prisma.refreshToken.delete({
        where: {
          token: verifiedRefreshTokenCookie.value!,
        },
      });

      await refreshTokens(user.id, request.ip, reply);

      return reply.code(204).send();
    } catch (err) {
      if (isTokenExpiredError(err)) {
        return reply.sendError(401, 'Token is expired');
      }
      request.log.error(err, 'Error during auth.refresh');
      return reply.code(401).send();
    }
  };

  return {
    registerUser,
    login,
    signout,
    csrfRefresh,
    getMe,
    verifyEmail,
    refresh: refreshTokens,
  };
};

export default authControllers;
