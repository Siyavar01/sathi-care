import axios from 'axios';

const API_URL = '/api/professionals/';
const INSTITUTION_API_URL = '/api/institutions/';

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

const getAllProfessionals = async (filters: any) => {
  const params = new URLSearchParams();
  if (filters.outreach) params.append('outreach', 'true');
  if (filters.title) params.append('title', filters.title);
  if (filters.specializations) params.append('specializations', filters.specializations.join(','));
  if (filters.minExperience) params.append('minExperience', filters.minExperience);
  if (filters.languages) params.append('languages', filters.languages.join(','));
  if (filters.proBono) params.append('proBono', 'true');

  const response = await axios.get(API_URL, { params });
  return response.data;
};

const getProfessionalById = async (id: string) => {
  const response = await axios.get(API_URL + id);
  return response.data;
};

const createConnectionRequest = async (requestData: { professionalId: string; message: string }, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(INSTITUTION_API_URL + 'connect', requestData, config);
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

const getIncomingConnectionRequests = async (token: string) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.get(API_URL + 'requests/incoming', config);
  return response.data;
};

const updateConnectionRequestStatus = async (requestId: string, status: 'accepted' | 'declined', token: string) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.put(API_URL + `requests/${requestId}`, { status }, config);
  return response.data;
};

const matchProfessionals = async (submissionId: string, token: string) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.post(API_URL + 'match', { submissionId }, config);
    return response.data;
}

const professionalService = {
  createOrUpdateProfile,
  getMyProfile,
  getAllProfessionals,
  getProfessionalById,
  createConnectionRequest,
  uploadProfilePicture,
  uploadCredential,
  getIncomingConnectionRequests,
  updateConnectionRequestStatus,
  matchProfessionals,
};

export default professionalService;