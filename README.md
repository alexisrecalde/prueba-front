# E-Commerce Frontend

## Descripción
Aplicación frontend de e-commerce construida con React, TypeScript y Material-UI.

## Requisitos Previos
- Node.js (v18 o superior)
- npm

## Instalación


1. Instalar dependencias
```bash
npm install
```

2. Configurar variables de entorno
Crear un archivo `.env` en la raíz del proyecto con:
```
VITE_API_URL=http://localhost:5000/api
```

## Scripts

- `npm run dev`: Iniciar servidor de desarrollo
- `npm run build`: Compilar para producción
- `npm run preview`: Previsualizar build de producción

## Estructura del Proyecto
```
src/
├── components/      # Componentes reutilizables
├── contexts/        # Contextos de React
├── hooks/           # Hooks personalizados
├── pages/           # Páginas de la aplicación
├── services/        # Servicios de API
├── types/           # Definiciones de tipos
└── utils/           # Utilidades
```

## Mejoras Pendientes

### Funcionalidades
- [ ] Implementar carrito de compras completo
- [ ] Añadir sistema de búsqueda avanzada
- [ ] Crear dashboard de usuario

### Rendimiento y UX
- [ ] Añadir transiciones y animaciones
- [ ] Mejorar manejo de estados de carga
- [ ] Mejorar experiencia de usuario en los distintos tipos de mensajes


## Licencia
Distribuido bajo la licencia MIT.