/// <reference types="vite/client" />

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AUTH_TOKEN_NAME = 'token';
export const AUTH_TOKEN_EXPIRY = 60 * 60 * 1000; 

export const APP_NAME = 'E-Commerce App';
export const APP_VERSION = '1.0.0';

export const FEATURES = {
  DARK_MODE: true,
  USER_REGISTRATION: true,
};

export const DEFAULT_PAGE_SIZE = 10;

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
};

export const DEFAULT_IMAGE = 'https://via.placeholder.com/300';