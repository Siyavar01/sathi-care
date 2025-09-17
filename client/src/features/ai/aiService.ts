import api from '../../api/axiosConfig.js';

const chatWithAI = async (history: { role: string; parts: { text: string }[] }[], token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await api.post('/api/ai/' + 'chat', { history }, config);
  return response.data;
};


const aiService = {
  chatWithAI,
};

export default aiService;