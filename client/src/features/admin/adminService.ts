import api from '../../api/axiosConfig.js';

const getUnverifiedProfessionals = async (token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await api.get('/api/admin/' + 'unverified-professionals', config);
  return response.data;
};

const verifyProfessional = async (professionalId: string, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await api.put(
    '/api/admin/' + `verify-professional/${professionalId}`,
    {},
    config
  );
  return response.data;
};

const getAllUsers = async (token: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await api.get('/api/admin/' + 'users', config);
    return response.data;
}

const adminService = {
  getUnverifiedProfessionals,
  verifyProfessional,
  getAllUsers,
};

export default adminService;