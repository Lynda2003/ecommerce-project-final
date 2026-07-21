import axios from 'axios';

const api = axios.create({ 
  baseURL: 'https://mernapp-lynda-dzbqengsgzdhayfh.swedencentral-01.azurewebsites.net/api'
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;