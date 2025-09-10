import { create } from 'zustand';
import paymentService from './paymentService.ts';

interface PaymentState {
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
  createOrder: (orderData: { amount: number }, token: string) => Promise<any>;
  verifyAndBookAppointment: (paymentData: any, token: string) => Promise<any>;
  reset: () => void;
}

const usePaymentStore = create<PaymentState>((set) => ({
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
  createOrder: async (orderData, token) => {
    set({ isLoading: true });
    try {
      const order = await paymentService.createOrder(orderData, token);
      set({ isLoading: false });
      return order;
    } catch (error: any) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      set({ isLoading: false, isError: true, message });
      throw new Error(message);
    }
  },
  verifyAndBookAppointment: async (paymentData, token) => {
    set({ isLoading: true });
    try {
      const result = await paymentService.verifyAndBookAppointment(paymentData, token);
      set({ isLoading: false, isSuccess: true, message: result.message });
      return result;
    } catch (error: any) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      set({ isLoading: false, isError: true, message });
      throw new Error(message);
    }
  },
  reset: () => set({ isError: false, isSuccess: false, isLoading: false, message: '' }),
}));

export default usePaymentStore;