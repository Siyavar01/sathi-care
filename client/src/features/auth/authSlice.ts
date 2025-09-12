import { create } from 'zustand';
import authService from './authService';
import useQuestionnaireStore from '../questionnaire/questionnaireSlice';
import type { IUser } from '../../types';

interface AuthState {
  user: IUser | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
  register: (userData: any) => Promise<IUser | null>;
  registerAndSubmit: (userData: any) => Promise<IUser | null>;
  login: (userData: any) => Promise<void>;
  logout: () => void;
  reset: () => void;
}

const userFromStorage = localStorage.getItem('user');
const user = userFromStorage ? JSON.parse(userFromStorage) : null;

const useAuthStore = create<AuthState>((set) => ({
  user: user,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
  register: async (userData) => {
    set({ isLoading: true });
    try {
      const user = await authService.register(userData);
      set({ isLoading: false, isSuccess: true, user });
      return user;
    } catch (error: any) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      set({ isLoading: false, isError: true, message });
      return null;
    }
  },
  registerAndSubmit: async (userData) => {
    set({ isLoading: true });
    try {
      const user = await authService.registerAndSubmit(userData);
      useQuestionnaireStore.setState({ submissionId: user.latestSubmissionId });
      set({ isLoading: false, isSuccess: true, user });
      return user;
    } catch (error: any) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      set({ isLoading: false, isError: true, message });
      return null;
    }
  },
  login: async (userData) => {
    set({ isLoading: true });
    try {
      const user = await authService.login(userData);
      set({ isLoading: false, isSuccess: true, user });
    } catch (error: any) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      set({ isLoading: false, isError: true, message });
    }
  },
  logout: () => {
    authService.logout();
    set({ user: null, isSuccess: false });
  },
  reset: () => {
    set({
      isError: false,
      isSuccess: false,
      isLoading: false,
      message: '',
    });
  },
}));

export default useAuthStore;