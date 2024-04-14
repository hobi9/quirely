import { client } from '@/lib/axios';
import {
  WorkspaceCreation,
  Workspace,
  WorkspaceDetail,
} from '@/types/workspace';

export const createWorkspace = async (req: WorkspaceCreation) => {
  const response = await client.post<Workspace>('/workspaces/', req);
  return response.data;
};

export const updateWorkspace = async (req: WorkspaceCreation, id: number) => {
  const response = await client.patch<Workspace>(`/workspaces/${id}`, req);
  return response.data;
};

export const updateWorkspaceLogo = async (id: number, file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await client.patch<Workspace>(
    `/workspaces/${id}/logo`,
    formData,
  );

  return response.data;
};

export const inviteToWorkspace = async (id: number, email: string) => {
  const response = await client.post<void>(`/workspaces/${id}/invite`, {
    email,
  });

  return response.data;
};

export const getWorkspaces = async () => {
  const response = await client.get<Workspace[]>('/workspaces');
  return response.data;
};

export const getWorkspace = async (id: number) => {
  const response = await client.get<WorkspaceDetail>(`/workspaces/${id}`);
  return response.data;
};

export const deleteWorkspace = async (id: number) => {
  return client.delete<void>(`/workspaces/${id}`);
};

export const leaveWorkspace = async (id: number) => {
  return client.delete<void>(`/workspaces/${id}/leave`);
};
