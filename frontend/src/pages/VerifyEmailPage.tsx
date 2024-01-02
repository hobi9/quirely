import { verifyEmail } from '@/services/authService';
import { EmailVerificationParams } from '@/types/misc';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const VerifyEmailPage = () => {
  const { id, token } =
    useParams<EmailVerificationParams>() as EmailVerificationParams;
  const navigate = useNavigate();

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        await verifyEmail({ id, token });
      } catch (error) {
        // TODO: add some kind of toaster
      }
      // TODO: add some kind of toaster
      navigate('/', { replace: true });
    };
    handleEmailVerification();
  }, [id, token, navigate]);

  return null;
};

export default VerifyEmailPage;
