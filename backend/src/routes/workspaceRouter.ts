import { WorkspaceCreationData, WorkspaceCreationSchema, WorkspaceSchema } from '../schemas/workspaceSchema';
import { FastifyInstance } from 'fastify';
import workspaceControllers from '../controllers/workspaceControllers';
import { Type } from '@sinclair/typebox';

const workspaceRouter = async (fastify: FastifyInstance) => {
  const { isAuthenticated, csrfProtection } = fastify;
  const controllers = workspaceControllers(fastify);

  fastify.post<{ Body: WorkspaceCreationData }>(
    '/',
    {
      onRequest: [isAuthenticated, csrfProtection],
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

  fastify.get<{ Params: { id: number } }>(
    '/:id',
    {
      onRequest: isAuthenticated,
      schema: {
        tags: ['Workspace'],
        params: Type.Object({ id: Type.Number() }),
        response: {
          200: WorkspaceSchema,
        },
      },
    },
    controllers.getWorkspaceById,
  );

  fastify.delete<{ Params: { id: number } }>(
    '/:id',
    {
      onRequest: [isAuthenticated, csrfProtection],
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
};

export default workspaceRouter;
