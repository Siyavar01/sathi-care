import { useEffect, useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../features/auth/authSlice';
import useProfessionalStore from '../features/professional/professionalSlice';
import useAppointmentStore from '../features/appointment/appointmentSlice';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format, isSameDay } from 'date-fns';
import type { IConnectionRequest } from '../types';
import { Dialog, Transition } from '@headlessui/react';

const ProfessionalDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    incomingRequests,
    isLoading: isRequestsLoading,
    isError: isRequestsError,
    isSuccess: isRequestsSuccess,
    message: requestsMessage,
    getIncomingConnectionRequests,
    updateConnectionRequestStatus,
    reset: resetProf,
  } = useProfessionalStore();

  const {
    appointments,
    isLoading: isApptsLoading,
    isError: isApptsError,
    message: apptsMessage,
    getMyAppointments,
    reset: resetAppt,
  } = useAppointmentStore();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedRequest, setSelectedRequest] = useState<IConnectionRequest | null>(null);
  const today = new Date();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'professional') {
      toast.error('You are not authorized to view this page.');
      navigate('/');
      return;
    }

    if (user.token) {
      getIncomingConnectionRequests(user.token);
      getMyAppointments(user.token);
    }

    return () => {
      resetProf();
      resetAppt();
    };
  }, [user, navigate, getIncomingConnectionRequests, getMyAppointments, resetProf, resetAppt]);

  useEffect(() => {
      if(isRequestsError) toast.error(requestsMessage);
      if(isApptsError) toast.error(apptsMessage);
      if(isRequestsSuccess && requestsMessage) {
          toast.success(requestsMessage);
          resetProf();
      }
  }, [isRequestsError, isApptsError, isRequestsSuccess, requestsMessage, apptsMessage, resetProf]);

  const handleStatusUpdate = (requestId: string, status: 'accepted' | 'declined') => {
    if (user?.token) {
      updateConnectionRequestStatus(requestId, status, user.token);
    }
  };

  const appointmentDates = appointments.map(appt => new Date(appt.appointmentDate));
  const appointmentsForSelectedDay = appointments.filter(appt => selectedDate && isSameDay(new Date(appt.appointmentDate), selectedDate));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-pastel-purple via-brand-cream to-pastel-pink p-4 sm:p-6 lg:p-8 bg-[length:200%_200%] animate-gradient-pan">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="rounded-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5">
            <h1 className="text-3xl font-bold tracking-tight text-brand-charcoal">
              Professional Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Welcome, {user?.name}. Manage your schedule and outreach here.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 rounded-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5">
              <h2 className="text-xl font-semibold text-brand-charcoal">Incoming Outreach Requests</h2>
              <div className="mt-4 overflow-x-auto">
                 {isRequestsLoading ? <p>Loading requests...</p> : incomingRequests.length === 0 ? <p className="text-gray-500">You have no new outreach requests.</p> : (
                     <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                          <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Institution</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Message</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                              {incomingRequests.map((req: IConnectionRequest) => (
                                <tr key={req._id}>
                                  <td className="py-4 pl-4 pr-3 text-sm sm:pl-6">
                                    <div className="font-medium text-gray-900">{req.institution.institutionName}</div>
                                    <div className="text-gray-500">{req.institution.user.email}</div>
                                  </td>
                                  <td className="px-3 py-4 text-sm">
                                    <button onClick={() => setSelectedRequest(req)} className="text-pastel-purple hover:underline">View Message</button>
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 capitalize ${getStatusColor(req.status)}`}>
                                      {req.status}
                                    </span>
                                  </td>
                                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-2">
                                    {req.status === 'pending' ? (
                                      <>
                                        <button onClick={() => handleStatusUpdate(req._id, 'accepted')} disabled={isRequestsLoading} className="rounded-md bg-green-600 px-3 py-1.5 text-white shadow-sm hover:bg-green-700 disabled:opacity-50">Accept</button>
                                        <button onClick={() => handleStatusUpdate(req._id, 'declined')} disabled={isRequestsLoading} className="rounded-md bg-red-600 px-3 py-1.5 text-white shadow-sm hover:bg-red-700 disabled:opacity-50">Decline</button>
                                      </>
                                    ) : (
                                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Action Taken</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                     </div>
                 )}
              </div>
            </div>

            <div className="lg:col-span-1 rounded-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5">
              <h2 className="text-xl font-semibold text-brand-charcoal">My Schedule</h2>
              <div className="mt-4 flex justify-center">
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  modifiers={{ booked: appointmentDates }}
                  disabled={{ before: today }}
                  modifiersClassNames={{ booked: 'bg-pastel-pink text-white rounded-full' }}
                />
              </div>
               <div className="mt-4 border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-brand-charcoal">Appointments for {selectedDate?.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
                {isApptsLoading ? <p>Loading...</p> : appointmentsForSelectedDay.length > 0 ? (
                  <ul className="mt-2 space-y-2">
                    {appointmentsForSelectedDay.map(appt => (
                      <li key={appt._id} className="text-sm p-3 rounded-lg bg-pastel-purple/10">
                        <p className="font-semibold text-brand-charcoal">{format(new Date(appt.appointmentDate), 'h:mm a')} with {appt.user.name}</p>
                        <p className="text-xs text-gray-600">{appt.sessionDetails.type} ({appt.sessionDetails.duration} min)</p>
                        <a href={appt.videoRoomUrl} target="_blank" rel="noopener noreferrer" className="text-pastel-purple font-semibold hover:underline text-xs">Join Video Call</a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-gray-500">No appointments for this day.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Transition appear show={!!selectedRequest} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setSelectedRequest(null)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Message from {selectedRequest?.institution.institutionName}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 whitespace-pre-wrap">{selectedRequest?.message}</p>
                  </div>
                  <div className="mt-4">
                    <button type="button" className="inline-flex justify-center rounded-md border border-transparent bg-pastel-purple/20 px-4 py-2 text-sm font-medium text-pastel-purple hover:bg-pastel-purple/30" onClick={() => setSelectedRequest(null)}>
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ProfessionalDashboardPage;