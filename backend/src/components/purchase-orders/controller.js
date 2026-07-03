const store = require('./store');
const productStore = require('../products/store');
const alertStore = require('../alerts/store');
const inventoryController = require('../inventory-movements/controller');

function createValidationError(message, status = 400) {
  const err = new Error(message);
  err.status = status;
  return err;
}

function assertMinimumQuantity(product, cantidadSolicitada) {
  const minimo = product.stockMinimo * 2;
  if (cantidadSolicitada < minimo) {
    throw createValidationError(
      `La cantidad solicitada debe ser al menos el doble del stock mínimo (${minimo} unidades).`
    );
  }
}

async function createPurchaseOrder(data) {
  const productId = data.producto || data.productoId;
  const alertaId = data.alerta || data.alertaId || null;

  if (!productId) {
    throw createValidationError('El producto es obligatorio.');
  }

  const product = await productStore.getById(productId);
  if (!product) throw createValidationError('Producto no encontrado.', 404);

  let alerta = null;
  if (alertaId) {
    alerta = await alertStore.getById(alertaId);
    const alertProductId = alerta?.producto?._id?.toString() || alerta?.producto?.toString();
    if (!alerta || alerta.estado !== 'ACTIVA' || alertProductId !== product._id.toString()) {
      throw createValidationError('La alerta indicada no existe o no está activa para este producto.');
    }
  }

  const cantidadSolicitada = Number(data.cantidadSolicitada);
  if (!Number.isInteger(cantidadSolicitada) || cantidadSolicitada <= 0) {
    throw createValidationError('La cantidad solicitada debe ser un entero mayor a 0.');
  }

  assertMinimumQuantity(product, cantidadSolicitada);

  const proveedor = String(data.proveedor || product.proveedor).trim();
  if (!proveedor) {
    throw createValidationError('El proveedor es obligatorio.');
  }

  return store.add({
    producto: product._id,
    proveedor,
    cantidadSolicitada,
    estado: 'PENDIENTE',
    alerta: alerta ? alerta._id : null,
  });
}

async function getPurchaseOrders(query = {}) {
  const filters = {};
  if (query.estado) filters.estado = String(query.estado).toUpperCase();
  if (query.producto) filters.producto = query.producto;
  return store.list(filters);
}

async function getPurchaseOrder(id) {
  const order = await store.getById(id);
  if (!order) throw createValidationError('Orden de compra no encontrada.', 404);
  return order;
}

async function approvePurchaseOrder(id) {
  const order = await getPurchaseOrder(id);
  if (order.estado !== 'PENDIENTE') {
    throw createValidationError('Solo se pueden aprobar órdenes en estado PENDIENTE.');
  }
  return store.update(id, { estado: 'APROBADA', motivoRechazo: null });
}

async function rejectPurchaseOrder(id, data) {
  const order = await getPurchaseOrder(id);
  if (order.estado !== 'PENDIENTE') {
    throw createValidationError('Solo se pueden rechazar órdenes en estado PENDIENTE.');
  }

  const motivoRechazo = String(data.motivoRechazo || data.motivo || '').trim();
  if (motivoRechazo.length < 10) {
    throw createValidationError('El motivo de rechazo es obligatorio y debe tener al menos 10 caracteres.');
  }

  return store.update(id, { estado: 'RECHAZADA', motivoRechazo });
}

async function receivePurchaseOrder(id) {
  const order = await getPurchaseOrder(id);
  if (order.estado !== 'APROBADA') {
    throw createValidationError('Solo se pueden recibir órdenes en estado APROBADA.');
  }

  await inventoryController.adjustStock(order.producto._id, {
    tipo: 'ENTRADA',
    cantidad: order.cantidadSolicitada,
    motivo: `Recepción de orden de compra ${order._id}`,
  });

  return store.update(id, { estado: 'RECIBIDA' });
}

module.exports = {
  createPurchaseOrder,
  getPurchaseOrders,
  getPurchaseOrder,
  approvePurchaseOrder,
  rejectPurchaseOrder,
  receivePurchaseOrder,
};
