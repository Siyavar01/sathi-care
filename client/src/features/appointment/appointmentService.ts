import api from '../../api/axiosConfig.js';

const createAppointment = async (appointmentData: any, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await api.post('/api/appointments/', appointmentData, config);
  return response.data;
};

const getMyAppointments = async (token: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await api.get('/api/appointments/' + 'my', config);
    return response.data;
};

const getAppointmentsByProfessional = async (professionalId: string) => {
    const response = await api.get('/api/appointments/' + `professional/${professionalId}`);
    return response.data;
}

const appointmentService = {
  createAppointment,
  getMyAppointments,
  getAppointmentsByProfessional,
};

export default appointmentService;