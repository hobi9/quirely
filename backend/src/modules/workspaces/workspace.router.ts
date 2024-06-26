import type { FastifyInstance } from 'fastify';
import z from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';
import * as controller from './workspace.controller';
import {
  type WorkspaceCreation,
  WorkspaceCreationSchema,
  WorkspaceDetailSchema,
  WorkspaceSchema,
  MembersSchema,
} from './workspace.schema';

const workspaceRouter = async (fastify: FastifyInstance) => {
  const { isAuthenticated, isEmailVerified, csrfProtection } = fastify;

  fastify.post<{ Body: WorkspaceCreation }>(
    '/',
    {
      onRequest: [isAuthenticated, isEmailVerified, csrfProtection],
      schema: {
        tags: ['Workspace'],
        body: zodToJsonSchema(WorkspaceCreationSchema),
        response: {
          201: zodToJsonSchema(WorkspaceSchema),
        },
      },
    },
    controller.createWorkspace,
  );

  fastify.patch<{ Body: WorkspaceCreation; Params: { id: number } }>(
    '/:id',
    {
      onRequest: [isAuthenticated, isEmailVerified, csrfProtection],
      schema: {
        tags: ['Workspace'],
        body: zodToJsonSchema(WorkspaceCreationSchema),
        params: zodToJsonSchema(z.object({ id: z.number() })),
        response: {
          200: zodToJsonSchema(WorkspaceSchema),
        },
      },
    },
    controller.updateWorkspace,
  );

  fastify.get(
    '/',
    {
      onRequest: isAuthenticated,
      schema: {
        tags: ['Workspace'],
        response: {
          200: zodToJsonSchema(z.array(WorkspaceSchema)),
        },
      },
    },
    controller.getWorkspaces,
  );

  fastify.get<{ Params: { id: number } }>(
    '/:id',
    {
      onRequest: isAuthenticated,
      schema: {
        tags: ['Workspace'],
        params: zodToJsonSchema(z.object({ id: z.number() })),
        response: {
          200: zodToJsonSchema(WorkspaceDetailSchema),
        },
      },
    },
    controller.getWorkspaceById,
  );

  fastify.get(
    '/pending',
    {
      onRequest: isAuthenticated,
      schema: {
        tags: ['Workspace'],
        response: {
          200: zodToJsonSchema(z.array(WorkspaceSchema)),
        },
      },
    },
    controller.getPendingWorkspaces,
  );

  fastify.delete<{ Params: { id: number } }>(
    '/:id',
    {
      onRequest: [isAuthenticated, isEmailVerified, csrfProtection],
      schema: {
        tags: ['Workspace'],
        params: zodToJsonSchema(z.object({ id: z.number() })),
        response: {
          204: zodToJsonSchema(z.null()),
        },
      },
    },
    controller.deleteWorkspace,
  );

  fastify.post<{ Params: { id: number } }>(
    '/:id/leave',
    {
      onRequest: [isAuthenticated, isEmailVerified, csrfProtection],
      schema: {
        tags: ['Workspace'],
        params: zodToJsonSchema(z.object({ id: z.number() })),
        response: {
          204: zodToJsonSchema(z.null()),
        },
      },
    },
    controller.leaveWorkspace,
  );

  fastify.patch<{ Params: { id: number }; Querystring: { accept: boolean } }>(
    '/:id/confirm-invitation',
    {
      onRequest: [isAuthenticated, isEmailVerified, csrfProtection],
      schema: {
        tags: ['Workspace'],
        params: zodToJsonSchema(z.object({ id: z.number() })),
        querystring: zodToJsonSchema(z.object({ accept: z.boolean() })),
        response: {
          204: zodToJsonSchema(z.null()),
        },
      },
    },
    controller.confirmInvitation,
  );

  fastify.patch<{ Params: { id: number } }>(
    '/:id/logo',
    {
      onRequest: [isAuthenticated, isEmailVerified, csrfProtection],
      schema: {
        tags: ['Workspace'],
        params: zodToJsonSchema(z.object({ id: z.number() })),
        consumes: ['multipart/form-data'],
        response: {
          200: zodToJsonSchema(z.object({ logoUrl: z.string() })),
        },
      },
    },
    controller.updateLogo,
  );

  fastify.post<{ Params: { id: number }; Body: { email: string } }>(
    '/:id/invite',
    {
      onRequest: [isAuthenticated, isEmailVerified, csrfProtection],
      schema: {
        tags: ['Workspace'],
        params: zodToJsonSchema(z.object({ id: z.number() })),
        body: zodToJsonSchema(z.object({ email: z.string() })),
        response: {
          204: zodToJsonSchema(z.null()),
        },
      },
    },
    controller.inviteUser,
  );

  fastify.get<{ Params: { id: number } }>(
    '/:id/members',
    {
      onRequest: [isAuthenticated, isEmailVerified],
      schema: {
        tags: ['Workspace'],
        params: zodToJsonSchema(z.object({ id: z.number() })),
        response: {
          200: zodToJsonSchema(z.array(MembersSchema)),
        },
      },
    },
    controller.getMembers,
  );

  fastify.delete<{ Params: { workspaceId: number; memberId: number } }>(
    '/:workspaceId/members/:memberId',
    {
      onRequest: [isAuthenticated, isEmailVerified, csrfProtection],
      schema: {
        tags: ['Workspace'],
        params: zodToJsonSchema(z.object({ workspaceId: z.number(), memberId: z.number() })),
        response: {
          204: zodToJsonSchema(z.null()),
        },
      },
    },
    controller.kickMember,
  );
};

export default workspaceRouter;
