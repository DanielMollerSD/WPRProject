// src/api/api.js
import axios from 'axios';

const API = axios.create({ baseURL: 'https://localhost:7265/api' });

export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);