import { client } from '@/lib/axios';
import { UploadFileResponse } from '@/types/misc';
import {
  WorkspaceCreation,
  Workspace,
  WorkspaceDetail,
  Member,
} from '@/types/workspace';

export const createWorkspace = async (req: WorkspaceCreation) => {
  const response = await client.post<Workspace>('/workspaces', req);
  return response.data;
};

export const updateWorkspace = async (req: WorkspaceCreation, id: number) => {
  const response = await client.put<Workspace>(`/workspaces/${id}`, req);
  return response.data;
};

export const updateWorkspaceLogo = async (id: number, file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await client.patch<UploadFileResponse>(
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

export const getPendingWorkspaces = async () => {
  const response = await client.get<Workspace[]>('/workspaces/pending');
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
  return client.post<void>(`/workspaces/${id}/leave`);
};

export const getWorkspaceMembers = async (id: number) => {
  const response = await client.get<Member[]>(`/workspaces/${id}/members`);
  return response.data;
};

export const kickFromWorkspace = async ({
  workspaceId,
  memberId,
}: {
  workspaceId: number;
  memberId: number;
}) => {
  return client.delete<void>(`/workspaces/${workspaceId}/members/${memberId}`);
};

export const acceptWorkspaceInvitation = async (
  workspaceId: number,
  accept: boolean,
) => {
  return client.patch<void>(
    `/workspaces/${workspaceId}/confirm-invitation`,
    null,
    {
      params: { accept },
    },
  );
};
