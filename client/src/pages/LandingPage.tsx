import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const LandingPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [breatheIndex, setBreatheIndex] = useState(0);

  const breatheCycle = ['Breathe In', 'Hold', 'Breathe Out'];
  const cycleDurations = [4000, 2000, 4000];

  useEffect(() => {
    const mountTimer = setTimeout(() => setIsMounted(true), 100);

    let currentIndex = 0;
    const interval = setInterval(() => {
      setBreatheIndex(currentIndex);
      currentIndex = (currentIndex + 1) % breatheCycle.length;
    }, cycleDurations[currentIndex]);

    return () => {
      clearTimeout(mountTimer);
      clearInterval(interval);
    };
  }, []);

  const breatheText = breatheCycle[breatheIndex];
  const breatheAnimationClass =
    breatheText === 'Breathe In'
      ? 'scale-110'
      : breatheText === 'Breathe Out'
      ? 'scale-90'
      : 'scale-100';

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pastel-purple via-brand-cream to-pastel-pink p-4 bg-[length:200%_200%] animate-gradient-pan overflow-hidden">
      <div className="w-full max-w-5xl rounded-2xl bg-white/50 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5">
        <div className="grid md:grid-cols-2">
          <div className="flex flex-col justify-center space-y-8 p-8 md:p-12">
            <div
              className={`transition-all duration-1000 ${
                isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            >
              <div className="flex items-center">
                <span className="text-4xl font-bold tracking-tight text-brand-charcoal">
                  Sathi.care
                </span>
              </div>
            </div>

            <div
              className={`transition-all duration-1000 delay-200 ${
                isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            >
              <h1 className="text-4xl font-bold tracking-tight text-brand-charcoal sm:text-5xl">
                Find your companion on the path to wellness.
              </h1>
              <p className="mt-4 text-lg text-gray-700">
                A safe space to connect, share, and grow. Accessible mental
                healthcare for everyone.
              </p>
            </div>

            <div
              className={`pt-4 transition-all duration-1000 delay-[400ms] ${
                isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            >
              <Link
                to="/register/select-role"
                className="inline-block rounded-lg bg-pastel-pink px-8 py-4 text-center text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-pastel-pink focus:ring-offset-2"
              >
                Get Started
              </Link>
            </div>
          </div>

          <div className="relative hidden flex-col items-center justify-center space-y-6 overflow-hidden rounded-r-2xl bg-pastel-pink/10 p-8 md:flex">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-brand-charcoal">
                A Moment of Calm
              </h3>
              <p className="text-sm text-brand-charcoal/70">
                Try this simple breathing exercise.
              </p>
            </div>
            <div className="relative h-48 w-48">
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className={`h-32 w-32 rounded-full bg-pastel-purple/20 transition-transform duration-[4000ms] ease-in-out ${breatheAnimationClass}`}
                ></div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <p className="w-40 text-center text-lg font-medium text-brand-charcoal transition-opacity duration-500">
                  {breatheText}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;