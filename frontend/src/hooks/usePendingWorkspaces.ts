import { getPendingWorkspaces } from '@/services/workspaceService';
import { queryOptions, useQuery } from '@tanstack/react-query';

export const pendingWorkspacesQueryOption = queryOptions({
  queryKey: ['workspaces', 'pending'],
  queryFn: getPendingWorkspaces,
  refetchInterval: 30000,
});

const usePendingWorkspaces = () => {
  return useQuery(pendingWorkspacesQueryOption);
};

export default usePendingWorkspaces;
