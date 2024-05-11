import { getWorkspaceMembers } from '@/services/workspaceService';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';

export const workspaceMemberQueryOptions = (workspaceId: number) =>
  queryOptions({
    queryKey: ['workspaces', workspaceId, 'members'],
    queryFn: () => getWorkspaceMembers(Number(workspaceId)),
  });

const useWorkspaceMembers = () => {
  const { workspaceId } = useParams({
    from: '/_protected/workspaces/$workspaceId',
  });
  return useSuspenseQuery(workspaceMemberQueryOptions(workspaceId)).data;
};

export default useWorkspaceMembers;
