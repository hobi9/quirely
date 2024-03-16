import { FastifyReply, FastifyRequest } from 'fastify';
import crypto from 'crypto';
import { AVATAR_BUCKET } from '../../utils/constants';
import { QueryUser } from './user.schema';
import { logger } from '../../lib/logger';
import { supabase } from '../../plugins/supabasePlugin';
import { prisma } from '../../plugins/prismaPlugin';

export const uploadAvatar = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id, avatarUrl: oldAvatarUrl } = request.user;
  const file = await request.file({ limits: { fileSize: 1_000_000 } });

  if (!file) {
    return reply.sendError(500, 'Error during image upload');
  }

  if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
    return reply.sendError(500, 'Invalid file extension.');
  }

  const fileBuffer = await file.toBuffer();
  const { data, error } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(crypto.randomUUID(), fileBuffer, { contentType: file.mimetype });

  if (error) {
    logger.error(error, 'Error during image upload');
    return reply.sendError(500, 'Error during image upload.');
  }

  const { publicUrl: avatarUrl } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(data.path).data;

  await prisma.user.update({
    where: { id },
    data: { avatarUrl },
  });

  if (oldAvatarUrl) {
    const oldFileName = oldAvatarUrl.split('/').at(-1)!;
    await supabase.storage.from(AVATAR_BUCKET).remove([oldFileName]);
  }

  return { avatarUrl };
};

export const queryUsers = async (request: FastifyRequest<{ Querystring: QueryUser }>) => {
  let { email, workspaceId } = request.query;
  const { id } = request.user;

  email = email ?? '';
  workspaceId = workspaceId ?? 0;

  const users = await prisma.user.findMany({
    where: {
      id: { not: id },
      email: {
        contains: email.toLowerCase(),
      },
      associatedWorkspaces: {
        none: {
          workspaceId: workspaceId,
        },
      },
    },
  });

  return users;
};
