import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const RoleSelectionPage = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const roleOptions = [
    {
      role: 'user',
      title: 'I am seeking support',
      description: 'Join our community to find therapists and resources for your mental wellness journey.',
      path: '/register/user',
    },
    {
      role: 'professional',
      title: 'I am a mental health professional',
      description: 'Offer your expertise and services to our growing community of users seeking support.',
      path: '/register/professional',
    },
    {
      role: 'institution',
      title: 'I represent an institution',
      description: 'Connect your school or organization with verified professionals for workshops and events.',
      path: '/register/institution',
    },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pastel-purple via-brand-cream to-pastel-pink p-4 bg-[length:200%_200%] animate-gradient-pan">
      <div className="w-full max-w-4xl text-center">
        <div
          className={`transition-all duration-1000 ${
            isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <h1 className="text-4xl font-bold tracking-tight text-brand-charcoal sm:text-5xl">
            How will you be using Sathi.care?
          </h1>
          <p className="mt-4 text-lg text-gray-700">
            Choose the path that's right for you.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {roleOptions.map((option, index) => (
            <Link
              key={option.role}
              to={option.path}
              className={`block rounded-2xl bg-white/50 p-8 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5 transition-all duration-500 hover:scale-105 hover:shadow-cyan-500/10 ${
                isMounted
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-5'
              }`}
              style={{ transitionDelay: `${200 + index * 150}ms` }}
            >
              <h3 className="text-xl font-bold text-brand-charcoal">
                {option.title}
              </h3>
              <p className="mt-2 text-gray-600">{option.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;