import { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../features/auth/authSlice';
import logoSrc from '../assets/logo-main.png';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;
  const navigate = useNavigate();

  const { user, isLoading, isError, isSuccess, message, login, reset } =
    useAuthStore();

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      if (user?.role === 'professional') {
        navigate('/professional/profile');
      } else if (user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    }

    reset();
  }, [user, isError, isSuccess, message, navigate, reset]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const userData = { email, password };
    login(userData);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pastel-purple via-brand-cream to-pastel-pink p-4 bg-[length:200%_200%] animate-gradient-pan">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white/50 p-8 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5 md:p-12">
        <div className="text-center">
          <img
            src={logoSrc}
            alt="Sathi.care Logo"
            className="mx-auto h-12 w-auto"
          />
          <p className="mt-2 text-lg text-gray-700">
            Welcome back to your journey.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <div className="space-y-4 rounded-md">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                value={email}
                onChange={onChange}
                required
                className="relative block w-full appearance-none rounded-lg border border-gray-300/50 bg-white/70 px-4 py-3 text-brand-charcoal placeholder-gray-500 transition-shadow duration-200 focus:border-pastel-purple focus:outline-none focus:ring-1 focus:ring-pastel-purple sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={onChange}
                required
                className="relative block w-full appearance-none rounded-lg border border-gray-300/50 bg-white/70 px-4 py-3 text-brand-charcoal placeholder-gray-500 transition-shadow duration-200 focus:border-pastel-purple focus:outline-none focus:ring-1 focus:ring-pastel-purple sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-pastel-purple hover:underline"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-lg border border-transparent bg-pastel-pink px-4 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-pastel-pink focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-pastel-pink/70"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="relative my-6">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-gray-300/50" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white/0 px-2 text-gray-600 backdrop-blur-sm">
              Or continue with
            </span>
          </div>
        </div>

        <div>
          <a
            href="/api/auth/google"
            className="group relative flex w-full items-center justify-center rounded-lg border border-gray-300/50 bg-white px-4 py-3 text-lg font-semibold text-brand-charcoal shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:ring-offset-2"
          >
            <svg
              className="h-5 w-5 text-brand-charcoal"
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="ml-3">Sign in with Google</span>
          </a>
        </div>
        <div className="text-center text-sm">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/register/select-role"
              className="font-medium text-pastel-purple hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;