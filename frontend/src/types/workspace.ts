import { User } from './user';

export type Workspace = {
  id: number;
  name: string;
  description?: string;
  logoUrl: string;
};

export type WorkspaceCreation = Omit<Workspace, 'id' | 'logoUrl' | 'owner'>;

export type WorkspaceDetail = Workspace & { members: User[]; owner: User };
