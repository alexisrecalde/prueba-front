import { createContext } from 'react';
import { AuthContextProps } from '../types';

const defaultValue: AuthContextProps = {
    user: null,
    token: null,
    isAuthenticated: false,
    isAdmin: false,
    loading: true,
    login: async () => { },
    register: async () => { },
    logout: () => { },
};

const AuthContext = createContext<AuthContextProps>(defaultValue);

export default AuthContext;