import api from '../../api/axiosConfig.js';
import type { IResource } from '../../types';

const getAllResources = async (): Promise<IResource[]> => {
  const response = await api.get('/api/resources/');
  return response.data;
};

const createResource = async (resourceData: Omit<IResource, '_id' | 'addedBy'>, token: string): Promise<IResource> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await api.post('/api/resources/', resourceData, config);
  return response.data;
};


const resourceService = {
  getAllResources,
  createResource,
};

export default resourceService;