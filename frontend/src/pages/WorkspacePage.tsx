import useWorkspace from '@/hooks/useWorkspace';
import useWorkspaceStore from '@/stores/workspaceStore';
import { isAxiosError } from 'axios';
import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const WorkspacePage = () => {
  const { isPending, isError, data: workspace, error } = useWorkspace();
  const setActiveWorkspace = useWorkspaceStore((state) => state.setActive);

  useEffect(() => {
    if (workspace) {
      setActiveWorkspace(workspace.id);
    }
  }, [setActiveWorkspace, workspace]);

  if (isPending) return;

  if (isError && isAxiosError(error) && error.status === 404) {
    // TODO: handle it better
    return <Navigate to={'/select-workspace'} replace />;
  }

  return <Outlet />;
};

export default WorkspacePage;
