import { z } from 'zod';
import { SanitizedUserSchema } from '../auth/auth.schema';

export const WorkspaceSchema = z.object({
  id: z.number(),
  name: z.string().max(100),
  description: z.string().optional().nullable(),
  logoUrl: z.string().nullable(),
});

export const WorkspaceCreationSchema = WorkspaceSchema.omit({ id: true, logoUrl: true, owner: true });

export const WorkspaceDetailSchema = WorkspaceSchema.extend({
  owner: SanitizedUserSchema,
});

export const MembersSchema = SanitizedUserSchema.extend({
  accepted: z.boolean().optional().nullable(),
});

export type WorkspaceCreation = z.infer<typeof WorkspaceCreationSchema>;
export type WorkspaceDetail = z.infer<typeof WorkspaceDetailSchema>;
