import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { WorkspaceCreationData } from '../schemas/workspaceSchema';

const workspaceControllers = (fastify: FastifyInstance) => {
  const { prisma } = fastify;

  const createWorkspace = async (request: FastifyRequest<{ Body: WorkspaceCreationData }>, reply: FastifyReply) => {
    const { user } = request;
    const { membersMails = [], name, description } = request.body;

    const members = await prisma.user.findMany({
      where: {
        email: {
          in: membersMails,
        },
      },
    });

    if (members.length !== membersMails.length) {
      reply.code(409);
      return { error: 'Members emails mismatch.' };
    }

    members.unshift(user);

    const workspace = await prisma.workspace.create({
      data: {
        name: name.trim(),
        description,
        ownerId: user.id,
        members: {
          connect: members.map(({ id }) => {
            return { id };
          }),
        },
        updatedAt: null,
      },
    });

    // TODO: this api should send email containing an invite to the workspace.
    reply.code(201);
    return workspace;
  };

  return {
    createWorkspace,
  };
};

export default workspaceControllers;
