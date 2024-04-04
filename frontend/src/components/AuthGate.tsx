import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useCurrentUser } from '@/hooks/auth';

type Props =
  | { required: true; notRequired?: never }
  | { required?: never; notRequired: true };

const AuthGate = ({ required, notRequired }: Props) => {
  const user = useCurrentUser();
  const location = useLocation();

  if (required && !user) {
    return (
      <Navigate
        to={'/auth/login'}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  if (notRequired && user) {
    return <Navigate to={'select-workspace'} replace />;
  }

  return <Outlet />;
};

export default AuthGate;
