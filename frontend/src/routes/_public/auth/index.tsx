import { Navigate, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_public/auth/')({
  component: () => <Navigate to="/auth/login" replace />,
});
