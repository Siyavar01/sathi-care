import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../features/auth/authSlice';
import useProfessionalStore from '../features/professional/professionalSlice';
import useAppointmentStore from '../features/appointment/appointmentSlice';
import usePaymentStore from '../features/payment/paymentSlice';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { addMonths, format, parse, addMinutes, isBefore } from 'date-fns';
import type { IAppointment } from '../types';

const ProfessionalDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { publicProfile: professional, isLoading: isProfileLoading, isError, message, getProfessionalById, reset: resetProf } = useProfessionalStore();
  const { createAppointment, getAppointmentsByProfessional, bookedSlots, isError: isBookingError, message: bookingMessage, reset: resetAppt } = useAppointmentStore();
  const { createOrder, verifyAndBookAppointment, isLoading: isPaymentLoading, isError: isPaymentError, message: paymentMessage, reset: resetPayment } = usePaymentStore();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<any>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextMonth = addMonths(new Date(), 1);

  useEffect(() => {
    if (id) {
      getProfessionalById(id);
      getAppointmentsByProfessional(id);
    }
    return () => {
      resetProf();
      resetAppt();
      resetPayment();
    };
  }, [id, getProfessionalById, getAppointmentsByProfessional, resetProf, resetAppt, resetPayment]);

  useEffect(() => {
    if (isError) toast.error(message);
    if (isBookingError) toast.error(bookingMessage);
    if (isPaymentError) toast.error(paymentMessage);
  }, [isError, isPaymentError, isBookingError, message, paymentMessage]);

  useEffect(() => {
    setSelectedTimeSlot(null);
  }, [selectedDate]);

  const generatedTimeSlots = useMemo(() => {
    if (!professional || !selectedDate) return [];
    const dayOfWeek = format(selectedDate, 'EEEE');
    const dayAvailability = professional.availability.find(a => a.day === dayOfWeek);
    if (!dayAvailability) return [];

    const slots = [];
    for (const timeBlock of dayAvailability.timeSlots) {
      const sessionDetails = professional.sessionTypes.find(st => st._id === timeBlock.sessionTypeId);
      if (!sessionDetails) continue;

      const duration = sessionDetails.duration;
      let currentSlotTime = parse(`${format(selectedDate, 'yyyy-MM-dd')} ${timeBlock.startTime}`, 'yyyy-MM-dd HH:mm', new Date());
      const endBlockTime = parse(`${format(selectedDate, 'yyyy-MM-dd')} ${timeBlock.endTime}`, 'yyyy-MM-dd HH:mm', new Date());

      while (isBefore(addMinutes(currentSlotTime, duration), addMinutes(endBlockTime, 1))) {
        slots.push({
          startTime: format(currentSlotTime, 'HH:mm'),
          endTime: format(addMinutes(currentSlotTime, duration), 'HH:mm'),
          sessionDetails: sessionDetails,
        });
        currentSlotTime = addMinutes(currentSlotTime, duration);
      }
    }
    return slots;
  }, [professional, selectedDate]);

  const handleBookSession = async () => {
    if (!user) {
      toast.error('You must be logged in to book a session.');
      navigate('/login');
      return;
    }
    if (user.role !== 'user') {
      toast.error('Only users can book sessions.');
      return;
    }
    if (selectedTimeSlot && selectedDate && id) {
      const { sessionDetails } = selectedTimeSlot;
      const appointmentDate = parse(`${format(selectedDate, 'yyyy-MM-dd')} ${selectedTimeSlot.startTime}`, 'yyyy-MM-dd HH:mm', new Date());

      const appointmentData = {
        professionalId: id,
        sessionDetails,
        appointmentDate,
      };

      if (sessionDetails.isProBono) {
        const result = await createAppointment(appointmentData, user.token);
        if (result) {
          toast.success('Pro bono session booked successfully!');
          navigate('/user/dashboard');
        }
      } else {
        const toastId = toast.loading('Redirecting to payment...');
        try {
          const order = await createOrder({ amount: sessionDetails.price }, user.token);
          toast.dismiss(toastId);

          const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: 'Sathi.care',
            description: `Booking for ${sessionDetails.type}`,
            image: '/logo.png',
            order_id: order.id,
            handler: async function (response: any) {
              const paymentData = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                appointmentData,
              };
              const result = await verifyAndBookAppointment(paymentData, user.token);
              if (result) {
                toast.success('Payment successful! Your appointment is confirmed.');
                navigate('/user/dashboard');
              }
            },
            modal: {
              ondismiss: function () {
                toast.error('Payment was cancelled.');
              },
            },
            prefill: { name: user.name, email: user.email },
            theme: { color: '#A093E2' },
          };
          const rzp1 = new (window as any).Razorpay(options);
          rzp1.open();
        } catch (error) {
          toast.error('Could not initiate payment.', { id: toastId });
        }
      }
    } else {
      toast.error('Please select a date and a time slot.');
    }
  };

  if (isProfileLoading || !professional) {
    return <div className="flex min-h-screen items-center justify-center bg-brand-cream"><p className="text-lg text-brand-charcoal">Loading professional details...</p></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-purple via-brand-cream to-pastel-pink p-4 sm:p-6 lg:p-8 bg-[length:200%_200%] animate-gradient-pan">
      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5">
            <div className="flex flex-col items-start gap-6 sm:flex-row">
              <img src={professional.profilePictureUrl} alt={`Dr. ${professional.user.name}`} className="h-32 w-32 flex-shrink-0 rounded-full object-cover shadow-lg" />
              <div className="flex-grow">
                <h1 className="text-4xl font-bold tracking-tight text-brand-charcoal">{professional.user.name}</h1>
                <p className="mt-1 text-xl font-semibold text-pastel-purple">{professional.title}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {professional.specializations.map((spec) => <span key={spec} className="rounded-full bg-pastel-purple/20 px-3 py-1 text-sm font-medium text-pastel-purple">{spec}</span>)}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5">
            <h2 className="text-2xl font-bold text-brand-charcoal">About Me</h2>
            <p className="mt-4 text-gray-700 whitespace-pre-wrap">{professional.bio}</p>
          </div>

          <div className="rounded-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5">
            <h2 className="text-2xl font-bold text-brand-charcoal">Details & Expertise</h2>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 border-t border-gray-200 pt-6">
               <div className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0 text-gray-400 mr-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg><div><h3 className="font-semibold text-brand-charcoal">Experience</h3><p className="text-gray-700">{professional.experience} years</p></div></div>
               <div className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0 text-gray-400 mr-3" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 00-6 6c0 1.887.645 3.65 1.758 5.042a.5.5 0 01.1 0l.003.002.002.002.002.002a.5.5 0 00.34.152h7.6a.5.5 0 00.34-.152l.002-.002.002-.002.003-.002a.5.5 0 01.1 0C15.355 11.65 16 9.887 16 8a6 6 0 00-6-6zm0 11.5a4.5 4.5 0 100-9 4.5 4.5 0 000 9z" /><path d="M4.08 13.372A7.5 7.5 0 0010 15.5a7.5 7.5 0 005.92-2.128.5.5 0 00-.638-.772A6.5 6.5 0 114.718 12.6a.5.5 0 00-.638.772z" /></svg><div><h3 className="font-semibold text-brand-charcoal">Languages Spoken</h3><p className="text-gray-700">{professional.languages.join(', ')}</p></div></div>
              {professional.offersProBono && (
                 <div className="sm:col-span-2 flex items-center rounded-lg bg-green-50 p-3"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0 text-green-500 mr-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg><div><h3 className="font-semibold text-green-800">Offers Pro Bono Sessions</h3><p className="text-sm text-green-700">This professional may offer some services free of charge.</p></div></div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-28 rounded-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5">
            <h2 className="text-2xl font-bold text-brand-charcoal">Book a Session</h2>
            <p className="mt-1 text-sm text-gray-600">Select an available date to see time slots.</p>
            <div className="mt-6 flex justify-center">
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                fromDate={today}
                toDate={nextMonth}
                disabled={{ before: today }}
                styles={{
                    caption: { color: '#A093E2' },
                    head: { color: '#3A3A3A' },
                }}
              />
            </div>

            <div className="mt-4 border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-brand-charcoal">Available Times for {selectedDate?.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {generatedTimeSlots.length > 0 ? (
                  generatedTimeSlots.map((slot, index) => {
                    const slotDateTime = parse(`${format(selectedDate!, 'yyyy-MM-dd')} ${slot.startTime}`, 'yyyy-MM-dd HH:mm', new Date());
                    const isBooked = bookedSlots.includes(slotDateTime.toISOString());

                    return (
                      <button key={index} onClick={() => setSelectedTimeSlot(slot)} disabled={isBooked} className={`rounded-lg p-2 text-center text-sm font-semibold transition-colors duration-200 ${isBooked ? 'bg-gray-200 text-gray-400 cursor-not-allowed line-through' : selectedTimeSlot === slot ? 'bg-pastel-pink text-white ring-2 ring-white' : 'bg-pastel-purple/20 text-pastel-purple hover:bg-pastel-purple/40'}`}>
                        {slot.startTime}
                        <span className="block text-xs">{slot.sessionDetails.type} ({slot.sessionDetails.duration} min)</span>
                      </button>
                    );
                  })
                ) : (
                  <p className="col-span-2 text-center text-sm text-gray-500">No available slots on this day.</p>
                )}
              </div>
            </div>

            {selectedTimeSlot && (
              <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="flex justify-between font-semibold text-brand-charcoal">
                  <span>Selected Session:</span>
                  <span>{selectedTimeSlot.sessionDetails.type}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Price:</span>
                  <span>₹ {selectedTimeSlot.sessionDetails.price}</span>
                </div>
                 <button onClick={handleBookSession} disabled={isPaymentLoading} className="mt-4 w-full rounded-lg bg-pastel-pink px-4 py-3 font-semibold text-white shadow-md transition-transform duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:bg-pastel-pink/70">
                    {isPaymentLoading ? 'Processing...' : 'Confirm & Book Session'}
                 </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDetailPage;