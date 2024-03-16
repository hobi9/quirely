import { z } from 'zod';

export const UserSchema = z.object({
  id: z.number(),
  fullName: z.string().min(2).max(100),
  email: z.string().email().max(254),
  password: z.string().min(8).max(254),
  avatarUrl: z.string().nullable(),
});

export const QueryUserSchema = z.object({
  email: z.string().optional(),
  workspaceId: z.number().optional(),
});

export type QueryUser = z.infer<typeof QueryUserSchema>;
