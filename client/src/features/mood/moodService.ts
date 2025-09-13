import axios from 'axios';
import type { IMoodEntry } from '../../types';

const API_URL = '/api/moods/';

const createMoodEntry = async (entryData: { rating: number; notes?: string }, token: string): Promise<IMoodEntry> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, entryData, config);
  return response.data;
};

const getMyMoodEntries = async (token: string): Promise<IMoodEntry[]> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(API_URL + 'my', config);
    return response.data;
}

const moodService = {
  createMoodEntry,
  getMyMoodEntries,
};

export default moodService;