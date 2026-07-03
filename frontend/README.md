# MercadoExpress — Frontend

Interfaz web para el sistema de gestión de inventario MercadoExpress. Consume la API REST desplegada en Render.

## Tecnologías

- **Next.js 16** (App Router) + **TypeScript**
- **Material UI (MUI) v9** + Emotion
- **Axios** para HTTP
- **Atomic Design** en `src/components/` (atoms → molecules → organisms → templates)

## Requisitos

- Node.js 20+
- API MercadoExpress accesible (local o producción)

## Configuración

```bash
cd frontend
cp .env.example .env.local
npm install
```

Variable de entorno:

| Variable | Descripción | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | URL base de la API (incluye `/api-v1`) | `https://prueba-ceiba-mercadoexpress.onrender.com/api-v1` |

> El backend en producción permite CORS desde `localhost:3000`. El servidor de desarrollo debe correr en el **puerto 3000**.

## Ejecución

```bash
npm run dev    # http://localhost:3000
npm run build  # build de producción
npm start      # sirve el build en :3000
```

## Credenciales de prueba

Tras ejecutar el seed del backend:

- **Email:** `admin@mercadoexpress.com`
- **Password:** `Admin1234!`

## Estructura

```
src/
├── app/                    # Rutas App Router
│   ├── login/              # Inicio de sesión
│   ├── register/           # Registro de admin
│   └── (dashboard)/        # Rutas protegidas
│       ├── products/       # CRUD y filtros de productos
│       ├── inventory/      # Ajustes ENTRADA/SALIDA e historial
│       ├── alerts/         # Alertas ACTIVA / RESUELTA
│       └── purchase-orders/ # Órdenes de compra
├── components/             # Atomic Design
├── context/                # AuthContext, SnackbarContext
├── guards/                 # ProtectedRoute
├── lib/                    # apiClient (axios + JWT)
├── services/               # Servicios por recurso API
├── theme/                  # ThemeRegistry MUI (SSR)
└── types/                  # Interfaces TypeScript
```

## Arquitectura

- **Auth:** JWT almacenado en `localStorage`; interceptor axios inyecta `Authorization: Bearer`.
- **Respuestas API:** el cliente desempaqueta `{ status, error, response }` y expone solo `response`.
- **Fetching:** client-side (`'use client'`) con hooks; no SSR autenticado.
- **Errores:** mensajes del backend en español vía `Snackbar`/`Alert`.

## Funcionalidades

| Página | Descripción |
|--------|-------------|
| `/login`, `/register` | Autenticación JWT |
| `/products` | Listado con filtros (categoría, proveedor, rango stock, alerta activa), crear/editar/eliminar |
| `/inventory` | Selección de producto, ajuste ENTRADA/SALIDA, historial de movimientos |
| `/alerts` | Consulta por estado ACTIVA / RESUELTA |
| `/purchase-orders` | Crear órdenes, aprobar, rechazar (motivo ≥ 10 chars), recibir |
