import { create } from 'zustand';
import professionalService from './professionalService.ts';
import type { IProfessional } from '../../types/index.ts';

interface ProfessionalListState {
  professionals: IProfessional[];
  primaryConcern: string | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
  getAllProfessionals: (filters: any) => Promise<void>;
  matchProfessionals: (submissionId: string, token: string) => Promise<void>;
  reset: () => void;
}

const useProfessionalListStore = create<ProfessionalListState>((set) => ({
  professionals: [],
  primaryConcern: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
  getAllProfessionals: async (filters) => {
    set({ isLoading: true, isError: false, isSuccess: false, message: '' });
    try {
      const professionals = await professionalService.getAllProfessionals(filters);
      set({ isLoading: false, isSuccess: true, professionals, primaryConcern: null });
    } catch (error: any) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      set({ isLoading: false, isError: true, message });
    }
  },
  matchProfessionals: async (submissionId, token) => {
    set({ isLoading: true, isError: false, isSuccess: false, message: '' });
    try {
      const response = await professionalService.matchProfessionals(submissionId, token);
      set({
        isLoading: false,
        isSuccess: true,
        professionals: response.recommendations,
        primaryConcern: response.primaryConcern,
      });
    } catch (error: any) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      set({ isLoading: false, isError: true, message });
    }
  },
  reset: () =>
    set({
      professionals: [],
      primaryConcern: null,
      isError: false,
      isSuccess: false,
      isLoading: false,
      message: '',
    }),
}));

export default useProfessionalListStore;