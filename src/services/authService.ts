import apiService from './apiService';
import { LoginCredentials, RegisterCredentials, AuthResponse } from '../types';

const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await apiService.post('/auth/login', credentials);
  return response.data;
};

const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const response = await apiService.post('/auth/register', credentials);
  return response.data;
};

export default {
  login,
  register,
};