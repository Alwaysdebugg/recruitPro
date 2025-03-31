import axios from 'axios';

interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
}

const API_URL = 'http://localhost:3000/users';

// login 
export const login = async (email: string, password: string) => {
  const response = await axios.post<LoginResponse>(`${API_URL}/login`, { email, password });
  if (response.data.access_token) {
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('user', JSON.stringify(response.data.user)); // 存储用户信息
    // 设置axios默认的header
    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
  }
  return response.data;
};

// register
export const register = async (firstName: string, lastName: string, email: string, password: string) => {
  const response = await axios.post(`${API_URL}/register`, { firstName, lastName, email, password });
  return response.data;
};

// logout
export const logout = async (userId: number) => {
  try {
    const response = await axios.post(`${API_URL}/logout`, { userId });
    // 清除token
    localStorage.removeItem('access_token');
    // 清除axios默认的header
    delete axios.defaults.headers.common['Authorization'];
    return response.data;
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
};




