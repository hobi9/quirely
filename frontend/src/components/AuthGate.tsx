import { useContext } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { AuthContext } from './AuthProvider';

type Props = {
  required?: true;
  anonymous?: true;
};

const AuthGate = ({ required, anonymous }: Props) => {
  if (!required && !anonymous) {
    throw new Error('Invalid state, required or anonymous must be set.');
  }

  const auth = useContext(AuthContext)!;
  const location = useLocation();

  if (required && !auth.user) {
    return (
      <Navigate to={'/login'} state={{ from: location.pathname }} replace />
    );
  }
  if (anonymous && auth.user) {
    return <Navigate to={'/'} replace />;
  }
  return <Outlet />;
};

export default AuthGate;
