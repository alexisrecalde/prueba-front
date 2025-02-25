import React from 'react';
import LoginForm from '../../components/auth/LoginForm';
import MainLayout from '../../layouts/MainLayout';

const LoginPage: React.FC = () => {
    return (
        <MainLayout>
            <LoginForm />
        </MainLayout>
    );
};

export default LoginPage;