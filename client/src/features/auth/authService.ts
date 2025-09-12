import axios from 'axios';

const API_URL = '/api/users/';

const register = async (userData: any) => {
  const response = await axios.post(API_URL + 'register', userData);

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

const login = async (userData: any) => {
  const response = await axios.post(API_URL + 'login', userData);

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

const registerAndSubmit = async (userData: any) => {
    const response = await axios.post(API_URL + 'register-and-submit', userData);
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
};

const authService = {
  register,
  registerAndSubmit,
  login,
  logout,
};

export default authService;