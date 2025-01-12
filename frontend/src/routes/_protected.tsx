import AuthenticatedNavbar from '@/components/AuthenticatedNavbar';
import { authQueryOptions } from '@/hooks/auth';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

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

  component: AuthenticationLayout,
});

function AuthenticationLayout() {
  return (
    <div className="h-screen">
      <AuthenticatedNavbar />
      <Outlet />
    </div>
  );
}
