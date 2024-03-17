import { FastifyReply, FastifyRequest } from 'fastify';
import { WorkspaceCreation } from './workspace.schema';
import { WORKSPACE_LOGO_BUCKET } from '../../utils/constants';
import { logger } from '../../lib/logger';
import {
  deleteWorkspaceById,
  findWorkspaceById,
  getWorkspaceDetail,
  getWorkspacesByMemberId,
  insertWorkspace,
  inviteToWorkspace,
  updateWorkspaceLogo,
} from './workspace.service';
import { uploadFile } from '../../lib/supabase';
import { findUserByEmail } from '../users/user.service';

export const createWorkspace = async (request: FastifyRequest<{ Body: WorkspaceCreation }>, reply: FastifyReply) => {
  const { id } = request.user;
  const { name, description } = request.body;

  const workspace = await insertWorkspace({ name, description }, id);

  return reply.code(201).send(workspace);
};

export const getWorkspaces = async (request: FastifyRequest) => {
  const { id } = request.user;

  const workspaces = await getWorkspacesByMemberId(id, true);

  return workspaces;
};

export const getWorkspaceById = async (request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
  const { user, params } = request;

  const workspace = await getWorkspaceDetail({ workspaceId: params.id, userId: user.id });

  if (!workspace) {
    return reply.sendValidationError(404, { message: 'Workspace not found.' });
  }

  return workspace;
};

export const getPendingWorkspaces = async (request: FastifyRequest) => {
  const { id } = request.user;

  const workspaces = await getWorkspacesByMemberId(id);

  return workspaces;
};

export const deleteWorkspace = async (request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
  const { user, params } = request;

  const workspace = await findWorkspaceById(params.id);

  if (!workspace) {
    return reply.sendError(404, 'Workspace not found.');
  }

  if (user.id !== workspace.ownerId) {
    return reply.sendError(409, 'You are not the owner of the workspace.');
  }

  await deleteWorkspaceById(params.id);

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

export const updateLogo = async (request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
  const {
    user,
    params: { id },
  } = request;

  const workspace = await findWorkspaceById(id);

  if (!workspace) {
    return reply.sendError(404, 'Workspace not found.');
  }

  if (workspace.ownerId !== user.id) {
    return reply.sendError(409, 'You are not the owner of the workspace.');
  }

  const file = await request.file({ limits: { fileSize: 1_000_000 } });

  if (!file) {
    return reply.sendError(400, 'Invalid file.');
  }

  if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
    return reply.sendError(400, 'Invalid file extension.');
  }

  try {
    const fileBuffer = await file.toBuffer();

    const logoUrl = await uploadFile({
      bucket: WORKSPACE_LOGO_BUCKET,
      mimeType: file.mimetype,
      oldFileUrl: workspace.logoUrl,
      fileBuffer,
      updateCallback: (url) => updateWorkspaceLogo(url, workspace.id),
    });

    return { logoUrl };
  } catch (error) {
    logger.error({ error }, 'Error during logo upload');
    return reply.sendError(500, 'Error during logo upload.');
  }
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

  const member = await findUserByEmail(email);

  if (!member) {
    return reply.sendError(404, 'User not found');
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

  await inviteToWorkspace({
    workspaceId: id,
    userId: user.id,
  });

  return reply.status(204).send();
};
