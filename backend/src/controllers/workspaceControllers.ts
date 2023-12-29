import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { WorkspaceCreationData } from '../schemas/workspaceSchema';

const workspaceControllers = (fastify: FastifyInstance) => {
  const { prisma } = fastify;

  const createWorkspace = async (request: FastifyRequest<{ Body: WorkspaceCreationData }>, reply: FastifyReply) => {
    const { user } = request;
    const { name, description } = request.body;

    const createdWorkspace = await prisma.$transaction(async (tr) => {
      const workspace = await tr.workspace.create({
        data: {
          name: name.trim(),
          description,
          ownerId: user.id,
          updatedAt: null,
        },
      });

      tr.membersOnWorkspaces.create({
        data: {
          memberId: user.id,
          workspaceId: workspace.id,
          accepted: true,
        },
      });

      return workspace;
    });

    return reply.code(201).send(createdWorkspace);
  };

  const getWorkspaces = async (request: FastifyRequest) => {
    const { user } = request;

    const workspaces = await prisma.workspace.findMany({
      where: {
        members: {
          some: {
            memberId: user.id,
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
            accepted: true,
          },
        },
      },
      include: {
        members: {
          include: {
            member: true,
          },
        },
        owner: true,
      },
    });

    if (!workspace) {
      return reply.sendValidationError(404, { message: 'Workspace not found.' });
    }

    const members = workspace.members
      .filter(({ accepted }) => accepted || workspace.ownerId === user.id)
      .map(({ member, accepted }) => ({ ...member, accepted }));

    return { ...workspace, members };
  };

  const deleteWorkspace = async (request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
    const { user, params } = request;

    const workspace = await prisma.workspace.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!workspace) {
      return reply.sendError(404, 'Workspace not found.');
    }

    if (user.id !== workspace.ownerId) {
      return reply.sendError(409, 'You are not the owner of the workspace.');
    }

    await prisma.workspace.delete({
      where: {
        id: params.id,
      },
    });

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
      return reply.sendError(404, 'Workspace not found.');
    }

    if (memberWorkspace.accepted !== null) {
      return reply.sendError(409, 'You have already confirmed this workspace.');
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
      include: {
        owner: true,
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
