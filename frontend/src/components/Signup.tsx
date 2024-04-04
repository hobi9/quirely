import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { UserRegistration } from '../types/user';
import { signUp } from '../services/authService';
import { isAxiosError } from 'axios';
import { ServerError } from '../types/misc';
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
import { useNavigate } from '@tanstack/react-router';

const SignUpSchema: z.ZodType<UserRegistration> = z
  .object({
    fullName: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(8).max(254),
    confirmPassword: z.string().min(8).max(254),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const SignUp = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UserRegistration>({
    resolver: zodResolver(SignUpSchema),
  });
  const navigate = useNavigate();

  const submitForm: SubmitHandler<UserRegistration> = async (data) => {
    try {
      await signUp(data);
    } catch (error) {
      if (isAxiosError<ServerError<UserRegistration>>(error)) {
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

    navigate({ to: '/auth/login' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign up</CardTitle>
        <CardDescription>to join Quirely</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(submitForm)}>
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              aria-invalid={!!errors.fullName}
              autoComplete="name"
              {...register('fullName')}
              className={clsx(
                errors.fullName &&
                  'ring ring-red-200 focus-visible:ring-red-200',
              )}
            />
            <p className="text-xs text-red-500">{errors.fullName?.message}</p>
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              autoComplete="email"
              aria-invalid={!!errors.email}
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
          <div className="space-y-1">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              aria-invalid={!!errors.confirmPassword}
              {...register('confirmPassword')}
              className={clsx(
                errors.confirmPassword &&
                  'ring ring-red-200 focus-visible:ring-red-200',
              )}
            />
            <p className="text-xs text-red-500">
              {errors.confirmPassword?.message}
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Loading...' : 'Sign Up'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default SignUp;
