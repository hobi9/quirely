import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { getCurrentUser, signin } from '../services/authService';
import { UserLogin } from '../types/user';
import { isAxiosError } from 'axios';
import { ServerError } from '../types/misc';
import useAuthStore from '../stores/authStore';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const LoginSchema: z.ZodType<UserLogin> = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(254),
});

const Login = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UserLogin>({
    resolver: zodResolver(LoginSchema),
  });
  const navigate = useNavigate();
  const { state } = useLocation();
  const setUser = useAuthStore((state) => state.setUser);

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
    const user = await getCurrentUser();
    setUser(user);
    navigate(state?.from || '/');
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
              className={clsx(
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
              className={clsx(
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
};

export default Login;
