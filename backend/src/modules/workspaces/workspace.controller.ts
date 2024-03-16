import { FastifyReply, FastifyRequest } from 'fastify';
import { WorkspaceCreation } from './workspace.schema';
import { WORKSPACE_LOGO_BUCKET } from '../../utils/constants';
import { logger } from '../../lib/logger';
import { prisma } from '../../plugins/prismaPlugin';
import { supabase } from '../../plugins/supabasePlugin';

export const createWorkspace = async (request: FastifyRequest<{ Body: WorkspaceCreation }>, reply: FastifyReply) => {
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
      include: {
        owner: true,
      },
    });

    await tr.membersOnWorkspaces.create({
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

export const getWorkspaces = async (request: FastifyRequest) => {
  const { user } = request;

  const workspaces = await prisma.workspace.findMany({
    where: {
      members: {
        some: {
          memberId: user.id,
        },
      },
    },
    include: {
      owner: true,
    },
  });

  return workspaces;
};

export const getWorkspaceById = async (request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
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

export const getPendingWorkspaces = async (request: FastifyRequest) => {
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

export const deleteWorkspace = async (request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
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

export const confirmInvitation = async (
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

  return reply.code(204).send();
};

export const updateWorkspaceLogo = async (request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
  const {
    user,
    params: { id },
  } = request;

  const workspace = await prisma.workspace.findUnique({
    where: { id, ownerId: user.id },
  });

  if (!workspace) {
    return reply.sendError(404, 'Workspace not found');
  }

  const file = await request.file({ limits: { fileSize: 1_000_000 } });

  if (!file) {
    return reply.sendError(500, 'Error during image upload');
  }

  if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
    return reply.sendError(500, 'Invalid file extension.');
  }

  const fileBuffer = await file.toBuffer();
  const { data, error } = await supabase.storage
    .from(WORKSPACE_LOGO_BUCKET)
    .upload(crypto.randomUUID(), fileBuffer, { contentType: file.mimetype });

  if (error) {
    logger.error(error, 'Error during image upload');
    return reply.sendError(500, 'Error during image upload.');
  }

  const { publicUrl: logoUrl } = supabase.storage.from(WORKSPACE_LOGO_BUCKET).getPublicUrl(data.path).data;

  await prisma.workspace.update({
    where: { id },
    data: { logoUrl },
  });

  const oldLogoUrl = workspace?.logoUrl;
  if (oldLogoUrl) {
    const oldFileName = oldLogoUrl.split('/').at(-1)!;
    await supabase.storage.from(WORKSPACE_LOGO_BUCKET).remove([oldFileName]);
  }

  return { logoUrl };
};

export const inviteUser = async (
  request: FastifyRequest<{ Params: { id: number }; Body: { email: string } }>,
  reply: FastifyReply,
) => {
  const { id } = request.params;
  const { email } = request.body;
  const { user } = request;

  if (email === user.email) {
    return reply.sendError(409, `You can't invite yourself`);
  }

  const member = await prisma.user.findUnique({
    where: { email },
  });

  if (!member) {
    return reply.sendError(404, 'Member not found');
  }

  const workspace = await prisma.workspace.findUnique({
    where: {
      id,
      ownerId: user.id,
      members: {
        none: {
          memberId: member.id,
        },
      },
    },
  });

  if (!workspace) {
    return reply.sendError(404, 'Workspace not found');
  }

  await prisma.membersOnWorkspaces.create({
    data: {
      workspaceId: workspace.id,
      memberId: member.id,
    },
  });

  return reply.status(204).send();
};
