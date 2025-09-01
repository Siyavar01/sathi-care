import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../features/auth/authSlice';
import logoSrc from '../assets/logo-main.png';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full animate-fade-slide-down bg-white/70 shadow-lg backdrop-blur-xl ring-1 ring-black/5">
      <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
        <Link to="/" className="flex items-center space-x-2">
          <img src={logoSrc} alt="Sathi.care Logo" className="h-10 w-auto" />
          <span className="hidden text-2xl font-bold text-brand-charcoal sm:inline">
            Sathi.care
          </span>
        </Link>
        <nav>
          <ul className="flex items-center space-x-4 sm:space-x-6">
            {user ? (
              <>
                <li>
                  <span className="hidden font-semibold text-brand-charcoal sm:inline">
                    Hello, {user.name.split(' ')[0]}
                  </span>
                </li>
                <li>
                  <button
                    onClick={onLogout}
                    className="rounded-lg bg-pastel-pink px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-pastel-pink focus:ring-offset-2"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="rounded-lg px-4 py-2 text-sm font-semibold text-brand-charcoal transition-colors duration-300 hover:bg-gray-200/50"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="rounded-lg bg-pastel-pink px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-pastel-pink focus:ring-offset-2"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;