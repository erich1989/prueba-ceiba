const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const Product = require('../src/components/products/model');
const Alert = require('../src/components/alerts/model');
const InventoryMovement = require('../src/components/inventory-movements/model');
const productsController = require('../src/components/products/controller');
const inventoryController = require('../src/components/inventory-movements/controller');
const purchaseOrdersController = require('../src/components/purchase-orders/controller');

function authHeader() {
  const token = jwt.sign({ id: 'test-user', role: 'admin' }, process.env.JWT_SECRET);
  return { Authorization: `Bearer ${token}` };
}

async function createProduct(overrides = {}) {
  return productsController.createProduct({
    nombre: 'Producto Test',
    sku: 'TEST-001',
    categoria: 'Bebidas',
    precio: 1000,
    stockActual: 10,
    stockMinimo: 5,
    proveedor: 'Proveedor Test',
    ...overrides,
  });
}

describe('Reglas de negocio MercadoExpress', () => {
  test('rechaza salida que dejaría stock negativo', async () => {
    const product = await createProduct({ stockActual: 3 });
    await expect(inventoryController.adjustStock(product._id, {
      tipo: 'SALIDA',
      cantidad: 5,
      motivo: 'Venta mayor al stock',
    })).rejects.toMatchObject({
      message: expect.stringContaining('Faltan 2 unidad(es)'),
    });
  });

  test('crea alerta ACTIVA cuando el stock baja al mínimo', async () => {
    const product = await createProduct({ stockActual: 6, stockMinimo: 5 });
    await inventoryController.adjustStock(product._id, {
      tipo: 'SALIDA',
      cantidad: 1,
      motivo: 'Salida de prueba',
    });

    const alert = await Alert.findOne({ producto: product._id, estado: 'ACTIVA' });
    expect(alert).toBeTruthy();
    expect(alert.tipo).toBe('STOCK_BAJO');
  });

  test('cierra alerta cuando el stock supera el mínimo', async () => {
    const product = await createProduct({ stockActual: 5, stockMinimo: 5 });
    await inventoryController.adjustStock(product._id, {
      tipo: 'ENTRADA',
      cantidad: 3,
      motivo: 'Reposición',
    });

    const active = await Alert.findOne({ producto: product._id, estado: 'ACTIVA' });
    const resolved = await Alert.findOne({ producto: product._id, estado: 'RESUELTA' });
    expect(active).toBeNull();
    expect(resolved).toBeTruthy();
  });

  test('solo permite una alerta ACTIVA por producto', async () => {
    const product = await createProduct({ stockActual: 4, stockMinimo: 5 });
    const alerts = await Alert.find({ producto: product._id, estado: 'ACTIVA' });
    expect(alerts).toHaveLength(1);
  });

  test('valida cantidad mínima 2x stockMinimo en órdenes de compra', async () => {
    const product = await createProduct({ stockActual: 2, stockMinimo: 10 });
    await expect(purchaseOrdersController.createPurchaseOrder({
      producto: product._id,
      cantidadSolicitada: 15,
    })).rejects.toMatchObject({
      message: expect.stringContaining('al menos el doble del stock mínimo'),
    });
  });

  test('ciclo de vida de orden: aprobar, rechazar y recibir', async () => {
    const product = await createProduct({ stockActual: 2, stockMinimo: 5 });
    const order = await purchaseOrdersController.createPurchaseOrder({
      producto: product._id,
      cantidadSolicitada: 10,
    });

    await expect(purchaseOrdersController.rejectPurchaseOrder(order._id, {
      motivoRechazo: 'Corto',
    })).rejects.toMatchObject({
      message: expect.stringContaining('al menos 10 caracteres'),
    });

    const rejected = await purchaseOrdersController.rejectPurchaseOrder(order._id, {
      motivoRechazo: 'Proveedor sin disponibilidad inmediata',
    });
    expect(rejected.estado).toBe('RECHAZADA');

    const product2 = await createProduct({
      sku: 'TEST-002',
      stockActual: 2,
      stockMinimo: 5,
    });
    const pending = await purchaseOrdersController.createPurchaseOrder({
      producto: product2._id,
      cantidadSolicitada: 10,
    });
    const approved = await purchaseOrdersController.approvePurchaseOrder(pending._id);
    expect(approved.estado).toBe('APROBADA');

    const received = await purchaseOrdersController.receivePurchaseOrder(pending._id);
    expect(received.estado).toBe('RECIBIDA');

    const updatedProduct = await Product.findById(product2._id);
    expect(updatedProduct.stockActual).toBe(12);
  });

  test('los movimientos de inventario son inmutables', async () => {
    const product = await createProduct({ stockActual: 10 });
    await inventoryController.adjustStock(product._id, {
      tipo: 'ENTRADA',
      cantidad: 1,
      motivo: 'Entrada de prueba',
    });

    const movement = await InventoryMovement.findOne({ producto: product._id });
    await expect(InventoryMovement.updateOne({ _id: movement._id }, { motivo: 'Cambio' }))
      .rejects
      .toThrow('inmutables');
  });

  test('endpoints HTTP principales responden correctamente', async () => {
    const productRes = await request(app)
      .post('/api-v1/products')
      .set(authHeader())
      .send({
        nombre: 'Agua Test',
        sku: 'HTTP-001',
        categoria: 'Bebidas',
        precio: 1200,
        stockActual: 4,
        stockMinimo: 5,
        proveedor: 'Proveedor HTTP',
      });

    expect(productRes.status).toBe(201);

    const alertsRes = await request(app).get('/api-v1/alerts?estado=ACTIVA');
    expect(alertsRes.status).toBe(200);
    expect(alertsRes.body.response.length).toBeGreaterThan(0);

    const categoriesRes = await request(app).get('/api-v1/categories');
    expect(categoriesRes.status).toBe(200);
    expect(categoriesRes.body.response).toContain('Bebidas');
  });
});
