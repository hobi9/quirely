import { getWorkspaces } from '@/services/workspaceService';
import { useQuery } from '@tanstack/react-query';

const useWorkspaces = () => {
  return useQuery({
    queryKey: ['workspaces'],
    queryFn: getWorkspaces,
  });
};

export default useWorkspaces;
