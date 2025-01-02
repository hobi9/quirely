import { verifyEmail } from '@/services/authService';
import { Navigate, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/verify-email/$token')({
  loader: async ({ params: { token } }) => {
    try {
      await verifyEmail(token);
    } catch (error) {
      console.error(error);
    }
  },
  component: () => <Navigate to="/auth/login" replace />,
});
