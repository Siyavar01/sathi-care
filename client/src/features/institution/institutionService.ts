import api from '../../api/axiosConfig.js';

const createOrUpdateProfile = async (profileData: any, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await api.post('/api/institutions/' + 'profile', profileData, config);
  return response.data;
};

const getMyProfile = async (token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await api.get('/api/institutions/' + 'profile/me', config);
  return response.data;
};

const createConnectionRequest = async (requestData: { professionalId: string; message: string }, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await api.post('/api/institutions/' + 'connect', requestData, config);
  return response.data;
};

const getMyConnectionRequests = async (token: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await api.get('/api/institutions/' + 'requests', config);
    return response.data;
}

const institutionService = {
  createOrUpdateProfile,
  getMyProfile,
  createConnectionRequest,
  getMyConnectionRequests,
};

export default institutionService;