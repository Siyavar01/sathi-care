import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../features/auth/authSlice';
import useInstitutionStore from '../features/institution/institutionSlice';

const InstitutionDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    profile,
    requests,
    isLoading,
    isError,
    message,
    getMyProfile,
    getMyConnectionRequests,
    reset,
  } = useInstitutionStore();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'institution') {
      toast.error('You are not authorized to view this page.');
      navigate('/');
      return;
    }

    if (isError) {
      toast.error(message);
    }

    getMyProfile(user.token);
    getMyConnectionRequests(user.token);

    return () => {
      reset();
    };
  }, [user, navigate, isError, message, getMyProfile, getMyConnectionRequests, reset]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-purple via-brand-cream to-pastel-pink p-4 sm:p-6 lg:p-8 bg-[length:200%_200%] animate-gradient-pan">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5">
          {isLoading && !profile && <p>Loading dashboard...</p>}
          {profile && (
            <>
              <h1 className="text-3xl font-bold tracking-tight text-brand-charcoal">
                {profile.institutionName} Dashboard
              </h1>
              <p className="mt-2 text-gray-600">
                Welcome, {profile.contactPerson}. Manage your outreach here.
              </p>
            </>
          )}

          <div className="mt-10">
            <h2 className="text-xl font-semibold text-brand-charcoal">
              Sent Connection Requests
            </h2>
            <div className="mt-4 overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Professional Name</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date Sent</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {isLoading && (
                        <tr>
                          <td colSpan={3} className="py-4 text-center text-gray-500">Loading requests...</td>
                        </tr>
                      )}
                      {!isLoading && requests.length === 0 && (
                         <tr>
                          <td colSpan={3} className="py-4 text-center text-gray-500">You have not sent any connection requests yet.</td>
                        </tr>
                      )}
                      {requests.map((req) => (
                        <tr key={req._id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {req.professional.user.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {new Date(req.createdAt).toLocaleDateString()}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(req.status)}`}>
                              {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionDashboardPage;