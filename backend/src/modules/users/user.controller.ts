import { FastifyReply, FastifyRequest } from 'fastify';
import { AVATAR_BUCKET } from '../../utils/constants';
import { QueryUser } from './user.schema';
import { logger } from '../../lib/logger';
import { findOtherUsersByFilter, updateUserAvatar } from './user.service';
import { uploadFile } from '../../lib/supabase';

export const uploadAvatar = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id, avatarUrl: oldAvatarUrl } = request.user;
  const file = await request.file({ limits: { fileSize: 1_000_000 } });

  if (!file) {
    return reply.sendError(400, 'Invalid file.');
  }

  if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
    return reply.sendError(400, 'Invalid file extension.');
  }

  try {
    const fileBuffer = await file.toBuffer();

    const avatarUrl = await uploadFile({
      bucket: AVATAR_BUCKET,
      mimeType: file.mimetype,
      oldFileUrl: oldAvatarUrl,
      fileBuffer: fileBuffer,
      updateCallback: (newUrl) => updateUserAvatar(newUrl, id),
    });

    return { avatarUrl };
  } catch (error) {
    logger.error({ error }, 'Error during image upload');
    return reply.sendError(500, 'Error during image upload.');
  }
};

export const queryUsers = async (request: FastifyRequest<{ Querystring: QueryUser }>) => {
  const { id } = request.user;

  const users = await findOtherUsersByFilter({ ...request.query, userId: id });

  return users;
};
