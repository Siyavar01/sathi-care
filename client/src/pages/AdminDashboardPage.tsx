import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../features/auth/authSlice';
import useAdminStore from '../features/admin/adminSlice';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    unverifiedProfessionals,
    isLoading,
    isError,
    isSuccess,
    message,
    getUnverifiedProfessionals,
    verifyProfessional,
    reset,
  } = useAdminStore();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'admin') {
      toast.error('You are not authorized to view this page.');
      navigate('/');
      return;
    }

    if (user.token) {
      getUnverifiedProfessionals(user.token);
    }

    return () => {
      reset();
    };
  }, [user, navigate, getUnverifiedProfessionals, reset]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess && message) {
      toast.success(message);
    }
  }, [isError, isSuccess, message]);

  const handleApprove = (professionalId: string) => {
    if (user?.token) {
      verifyProfessional(professionalId, user.token);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-purple via-brand-cream to-pastel-pink p-4 sm:p-6 lg:p-8 bg-[length:200%_200%] animate-gradient-pan">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5">
          <h1 className="text-3xl font-bold tracking-tight text-brand-charcoal">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Welcome, {user?.name}. Manage the platform here.
          </p>

          <div className="mt-10">
            <h2 className="text-xl font-semibold text-brand-charcoal">
              Pending Professional Verifications
            </h2>
            <div className="mt-4 overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Credentials</th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Approve</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {isLoading && (
                        <tr>
                          <td colSpan={4} className="py-4 text-center text-gray-500">Loading...</td>
                        </tr>
                      )}
                      {!isLoading && unverifiedProfessionals.length === 0 && (
                         <tr>
                          <td colSpan={4} className="py-4 text-center text-gray-500">No pending verifications.</td>
                        </tr>
                      )}
                      {unverifiedProfessionals.map((prof) => (
                        <tr key={prof._id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{prof.user.name}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{prof.user.email}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {prof.credentials.length > 0 ? (
                              <a href={prof.credentials[0].url} target="_blank" rel="noopener noreferrer" className="text-pastel-purple hover:underline">
                                View Document
                              </a>
                            ) : (
                              'None provided'
                            )}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button
                              onClick={() => handleApprove(prof._id)}
                              className="rounded-md bg-green-600 px-3 py-1.5 text-white shadow-sm hover:bg-green-700"
                            >
                              Approve
                            </button>
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

export default AdminDashboardPage;