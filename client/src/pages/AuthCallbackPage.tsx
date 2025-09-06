import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../features/auth/authSlice';
import type { IUser } from '../types';

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: authUser, login } = useAuthStore();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userString = params.get('user');

    if (userString) {
      try {
        const userData: IUser = JSON.parse(decodeURIComponent(userString));
        localStorage.setItem('user', JSON.stringify(userData));
        useAuthStore.setState({ user: userData, isSuccess: true });

        if (userData?.role === 'professional') {
          navigate('/professional/profile');
        } else if (userData?.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (userData?.role === 'user' || userData?.role === 'institution') {
          navigate('/professionals');
        } else {
          navigate('/');
        }

      } catch (error) {
        console.error('Failed to parse user data from URL', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [location, navigate, login]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-cream">
      <div className="text-center">
        <p className="text-lg text-brand-charcoal">Finalizing your login...</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;