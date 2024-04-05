import { getWorkspace } from '@/services/workspaceService';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';

export const workspaceQueryOptions = (workspaceId: number) =>
  queryOptions({
    queryKey: ['workspaces', workspaceId],
    queryFn: () => getWorkspace(Number(workspaceId)),
  });

const useWorkspace = () => {
  const { workspaceId } = useParams({
    from: '/_protected/workspaces/$workspaceId',
  });
  return useSuspenseQuery(workspaceQueryOptions(Number(workspaceId))).data;
};

export default useWorkspace;
