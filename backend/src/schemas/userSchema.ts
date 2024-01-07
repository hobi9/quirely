import { Type, Static } from '@sinclair/typebox';

export const QueryUserSchema = Type.Object({
  email: Type.Optional(Type.String()),
  workspaceId: Type.Optional(Type.Number()),
});

export type QueryUser = Static<typeof QueryUserSchema>;
