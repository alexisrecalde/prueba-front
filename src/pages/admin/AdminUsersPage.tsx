import React from 'react';
import { Box, Container, Typography, Paper, Breadcrumbs, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Navbar from '../../components/ui/Navbar';
import UserList from '../../components/admin/UserList';
import { useAuth } from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const AdminUsersPage: React.FC = () => {
    const { isAuthenticated, isAdmin } = useAuth();

    if (!isAuthenticated || !isAdmin) {
        return <Navigate to="/login" />;
    }

    return (
        <>
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Administración de Usuarios
                    </Typography>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link component={RouterLink} to="/" color="inherit">
                            Inicio
                        </Link>
                        <Link component={RouterLink} to="/admin/users" color="inherit">
                            Admin
                        </Link>
                        <Typography color="text.primary">Usuarios</Typography>
                    </Breadcrumbs>
                </Box>

                <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                    <UserList />
                </Paper>
            </Container>
        </>
    );
};

export default AdminUsersPage;