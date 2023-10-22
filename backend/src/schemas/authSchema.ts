import { Type, Static } from '@sinclair/typebox';

export const UserRegistrationSchema = Type.Object({
  username: Type.String({
    maxLength: 50,
  }),
  email: Type.String({
    format: 'email',
    maxLength: 254,
  }),
  password: Type.String({
    maxLength: 254,
  }),
});

export const UserResponseSchema = Type.Object({
  id: Type.Number(),
  username: Type.String({
    maxLength: 50,
  }),
  email: Type.String({
    format: 'email',
    maxLength: 254,
  }),
});

// Create a type alias representing the structure of user registration data
export type UserRegistrationData = Static<typeof UserRegistrationSchema>;
