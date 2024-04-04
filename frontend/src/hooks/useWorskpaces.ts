import { getWorkspaces } from '@/services/workspaceService';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

export const workspacesQueryOption = queryOptions({
  queryKey: ['workspaces'],
  queryFn: getWorkspaces,
});

const useWorkspaces = () => {
  return useSuspenseQuery(workspacesQueryOption).data;
};

export default useWorkspaces;
