import { create } from 'zustand';
import appointmentService from './appointmentService.ts';
import type { IAppointment } from '../../types/index.ts';

interface AppointmentState {
  appointments: IAppointment[];
  bookedSlots: string[];
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
  createAppointment: (appointmentData: any, token: string) => Promise<IAppointment | null>;
  getMyAppointments: (token: string) => Promise<void>;
  getAppointmentsByProfessional: (professionalId: string) => Promise<void>;
  reset: () => void;
}

const useAppointmentStore = create<AppointmentState>((set) => ({
  appointments: [],
  bookedSlots: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
  createAppointment: async (appointmentData, token) => {
    set({ isLoading: true, isError: false, isSuccess: false, message: '' });
    try {
      const newAppointment = await appointmentService.createAppointment(appointmentData, token);
      set({ isLoading: false, isSuccess: true, message: 'Appointment created successfully.' });
      return newAppointment;
    } catch (error: any) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      set({ isLoading: false, isError: true, message });
      return null;
    }
  },
  getMyAppointments: async (token) => {
    set({ isLoading: true });
    try {
      const appointments = await appointmentService.getMyAppointments(token);
      set({ isLoading: false, isSuccess: true, appointments });
    } catch (error: any) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      set({ isLoading: false, isError: true, message });
    }
  },
  getAppointmentsByProfessional: async (professionalId: string) => {
    set({ isLoading: true });
    try {
      const appointments = await appointmentService.getAppointmentsByProfessional(professionalId);
      const bookedDateStrings = appointments.map((appt: IAppointment) => new Date(appt.appointmentDate).toISOString());
      set({ isLoading: false, bookedSlots: bookedDateStrings });
    } catch (error: any) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      set({ isLoading: false, isError: true, message });
    }
  },
  reset: () => set({ isError: false, isSuccess: false, isLoading: false, message: '' }),
}));

export default useAppointmentStore;