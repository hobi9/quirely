import { client } from '@/lib/axios';
import { UploadFileResponse } from '@/types/misc';
import { FullUser, UpdateUser, User } from '@/types/user';

export const getUsers = async (
  params: {
    email?: string;
    workspaceId?: number;
  } = {},
) => {
  const response = await client.get<User[]>('/users', { params });
  return response.data;
};

export const updateAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await client.put<UploadFileResponse>(
    `/users/avatar`,
    formData,
  );

  return response.data;
};

export const updateUser = async (request: UpdateUser) => {
  const response = await client.put<FullUser>(`/users`, request);
  return response.data;
};
