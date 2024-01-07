import { Navigate, useLocation, Outlet } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

type Props =
  | { required: true; notRequired?: never }
  | { required?: never; notRequired: true };

const AuthGate = ({ required, notRequired }: Props) => {
  const user = useAuthStore((state) => state.user);
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
    return <Navigate to={'/'} replace />;
  }
  return <Outlet />;
};

export default AuthGate;
