import axios from 'axios';
import type { IResource } from '../../types';

const API_URL = '/api/resources/';

const getAllResources = async (): Promise<IResource[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

const createResource = async (resourceData: Omit<IResource, '_id' | 'addedBy'>, token: string): Promise<IResource> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, resourceData, config);
  return response.data;
};


const resourceService = {
  getAllResources,
  createResource,
};

export default resourceService;