import { Link, useNavigate } from 'react-router-dom';
import { Fragment, useState, useEffect } from 'react';
import { Menu, Transition } from '@headlessui/react';
import useAuthStore from '../features/auth/authSlice';
import logoSrc from '../assets/logo-main.png';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name: string = '') => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const renderMenuItems = () => {
    switch (user?.role) {
      case 'user':
        return (
          <>
            <Menu.Item>
              {({ active }) => (
                <Link to="/professionals" className={`${active ? 'bg-pastel-purple/20' : ''} block px-4 py-2 text-sm text-brand-charcoal`}>
                  Find a Professional
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link to="/user/dashboard" className={`${active ? 'bg-pastel-purple/20' : ''} block px-4 py-2 text-sm text-brand-charcoal`}>
                  My Dashboard
                </Link>
              )}
            </Menu.Item>
             <Menu.Item>
              {({ active }) => (
                <Link to="/community" className={`${active ? 'bg-pastel-purple/20' : ''} block px-4 py-2 text-sm text-brand-charcoal`}>
                  Community Forum
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link to="/ai-companion" className={`${active ? 'bg-pastel-purple/20' : ''} block px-4 py-2 text-sm text-brand-charcoal`}>
                  AI Companion
                </Link>
              )}
            </Menu.Item>
          </>
        );
      case 'professional':
        return (
          <>
            <Menu.Item>
              {({ active }) => (
                <Link to="/professional/dashboard" className={`${active ? 'bg-pastel-purple/20' : ''} block px-4 py-2 text-sm text-brand-charcoal`}>
                  My Dashboard
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link to="/professional/profile" className={`${active ? 'bg-pastel-purple/20' : ''} block px-4 py-2 text-sm text-brand-charcoal`}>
                  Manage Profile
                </Link>
              )}
            </Menu.Item>
          </>
        );
       case 'institution':
        return (
           <>
            <Menu.Item>
              {({ active }) => (
                <Link to="/professionals" className={`${active ? 'bg-pastel-purple/20' : ''} block px-4 py-2 text-sm text-brand-charcoal`}>
                  Find a Professional
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link to="/institution/dashboard" className={`${active ? 'bg-pastel-purple/20' : ''} block px-4 py-2 text-sm text-brand-charcoal`}>
                  My Dashboard
                </Link>
              )}
            </Menu.Item>
          </>
        );
      case 'admin':
        return (
          <Menu.Item>
            {({ active }) => (
              <Link to="/admin/dashboard" className={`${active ? 'bg-pastel-purple/20' : ''} block px-4 py-2 text-sm text-brand-charcoal`}>
                Admin Dashboard
              </Link>
            )}
          </Menu.Item>
        );
      default:
        return null;
    }
  };


  return (
    <header
      className={`sticky top-0 z-50 w-full animate-fade-slide-down bg-white/70 shadow-lg backdrop-blur-xl ring-1 ring-black/5`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
        <Link to="/" className="flex items-center space-x-2">
          <img src={logoSrc} alt="Sathi.care Logo" className="h-10 w-auto" />
          <span className="hidden text-2xl font-bold text-brand-charcoal sm:inline">
            Sathi.care
          </span>
        </Link>
        <nav>
          <ul className="flex items-center space-x-4 sm:space-x-6">
            {user ? (
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="flex items-center justify-center h-10 w-10 rounded-full bg-pastel-purple text-white font-bold hover:bg-pastel-purple/80 focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:ring-offset-2">
                    {getInitials(user.name)}
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-200/50 rounded-lg bg-white/80 shadow-2xl backdrop-blur-xl ring-1 ring-black/5 focus:outline-none">
                    <div className="px-1 py-1">
                      {renderMenuItems()}
                    </div>
                    <div className="px-1 py-1">
                       <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={onLogout}
                            className={`${
                              active ? 'bg-pastel-pink text-white' : 'text-brand-charcoal'
                            } group flex w-full items-center rounded-md px-4 py-2 text-sm`}
                          >
                            Logout
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
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
                    to="/register/select-role"
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