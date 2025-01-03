import { FullUser, UserLogin, UserRegistration } from '../types/user';
import { client } from '../lib/axios';

export const signin = async (req: UserLogin) => {
  return client.post<void>('/auth/login', req);
};

export const signUp = async (req: UserRegistration) => {
  return client.post<void>('/auth/register', req);
};

export const getCurrentUser = async () => {
  const response = await client.get<FullUser | null>('/auth/me');
  return response.data;
};

export const getCsrf = async () => {
  const response = await client.get<{ csrfToken: string }>(
    '/auth/csrf-refresh',
  );

  const { csrfToken } = response.data;

  client.defaults.headers.common['X-XSRF-TOKEN'] = csrfToken;
};

export const signOut = async () => {
  return client.post<void>('/auth/sign-out');
};

export const verifyEmail = async (token: string) => {
  return client.post<void>(`/auth/verify/${token}`);
};

export const resendVerificationEmail = async () => {
  return client.post<void>('/auth/resend-verification');
};
