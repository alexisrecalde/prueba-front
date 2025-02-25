import React from 'react';
import { Typography, Button, Container, Paper, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';

const HomePage: React.FC = () => {
    return (
        <>
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Bienvenido a nuestra Tienda Online
                    </Typography>

                    <Typography variant="body1" paragraph>
                        Encuentra los mejores productos electrónicos al mejor precio.
                    </Typography>

                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                component={RouterLink}
                                to="/products"
                                size="large"
                            >
                                Ver Productos
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="outlined"
                                component={RouterLink}
                                to="/login"
                            >
                                Iniciar Sesión
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                <Grid container spacing={3} sx={{ mt: 4 }}>
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, height: '100%' }}>
                            <Typography variant="h6" gutterBottom>
                                Electrónicos
                            </Typography>
                            <Typography variant="body2">
                                Descubre nuestra amplia selección de productos electrónicos: smartphones, laptops y más.
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, height: '100%' }}>
                            <Typography variant="h6" gutterBottom>
                                Accesorios
                            </Typography>
                            <Typography variant="body2">
                                Complementa tus dispositivos con nuestra colección de accesorios de alta calidad.
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, height: '100%' }}>
                            <Typography variant="h6" gutterBottom>
                                Wearables
                            </Typography>
                            <Typography variant="body2">
                                Explora nuestros dispositivos wearables: smartwatches, auriculares y más.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default HomePage;