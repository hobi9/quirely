import { Type, Static } from '@sinclair/typebox';

export const UserSchema = Type.Object({
  id: Type.Number(),
  fullName: Type.String({
    minLength: 2,
    maxLength: 100,
  }),
  email: Type.String({
    format: 'email',
    maxLength: 254,
  }),
  password: Type.String({
    minLength: 8,
    maxLength: 254,
  }),
  avatarUrl: Type.Union([Type.String(), Type.Null()]),
});

export const UserRegistrationSchema = Type.Omit(UserSchema, ['id', 'avatarUrl']);
export const UserLoginSchema = Type.Omit(UserSchema, ['id', 'fullName', 'avatarUrl']);
export const SanitizedUserSchema = Type.Omit(UserSchema, ['password']);

// Create a type alias representing the structure of user registration data
export type UserRegistrationData = Static<typeof UserRegistrationSchema>;
export type UserLoginData = Static<typeof UserLoginSchema>;
