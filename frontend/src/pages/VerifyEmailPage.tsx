import { verifyEmail } from '@/services/authService';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const VerifyEmailPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        await verifyEmail(token!);
      } catch (error) {
        // TODO: add some kind of toaster
      }
      // TODO: add some kind of toaster
      navigate('/', { replace: true });
    };
    handleEmailVerification();
  }, [token, navigate]);

  return null;
};

export default VerifyEmailPage;
