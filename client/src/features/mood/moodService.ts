import api from '../../api/axiosConfig.js';
import type { IMoodEntry } from '../../types';

const createMoodEntry = async (entryData: { rating: number; notes?: string }, token: string): Promise<IMoodEntry> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await api.post('/api/moods/', entryData, config);
  return response.data;
};

const getMyMoodEntries = async (token: string): Promise<IMoodEntry[]> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await api.get('/api/moods/' + 'my', config);
    return response.data;
}

const moodService = {
  createMoodEntry,
  getMyMoodEntries,
};

export default moodService;