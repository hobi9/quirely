import { authQueryOptions } from '@/hooks/auth';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_protected')({
  beforeLoad: ({ location, context: { queryClient } }) => {
    const user = queryClient.getQueryData(authQueryOptions.queryKey);
    if (!user) {
      throw redirect({
        to: '/auth/login',
        search: {
          redirect: location.href,
        },
      });
    }

    if (!location.pathname.startsWith('/verify-email') && !user.isVerified) {
      throw redirect({
        to: '/verify-email',
        replace: true,
      });
    }
  },
});
