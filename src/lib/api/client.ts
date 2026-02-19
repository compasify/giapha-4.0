import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export function createServerApiClient(token: string) {
  return axios.create({
    baseURL: `${API_BASE_URL}/api/v1`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
}

