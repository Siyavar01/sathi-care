import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../features/auth/authSlice';

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userString = params.get('user');

    if (userString) {
      try {
        const userData = JSON.parse(decodeURIComponent(userString));
        localStorage.setItem('user', JSON.stringify(userData));
        useAuthStore.setState({ user: userData, isSuccess: true });
        navigate('/');
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
      <p className="text-lg text-brand-charcoal">
        Finalizing your login...
      </p>
    </div>
  );
};

export default AuthCallbackPage;