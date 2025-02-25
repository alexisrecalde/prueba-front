import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';

import theme from './theme/theme';

import { AuthProvider } from './contexts';
import CartProvider from './contexts/CartProvider';

import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProductDetailPage from './pages/products/ProductDetailPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import CartPage from './pages/products/CartPage';
import ProductsPage from './pages/products/ProductsPage';

const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <CartProvider>
                    <Router>
                        <Routes>
                            {/* Rutas públicas */}
                            <Route path="/" element={<HomePage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/products" element={<ProductsPage />} />
                            <Route path="/products/:id" element={<ProductDetailPage />} />
                            <Route path="/cart" element={<CartPage />} />

                            {/* Rutas protegidas de administrador */}
                            <Route path="/admin/products" element={<AdminProductsPage />} />
                            <Route path="/admin/users" element={<AdminUsersPage />} />

                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </Router>
                    <Toaster position="top-right" />
                </CartProvider>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;