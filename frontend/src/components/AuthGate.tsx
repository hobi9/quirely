import { Navigate, useLocation, Outlet } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

type Props = {
  required?: true;
  anonymous?: true;
};

const AuthGate = ({ required, anonymous }: Props) => {
  if (!required && !anonymous) {
    throw new Error('Invalid state, required or anonymous must be set.');
  }

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
  if (anonymous && user) {
    return <Navigate to={'/'} replace />;
  }
  return <Outlet />;
};

export default AuthGate;
