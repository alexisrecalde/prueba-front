import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Grid,
    Box,
    Typography,
    Button,
    Paper,
    Chip,
    CircularProgress,
    Snackbar,
    Alert,
    Divider,
    TextField,
} from '@mui/material';
import {
    ShoppingCart as CartIcon,
    ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import Navbar from '../../components/ui/Navbar';
import productService from '../../services/productService';
import { Product } from '../../types';


const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error';
    }>({
        open: false,
        message: '',
        severity: 'success',
    });

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const data = await productService.getProductById(id);
                setProduct(data);
            } catch (err) {
                console.error('Error fetching product:', err);
                setError('No se pudo cargar el producto. Intente nuevamente.');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value);
        if (value > 0) {
            setQuantity(value);
        }
    };

    const handleAddToCart = () => {
        if (!product) return;

        console.log('Agregando al carrito:', { product, quantity });

        setSnackbar({
            open: true,
            message: `${product.name} agregado al carrito`,
            severity: 'success',
        });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <Container sx={{ py: 5, textAlign: 'center' }}>
                    <CircularProgress />
                    <Typography sx={{ mt: 2 }}>Cargando producto...</Typography>
                </Container>
            </>
        );
    }

    if (error || !product) {
        return (
            <>
                <Navbar />
                <Container sx={{ py: 5 }}>
                    <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                        <Typography variant="h5" color="error" gutterBottom>
                            {error || 'Producto no encontrado'}
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate('/products')}
                            sx={{ mt: 2 }}
                        >
                            Volver a Productos
                        </Button>
                    </Paper>
                </Container>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <Container sx={{ py: 4 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{ mb: 3 }}
                >
                    Volver
                </Button>

                <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={5}>
                            <Box
                                component="img"
                                src={product.image}
                                alt={product.name}
                                sx={{
                                    width: '100%',
                                    borderRadius: 2,
                                    boxShadow: 1,
                                    maxHeight: '400px',
                                    objectFit: 'contain',
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={7}>
                            <Typography variant="h4" component="h1" gutterBottom>
                                {product.name}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Chip label={product.category} size="small" color="primary" />
                                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                    ID: {product.id}
                                </Typography>
                            </Box>

                            <Typography variant="h5" color="primary" gutterBottom>
                                ${product.price.toFixed(2)}
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="body1" paragraph>
                                {product.description}
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
                                <TextField
                                    label="Cantidad"
                                    type="number"
                                    InputProps={{ inputProps: { min: 1 } }}
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    sx={{ width: '100px', mr: 2 }}
                                />

                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    startIcon={<CartIcon />}
                                    onClick={handleAddToCart}
                                    fullWidth
                                >
                                    Agregar al Carrito
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default ProductDetailPage;