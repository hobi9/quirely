import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { WorkspaceCreationData } from '../schemas/workspaceSchema';
import { Prisma } from '@prisma/client';

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

    members.push(user);

    const workspace = await prisma.workspace.create({
      data: {
        name: name.trim(),
        description,
        ownerId: user.id,
        members: {
          create: members.map(({ id }) => {
            return { accepted: id === user.id || null, member: { connect: { id } } };
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
            memberId: user.id,
            accepted: true,
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
            memberId: user.id,
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

  const deleteWorkspace = async (request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
    const { user, params } = request;

    try {
      await prisma.workspace.delete({
        where: {
          id: params.id,
          members: {
            some: {
              memberId: user.id,
            },
          },
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        reply.code(404);
        return { error: 'Workspace not found.' };
      }
      throw err;
    }
    return reply.code(204).send();
  };

  const confirmInvitation = async (
    request: FastifyRequest<{ Params: { id: number }; Querystring: { accept: boolean } }>,
    reply: FastifyReply,
  ) => {
    const { user, params, query } = request;

    const memberWorkspace = await prisma.membersOnWorkspaces.findUnique({
      where: {
        memberId_workspaceId: {
          memberId: user.id,
          workspaceId: params.id,
        },
      },
    });

    if (!memberWorkspace) {
      reply.code(404);
      return { error: 'Workspace not found.' };
    }

    if (memberWorkspace.accepted !== null) {
      reply.code(409);
      return { error: 'You have already confirmed this workspace.' };
    }

    await prisma.membersOnWorkspaces.update({
      where: {
        memberId_workspaceId: {
          memberId: user.id,
          workspaceId: params.id,
        },
      },
      data: {
        accepted: query.accept,
      },
    });

    return reply.code(200).send();
  };

  const getPendingWorkspaces = async (request: FastifyRequest) => {
    const { user } = request;

    const workspaces = await prisma.workspace.findMany({
      where: {
        members: {
          some: {
            memberId: user.id,
            accepted: null,
          },
        },
      },
    });

    return workspaces;
  };

  return {
    createWorkspace,
    getWorkspaces,
    getWorkspaceById,
    deleteWorkspace,
    confirmInvitation,
    getPendingWorkspaces,
  };
};

export default workspaceControllers;
