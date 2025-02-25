import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';
import { AuthContextProps } from '../types';

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  
  return context;
};