import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../features/auth/authSlice';
import useAppointmentStore from '../features/appointment/appointmentSlice';
import useMoodStore from '../features/mood/moodSlice';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { format, isToday, startOfToday } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const UserDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { appointments, getMyAppointments, isLoading: isApptsLoading, isError: isApptsError, message: apptMessage } = useAppointmentStore();
  const { moodEntries, getMyMoodEntries, createMoodEntry, isLoading: isMoodLoading, isError: isMoodError, message: moodMessage } = useMoodStore();

  const [rating, setRating] = useState(3);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'user') {
      toast.error('You are not authorized to view this page.');
      navigate('/');
      return;
    }

    if (user.token) {
      getMyAppointments(user.token);
      getMyMoodEntries(user.token);
    }
  }, [user, navigate, getMyAppointments, getMyMoodEntries]);

  useEffect(() => {
      if(isApptsError) toast.error(apptMessage);
      if(isMoodError) toast.error(moodMessage);
  }, [isApptsError, isMoodError, apptMessage, moodMessage]);

  const upcomingAppointments = useMemo(() => {
    const today = startOfToday();
    return appointments
      .filter(appt => new Date(appt.appointmentDate) >= today)
      .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());
  }, [appointments]);

  const hasLoggedMoodToday = useMemo(() => {
    return moodEntries.some(entry => isToday(new Date(entry.entryDate)));
  }, [moodEntries]);

  const handleMoodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.token) {
        await createMoodEntry({ rating, notes }, user.token);
        setRating(3);
        setNotes('');
        toast.success("Mood entry saved!");
    }
  };

  const chartData = {
    labels: moodEntries.map(entry => format(new Date(entry.entryDate), 'MMM d')),
    datasets: [
      {
        label: 'Your Mood Rating (1-5)',
        data: moodEntries.map(entry => entry.rating),
        borderColor: '#A093E2',
        backgroundColor: 'rgba(160, 147, 226, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Your Mood Progress Over Time',
      },
    },
    scales: {
        y: {
            beginAtZero: true,
            max: 5.5,
            ticks: {
                stepSize: 1,
            }
        }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-purple via-brand-cream to-pastel-pink p-4 sm:p-6 lg:p-8 bg-[length:200%_200%] animate-gradient-pan">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5">
          <h1 className="text-3xl font-bold tracking-tight text-brand-charcoal">
            My Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {user?.name}. Here's your wellness summary.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5">
              <h2 className="text-xl font-semibold text-brand-charcoal">Upcoming Appointments</h2>
              <div className="mt-4 space-y-4">
                {isApptsLoading ? <p>Loading appointments...</p> : upcomingAppointments.length === 0 ? <p className="text-gray-500">You have no upcoming appointments.</p> : (
                  upcomingAppointments.map(appt => (
                    <div key={appt._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg border border-gray-200 bg-white/50">
                      <div>
                        <p className="font-semibold text-brand-charcoal">with {appt.professional.user.name}</p>
                        <p className="text-sm text-gray-600">{format(new Date(appt.appointmentDate), 'eeee, MMMM do, yyyy')} at {format(new Date(appt.appointmentDate), 'h:mm a')}</p>
                        <p className="text-xs text-gray-500">{appt.sessionDetails.type} ({appt.sessionDetails.duration} min)</p>
                      </div>
                      <a href={appt.videoRoomUrl} target="_blank" rel="noopener noreferrer" className="mt-2 sm:mt-0 rounded-md bg-pastel-purple px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pastel-purple/80">
                        Join Video Call
                      </a>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5">
                <h2 className="text-xl font-semibold text-brand-charcoal">Your Mood Progress</h2>
                {isMoodLoading && moodEntries.length === 0 ? <p>Loading mood data...</p> : moodEntries.length > 0 ? (
                    <div className="mt-4">
                        <Line options={chartOptions} data={chartData} />
                    </div>
                ) : <p className="mt-4 text-gray-500">Log your mood to see your progress chart.</p>}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 rounded-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5">
              <h2 className="text-xl font-semibold text-brand-charcoal">How are you feeling today?</h2>
              {hasLoggedMoodToday ? (
                <p className="mt-4 text-center text-gray-600 p-4 bg-green-50 rounded-lg">You've already logged your mood for today. Great job!</p>
              ) : (
                <form onSubmit={handleMoodSubmit} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rating (1=Bad, 5=Great): {rating}</label>
                    <input type="range" min="1" max="5" value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"/>
                  </div>
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
                    <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" placeholder="Any thoughts on your mood today?"></textarea>
                  </div>
                  <button type="submit" disabled={isMoodLoading} className="w-full rounded-lg bg-pastel-pink px-4 py-3 font-semibold text-white shadow-md transition-transform duration-200 hover:scale-105 disabled:opacity-50">
                    {isMoodLoading ? 'Saving...' : 'Save Today\'s Entry'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;