/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, ReactNode, JSX } from 'react';
import { User, LoginCredentials, RegisterCredentials } from '../types';
import authService from '../services/authService';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-hot-toast';
import AuthContext from './AuthContext';

interface AuthProviderProps {
    children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            try {
                const decodedToken: any = jwtDecode(storedToken);
                const currentTime = Date.now() / 1000;

                if (decodedToken.exp && decodedToken.exp < currentTime) {
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                } else {
                    setToken(storedToken);
                    setUser({
                        id: decodedToken.id,
                        email: decodedToken.email,
                        name: decodedToken.name || 'Usuario',
                        role: decodedToken.role,
                    });
                }
            } catch (error) {
                console.error('Error al decodificar el token:', error);
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            const data = await authService.login(credentials);
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUser(data.user);
            toast.success('Inicio de sesión exitoso');
        } catch (error: any) {
            console.error('Error al iniciar sesión:', error);
            toast.error(error.response?.data?.message || 'Error al iniciar sesión');
            throw error;
        }
    };

    const register = async (credentials: RegisterCredentials) => {
        try {
            const data = await authService.register(credentials);
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUser(data.user);
            toast.success('Registro exitoso');
        } catch (error: any) {
            console.error('Error al registrarse:', error);
            toast.error(error.response?.data?.message || 'Error al registrarse');
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        toast.success('Sesión cerrada');
    };

    const isAuthenticated = !!token;
    const isAdmin = user?.role === 'admin';

    const contextValue = {
        user,
        token,
        isAuthenticated,
        isAdmin,
        loading,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;