import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../features/auth/authSlice';
import type { IUser } from '../types';

type UserAuthResponse = IUser & { isNewUser?: boolean };

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userString = params.get('user');

    if (userString) {
      try {
        const userData: UserAuthResponse = JSON.parse(decodeURIComponent(userString));

        localStorage.setItem('user', JSON.stringify(userData));
        useAuthStore.setState({ user: userData, isSuccess: true });

        if (userData.isNewUser && userData.role === 'user') {
          navigate('/questionnaire');
        } else {
          if (userData.role === 'professional') {
            navigate('/professional/profile');
          } else if (userData.role === 'admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/professionals');
          }
        }
      } catch (error) {
        console.error('Failed to parse user data from URL', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [location, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-cream">
      <div className="text-center">
        <p className="text-lg text-brand-charcoal animate-pulse">Finalizing your login...</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;