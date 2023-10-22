import { Type, Static } from '@sinclair/typebox';

export const configSchema = Type.Object({
  DATABASE_URL: Type.String(),
});

// Create a type alias representing the structure of user registration data
export type config = Static<typeof configSchema>;
