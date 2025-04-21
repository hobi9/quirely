import { getWorkspaceActivities } from '@/services/workspaceService';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

export const workspaceActivitiesQueryOptions = (workspaceId: number) =>
  queryOptions({
    staleTime: 0,
    queryKey: ['workspace', workspaceId, 'activities'],
    queryFn: () => getWorkspaceActivities(workspaceId),
  });

const useWorkspaceActivities = (workspaceId: number) => {
  return useSuspenseQuery(workspaceActivitiesQueryOptions(workspaceId)).data;
};

export default useWorkspaceActivities;
