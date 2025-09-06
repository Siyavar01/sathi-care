import { create } from 'zustand';
import professionalService from './professionalService.ts';
import type { IProfessional } from '../../types/index.ts';

interface ProfessionalListState {
  professionals: IProfessional[];
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
  getAllProfessionals: (filters: any) => Promise<void>;
  reset: () => void;
}

const useProfessionalListStore = create<ProfessionalListState>((set) => ({
  professionals: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
  getAllProfessionals: async (filters) => {
    set({ isLoading: true, isError: false, isSuccess: false, message: '' });
    try {
      const professionals = await professionalService.getAllProfessionals(
        filters
      );
      set({ isLoading: false, isSuccess: true, professionals });
    } catch (error: any) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      set({ isLoading: false, isError: true, message });
    }
  },
  reset: () =>
    set({
      professionals: [],
      isError: false,
      isSuccess: false,
      isLoading: false,
      message: '',
    }),
}));

export default useProfessionalListStore;