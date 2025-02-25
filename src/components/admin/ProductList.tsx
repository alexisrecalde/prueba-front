import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import productService from '../../services/productService';
import {
    Box,
    Button,
    Typography,
    Paper,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Grid,
    CircularProgress,
    Avatar,
    Chip,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import { toast } from 'react-hot-toast';

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    const [formDialogOpen, setFormDialogOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState<Omit<Product, 'id'>>({
        name: '',
        description: '',
        price: 0,
        image: '',
        category: '',
    });
    const [formSubmitting, setFormSubmitting] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await productService.getProducts();
            setProducts(data);
            setError(null);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error('Error al cargar productos:', err);
            setError('Error al cargar los productos');
            toast.error('No se pudieron cargar los productos');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (product: Product) => {
        setProductToDelete(product);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!productToDelete) return;

        try {
            await productService.deleteProduct(productToDelete.id);
            setProducts(products.filter(p => p.id !== productToDelete.id));
            toast.success('Producto eliminado con éxito');
        } catch (err) {
            console.error('Error al eliminar producto:', err);
            toast.error('Error al eliminar el producto');
        } finally {
            setDeleteDialogOpen(false);
            setProductToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setProductToDelete(null);
    };

    const handleAddClick = () => {
        setFormData({
            name: '',
            description: '',
            price: 0,
            image: '',
            category: '',
        });
        setEditMode(false);
        setFormDialogOpen(true);
    };

    const handleEditClick = (product: Product) => {
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            image: product.image,
            category: product.category,
        });
        setEditMode(true);
        setProductToDelete(product);
        setFormDialogOpen(true);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' ? parseFloat(value) : value,
        }));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormSubmitting(true);

        try {
            if (editMode && productToDelete) {
                const updatedProduct = await productService.updateProduct(productToDelete.id, formData);
                setProducts(products.map(p => p.id === productToDelete.id ? updatedProduct : p));
                toast.success('Producto actualizado con éxito');
            } else {
                const newProduct = await productService.createProduct(formData);
                setProducts([...products, newProduct]);
                toast.success('Producto creado con éxito');
            }
            setFormDialogOpen(false);
        } catch (err) {
            console.error('Error al guardar producto:', err);
            toast.error('Error al guardar el producto');
        } finally {
            setFormSubmitting(false);
        }
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        {
            field: 'image',
            headerName: 'Imagen',
            width: 100,
            renderCell: (params: GridRenderCellParams) => (
                <Avatar
                    src={params.value}
                    alt={params.row.name}
                    variant="rounded"
                    sx={{ width: 50, height: 50 }}
                />
            ),
        },
        { field: 'name', headerName: 'Nombre', width: 200 },
        {
            field: 'price',
            headerName: 'Precio',
            type: 'number',
            width: 120,
            renderCell: (params) => `$${params.value.toFixed(2)}`,
        },
        {
            field: 'category',
            headerName: 'Categoría',
            width: 150,
            renderCell: (params: GridRenderCellParams) => (
                <Chip label={params.value} size="small" />
            ),
        },
        {
            field: 'description',
            headerName: 'Descripción',
            width: 300,
            renderCell: (params) => {
                const description = params.row.description || '';
                return description.length > 100 ? description.substring(0, 100) + '...' : description;
            },
        },
        {
            field: 'actions',
            headerName: 'Acciones',
            width: 120,
            sortable: false,
            renderCell: (params: GridRenderCellParams) => (
                <Box>
                    <IconButton
                        color="primary"
                        onClick={() => handleEditClick(params.row as Product)}
                        size="small"
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(params.row as Product)}
                        size="small"
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>
            ),
        },
    ];

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography color="error">{error}</Typography>
                <Button variant="contained" onClick={fetchProducts} sx={{ mt: 2 }}>
                    Reintentar
                </Button>
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" component="h1">
                    Gestión de Productos
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleAddClick}
                >
                    Nuevo Producto
                </Button>
            </Box>

            <Paper sx={{ height: 500, width: '100%' }}>
                <DataGrid
                    rows={products}
                    columns={columns}
                    pagination
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[5, 10, 25]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{
                        toolbar: {
                            showQuickFilter: true,
                            quickFilterProps: { debounceMs: 500 },
                        },
                    }}
                    sx={{ border: 0 }}
                    loading={loading}
                />
            </Paper>
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
            >
                <DialogTitle>Confirmar eliminación</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Estás seguro de que deseas eliminar el producto "{productToDelete?.name}"? Esta acción no se puede deshacer.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>Cancelar</Button>
                    <Button onClick={handleDeleteConfirm} color="error" autoFocus>
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={formDialogOpen}
                onClose={() => !formSubmitting && setFormDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {editMode ? 'Editar Producto' : 'Nuevo Producto'}
                </DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleFormSubmit} noValidate sx={{ mt: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="name"
                                    label="Nombre del Producto"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    disabled={formSubmitting}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    multiline
                                    rows={3}
                                    id="description"
                                    label="Descripción"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleFormChange}
                                    disabled={formSubmitting}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="price"
                                    label="Precio"
                                    name="price"
                                    type="number"
                                    inputProps={{ min: 0, step: 0.01 }}
                                    value={formData.price}
                                    onChange={handleFormChange}
                                    disabled={formSubmitting}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="category"
                                    label="Categoría"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleFormChange}
                                    disabled={formSubmitting}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    id="image"
                                    label="URL de Imagen"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleFormChange}
                                    disabled={formSubmitting}
                                    helperText="Deja en blanco para usar imagen predeterminada"
                                />
                            </Grid>
                        </Grid>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                            <Button
                                onClick={() => setFormDialogOpen(false)}
                                disabled={formSubmitting}
                                sx={{ mr: 1 }}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={formSubmitting}
                            >
                                {formSubmitting ? 'Guardando...' : 'Guardar'}
                            </Button>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default ProductList;