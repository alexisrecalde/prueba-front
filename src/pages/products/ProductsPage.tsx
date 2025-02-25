import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Typography,
    Paper,
    Button,
    CircularProgress,
    Box,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Chip,
    Stack
} from '@mui/material';
import { AddShoppingCart as CartIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

import Navbar from '../../components/ui/Navbar';
import productService from '../../services/productService';
import { Product } from '../../types';
import { useCart } from '../../hooks/UseCart';

const ProductsPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const { addToCart } = useCart();

    const categories = Array.from(
        new Set(products.map(product => product.category))
    );

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await productService.getProducts(
                    selectedCategory || undefined
                );
                setProducts(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('No se pudieron cargar los productos');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedCategory]);

    const handleAddToCart = (product: Product) => {
        addToCart(product, 1);
    };

    const handleCategoryFilter = (category: string | null) => {
        setSelectedCategory(category);
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <Container sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh'
                }}>
                    <CircularProgress />
                </Container>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <Container>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 4,
                            mt: 4,
                            textAlign: 'center'
                        }}
                    >
                        <Typography color="error" variant="h6">
                            {error}
                        </Typography>
                        <Button
                            variant="contained"
                            sx={{ mt: 2 }}
                            onClick={() => setSelectedCategory(null)}
                        >
                            Reintentar
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
                <Typography variant="h4" component="h1" gutterBottom>
                    Nuestros Productos
                </Typography>

                <Box sx={{ mb: 3 }}>
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                    >
                        <Typography variant="body1">Filtrar por:</Typography>
                        <Chip
                            label="Todos"
                            color={!selectedCategory ? 'primary' : 'default'}
                            onClick={() => handleCategoryFilter(null)}
                        />
                        {categories.map(category => (
                            <Chip
                                key={category}
                                label={category}
                                color={selectedCategory === category ? 'primary' : 'default'}
                                onClick={() => handleCategoryFilter(category)}
                            />
                        ))}
                    </Stack>
                </Box>

                {products.length === 0 ? (
                    <Paper
                        elevation={3}
                        sx={{
                            p: 4,
                            textAlign: 'center'
                        }}
                    >
                        <Typography variant="h6">
                            No hay productos disponibles
                        </Typography>
                    </Paper>
                ) : (
                    <Grid container spacing={3}>
                        {products.map(product => (
                            <Grid item xs={12} sm={6} md={4} key={product.id}>
                                <Card
                                    elevation={3}
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={product.image}
                                        alt={product.name}
                                        sx={{ objectFit: 'contain' }}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography
                                            gutterBottom
                                            variant="h6"
                                            component="div"
                                        >
                                            {product.name}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                display: '-webkit-box',
                                                overflow: 'hidden',
                                                WebkitBoxOrient: 'vertical',
                                                WebkitLineClamp: 2,
                                            }}
                                        >
                                            {product.description}
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                mt: 2
                                            }}
                                        >
                                            <Typography
                                                variant="h6"
                                                color="primary"
                                            >
                                                ${product.price.toFixed(2)}
                                            </Typography>
                                            <Chip
                                                label={product.category}
                                                size="small"
                                                color="secondary"
                                            />
                                        </Box>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            component={RouterLink}
                                            to={`/products/${product.id}`}
                                            variant="outlined"
                                            size="small"
                                            sx={{ mr: 1 }}
                                        >
                                            Ver Detalles
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            startIcon={<CartIcon />}
                                            onClick={() => handleAddToCart(product)}
                                        >
                                            Añadir
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </>
    );
};

export default ProductsPage;