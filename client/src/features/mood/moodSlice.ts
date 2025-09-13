import { create } from 'zustand';
import moodService from './moodService';
import type { IMoodEntry } from '../../types';

interface MoodState {
  moodEntries: IMoodEntry[];
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
  createMoodEntry: (entryData: { rating: number; notes?: string }, token: string) => Promise<void>;
  getMyMoodEntries: (token: string) => Promise<void>;
  reset: () => void;
}

const useMoodStore = create<MoodState>((set) => ({
  moodEntries: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
  createMoodEntry: async (entryData, token) => {
    set({ isLoading: true, isError: false, isSuccess: false, message: '' });
    try {
      const newEntry = await moodService.createMoodEntry(entryData, token);
      set((state) => ({
        isLoading: false,
        isSuccess: true,
        message: 'Mood entry saved.',
        moodEntries: [...state.moodEntries, newEntry].sort((a, b) => new Date(a.entryDate).getTime() - new Date(b.entryDate).getTime()),
      }));
    } catch (error: any) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      set({ isLoading: false, isError: true, message });
    }
  },
  getMyMoodEntries: async (token) => {
    set({ isLoading: true, isError: false, isSuccess: false, message: '' });
    try {
      const entries = await moodService.getMyMoodEntries(token);
      set({ isLoading: false, isSuccess: true, moodEntries: entries });
    } catch (error: any) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      set({ isLoading: false, isError: true, message });
    }
  },
  reset: () => set({ isError: false, isSuccess: false, isLoading: false, message: '' }),
}));

export default useMoodStore;