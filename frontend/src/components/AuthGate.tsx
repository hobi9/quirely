import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthProvider';

type Props = {
  required?: true;
  notRequired?: true;
  children: React.ReactNode;
};

const AuthGate = ({ required, notRequired, children }: Props) => {
  if (!required && !notRequired) {
    throw new Error('Invalid state, required or notRequired must be set.');
  }

  const auth = useContext(AuthContext);
  const location = useLocation();

  if (required && !auth?.user) {
    return (
      <Navigate to={'/login'} state={{ from: location.pathname }} replace />
    );
  }
  if (notRequired && auth?.user) {
    return <Navigate to={'/'} replace />;
  }
  return <>{children}</>;
};

export default AuthGate;
