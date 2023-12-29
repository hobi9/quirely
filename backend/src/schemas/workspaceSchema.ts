import { Type, Static } from '@sinclair/typebox';
import { SanitizedUserSchema } from './authSchema';

export const WorkspaceSchema = Type.Object({
  id: Type.Number(),
  name: Type.String({
    maxLength: 100,
  }),
  description: Type.Optional(Type.String()),
});

export const WorkspaceCreationSchema = Type.Omit(WorkspaceSchema, ['id']);

export const EnhancedWorkspaceSchema = Type.Intersect([
  WorkspaceSchema,
  Type.Object({
    members: Type.Array(
      Type.Intersect([
        SanitizedUserSchema,
        Type.Object({
          accepted: Type.Union([Type.Boolean(), Type.Null()]),
        }),
      ]),
    ),
    owner: SanitizedUserSchema,
  }),
]);

export type WorkspaceCreationData = Static<typeof WorkspaceCreationSchema>;
