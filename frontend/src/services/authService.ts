import { User, UserLogin } from '../types/user';
import { client } from '../lib/axios';

export const signin = async (req: UserLogin) => {
  return client.post<void>('/auth/login', req);
};

export const getCurrentUser = async () => {
  return (await client.get<User>('/auth/me')).data;
};

export const getCsrf = async () => {
  const { csrfToken } = (
    await client.get<{ csrfToken: string }>('/auth/csrf-refresh')
  ).data;

  client.defaults.headers.common['csrf_token'] = csrfToken;
  return csrfToken;
};
