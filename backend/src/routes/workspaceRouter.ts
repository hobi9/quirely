import { WorkspaceCreationData, WorkspaceCreationSchema, WorkspaceSchema } from '../schemas/workspaceSchema';
import { FastifyInstance } from 'fastify';
import workspaceControllers from '../controllers/workspaceControllers';

const workspaceRouter = async (fastify: FastifyInstance) => {
  const { isAuthenticated, csrfProtection } = fastify;
  const controllers = workspaceControllers(fastify);

  fastify.post<{ Body: WorkspaceCreationData }>(
    '',
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
};

export default workspaceRouter;
