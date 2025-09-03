import { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../features/auth/authSlice';
import logoSrc from '../assets/logo-main.png';

const ProfessionalRegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { name, email, password } = formData;
  const navigate = useNavigate();

  const { user, isLoading, isError, isSuccess, message, register, reset } =
    useAuthStore();

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      navigate('/');
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
    const userData = {
      name,
      email,
      password,
      role: 'professional',
    };
    register(userData);
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
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-brand-charcoal">
            Professional Registration
          </h2>
          <p className="mt-2 text-gray-700">
            Join our network of trusted professionals.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <div className="space-y-4 rounded-md">
            <input
              name="name"
              type="text"
              value={name}
              onChange={onChange}
              required
              className="relative block w-full appearance-none rounded-lg border border-gray-300/50 bg-white/70 px-4 py-3 text-brand-charcoal placeholder-gray-500 transition-shadow duration-200 focus:border-pastel-purple focus:outline-none focus:ring-1 focus:ring-pastel-purple sm:text-sm"
              placeholder="Full Name"
            />
            <input
              name="email"
              type="email"
              value={email}
              onChange={onChange}
              required
              className="relative block w-full appearance-none rounded-lg border border-gray-300/50 bg-white/70 px-4 py-3 text-brand-charcoal placeholder-gray-500 transition-shadow duration-200 focus:border-pastel-purple focus:outline-none focus:ring-1 focus:ring-pastel-purple sm:text-sm"
              placeholder="Email address"
            />
            <input
              name="password"
              type="password"
              value={password}
              onChange={onChange}
              required
              className="relative block w-full appearance-none rounded-lg border border-gray-300/50 bg-white/70 px-4 py-3 text-brand-charcoal placeholder-gray-500 transition-shadow duration-200 focus:border-pastel-purple focus:outline-none focus:ring-1 focus:ring-pastel-purple sm:text-sm"
              placeholder="Password"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-lg border border-transparent bg-pastel-pink px-4 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-pastel-pink focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-pastel-pink/70"
            >
              {isLoading ? 'Creating Account...' : 'Create Account & Continue'}
            </button>
          </div>
          <div className="text-center text-xs text-gray-600">
            <p>
              You will be asked to complete your professional profile and upload
              credentials in the next step.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfessionalRegisterPage;