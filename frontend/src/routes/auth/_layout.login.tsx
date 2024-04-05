import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authQueryOptions } from '@/hooks/auth';
import { cn } from '@/lib/utils';
import { signin } from '@/services/authService';
import { ServerError } from '@/types/misc';
import { UserLogin } from '@/types/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { isAxiosError } from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

export const Route = createFileRoute('/auth/_layout/login')({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  component: LoginPage,
});

const LoginSchema: z.ZodType<UserLogin> = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(254),
});

function LoginPage() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UserLogin>({
    resolver: zodResolver(LoginSchema),
  });
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const queryClient = useQueryClient();

  const submitForm: SubmitHandler<UserLogin> = async (data) => {
    try {
      await signin(data);
    } catch (error) {
      if (isAxiosError<ServerError<UserLogin>>(error)) {
        const { field, message } = error.response!.data;
        if (field) {
          setError(field, {
            type: 'server',
            message,
          });
        }
      }
      //TODO: add toaster or some kind of notification
      return;
    }

    await queryClient.invalidateQueries(authQueryOptions);
    navigate({ to: redirect ?? '/select-workspace', replace: true });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>to continue to Quirely</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(submitForm)}>
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              aria-invalid={!!errors.email}
              autoComplete="email"
              {...register('email')}
              className={cn(
                errors.email && 'ring ring-red-200 focus-visible:ring-red-200',
              )}
            />
            <p className="text-xs text-red-500">{errors.email?.message}</p>
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              aria-invalid={!!errors.password}
              {...register('password')}
              className={cn(
                errors.password &&
                  'ring ring-red-200 focus-visible:ring-red-200',
              )}
            />
            <p className="text-xs text-red-500">{errors.password?.message}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Loading...' : 'Sign In'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
