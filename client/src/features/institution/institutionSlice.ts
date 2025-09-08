import { create } from 'zustand';
import institutionService from './institutionService.ts';
import type { IInstitutionProfile, IConnectionRequest } from '../../types/index.ts';

interface InstitutionState {
  profile: IInstitutionProfile | null;
  requests: IConnectionRequest[];
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
  createOrUpdateProfile: (profileData: any, token: string) => Promise<void>;
  getMyProfile: (token: string) => Promise<void>;
  createConnectionRequest: (requestData: { professionalId: string; message: string }, token: string) => Promise<void>;
  getMyConnectionRequests: (token: string) => Promise<void>;
  reset: () => void;
}

const useInstitutionStore = create<InstitutionState>((set) => ({
  profile: null,
  requests: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
  createOrUpdateProfile: async (profileData, token) => {
    set({ isLoading: true, isError: false, isSuccess: false, message: '' });
    try {
      const profile = await institutionService.createOrUpdateProfile(profileData, token);
      set({ isLoading: false, isSuccess: true, profile, message: 'Profile updated successfully.' });
    } catch (error: any) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      set({ isLoading: false, isError: true, message });
    }
  },
  getMyProfile: async (token) => {
    set({ isLoading: true });
    try {
      const profile = await institutionService.getMyProfile(token);
      set({ isLoading: false, isSuccess: true, profile });
    } catch (error: any) {
      if (error.response?.status === 404) {
        set({ isLoading: false, profile: null });
      } else {
        const message = (error.response?.data?.message) || error.message || error.toString();
        set({ isLoading: false, isError: true, message });
      }
    }
  },
  createConnectionRequest: async (requestData, token) => {
    set({ isLoading: true, isError: false, isSuccess: false, message: '' });
    try {
      await institutionService.createConnectionRequest(requestData, token);
      set({ isLoading: false, isSuccess: true, message: 'Connection request sent successfully.' });
    } catch (error: any) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      set({ isLoading: false, isError: true, message });
    }
  },
    getMyConnectionRequests: async (token) => {
        set({ isLoading: true });
        try {
            const requests = await institutionService.getMyConnectionRequests(token);
            set({ isLoading: false, isSuccess: true, requests });
        } catch (error: any) {
            const message = (error.response?.data?.message) || error.message || error.toString();
            set({ isLoading: false, isError: true, message });
        }
    },
  reset: () => set({ isError: false, isSuccess: false, isLoading: false, message: '' }),
}));

export default useInstitutionStore;