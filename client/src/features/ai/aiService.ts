import axios from 'axios';

const API_URL = '/api/ai/';

const chatWithAI = async (history: { role: string; parts: { text: string }[] }[], token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL + 'chat', { history }, config);
  return response.data;
};


const aiService = {
  chatWithAI,
};

export default aiService;