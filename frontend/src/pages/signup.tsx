import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { UserRegistration } from '../types/user';
import { signUp } from '../services/authService';
import { isAxiosError } from 'axios';
import { ServerError } from '../types/misc';

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

    navigate('/login');
  };

  return (
    <section className="flex items-center justify-center flex-col h-screen gap-5">
      {/*TODO: replace with an image*/}
      <h1 className="text-6xl text-center">Quirely</h1>
      <form
        onSubmit={handleSubmit(submitForm)}
        className="border p-9 mt-4 min-w-[35rem]"
      >
        <h1 className="text-3xl">Sign up</h1>
        <p className="text-sm">to join Quirely</p>

        <div className="flex flex-col gap-6 mt-5">
          <div className="flex flex-col gap-0.5">
            <p className="text-xs text-red-500">{errors.fullName?.message}</p>
            <input
              placeholder="Full name"
              className={clsx(
                'p-1 border-b-2 focus:outline-none',
                errors.fullName && 'border-red-200',
              )}
              aria-invalid={!!errors.fullName}
              {...register('fullName')}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-5">
          <div className="flex flex-col gap-0.5">
            <p className="text-xs text-red-500">{errors.email?.message}</p>
            <input
              placeholder="Email"
              className={clsx(
                'p-1 border-b-2 focus:outline-none',
                errors.email && 'border-red-200',
              )}
              aria-invalid={!!errors.email}
              {...register('email')}
            />
          </div>

          <div className="flex flex-col gap-0.5 ">
            <p className="text-xs text-red-500">{errors.password?.message}</p>
            <input
              type="password"
              placeholder="Password"
              className={clsx(
                'p-1 border-b-2 focus:outline-none',
                errors.password && 'border-red-200',
              )}
              {...register('password')}
              aria-invalid={!!errors.password}
            />
          </div>

          <div className="flex flex-col gap-0.5 ">
            <p className="text-xs text-red-500">
              {errors.confirmPassword?.message}
            </p>
            <input
              type="password"
              placeholder="Confirm password"
              className={clsx(
                'p-1 border-b-2 focus:outline-none',
                errors.password && 'border-red-200',
              )}
              {...register('confirmPassword')}
              aria-invalid={!!errors.password}
            />
          </div>

          <button
            disabled={isSubmitting}
            className="text-center text-white bg-black p-1 hover:text-black 
               hover:bg-white hover:outline-1 hover:outline-black hover:outline"
          >
            Sign Up
          </button>
        </div>
        <p className="mt-1 text-sm text-center">
          Already have an account?
          <Link to="/login" className="text-blue-800 hover:underline ml-1">
            Login!
          </Link>
        </p>
      </form>
    </section>
  );
};

export default SignUp;
