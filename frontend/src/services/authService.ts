import { User, UserLogin, UserRegistration } from '../types/user';
import { client } from '../lib/axios';
import { EmailVerificationParams } from '@/types/misc';

export const signin = async (req: UserLogin) => {
  return client.post<void>('/auth/login', req);
};

export const signUp = async (req: UserRegistration) => {
  return client.post<void>('/auth/register', req);
};

export const getCurrentUser = async () => {
  const response = await client.get<User | null>('/auth/me');
  return response.data;
};

export const getCsrf = async () => {
  const response = await client.get<{ csrfToken: string }>(
    '/auth/csrf-refresh',
  );

  const { csrfToken } = response.data;

  client.defaults.headers.common['X-Csrf-Token'] = csrfToken;
};

export const signOut = async () => {
  return client.post<void>('/auth/signout');
};

export const verifyEmail = async ({ id, token }: EmailVerificationParams) => {
  return client.patch<void>(`/auth/verify/${id}/${token}`);
};
