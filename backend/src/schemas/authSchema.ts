import { Type, Static } from '@sinclair/typebox';

export const UserSchema = Type.Object({
  id: Type.Number(),
  username: Type.String({
    minLength: 6,
    maxLength: 50,
    pattern: '^[a-zA-Z0-9_-]+$',
  }),
  email: Type.String({
    format: 'email',
    maxLength: 254,
  }),
  password: Type.String({
    minLength: 8,
    maxLength: 254,
  }),
});

export const UserRegistrationSchema = Type.Omit(UserSchema, ['id']);
export const UserLoginSchema = Type.Omit(UserSchema, ['id', 'email']);
export const SanitizedUserSchema = Type.Omit(UserSchema, ['password']);

// Create a type alias representing the structure of user registration data
export type UserRegistrationData = Static<typeof UserRegistrationSchema>;
export type UserLoginData = Static<typeof UserLoginSchema>;
