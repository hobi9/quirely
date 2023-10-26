import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { UserRegistrationData } from '../schemas/authSchema';

const authControllers = (fastify: FastifyInstance) => {
  const { prisma, bcrypt } = fastify;

  const registerUser = async (
    request: FastifyRequest<{ Body: UserRegistrationData }>,
    reply: FastifyReply,
  ) => {
    const { email, username, password } = request.body;

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

    if (usersInDb.length) {
      reply.code(409);
      return { error: 'Email or username already taken' };
    }

    const passwordHash = await bcrypt.hash(password, await bcrypt.genSalt());

    const user = await prisma.user.create({
      data: {
        username,
        password: passwordHash,
        email,
      },
    });

    reply.code(201);
    return user;
  };

  return {
    registerUser,
  };
};

export default authControllers;
