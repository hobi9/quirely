import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(254),
});

type LoginData = z.infer<typeof LoginSchema>;

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(LoginSchema),
  });
  const navigate = useNavigate();
  const { state } = useLocation();

  const submitForm: SubmitHandler<LoginData> = (data) => {
    console.log(data);
    navigate(state?.from || '/');
  };

  return (
    <section className='flex items-center justify-center flex-col h-screen gap-5'>
      {/*TODO: replace with an image*/}
      <h1 className='text-6xl text-center'>Quirely</h1>
      <form
        onSubmit={handleSubmit(submitForm)}
        className='border p-9 mt-4 min-w-[35rem]'
      >
        <h1 className='text-3xl'>Sign in</h1>
        <p className='text-sm'>to continue to Quirely</p>

        <div className='flex flex-col gap-6 mt-5'>
          <div className='flex flex-col gap-0.5'>
            <p className='text-xs text-red-500'>{errors.email?.message}</p>
            <input
              id='email'
              placeholder='Email'
              className={clsx(
                'p-1 border-b-2 focus:outline-none',
                errors.email && 'border-red-200',
              )}
              aria-invalid={!!errors.email}
              {...register('email')}
            />
          </div>

          <div className='flex flex-col gap-0.5 '>
            <p className='text-xs text-red-500'>{errors.password?.message}</p>
            <input
              id='password'
              type='password'
              placeholder='Password'
              className={clsx(
                'p-1 border-b-2 focus:outline-none',
                errors.password && 'border-red-200',
              )}
              {...register('password')}
              aria-invalid={!!errors.password}
            />
          </div>

          <button
            className='text-center text-white bg-black p-1 hover:text-black 
                  hover:bg-white hover:outline-1 hover:outline-black hover:outline'
          >
            Sign In
          </button>
        </div>
        <p className='mt-1 text-sm text-center'>
          No account?
          <Link to='/signup' className='text-blue-800 hover:underline ml-1'>
            Create one!
          </Link>
        </p>
      </form>
    </section>
  );
};

export default Login;
