import type { z } from 'zod';
import { UserSchema } from '../users/user.schema';

export const UserRegistrationSchema = UserSchema.omit({ id: true, avatarUrl: true });
export const UserLoginSchema = UserSchema.omit({ id: true, fullName: true, avatarUrl: true });
export const SanitizedUserSchema = UserSchema.omit({ password: true });

export type UserRegistration = z.infer<typeof UserRegistrationSchema>;
export type UserLogin = z.infer<typeof UserLoginSchema>;
