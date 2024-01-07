export type Workspace = {
  id: number;
  name: string;
  description?: string;
  logoUrl: string;
};

export type WorkspaceCreation = Omit<Workspace, 'id' | 'logoUrl'>;
