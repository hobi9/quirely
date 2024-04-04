import { verifyEmail } from '@/services/authService';
import { Navigate, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/verify-email/$token')({
  loader: async ({ params: { token } }) => {
    await verifyEmail(token);
  },
  errorComponent: () => <div>Invalid token</div>,
  component: () => <Navigate to="/" replace />,
});
