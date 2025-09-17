import api from '../../api/axiosConfig.js';

const createOrder = async (orderData: { amount: number }, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await api.post('/api/payments/' + 'orders', orderData, config);
  return response.data;
};

const verifyAndBookAppointment = async (paymentData: any, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await api.post('/api/payments/' + 'verify-and-book', paymentData, config);
  return response.data;
};

const paymentService = {
  createOrder,
  verifyAndBookAppointment,
};

export default paymentService;