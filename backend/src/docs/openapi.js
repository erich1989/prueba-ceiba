/**
 * Especificación OpenAPI 3.0 — MercadoExpress Inventario API
 * Todas las respuestas exitosas usan el envelope: { status, error, response }
 */
module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'MercadoExpress — API de Inventario',
    version: '1.0.0',
    description: 'API REST para gestión de inventario, alertas de stock bajo y órdenes de compra.',
  },
  servers: [
    { url: 'http://localhost:6002/api-v1', description: 'Desarrollo local' },
  ],
  tags: [
    { name: 'Health', description: 'Estado del servicio' },
    { name: 'Categories', description: 'Categorías válidas' },
    { name: 'Products', description: 'Catálogo y consultas con filtros' },
    { name: 'Inventory', description: 'Ajustes de stock e historial' },
    { name: 'Alerts', description: 'Alertas STOCK_BAJO' },
    { name: 'PurchaseOrders', description: 'Órdenes de compra' },
    { name: 'Users', description: 'Autenticación JWT' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token obtenido en POST /users/login',
      },
    },
    schemas: {
      ApiEnvelope: {
        type: 'object',
        properties: {
          status: { type: 'integer', example: 200 },
          error: { type: 'string', example: '' },
          response: { type: 'object' },
        },
      },
      ApiError: {
        type: 'object',
        properties: {
          status: { type: 'integer', example: 400 },
          error: { type: 'string', example: 'Mensaje de error en español' },
          message: { type: 'string' },
        },
      },
      Product: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          nombre: { type: 'string', minLength: 3, maxLength: 100 },
          sku: { type: 'string', pattern: '^[A-Za-z0-9-]{6,20}$' },
          categoria: { type: 'string' },
          precio: { type: 'number', minimum: 0.01 },
          stockActual: { type: 'integer', minimum: 0, default: 0 },
          stockMinimo: { type: 'integer', minimum: 1 },
          proveedor: { type: 'string' },
        },
        required: ['nombre', 'sku', 'categoria', 'precio', 'stockMinimo', 'proveedor'],
      },
      ProductInput: {
        type: 'object',
        properties: {
          nombre: { type: 'string', example: 'Agua Mineral 500ml' },
          sku: { type: 'string', example: 'BEB-001' },
          categoria: { type: 'string', example: 'Bebidas' },
          precio: { type: 'number', example: 1500 },
          stockActual: { type: 'integer', example: 0 },
          stockMinimo: { type: 'integer', example: 50 },
          proveedor: { type: 'string', example: 'Distribuidora Andina' },
        },
      },
      StockAdjust: {
        type: 'object',
        required: ['tipo', 'cantidad', 'motivo'],
        properties: {
          tipo: { type: 'string', enum: ['ENTRADA', 'SALIDA'] },
          cantidad: { type: 'integer', minimum: 1 },
          motivo: { type: 'string', minLength: 3 },
        },
      },
      Movement: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          producto: { type: 'string' },
          tipo: { type: 'string', enum: ['ENTRADA', 'SALIDA'] },
          cantidad: { type: 'integer' },
          fecha: { type: 'string', format: 'date-time' },
          motivo: { type: 'string' },
        },
      },
      Alert: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          producto: { type: 'object' },
          tipo: { type: 'string', enum: ['STOCK_BAJO'] },
          estado: { type: 'string', enum: ['ACTIVA', 'RESUELTA'] },
          resueltaEn: { type: 'string', format: 'date-time', nullable: true },
        },
      },
      PurchaseOrder: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          producto: { type: 'object' },
          proveedor: { type: 'string' },
          cantidadSolicitada: { type: 'integer' },
          estado: { type: 'string', enum: ['PENDIENTE', 'APROBADA', 'RECHAZADA', 'RECIBIDA'] },
          motivoRechazo: { type: 'string', nullable: true },
        },
      },
      PurchaseOrderInput: {
        type: 'object',
        required: ['producto', 'cantidadSolicitada'],
        properties: {
          producto: { type: 'string', description: 'ObjectId del producto' },
          cantidadSolicitada: { type: 'integer', minimum: 1 },
          proveedor: { type: 'string' },
          alerta: { type: 'string', description: 'ObjectId de alerta ACTIVA (opcional)' },
        },
      },
      RejectOrder: {
        type: 'object',
        required: ['motivoRechazo'],
        properties: {
          motivoRechazo: { type: 'string', minLength: 10 },
        },
      },
      RegisterInput: {
        type: 'object',
        required: ['nombre', 'email', 'password'],
        properties: {
          nombre: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8 },
        },
      },
      LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          token: { type: 'string' },
          user: { type: 'object' },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        responses: {
          200: { description: 'Servicio operativo' },
        },
      },
    },
    '/categories': {
      get: {
        tags: ['Categories'],
        summary: 'Listar categorías válidas',
        responses: {
          200: {
            description: 'Lista de categorías',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiEnvelope' },
              },
            },
          },
        },
      },
    },
    '/products': {
      get: {
        tags: ['Products'],
        summary: 'Listar productos con filtros',
        parameters: [
          { name: 'categoria', in: 'query', schema: { type: 'string' } },
          { name: 'proveedor', in: 'query', schema: { type: 'string' } },
          { name: 'stockMin', in: 'query', schema: { type: 'number' } },
          { name: 'stockMax', in: 'query', schema: { type: 'number' } },
          { name: 'conAlertaActiva', in: 'query', schema: { type: 'boolean' } },
        ],
        responses: {
          200: { description: 'Lista de productos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiEnvelope' } } } },
        },
      },
      post: {
        tags: ['Products'],
        summary: 'Crear producto',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ProductInput' } } },
        },
        responses: {
          201: { description: 'Producto creado' },
          401: { description: 'No autenticado' },
        },
      },
    },
    '/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Obtener producto por ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Producto encontrado' },
          404: { description: 'No encontrado' },
        },
      },
      put: {
        tags: ['Products'],
        summary: 'Actualizar producto',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ProductInput' } } },
        },
        responses: {
          200: { description: 'Producto actualizado' },
          401: { description: 'No autenticado' },
        },
      },
      delete: {
        tags: ['Products'],
        summary: 'Eliminar producto',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Producto eliminado' },
          401: { description: 'No autenticado' },
        },
      },
    },
    '/products/{id}/ajustar': {
      post: {
        tags: ['Inventory'],
        summary: 'Ajustar stock (ENTRADA/SALIDA)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/StockAdjust' } } },
        },
        responses: {
          200: { description: 'Stock ajustado' },
          400: { description: 'Stock insuficiente u otro error de negocio' },
          401: { description: 'No autenticado' },
        },
      },
    },
    '/products/{id}/movimientos': {
      get: {
        tags: ['Inventory'],
        summary: 'Historial de movimientos del producto',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Lista de movimientos inmutables' },
        },
      },
    },
    '/alerts': {
      get: {
        tags: ['Alerts'],
        summary: 'Listar alertas',
        parameters: [
          { name: 'estado', in: 'query', schema: { type: 'string', enum: ['ACTIVA', 'RESUELTA'] } },
        ],
        responses: {
          200: { description: 'Lista de alertas' },
        },
      },
    },
    '/alerts/{id}': {
      get: {
        tags: ['Alerts'],
        summary: 'Obtener alerta por ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Alerta encontrada' },
          404: { description: 'No encontrada' },
        },
      },
    },
    '/purchase-orders': {
      get: {
        tags: ['PurchaseOrders'],
        summary: 'Listar órdenes de compra',
        parameters: [
          { name: 'estado', in: 'query', schema: { type: 'string', enum: ['PENDIENTE', 'APROBADA', 'RECHAZADA', 'RECIBIDA'] } },
        ],
        responses: {
          200: { description: 'Lista de órdenes' },
        },
      },
      post: {
        tags: ['PurchaseOrders'],
        summary: 'Crear orden de compra',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/PurchaseOrderInput' } } },
        },
        responses: {
          201: { description: 'Orden creada (PENDIENTE)' },
          400: { description: 'Cantidad menor a 2x stock mínimo' },
          401: { description: 'No autenticado' },
        },
      },
    },
    '/purchase-orders/{id}': {
      get: {
        tags: ['PurchaseOrders'],
        summary: 'Obtener orden por ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Orden encontrada' },
        },
      },
    },
    '/purchase-orders/{id}/aprobar': {
      post: {
        tags: ['PurchaseOrders'],
        summary: 'Aprobar orden (PENDIENTE → APROBADA)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Orden aprobada' },
          400: { description: 'Transición inválida' },
        },
      },
    },
    '/purchase-orders/{id}/rechazar': {
      post: {
        tags: ['PurchaseOrders'],
        summary: 'Rechazar orden (PENDIENTE → RECHAZADA)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/RejectOrder' } } },
        },
        responses: {
          200: { description: 'Orden rechazada' },
          400: { description: 'Motivo menor a 10 caracteres' },
        },
      },
    },
    '/purchase-orders/{id}/recibir': {
      post: {
        tags: ['PurchaseOrders'],
        summary: 'Recibir orden (APROBADA → RECIBIDA)',
        description: 'Incrementa stock y cierra alerta asociada si aplica.',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Orden recibida, stock actualizado' },
          400: { description: 'La orden debe estar APROBADA' },
        },
      },
    },
    '/users/register': {
      post: {
        tags: ['Users'],
        summary: 'Registrar usuario admin',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterInput' } } },
        },
        responses: {
          201: { description: 'Usuario creado' },
          409: { description: 'Email ya registrado' },
        },
      },
    },
    '/users/login': {
      post: {
        tags: ['Users'],
        summary: 'Iniciar sesión y obtener JWT',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginInput' } } },
        },
        responses: {
          200: {
            description: 'Token JWT',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiEnvelope' },
                    { properties: { response: { $ref: '#/components/schemas/LoginResponse' } } },
                  ],
                },
              },
            },
          },
          401: { description: 'Credenciales inválidas' },
        },
      },
    },
    '/users/me': {
      get: {
        tags: ['Users'],
        summary: 'Perfil del usuario autenticado',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Perfil del usuario' },
          401: { description: 'No autenticado' },
        },
      },
    },
  },
};
