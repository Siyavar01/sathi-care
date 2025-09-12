import { create } from 'zustand';
import questionnaireService from './questionnaireService.ts';
import useAuthStore from '../auth/authSlice';
import type { IQuestion, IUser } from '../../types';

interface QuestionnaireState {
  questions: IQuestion[];
  submissionId: string | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
  getQuestions: () => Promise<void>;
  submitAnswers: (answers: any, token: string) => Promise<void>;
  reset: () => void;
}

const useQuestionnaireStore = create<QuestionnaireState>((set) => ({
  questions: [],
  submissionId: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
  getQuestions: async () => {
    set({ isLoading: true });
    try {
      const questions = await questionnaireService.getQuestions();
      set({ isLoading: false, isSuccess: true, questions });
    } catch (error: any) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      set({ isLoading: false, isError: true, message });
    }
  },
  submitAnswers: async (answers, token) => {
    set({ isLoading: true });
    try {
      const response = await questionnaireService.submitAnswers(answers, token);

      if (response.user) {
        useAuthStore.setState({ user: response.user });
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      set({ isLoading: false, isSuccess: true, submissionId: response.submissionId });
    } catch (error: any) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      set({ isLoading: false, isError: true, message });
    }
  },
  reset: () => set({
    questions: [],
    submissionId: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  }),
}));

export default useQuestionnaireStore;