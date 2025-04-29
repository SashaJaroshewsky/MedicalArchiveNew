// src/api/api.ts
import axios from 'axios';

// Створюємо екземпляр axios з базовою URL
const api = axios.create({
  baseURL: 'https://localhost:7066/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Додаємо перехоплювач для додавання заголовка авторизації до запитів
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Додаємо перехоплювач для обробки помилок 401 (неавторизований)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Якщо токен неправильний, видаляємо його і перенаправляємо на сторінку входу
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;