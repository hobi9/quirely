import { create } from 'zustand';

type WorkspaceState = {
  activeId: number | null;
  setActive: (workspaceId: number) => void;
};

const useWorkspaceStore = create<WorkspaceState>()((set) => ({
  activeId: null,
  setActive: (workspace) => set(() => ({ activeId: workspace })),
}));

export default useWorkspaceStore;
