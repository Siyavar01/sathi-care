import axios from 'axios';

const API_URL = '/api/institutions/';

const createOrUpdateProfile = async (profileData: any, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL + 'profile', profileData, config);
  return response.data;
};

const getMyProfile = async (token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + 'profile/me', config);
  return response.data;
};

const createConnectionRequest = async (requestData: { professionalId: string; message: string }, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL + 'connect', requestData, config);
  return response.data;
};

const getMyConnectionRequests = async (token: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(API_URL + 'requests', config);
    return response.data;
}

const institutionService = {
  createOrUpdateProfile,
  getMyProfile,
  createConnectionRequest,
  getMyConnectionRequests,
};

export default institutionService;