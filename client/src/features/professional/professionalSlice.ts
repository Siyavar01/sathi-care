import { create } from 'zustand';
import professionalService from './professionalService.ts';
import type { IProfessional } from '../../types/index.ts';

interface ProfessionalState {
  profile: IProfessional | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
  createOrUpdateProfile: (profileData: any, token: string) => Promise<void>;
  getMyProfile: (token: string) => Promise<void>;
  uploadProfilePicture: (file: File, token: string) => Promise<void>;
  uploadCredential: (credentialData: { file: File; name: string }, token: string) => Promise<void>;
  reset: () => void;
}

const useProfessionalStore = create<ProfessionalState>((set) => ({
  profile: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
  createOrUpdateProfile: async (profileData, token) => {
    set({ isLoading: true, isError: false, isSuccess: false, message: '' });
    try {
      const profile = await professionalService.createOrUpdateProfile(profileData, token);
      set({ isLoading: false, isSuccess: true, profile, message: 'Profile updated' });
    } catch (error: any) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      set({ isLoading: false, isError: true, message });
    }
  },
  getMyProfile: async (token) => {
    set({ isLoading: true, isError: false, isSuccess: false, message: '' });
    try {
      const profile = await professionalService.getMyProfile(token);
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
  uploadProfilePicture: async (file, token) => {
    set({ isLoading: true, isError: false, isSuccess: false, message: '' });
    try {
      const profile = await professionalService.uploadProfilePicture(file, token);
      set({ isLoading: false, isSuccess: true, profile, message: 'Picture uploaded' });
    } catch (error: any) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      set({ isLoading: false, isError: true, message });
    }
  },
  uploadCredential: async (credentialData, token) => {
    set({ isLoading: true, isError: false, isSuccess: false, message: '' });
    try {
      const profile = await professionalService.uploadCredential(credentialData, token);
      set({ isLoading: false, isSuccess: true, profile, message: 'Credential uploaded' });
    } catch (error: any) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      set({ isLoading: false, isError: true, message });
    }
  },
  reset: () => set({ isError: false, isSuccess: false, isLoading: false, message: '' }),
}));

export default useProfessionalStore;