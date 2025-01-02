import { authQueryOptions } from '@/hooks/auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { resendVerificationEmail } from '@/services/authService';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { Mail } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const Route = createFileRoute('/_protected/verify-email')({
  component: VerifyEmailPage,
  beforeLoad: ({ context: { queryClient } }) => {
    const user = queryClient.getQueryData(authQueryOptions.queryKey)!;

    if (user.isVerified) {
      throw redirect({
        to: '/select-workspace',
        replace: true,
      });
    }
  },
});

function VerifyEmailPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleResendVerification = async () => {
    setIsLoading(true);
    try {
      await resendVerificationEmail();
      toast({
        title: 'Email sent!',
        description: 'Please check your inbox for the verification link.',
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to send verification email. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md space-y-6 p-8">
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Verify your email
          </h1>
          <p className="text-sm text-muted-foreground">
            Please check your inbox and click the verification link to continue
            using Quirely.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            Didn&apos;t receive the email? Check your spam folder or request a
            new verification link.
          </p>
          <div className="space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              onClick={handleResendVerification}
            >
              {isLoading ? 'Sending...' : 'Resend verification email'}
            </Button>
          </div>
        </div>
      </Card>
    </main>
  );
}
