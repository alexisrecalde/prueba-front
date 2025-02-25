import apiService from './apiService';
import { Product } from '../types';

const getProducts = async (category?: string): Promise<Product[]> => {
  const url = category ? `/products?category=${category}` : '/products';
  const response = await apiService.get(url);
  return response.data;
};

const getProductById = async (id: string): Promise<Product> => {
  const response = await apiService.get(`/products/${id}`);
  return response.data;
};

const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  const response = await apiService.post('/products', product);
  return response.data;
};

const updateProduct = async (id: string, product: Partial<Product>): Promise<Product> => {
  const response = await apiService.put(`/products/${id}`, product);
  return response.data;
};

const deleteProduct = async (id: string): Promise<void> => {
  await apiService.delete(`/products/${id}`);
};

export default {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};