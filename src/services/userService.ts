import apiService from './apiService';
import { User } from '../types';

const getUsers = async (): Promise<User[]> => {
  const response = await apiService.get('/users');
  return response.data;
};

const getUserById = async (id: string): Promise<User> => {
  const response = await apiService.get(`/users/${id}`);
  return response.data;
};

const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
  const response = await apiService.put(`/users/${id}`, userData);
  return response.data;
};

const deleteUser = async (id: string): Promise<void> => {
  await apiService.delete(`/users/${id}`);
};

export default {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};