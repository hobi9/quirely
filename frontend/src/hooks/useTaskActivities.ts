import { getTaskActivities } from '@/services/taskService';
import { queryOptions, useQuery } from '@tanstack/react-query';

export const taskActivitiesQueryOptions = (taskId?: number) =>
  queryOptions({
    staleTime: 5 * 1000,
    queryKey: ['taskId', taskId, 'activities'],
    queryFn: () => getTaskActivities(taskId!),
    enabled: !!taskId,
  });

const useTaskActivities = (taskId?: number) => {
  return useQuery(taskActivitiesQueryOptions(taskId));
};

export default useTaskActivities;
