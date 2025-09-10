import axios from 'axios';

const API_URL = '/api/appointments/';

const createAppointment = async (appointmentData: any, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, appointmentData, config);
  return response.data;
};

const getMyAppointments = async (token: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(API_URL + 'my', config);
    return response.data;
};

const getAppointmentsByProfessional = async (professionalId: string) => {
    const response = await axios.get(API_URL + `professional/${professionalId}`);
    return response.data;
}

const appointmentService = {
  createAppointment,
  getMyAppointments,
  getAppointmentsByProfessional,
};

export default appointmentService;