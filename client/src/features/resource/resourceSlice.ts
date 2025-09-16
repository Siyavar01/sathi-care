import { create } from 'zustand';
import resourceService from './resourceService';
import type { IResource } from '../../types';

interface ResourceState {
  resources: IResource[];
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
  getAllResources: () => Promise<void>;
  createResource: (resourceData: Omit<IResource, '_id' | 'addedBy' | 'createdAt'>, token: string) => Promise<void>;
  reset: () => void;
}

const useResourceStore = create<ResourceState>((set) => ({
  resources: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',

  getAllResources: async () => {
    set({ isLoading: true });
    try {
      const resources = await resourceService.getAllResources();
      set({ isLoading: false, isSuccess: true, resources });
    } catch (error: any) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      set({ isLoading: false, isError: true, message });
    }
  },

  createResource: async (resourceData, token) => {
    set({ isLoading: true });
    try {
      const newResource = await resourceService.createResource(resourceData, token);
      set((state) => ({
        isLoading: false,
        isSuccess: true,
        resources: [...state.resources, newResource],
        message: 'Resource created successfully.',
      }));
    } catch (error: any) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      set({ isLoading: false, isError: true, message });
    }
  },

  reset: () => set({ isError: false, isSuccess: false, isLoading: false, message: '' }),
}));

export default useResourceStore;