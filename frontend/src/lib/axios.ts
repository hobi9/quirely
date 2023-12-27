import axios from 'axios';

export const client = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  withCredentials: true,
  timeout: 30_000,
});
