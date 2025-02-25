/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import userService from '../../services/userService';
import {
    Box,
    Typography,
    Paper,
    IconButton,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Button,
    CircularProgress,
    Grid,
    ToggleButtonGroup,
    ToggleButton,
    Avatar,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Person as PersonIcon,
    AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

const UserList: React.FC = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'user' as 'admin' | 'user',
    });
    const [formSubmitting, setFormSubmitting] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await userService.getUsers();
            setUsers(data);
            setError(null);
        } catch (err: any) {
            console.error('Error al cargar usuarios:', err);
            setError('Error al cargar los usuarios');
            toast.error('No se pudieron cargar los usuarios');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (user: User) => {
        setUserToDelete(user);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!userToDelete) return;

        try {
            await userService.deleteUser(userToDelete.id);
            setUsers(users.filter(u => u.id !== userToDelete.id));
            toast.success('Usuario eliminado con éxito');
        } catch (err) {
            console.error('Error al eliminar usuario:', err);
            toast.error('Error al eliminar el usuario');
        } finally {
            setDeleteDialogOpen(false);
            setUserToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setUserToDelete(null);
    };

    const handleEditClick = (user: User) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            role: user.role,
        });
        setEditDialogOpen(true);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRoleChange = (
        _event: React.MouseEvent<HTMLElement>,
        newRole: 'admin' | 'user'
    ) => {
        if (newRole !== null) {
            setFormData(prev => ({
                ...prev,
                role: newRole,
            }));
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!editingUser) return;
        setFormSubmitting(true);

        try {
            const updatedUser = await userService.updateUser(editingUser.id, formData);
            setUsers(users.map(u => u.id === editingUser.id ? { ...updatedUser, role: formData.role } : u));
            toast.success('Usuario actualizado con éxito');
            setEditDialogOpen(false);
        } catch (err) {
            console.error('Error al actualizar usuario:', err);
            toast.error('Error al actualizar el usuario');
        } finally {
            setFormSubmitting(false);
        }
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        {
            field: 'name',
            headerName: 'Nombre',
            width: 200,
            renderCell: (params: GridRenderCellParams) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2, bgcolor: params.row.role === 'admin' ? 'primary.main' : 'secondary.main' }}>
                        {params.value.charAt(0)}
                    </Avatar>
                    <Typography>{params.value}</Typography>
                </Box>
            ),
        },
        { field: 'email', headerName: 'Email', width: 230 },
        {
            field: 'role',
            headerName: 'Rol',
            width: 150,
            renderCell: (params: GridRenderCellParams) => (
                <Chip
                    icon={params.value === 'admin' ? <AdminIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
                    label={params.value === 'admin' ? 'Administrador' : 'Usuario'}
                    color={params.value === 'admin' ? 'primary' : 'default'}
                    variant={params.value === 'admin' ? 'filled' : 'outlined'}
                    size="small"
                />
            ),
        },
        {
            field: 'actions',
            headerName: 'Acciones',
            width: 120,
            sortable: false,
            renderCell: (params: GridRenderCellParams) => {
                const isCurrentUser = params.row.id === currentUser?.id;

                return (
                    <Box>
                        <IconButton
                            color="primary"
                            onClick={() => handleEditClick(params.row as User)}
                            size="small"
                            disabled={isCurrentUser}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            color="error"
                            onClick={() => handleDeleteClick(params.row as User)}
                            size="small"
                            disabled={isCurrentUser}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Box>
                );
            },
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
                <Button variant="contained" onClick={fetchUsers} sx={{ mt: 2 }}>
                    Reintentar
                </Button>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
                Gestión de Usuarios
            </Typography>

            <Paper sx={{ height: 500, width: '100%' }}>
                <DataGrid
                    rows={users}
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
                        ¿Estás seguro de que deseas eliminar al usuario "{userToDelete?.name}"? Esta acción no se puede deshacer.
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
                open={editDialogOpen}
                onClose={() => !formSubmitting && setEditDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Editar Usuario</DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleFormSubmit} noValidate sx={{ mt: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="name"
                                    label="Nombre"
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
                                    id="email"
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleFormChange}
                                    disabled={formSubmitting}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Rol del usuario
                                </Typography>
                                <ToggleButtonGroup
                                    color="primary"
                                    value={formData.role}
                                    exclusive
                                    onChange={handleRoleChange}
                                    disabled={formSubmitting}
                                    fullWidth
                                >
                                    <ToggleButton value="user">
                                        <PersonIcon sx={{ mr: 1 }} />
                                        Usuario
                                    </ToggleButton>
                                    <ToggleButton value="admin">
                                        <AdminIcon sx={{ mr: 1 }} />
                                        Administrador
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Grid>
                        </Grid>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                            <Button
                                onClick={() => setEditDialogOpen(false)}
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

export default UserList;