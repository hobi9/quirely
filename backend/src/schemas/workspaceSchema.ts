import { Type, Static } from '@sinclair/typebox';

export const WorkspaceSchema = Type.Object({
  id: Type.Number(),
  name: Type.String({
    maxLength: 100,
    pattern: '^.*\\S.*$',
  }),
  description: Type.Optional(Type.String()),
  ownerId: Type.Number(),
});

export const WorkspaceCreationSchema = Type.Intersect([
  Type.Omit(WorkspaceSchema, ['id', 'ownerId']),
  Type.Object({
    membersMails: Type.Optional(Type.Array(Type.String({ format: 'email' }))),
  }),
]);

export type WorkspaceCreationData = Static<typeof WorkspaceCreationSchema>;
