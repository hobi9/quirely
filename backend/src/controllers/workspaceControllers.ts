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

  const getWorkspaces = async (request: FastifyRequest) => {
    const { user } = request;

    const workspaces = await prisma.workspace.findMany({
      where: {
        members: {
          some: {
            id: user.id,
          },
        },
      },
    });

    return workspaces;
  };

  const getWorkspaceById = async (request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
    const { user, params } = request;

    const workspace = await prisma.workspace.findUnique({
      where: {
        id: params.id,
        members: {
          some: {
            id: user.id,
          },
        },
      },
    });

    if (!workspace) {
      reply.code(404);
      return { error: 'Workspace not found.' };
    }

    return workspace;
  };

  return {
    createWorkspace,
    getWorkspaces,
    getWorkspaceById,
  };
};

export default workspaceControllers;
