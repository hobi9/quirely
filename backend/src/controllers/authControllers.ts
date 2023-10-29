import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { UserLoginData, UserRegistrationData } from '../schemas/authSchema';
import crypto from 'crypto';

const authControllers = (fastify: FastifyInstance) => {
  const { prisma, bcrypt } = fastify;

  const registerUser = async (request: FastifyRequest<{ Body: UserRegistrationData }>, reply: FastifyReply) => {
    const { email, username, password } = request.body;

    const passwordHash = await bcrypt.hash(password, await bcrypt.genSalt());

    const usersInDb = await prisma.user.findMany({
      where: {
        OR: [
          {
            email,
          },
          {
            username,
          },
        ],
      },
    });

    const userExists = usersInDb.length > 0;

    if (userExists) {
      reply.code(409);
      return { error: 'Email or username already taken.' };
    }

    const user = await prisma.user.create({
      data: {
        username,
        password: passwordHash,
        email,
        updatedAt: null,
      },
    });

    // TODO: don't return the user but just retun the status code.
    // TODO: add email verification.
    reply.code(201);
    return user;
  };

  const login = async (request: FastifyRequest<{ Body: UserLoginData }>, reply: FastifyReply) => {
    const { username, password } = request.body;

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      // instead of returning early we compare with a random string in order to prevent timing attacks
      const randomString = crypto.randomBytes(24).toString('hex');
      await bcrypt.compare(password, randomString);

      reply.code(401);
      return { error: 'Invalid username or password.' };
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      reply.code(401);
      return { error: 'Invalid username or password.' };
    }

    await fastify.refreshTokens(user.id, reply);

    reply.code(200);
    return user;
  };

  return {
    registerUser,
    login,
  };
};

export default authControllers;
