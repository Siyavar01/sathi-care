import axios from 'axios';

const API_URL = '/api/payments/';

const createOrder = async (orderData: { amount: number }, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL + 'orders', orderData, config);
  return response.data;
};

const verifyAndBookAppointment = async (paymentData: any, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL + 'verify-and-book', paymentData, config);
  return response.data;
};

const paymentService = {
  createOrder,
  verifyAndBookAppointment,
};

export default paymentService;