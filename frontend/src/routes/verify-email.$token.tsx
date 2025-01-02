import { authQueryOptions } from '@/hooks/auth';
import { verifyEmail } from '@/services/authService';
import { Navigate, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/verify-email/$token')({
  loader: async ({ params: { token }, context: { queryClient } }) => {
    try {
      await verifyEmail(token);
      await queryClient.invalidateQueries(authQueryOptions);
    } catch (error) {
      console.error(error);
    }
  },
  component: () => <Navigate to="/auth/login" replace />,
});
