import React, { ReactNode } from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/ui/Navbar';

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />

            <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    {children}
                </Paper>
            </Container>

            <Box
                component="footer"
                sx={{
                    py: 3,
                    px: 2,
                    mt: 'auto',
                    backgroundColor: (theme) => theme.palette.grey[900],
                    color: 'white',
                }}
            >
                <Container maxWidth="sm">
                    <Typography variant="body2" align="center">
                        © {new Date().getFullYear()} E-Commerce App. Todos los derechos reservados.
                    </Typography>
                </Container>
            </Box>

            <Toaster position="top-right" />
        </Box>
    );
};

export default MainLayout;