import { useEffect, useState, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../features/auth/authSlice';
import useProfessionalStore from '../features/professional/professionalSlice';
import useInstitutionStore from '../features/institution/institutionSlice';

const ProfessionalConnectPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    publicProfile,
    isLoading: isProfileLoading,
    isError: isProfileError,
    message: profileMessage,
    getProfessionalById,
    reset: resetProfessional,
  } = useProfessionalStore();

  const {
    isLoading: isRequestLoading,
    isError: isRequestError,
    isSuccess: isRequestSuccess,
    message: requestMessage,
    createConnectionRequest,
    reset: resetInstitution,
  } = useInstitutionStore();

  const [message, setMessage] = useState('');

  useEffect(() => {
    if (id) {
      getProfessionalById(id);
    }
    return () => {
      resetProfessional();
      resetInstitution();
    };
  }, [id, getProfessionalById, resetProfessional, resetInstitution]);

  useEffect(() => {
    if (isProfileError) {
      toast.error(profileMessage);
      navigate('/professionals');
    }
    if (isRequestError) {
      toast.error(requestMessage);
    }
    if (isRequestSuccess) {
      toast.success('Connection request sent successfully!');
      navigate('/institution/dashboard');
    }
  }, [isProfileError, isRequestError, isRequestSuccess, profileMessage, requestMessage, navigate]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (user?.token && id && message) {
      const requestData = { professionalId: id, message };
      createConnectionRequest(requestData, user.token);
    } else {
      toast.error('Please write a message before sending.');
    }
  };

  if (isProfileLoading || !publicProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-cream">
        <p className="text-lg text-brand-charcoal">Loading professional details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-purple via-brand-cream to-pastel-pink p-4 sm:p-6 lg:p-8 bg-[length:200%_200%] animate-gradient-pan">
      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5">
            <div className="flex flex-col items-start gap-6 sm:flex-row">
              <img
                src={publicProfile.profilePictureUrl}
                alt={`Dr. ${publicProfile.user.name}`}
                className="h-32 w-32 flex-shrink-0 rounded-full object-cover shadow-lg"
              />
              <div className="flex-grow">
                <h1 className="text-4xl font-bold tracking-tight text-brand-charcoal">
                  {publicProfile.user.name}
                </h1>
                <p className="mt-1 text-xl font-semibold text-pastel-purple">
                  {publicProfile.title}
                </p>
                <a href={`mailto:${publicProfile.user.email}`} className="mt-2 text-sm text-gray-600 hover:underline">
                  {publicProfile.user.email}
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5">
            <h2 className="text-2xl font-bold text-brand-charcoal">About Me</h2>
            <p className="mt-4 text-gray-700 whitespace-pre-wrap">{publicProfile.bio}</p>
          </div>

          <div className="rounded-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5">
            <h2 className="text-2xl font-bold text-brand-charcoal">Expertise & Details</h2>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-gray-200 pt-6">
              <div>
                <h3 className="font-semibold text-brand-charcoal">Specializations</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {publicProfile.specializations.map((spec) => (
                    <span key={spec} className="rounded-full bg-pastel-purple/20 px-3 py-1 text-sm font-medium text-pastel-purple">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
               <div>
                <h3 className="font-semibold text-brand-charcoal">Languages Spoken</h3>
                <p className="mt-2 text-gray-700">{publicProfile.languages.join(', ')}</p>
              </div>
              <div>
                <h3 className="font-semibold text-brand-charcoal">Years of Experience</h3>
                <p className="mt-2 text-gray-700">{publicProfile.experience} years</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-28 rounded-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5">
            <h2 className="text-2xl font-bold text-brand-charcoal">
              Send Connection Request
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Your message will be sent to Dr. {publicProfile.user.name.split(' ')[1]}. They will respond to you via email if they are interested.
            </p>
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="message" className="sr-only">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={8}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-pastel-purple focus:ring-pastel-purple sm:text-sm"
                  placeholder={`e.g., Hello Dr. ${publicProfile.user.name.split(' ')[1]}, we are from [Your Institution Name]...`}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isRequestLoading}
                  className="w-full rounded-lg bg-pastel-purple px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:ring-offset-2 disabled:cursor-not-allowed"
                >
                  {isRequestLoading ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalConnectPage;