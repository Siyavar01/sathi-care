import axios from 'axios';

const API_URL = '/api/admin/';

const getUnverifiedProfessionals = async (token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + 'unverified-professionals', config);
  return response.data;
};

const verifyProfessional = async (professionalId: string, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(
    API_URL + `verify-professional/${professionalId}`,
    {}, // No data needed in the body for this request
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
    const response = await axios.get(API_URL + 'users', config);
    return response.data;
}

const adminService = {
  getUnverifiedProfessionals,
  verifyProfessional,
  getAllUsers,
};

export default adminService;