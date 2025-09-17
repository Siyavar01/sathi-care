import api from '../../api/axiosConfig.js';

const getQuestions = async () => {
  const response = await api.get('/api/questionnaire/');
  return response.data;
};

const submitAnswers = async (answers: any, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await api.post('/api/questionnaire/' + 'submit', { answers }, config);
  return response.data;
};

const questionnaireService = {
  getQuestions,
  submitAnswers,
};

export default questionnaireService;