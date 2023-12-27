import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { getCurrentUser, signin } from '../services/authService';
import { UserLogin } from '../types/user';
import { isAxiosError } from 'axios';
import { ServerError } from '../types/misc';
import useAuthStore from '../stores/authStore';

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
    <section className="flex items-center justify-center flex-col h-screen gap-5">
      {/*TODO: replace with an image*/}
      <h1 className="text-6xl text-center">Quirely</h1>
      <form
        onSubmit={handleSubmit(submitForm)}
        className="border p-9 mt-4 min-w-[35rem]"
      >
        <h1 className="text-3xl">Sign in</h1>
        <p className="text-sm">to continue to Quirely</p>

        <div className="flex flex-col gap-6 mt-5">
          <div className="flex flex-col gap-0.5">
            <p className="text-xs text-red-500">{errors.email?.message}</p>
            <input
              id="email"
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
              id="password"
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

          <button
            disabled={isSubmitting}
            className="text-center text-white bg-black p-1 hover:text-black 
                  hover:bg-white hover:outline-1 hover:outline-black hover:outline
                  disabled:bg-slate-300 disabled:opacity-80 disabled:hover:outline-none disabled:hover:text-white"
          >
            {isSubmitting ? 'Loading...' : 'Sign In'}
          </button>
        </div>
        <p className="mt-1 text-sm text-center">
          No account?
          <Link to="/register" className="text-blue-800 hover:underline ml-1">
            Create one!
          </Link>
        </p>
      </form>
    </section>
  );
};

export default Login;
