# MercadoExpress — Sistema de Gestión de Inventario

API REST para gestionar inventario, alertas de stock bajo y órdenes de compra a proveedores.

Este repositorio contiene:

- **Parte 1 — API REST** (`backend/`): la solución de la prueba técnica. Es autosuficiente y funciona por completo sin frontend (consumible vía HTTP/Postman/cURL).
- **Parte 2 — Frontend web** (`frontend/`): interfaz opcional que consume la API, incluida como valor agregado.

## Demo desplegada

- **API:** https://prueba-ceiba-mercadoexpress.onrender.com
- **Health check:** https://prueba-ceiba-mercadoexpress.onrender.com/api-v1/health
- **Frontend (plus):** https://prueba-ceiba-frontend.onrender.com

---

# Parte 1 — API REST (la prueba)

## Tecnologías

- Node.js + Express
- MongoDB + Mongoose
- JWT para autenticación en mutaciones
- Jest + Supertest + MongoDB Memory Server

## Arquitectura

El proyecto sigue una **arquitectura en capas modular por componentes** (también conocida como *modular monolith* con *layered / feature-based architecture*): un único servicio desplegable, organizado por componente de dominio, donde cada componente separa sus responsabilidades en capas.

Cada componente en `src/components/<recurso>/` separa:

- `network.js` — rutas HTTP, validación básica y respuestas
- `controller.js` — reglas de negocio
- `store.js` — acceso a datos
- `model.js` — esquemas Mongoose

Componentes principales:

- `products` — catálogo y consultas con filtros
- `inventory-movements` — ledger inmutable de entradas/salidas
- `alerts` — alertas `STOCK_BAJO` con estado `ACTIVA` / `RESUELTA`
- `purchase-orders` — ciclo de vida de órdenes de compra
- `users` — registro/login JWT (auth opcional para lecturas)

## Ejecución local

Ejecuta estos comandos en la terminal de tu preferencia (bash, zsh, PowerShell, la integrada de tu IDE, etc.), desde la raíz del proyecto:

```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```

La API queda en `http://localhost:6002`.

Variables clave en `.env`:

- `PORT`
- `JWT_SECRET`
- `CLUSTER_DB_MONGO`, `USER_DB_MONGO`, `PASSWORD_DB_MONGO`, `NAME_CONTAINER_DB_MONGO`
- `MONGO_URI` (fallback local)

## Endpoints principales

| Método             | Ruta                                   | Auth                | Descripción             |
| --------------------- | ---------------------------------------- | --------------------- | -------------------------- |
| GET                 | `/api-v1/health`                       | No                  | Health check             |
| GET                 | `/api-v1/categories`                   | No                  | Categorías válidas     |
| GET/POST/PUT/DELETE | `/api-v1/products`                     | POST/PUT/DELETE sí | CRUD de productos        |
| POST                | `/api-v1/products/:id/ajustar`         | Sí                 | Ajuste ENTRADA/SALIDA    |
| GET                 | `/api-v1/products/:id/movimientos`     | No                  | Historial de movimientos |
| GET                 | `/api-v1/alerts`                       | No                  | Consulta de alertas      |
| GET/POST            | `/api-v1/purchase-orders`              | POST sí            | Órdenes de compra       |
| POST                | `/api-v1/purchase-orders/:id/aprobar`  | Sí                 | Aprobar orden            |
| POST                | `/api-v1/purchase-orders/:id/rechazar` | Sí                 | Rechazar orden           |
| POST                | `/api-v1/purchase-orders/:id/recibir`  | Sí                 | Recibir orden            |
| POST                | `/api-v1/users/register`               | No                  | Registrar admin          |
| POST                | `/api-v1/users/login`                  | No                  | Obtener JWT              |

## Tests

```bash
cd backend
npm test
```

Cubren reglas críticas: stock no negativo, alertas, cantidad mínima de orden, transiciones de estado, inmutabilidad de movimientos y endpoints HTTP.

## Justificación de diseño

- Arquitectura por componentes en capas para lograr separación de responsabilidades y facilitar el mantenimiento y las pruebas.
- El stock se modela con un ledger inmutable de movimientos (ENTRADA/SALIDA), garantizando trazabilidad e historial no modificable.
- Las alertas son una entidad de dominio persistente (`ACTIVA`/`RESUELTA`), consultable por estado.
- Auth JWT en las mutaciones para proteger las operaciones de escritura.

## Datos de referencia (seed)

```bash
cd backend
npm run seed
```

Crea los 6 productos del enunciado y un usuario admin:

- Email: `admin@mercadoexpress.com`
- Password: `Admin1234!`

Tras el seed, los productos con stock bajo generan alertas `ACTIVA` automáticamente (p. ej. BEB-002 y LAC-002).

## Despliegue (Render)

1. Sube el repo a GitHub.
2. En [Render](https://render.com), crea un **Web Service** desde el repo.
3. Usa el blueprint [`render.yaml`](render.yaml) o configura manualmente:
   - **Root directory:** `backend`
   - **Build:** `npm install`
   - **Start:** `npm start`
4. Variables de entorno en Render:
   - `JWT_SECRET` (generar valor seguro)
   - `CLUSTER_DB_MONGO`, `USER_DB_MONGO`, `PASSWORD_DB_MONGO`
   - `NAME_CONTAINER_DB_MONGO=ceiba-mercadoexpress`
5. En MongoDB Atlas, permite acceso desde `0.0.0.0/0` (o la IP de Render).
6. Tras el deploy, ejecuta el seed una vez (local apuntando a la misma DB o vía script manual).

Health check: `GET /api-v1/health`

## Documentación interactiva (Swagger)

En **desarrollo local**, la API expone documentación interactiva con Swagger UI:

- **URL:** http://localhost:6002/api-docs
- Permite explorar todos los endpoints, ver schemas y probar peticiones (botón **Authorize** para el JWT).

**Importante:** Swagger está disponible **únicamente en entorno de desarrollo**. En producción queda deshabilitado de forma intencional (seguridad: no exponer documentación interactiva ni pruebas contra la API pública).

Se controla con la variable `NODE_ENV`:

| Entorno | `NODE_ENV` | `/api-docs` |
|---------|------------|-------------|
| Local (`npm run dev`) | vacío o `development` | Activo |
| Render (producción) | `production` | No montado (404) |

---

# Parte 2 — Frontend web (plus)

Interfaz web opcional construida como valor agregado. **No es necesaria para usar la API**: la Parte 1 funciona de forma independiente (Postman, cURL, Swagger en local, etc.). El frontend ofrece una capa visual sobre los mismos endpoints de la API.

- **Demo:** https://prueba-ceiba-frontend.onrender.com
- **Código:** carpeta [`frontend/`](frontend/)

## Tecnologías

- Next.js 16 (App Router) + TypeScript
- Material UI (MUI) + Atomic Design (`atoms` → `molecules` → `organisms` → `templates`)
- Axios + JWT en `localStorage`
- Fetching client-side (`'use client'`); no SSR autenticado

## Autenticación y acceso

El flujo de sesión es el siguiente:

1. **`/login`** — el usuario ingresa email y contraseña. Se llama a `POST /api-v1/users/login`; la API devuelve `{ token, user }`.
2. **`AuthContext`** — guarda el JWT y el usuario en `localStorage`. Un interceptor de Axios inyecta `Authorization: Bearer <token>` en cada petición.
3. **`ProtectedRoute`** — envuelve el dashboard. Si no hay sesión, redirige a `/login`.
4. **`/`** — redirige a `/products` (con sesión) o `/login` (sin sesión).
5. **`/register`** — crea un usuario admin vía `POST /api-v1/users/register` e inicia sesión automáticamente.
6. **Salir** — borra token y usuario de `localStorage` y vuelve al login.

Credenciales de prueba (tras `npm run seed` en el backend):

- Email: `admin@mercadoexpress.com`
- Password: `Admin1234!`

## Páginas del dashboard

Todas las rutas del panel están bajo el layout protegido con barra lateral y topbar (`DashboardLayout`):

| Ruta | Funcionalidad |
|------|----------------|
| `/products` | Listado con filtros (categoría, proveedor, rango de stock, alerta activa). Crear, editar y eliminar productos. |
| `/inventory` | Seleccionar producto, ajustar stock (`ENTRADA` / `SALIDA`) y ver historial de movimientos inmutables. |
| `/alerts` | Consultar alertas `STOCK_BAJO` filtradas por estado `ACTIVA` o `RESUELTA`. |
| `/purchase-orders` | Crear órdenes de compra, aprobar, rechazar (motivo ≥ 10 caracteres) y recibir (incrementa stock y cierra alerta). |

Cada página consume los servicios en `frontend/src/services/` (`products`, `inventory`, `alerts`, `purchaseOrders`, `auth`), que desempaquetan el envelope `{ status, error, response }` de la API.

## Ejecución local

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

La app queda en `http://localhost:3000` (puerto requerido por CORS del backend en producción).

Variable de entorno:

- `NEXT_PUBLIC_API_URL` — URL base de la API (default: la instancia desplegada en Render)

Ver [`frontend/README.md`](frontend/README.md) para estructura de carpetas y más detalle técnico.
