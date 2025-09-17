import api from '../../api/axiosConfig.js';

const register = async (userData: any) => {
  const response = await api.post('/api/users/' + 'register', userData);

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

const login = async (userData: any) => {
  const response = await api.post('/api/users/' + 'login', userData);

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

const registerAndSubmit = async (userData: any) => {
    const response = await api.post('/api/users/' + 'register-and-submit', userData);
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