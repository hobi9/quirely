import { getCsrf, getCurrentUser } from '@/services/authService';
import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';

export const authQueryOptions = queryOptions({
  queryKey: ['auth'],
  queryFn: async () => {
    const user = await getCurrentUser();
    if (user) {
      await getCsrf();
    }
    return user;
  },
});

export const useAuth = () => {
  return useQuery(authQueryOptions);
};

export const useCurrentUser = () => {
  return useSuspenseQuery(authQueryOptions).data;
};
