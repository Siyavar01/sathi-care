import { create } from 'zustand';
import aiService from './aiService';

interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface AIState {
  history: ChatMessage[];
  isError: boolean;
  isLoading: boolean;
  message: string;
  sendMessage: (history: ChatMessage[], token: string) => Promise<void>;
  reset: () => void;
}

const useAIStore = create<AIState>((set, get) => ({
  history: [],
  isError: false,
  isLoading: false,
  message: '',
  sendMessage: async (history, token) => {
    set({ isLoading: true, isError: false, message: '' });
    try {
      const response = await aiService.chatWithAI(history, token);
      const newHistory = [
        ...history,
        { role: 'model' as const, parts: [{ text: response.response }] },
      ];
      set({ isLoading: false, history: newHistory });
    } catch (error: any) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      set({ isLoading: false, isError: true, message });
    }
  },
  reset: () => set({ history: [], isError: false, isLoading: false, message: '' }),
}));

export default useAIStore;