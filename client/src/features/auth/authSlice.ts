import { create } from 'zustand';
import authService from './authService';
import type { IUser } from '../../types';

const userString = localStorage.getItem('user');
const user = userString ? JSON.parse(userString) : null;

interface AuthState {
  user: IUser | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
  register: (userData: any) => Promise<void>;
  login: (userData: any) => Promise<void>;
  logout: () => void;
  reset: () => void;
}

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
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      set({ isLoading: false, isError: true, message });
    }
  },
  login: async (userData) => {
    set({ isLoading: true });
    try {
      const user = await authService.login(userData);
      set({ isLoading: false, isSuccess: true, user });
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      set({ isLoading: false, isError: true, message });
    }
  },
  logout: () => {
    authService.logout();
    set({ user: null, isSuccess: false, isError: false, message: '' });
  },
  reset: () => set({ isError: false, isSuccess: false, isLoading: false, message: '' }),
}));

export default useAuthStore;