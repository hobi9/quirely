import {
  EnhancedWorkspaceSchema,
  WorkspaceCreationData,
  WorkspaceCreationSchema,
  WorkspaceSchema,
} from '../schemas/workspaceSchema';
import { FastifyInstance } from 'fastify';
import workspaceControllers from '../controllers/workspaceControllers';
import { Type } from '@sinclair/typebox';

const workspaceRouter = async (fastify: FastifyInstance) => {
  const { isAuthenticated, isEmailVerified, csrfProtection } = fastify;
  const controllers = workspaceControllers(fastify);

  fastify.post<{ Body: WorkspaceCreationData }>(
    '/',
    {
      onRequest: [isAuthenticated, isEmailVerified, csrfProtection],
      schema: {
        tags: ['Workspace'],
        body: WorkspaceCreationSchema,
        response: {
          201: WorkspaceSchema,
        },
      },
    },
    controllers.createWorkspace,
  );

  fastify.get(
    '/',
    {
      onRequest: isAuthenticated,
      schema: {
        tags: ['Workspace'],
        response: {
          200: Type.Array(WorkspaceSchema),
        },
      },
    },
    controllers.getWorkspaces,
  );

  fastify.get(
    '/pending',
    {
      onRequest: isAuthenticated,
      schema: {
        tags: ['Workspace'],
        response: {
          200: Type.Array(WorkspaceSchema),
        },
      },
    },
    controllers.getPendingWorkspaces,
  );

  fastify.get<{ Params: { id: number } }>(
    '/:id',
    {
      onRequest: isAuthenticated,
      schema: {
        tags: ['Workspace'],
        params: Type.Object({ id: Type.Number() }),
        response: {
          200: EnhancedWorkspaceSchema,
        },
      },
    },
    controllers.getWorkspaceById,
  );

  fastify.delete<{ Params: { id: number } }>(
    '/:id',
    {
      onRequest: [isAuthenticated, isEmailVerified, csrfProtection],
      schema: {
        tags: ['Workspace'],
        params: Type.Object({ id: Type.Number() }),
        response: {
          204: Type.Null(),
        },
      },
    },
    controllers.deleteWorkspace,
  );

  fastify.patch<{ Params: { id: number }; Querystring: { accept: boolean } }>(
    '/:id',
    {
      onRequest: [isAuthenticated, isEmailVerified, csrfProtection],
      schema: {
        tags: ['Workspace'],
        params: Type.Object({ id: Type.Number() }),
        querystring: Type.Object({ accept: Type.Boolean() }),
        response: {
          200: Type.Null(),
        },
      },
    },
    controllers.confirmInvitation,
  );

  fastify.patch<{ Params: { id: number } }>(
    '/:id/logo',
    {
      onRequest: [isAuthenticated, isEmailVerified, csrfProtection],
      schema: {
        tags: ['Workspace'],
        params: Type.Object({ id: Type.Number() }),
        consumes: ['multipart/form-data'],
        response: {
          200: Type.Object({ logoUrl: Type.String() }),
        },
      },
    },
    controllers.updateWorkspaceLogo,
  );

  fastify.post<{ Params: { id: number }; Body: { email: string } }>(
    '/:id/invite',
    {
      onRequest: [isAuthenticated, isEmailVerified, csrfProtection],
      schema: {
        tags: ['Workspace'],
        params: Type.Object({ id: Type.Number() }),
        body: Type.Object({ email: Type.String() }),
        response: {
          200: Type.Null(),
        },
      },
    },
    controllers.inviteUser,
  );
};

export default workspaceRouter;
