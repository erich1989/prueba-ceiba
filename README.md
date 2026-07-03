# MercadoExpress — Sistema de Gestión de Inventario

API REST y frontend web para gestionar inventario, alertas de stock bajo y órdenes de compra a proveedores.

## Demo desplegada

- **Frontend:** https://prueba-ceiba-frontend.onrender.com
- **API:** https://prueba-ceiba-mercadoexpress.onrender.com
- **Health check:** https://prueba-ceiba-mercadoexpress.onrender.com/api-v1/health

> Nota: el servicio usa el plan gratuito de Render, por lo que la primera petición tras un periodo de inactividad puede tardar ~30-50s en responder mientras el servicio se reactiva.

## Tecnologías

**Backend**

- Node.js + Express
- MongoDB + Mongoose
- JWT para autenticación en mutaciones
- Jest + Supertest + MongoDB Memory Server

**Frontend** (`frontend/`)

- Next.js 16 (App Router) + TypeScript
- Material UI (MUI) + Atomic Design
- Axios + JWT en localStorage

Ver [`frontend/README.md`](frontend/README.md) para instrucciones del frontend.

## Arquitectura

Arquitectura por componentes en capas:

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

```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```

La API queda en `http://localhost:6002`.

### Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

La app queda en `http://localhost:3000` (puerto requerido por CORS del backend en producción).

Variables clave en `.env`:

- `PORT`
- `JWT_SECRET`
- `CLUSTER_DB_MONGO`, `USER_DB_MONGO`, `PASSWORD_DB_MONGO`, `NAME_CONTAINER_DB_MONGO`
- `MONGO_URI` (fallback local)

## Endpoints principales

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api-v1/health` | No | Health check |
| GET | `/api-v1/categories` | No | Categorías válidas |
| GET/POST/PUT/DELETE | `/api-v1/products` | POST/PUT/DELETE sí | CRUD de productos |
| POST | `/api-v1/products/:id/ajustar` | Sí | Ajuste ENTRADA/SALIDA |
| GET | `/api-v1/products/:id/movimientos` | No | Historial de movimientos |
| GET | `/api-v1/alerts` | No | Consulta de alertas |
| GET/POST | `/api-v1/purchase-orders` | POST sí | Órdenes de compra |
| POST | `/api-v1/purchase-orders/:id/aprobar` | Sí | Aprobar orden |
| POST | `/api-v1/purchase-orders/:id/rechazar` | Sí | Rechazar orden |
| POST | `/api-v1/purchase-orders/:id/recibir` | Sí | Recibir orden |
| POST | `/api-v1/users/register` | No | Registrar admin |
| POST | `/api-v1/users/login` | No | Obtener JWT |

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
