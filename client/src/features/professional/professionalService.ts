import axios from 'axios';

const API_URL = '/api/professionals/';

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

const uploadProfilePicture = async (file: File, token: string) => {
  const formData = new FormData();
  formData.append('profilePicture', file);

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(
    API_URL + 'profile/upload-picture',
    formData,
    config
  );
  return response.data;
};

const uploadCredential = async (
  credentialData: { file: File; name: string },
  token: string
) => {
  const formData = new FormData();
  formData.append('credential', credentialData.file);
  formData.append('credentialName', credentialData.name);

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(
    API_URL + 'credentials/upload',
    formData,
    config
  );
  return response.data;
};

const professionalService = {
  createOrUpdateProfile,
  getMyProfile,
  uploadProfilePicture,
  uploadCredential,
};

export default professionalService;