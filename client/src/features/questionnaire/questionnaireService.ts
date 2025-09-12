import axios from 'axios';

const API_URL = '/api/questionnaire/';

const getQuestions = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const submitAnswers = async (answers: any, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL + 'submit', { answers }, config);
  return response.data;
};

const questionnaireService = {
  getQuestions,
  submitAnswers,
};

export default questionnaireService;