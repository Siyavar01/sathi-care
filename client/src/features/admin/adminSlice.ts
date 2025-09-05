import { create } from 'zustand';
import adminService from './adminService.ts';
import type { IUser, IProfessional } from '../../types/index.ts';

interface AdminState {
  users: IUser[];
  unverifiedProfessionals: IProfessional[];
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
  getAllUsers: (token: string) => Promise<void>;
  getUnverifiedProfessionals: (token: string) => Promise<void>;
  verifyProfessional: (professionalId: string, token: string) => Promise<void>;
  reset: () => void;
}

const useAdminStore = create<AdminState>((set) => ({
  users: [],
  unverifiedProfessionals: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
  getAllUsers: async (token) => {
    set({ isLoading: true });
    try {
      const users = await adminService.getAllUsers(token);
      set({ isLoading: false, isSuccess: true, users });
    } catch (error: any) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      set({ isLoading: false, isError: true, message });
    }
  },
  getUnverifiedProfessionals: async (token) => {
    set({ isLoading: true });
    try {
      const professionals = await adminService.getUnverifiedProfessionals(token);
      set({ isLoading: false, isSuccess: true, unverifiedProfessionals: professionals });
    } catch (error: any) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      set({ isLoading: false, isError: true, message });
    }
  },
  verifyProfessional: async (professionalId, token) => {
    set({ isLoading: true });
    try {
      await adminService.verifyProfessional(professionalId, token);
      set((state) => ({
        isLoading: false,
        isSuccess: true,
        unverifiedProfessionals: state.unverifiedProfessionals.filter(
          (p) => p._id !== professionalId
        ),
        message: 'Professional verified successfully',
      }));
    } catch (error: any) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      set({ isLoading: false, isError: true, message });
    }
  },
  reset: () => set({ isError: false, isSuccess: false, isLoading: false, message: '' }),
}));

export default useAdminStore;