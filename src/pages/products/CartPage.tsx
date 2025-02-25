import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
    Box,
    TextField,
    Divider,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Alert,
    Snackbar,
} from '@mui/material';
import {
    Add as AddIcon,
    Remove as RemoveIcon,
    Delete as DeleteIcon,
    ShoppingBag as ShoppingBagIcon,
    ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/UseCart';
import Navbar from '../../components/ui/Navbar';

const CartPage: React.FC = () => {
    const navigate = useNavigate();
    const { cart, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
    const { isAuthenticated } = useAuth();

    const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
    const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);

    const handleQuantityChange = (productId: string, newQuantity: number) => {
        if (newQuantity > 0) {
            updateQuantity(productId, newQuantity);
        }
    };

    const handleRemoveItem = (productId: string) => {
        removeFromCart(productId);
    };

    const handleCheckoutClick = () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: '/cart' } });
        } else {
            setCheckoutDialogOpen(true);
        }
    };

    const handleCheckoutConfirm = () => {
        setCheckoutDialogOpen(false);
        clearCart();
        setSuccessSnackbarOpen(true);
    };

    if (cart.length === 0) {
        return (
            <>
                <Navbar />
                <Container maxWidth="md" sx={{ py: 5 }}>
                    <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                        <ShoppingBagIcon sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
                        <Typography variant="h5" gutterBottom>
                            Tu carrito está vacío
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph>
                            Parece que aún no has añadido productos a tu carrito.
                        </Typography>
                        <Button
                            variant="contained"
                            component={RouterLink}
                            to="/products"
                            size="large"
                            sx={{ mt: 2 }}
                        >
                            Explorar Productos
                        </Button>
                    </Paper>
                </Container>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Carrito de Compras
                </Typography>

                <Paper elevation={3} sx={{ mt: 3, borderRadius: 2, overflow: 'hidden' }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Producto</TableCell>
                                    <TableCell align="center">Precio</TableCell>
                                    <TableCell align="center">Cantidad</TableCell>
                                    <TableCell align="center">Subtotal</TableCell>
                                    <TableCell align="center">Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cart.map((item) => (
                                    <TableRow key={item.product.id}>
                                        <TableCell component="th" scope="row">
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Box
                                                    component="img"
                                                    src={item.product.image}
                                                    alt={item.product.name}
                                                    sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1, mr: 2 }}
                                                />
                                                <Box>
                                                    <Typography variant="body1">
                                                        {item.product.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Categoría: {item.product.category}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">${item.product.price.toFixed(2)}</TableCell>
                                        <TableCell align="center">
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                                                >
                                                    <RemoveIcon fontSize="small" />
                                                </IconButton>
                                                <TextField
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => {
                                                        const value = parseInt(e.target.value);
                                                        if (!isNaN(value)) {
                                                            handleQuantityChange(item.product.id, value);
                                                        }
                                                    }}
                                                    InputProps={{ inputProps: { min: 1, style: { textAlign: 'center' } } }}
                                                    sx={{ width: 60, mx: 1 }}
                                                />
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                                                >
                                                    <AddIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            ${(item.product.price * item.quantity).toFixed(2)}
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                color="error"
                                                onClick={() => handleRemoveItem(item.product.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

                <Paper elevation={3} sx={{ mt: 3, p: 3, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6">Resumen del Pedido</Typography>
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={clearCart}
                        >
                            Vaciar Carrito
                        </Button>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography>Cantidad de productos:</Typography>
                        <Typography>{totalItems}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6">Total:</Typography>
                        <Typography variant="h6" color="primary">${totalPrice.toFixed(2)}</Typography>
                    </Box>

                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        sx={{ mt: 3 }}
                        endIcon={<ArrowForwardIcon />}
                        onClick={handleCheckoutClick}
                    >
                        Proceder al Pago
                    </Button>
                </Paper>
            </Container>

            <Dialog
                open={checkoutDialogOpen}
                onClose={() => setCheckoutDialogOpen(false)}
            >
                <DialogTitle>Confirmar Compra</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Estás seguro de que deseas finalizar la compra? Se procesará un pago por ${totalPrice.toFixed(2)}.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCheckoutDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={handleCheckoutConfirm} variant="contained" color="primary">
                        Confirmar Compra
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={successSnackbarOpen}
                autoHideDuration={5000}
                onClose={() => setSuccessSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSuccessSnackbarOpen(false)}
                    severity="success"
                    variant="filled"
                >
                    ¡Compra realizada con éxito! Gracias por tu pedido.
                </Alert>
            </Snackbar>
        </>
    );
};

export default CartPage;