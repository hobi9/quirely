import { client } from '@/lib/axios';
import { User } from '@/types/user';

export const getUsers = async (
  params: {
    email?: string;
    workspaceId?: number;
  } = {},
) => {
  const response = await client.get<User[]>('/users', { params });
  return response.data;
};
