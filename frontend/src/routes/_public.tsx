import { authQueryOptions } from '@/hooks/auth';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_public')({
  beforeLoad: ({ context: { queryClient } }) => {
    const user = queryClient.getQueryData(authQueryOptions.queryKey);
    if (user) {
      throw redirect({
        to: '/select-workspace',
        replace: true,
      });
    }
  },
});
