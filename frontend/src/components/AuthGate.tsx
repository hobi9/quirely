import { Navigate, useLocation } from 'react-router-dom';

type Props = {
  required?: true;
  notRequired?: true;
  children: React.ReactNode;
};

const AuthGate = ({ required, notRequired, children }: Props) => {
  if (!required && !notRequired) {
    throw new Error('Invalid state, required or notRequired must be set.');
  }

  const auth = false;
  const location = useLocation();

  if (required && !auth) {
    return (
      <Navigate to={'/signin'} state={{ from: location.pathname }} replace />
    );
  }
  if (notRequired && auth) {
    return <Navigate to={'/'} replace />;
  }
  return <>{children}</>;
};

export default AuthGate;
