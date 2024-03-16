import { z } from 'zod';
import { SanitizedUserSchema } from '../auth/auth.schema';

export const WorkspaceSchema = z.object({
  id: z.number(),
  name: z.string().max(100),
  description: z.string().optional(),
  logoUrl: z.string(),
  owner: SanitizedUserSchema,
});

export const WorkspaceCreationSchema = WorkspaceSchema.omit({ id: true, logoUrl: true, owner: true });

export const EnhancedWorkspaceSchema = WorkspaceSchema.extend({
  members: z.array(
    z.object({
      ...SanitizedUserSchema.shape,
      accepted: z.boolean().nullable(),
    }),
  ),
});

export type WorkspaceCreation = z.infer<typeof WorkspaceCreationSchema>;
