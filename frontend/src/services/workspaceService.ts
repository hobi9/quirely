import { client } from '@/lib/axios';
import { WorkspaceCreation, Workspace } from '@/types/workspace';

export const createWorkspace = async (req: WorkspaceCreation) => {
  const response = await client.post<Workspace>('/workspaces/', req);
  return response.data;
};

export const updateWorkspaceLogo = async (id: number, file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await client.put<Workspace>(
    `/workspaces/${id}/logo`,
    formData,
  );

  return response.data;
};
