import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../features/auth/authSlice';
import useInstitutionStore from '../features/institution/institutionSlice';
import logoSrc from '../assets/logo-main.png';

const InstitutionRegisterPage = () => {
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const institutionStore = useInstitutionStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    institutionName: '',
    address: '',
    contactPerson: '',
    contactEmail: '',
    website: '',
  });

  const {
    name,
    email,
    password,
    institutionName,
    address,
    contactPerson,
    contactEmail,
    website,
  } = formData;

  useEffect(() => {
    if (authStore.isSuccess && authStore.user?.role === 'institution') {
      const profileData = { institutionName, address, contactPerson, contactEmail, website };
      institutionStore.createOrUpdateProfile(profileData, authStore.user.token);
    }
  }, [authStore.isSuccess, authStore.user]);

  useEffect(() => {
    if (institutionStore.isSuccess) {
      navigate('/professionals');
    }

    if(authStore.isError) {
        toast.error(authStore.message);
    }
    if(institutionStore.isError){
        toast.error(institutionStore.message);
    }

    return () => {
        authStore.reset();
        institutionStore.reset();
    }
  }, [institutionStore.isSuccess, authStore.isError, institutionStore.isError, navigate]);


  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const userData = { name, email, password, role: 'institution' };
    authStore.register(userData);
  };

  const isLoading = authStore.isLoading || institutionStore.isLoading;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pastel-purple via-brand-cream to-pastel-pink p-4 bg-[length:200%_200%] animate-gradient-pan">
      <div className="w-full max-w-lg space-y-8 rounded-2xl bg-white/50 p-8 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5 md:p-12">
        <div className="text-center">
          <img
            src={logoSrc}
            alt="Sathi.care Logo"
            className="mx-auto h-12 w-auto"
          />
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-brand-charcoal">
            Institutional Registration
          </h2>
          <p className="mt-2 text-gray-700">
            Join Sathi.care to connect with our network of professionals.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
            <fieldset className="space-y-4">
                <legend className="text-lg font-semibold text-brand-charcoal">Account Details</legend>
                 <input
                    name="name"
                    type="text"
                    value={name}
                    onChange={onChange}
                    required
                    className="relative block w-full appearance-none rounded-lg border border-gray-300/50 bg-white/70 px-4 py-3 text-brand-charcoal placeholder-gray-500 transition-shadow duration-200 focus:border-pastel-purple focus:outline-none focus:ring-1 focus:ring-pastel-purple sm:text-sm"
                    placeholder="Your Full Name (e.g., School Counselor's Name)"
                />
                 <input
                    name="email"
                    type="email"
                    value={email}
                    onChange={onChange}
                    required
                    className="relative block w-full appearance-none rounded-lg border border-gray-300/50 bg-white/70 px-4 py-3 text-brand-charcoal placeholder-gray-500 transition-shadow duration-200 focus:border-pastel-purple focus:outline-none focus:ring-1 focus:ring-pastel-purple sm:text-sm"
                    placeholder="Login Email Address"
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
            </fieldset>

            <fieldset className="space-y-4">
                <legend className="text-lg font-semibold text-brand-charcoal">Institution Details</legend>
                 <input
                    name="institutionName"
                    type="text"
                    value={institutionName}
                    onChange={onChange}
                    required
                    className="relative block w-full appearance-none rounded-lg border border-gray-300/50 bg-white/70 px-4 py-3 text-brand-charcoal placeholder-gray-500 transition-shadow duration-200 focus:border-pastel-purple focus:outline-none focus:ring-1 focus:ring-pastel-purple sm:text-sm"
                    placeholder="Institution Name (e.g., Delhi Public School)"
                />
                <textarea
                    name="address"
                    rows={3}
                    value={address}
                    onChange={onChange}
                    required
                    className="relative block w-full appearance-none rounded-lg border border-gray-300/50 bg-white/70 px-4 py-3 text-brand-charcoal placeholder-gray-500 transition-shadow duration-200 focus:border-pastel-purple focus:outline-none focus:ring-1 focus:ring-pastel-purple sm:text-sm"
                    placeholder="Full Address"
                />
                 <input
                    name="contactPerson"
                    type="text"
                    value={contactPerson}
                    onChange={onChange}
                    required
                    className="relative block w-full appearance-none rounded-lg border border-gray-300/50 bg-white/70 px-4 py-3 text-brand-charcoal placeholder-gray-500 transition-shadow duration-200 focus:border-pastel-purple focus:outline-none focus:ring-1 focus:ring-pastel-purple sm:text-sm"
                    placeholder="Contact Person's Name"
                />
                <input
                    name="contactEmail"
                    type="email"
                    value={contactEmail}
                    onChange={onChange}
                    required
                    className="relative block w-full appearance-none rounded-lg border border-gray-300/50 bg-white/70 px-4 py-3 text-brand-charcoal placeholder-gray-500 transition-shadow duration-200 focus:border-pastel-purple focus:outline-none focus:ring-1 focus:ring-pastel-purple sm:text-sm"
                    placeholder="Official Contact Email"
                />
                 <input
                    name="website"
                    type="url"
                    value={website}
                    onChange={onChange}
                    className="relative block w-full appearance-none rounded-lg border border-gray-300/50 bg-white/70 px-4 py-3 text-brand-charcoal placeholder-gray-500 transition-shadow duration-200 focus:border-pastel-purple focus:outline-none focus:ring-1 focus:ring-pastel-purple sm:text-sm"
                    placeholder="Website (Optional)"
                />
            </fieldset>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-lg border border-transparent bg-pastel-pink px-4 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-pastel-pink focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-pastel-pink/70"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InstitutionRegisterPage;