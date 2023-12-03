import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { UserLoginData, UserRegistrationData } from '../schemas/authSchema';
import crypto from 'crypto';
import { TOKEN_COOKIE_NAME } from '../utils/constants';

const authControllers = (fastify: FastifyInstance) => {
  const {
    prisma,
    bcrypt,
    sendMail,
    config: { CLIENT_BASE_URL },
  } = fastify;

  const registerUser = async (request: FastifyRequest<{ Body: UserRegistrationData }>, reply: FastifyReply) => {
    const { email, fullName, password } = request.body;

    const passwordHash = await bcrypt.hash(password, await bcrypt.genSalt());

    const userInDb = await prisma.user.findUnique({
      where: { email },
    });

    if (userInDb) {
      reply.code(409);
      return { error: 'User with the given email already exists.' };
    }

    const createdUser = await prisma.user.create({
      data: {
        fullName: fullName.trim(),
        password: passwordHash,
        email,
        updatedAt: null,
      },
    });

    const confirmationToken = crypto.randomBytes(32).toString('hex');

    await prisma.token.create({
      data: { userId: createdUser.id, confirmationToken },
    });

    new Promise(
      (resolve) =>
        setTimeout(async () => {
          await prisma.token.update({
            where: { userId: createdUser.id },
            data: { confirmationToken: null },
          });
          resolve(null);
        }, 600000), // 5 minutes
    );

    const message = `Verify your email at ${CLIENT_BASE_URL}/${createdUser.id}/${confirmationToken}`;

    await sendMail({
      email,
      subject: 'Quirely - Verify email',
      message,
    });

    reply.code(201).send();
  };

  const verifyEmail = async (
    request: FastifyRequest<{ Params: { id: number; token: string } }>,
    reply: FastifyReply,
  ) => {
    const { id, token } = request.params;

    const userTokens = await prisma.token.findUnique({
      where: { userId: id },
    });

    if (!userTokens || token !== userTokens.confirmationToken) {
      reply.code(400);
      return { error: 'Invalid link' };
    }

    await prisma.user.update({
      where: { id },
      data: { isVerified: true, token: { update: { data: { confirmationToken: null } } } },
    });

    reply.code(200).send();
  };

  const login = async (request: FastifyRequest<{ Body: UserLoginData }>, reply: FastifyReply) => {
    const { email, password } = request.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // instead of returning early we compare with a random string in order to prevent timing attacks
      const randomString = crypto.randomBytes(24).toString('hex');
      await bcrypt.compare(password, randomString);

      reply.code(401);
      return { error: 'Invalid email or password.' };
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      reply.code(401);
      return { error: 'Invalid email or password.' };
    }

    await fastify.refreshTokens(user.id, reply);

    return reply.code(200);
  };

  const signout = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.user;

    await prisma.token.update({
      where: {
        userId: id,
      },
      data: {
        accessToken: null,
        refreshToken: null,
      },
    });

    reply.clearCookie(TOKEN_COOKIE_NAME, { path: '/api' });

    return reply.code(204).send();
  };

  const me = async (request: FastifyRequest) => {
    return request.user;
  };

  const csrfRefresh = async (_request: FastifyRequest, reply: FastifyReply) => {
    const csrfToken = reply.generateCsrf();
    return { csrfToken };
  };

  return {
    registerUser,
    login,
    signout,
    csrfRefresh,
    me,
    verifyEmail,
  };
};

export default authControllers;
