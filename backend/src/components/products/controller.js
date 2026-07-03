const mongoose = require('mongoose');
const store = require('./store');
const alertStore = require('../alerts/store');
const { isValidCategory } = require('../../constants/categories');

function createValidationError(message, status = 400) {
  const err = new Error(message);
  err.status = status;
  return err;
}

function normalizeProductPayload(data, { isUpdate = false } = {}) {
  const payload = {};

  if (data.nombre !== undefined) payload.nombre = String(data.nombre).trim();
  if (data.sku !== undefined) payload.sku = String(data.sku).trim().toUpperCase();
  if (data.categoria !== undefined) payload.categoria = String(data.categoria).trim();
  if (data.precio !== undefined) payload.precio = Number(data.precio);
  if (data.stockActual !== undefined) payload.stockActual = Number(data.stockActual);
  if (data.stockMinimo !== undefined) payload.stockMinimo = Number(data.stockMinimo);
  if (data.proveedor !== undefined) payload.proveedor = String(data.proveedor).trim();

  if (!isUpdate) {
    const required = ['nombre', 'sku', 'categoria', 'precio', 'stockMinimo', 'proveedor'];
    for (const field of required) {
      if (payload[field] === undefined || payload[field] === '' || Number.isNaN(payload[field])) {
        throw createValidationError(`El campo "${field}" es obligatorio.`);
      }
    }
    if (payload.stockActual === undefined || Number.isNaN(payload.stockActual)) {
      payload.stockActual = 0;
    }
  }

  if (payload.nombre && (payload.nombre.length < 3 || payload.nombre.length > 100)) {
    throw createValidationError('El nombre debe tener entre 3 y 100 caracteres.');
  }

  if (payload.categoria && !isValidCategory(payload.categoria)) {
    throw createValidationError('La categoría no es válida. Usa una de las categorías permitidas.');
  }

  if (payload.precio !== undefined && payload.precio <= 0) {
    throw createValidationError('El precio debe ser mayor a 0.');
  }

  if (payload.stockActual !== undefined && payload.stockActual < 0) {
    throw createValidationError('El stock actual no puede ser negativo.');
  }

  if (payload.stockMinimo !== undefined && payload.stockMinimo <= 0) {
    throw createValidationError('El stock mínimo debe ser mayor a 0.');
  }

  return payload;
}

async function buildListFilters(query = {}) {
  const filters = {};

  if (query.categoria) filters.categoria = String(query.categoria).trim();
  if (query.proveedor) filters.proveedor = new RegExp(String(query.proveedor).trim(), 'i');

  if (query.stockMin !== undefined || query.stockMax !== undefined) {
    filters.stockActual = {};
    if (query.stockMin !== undefined) filters.stockActual.$gte = Number(query.stockMin);
    if (query.stockMax !== undefined) filters.stockActual.$lte = Number(query.stockMax);
  }

  if (String(query.conAlertaActiva).toLowerCase() === 'true') {
    const activeAlerts = await alertStore.list({ estado: 'ACTIVA' });
    const productIds = activeAlerts.map((alert) => alert.producto);
    filters._id = { $in: productIds };
  }

  return filters;
}

async function getProducts(query = {}) {
  const filters = await buildListFilters(query);
  return store.list(filters);
}

async function getProduct(id) {
  const product = await store.getById(id);
  if (!product) throw createValidationError('Producto no encontrado.', 404);
  return product;
}

async function createProduct(data) {
  const payload = normalizeProductPayload(data);
  const existing = await store.getBySku(payload.sku);
  if (existing) throw createValidationError('Ya existe un producto con ese SKU.', 409);

  const product = await store.add(payload);
  if (product.stockActual <= product.stockMinimo) {
    const alertService = require('../alerts/service');
    await alertService.evaluateAfterStockChange(product, 0);
  }
  return product;
}

async function updateProduct(id, data) {
  const product = await getProduct(id);
  const payload = normalizeProductPayload(data, { isUpdate: true });

  if (payload.sku && payload.sku !== product.sku) {
    const existing = await store.getBySku(payload.sku);
    if (existing && existing._id.toString() !== id) {
      throw createValidationError('Ya existe un producto con ese SKU.', 409);
    }
  }

  if (data.stockActual !== undefined) {
    throw createValidationError('El stock solo puede ajustarse mediante movimientos de inventario.');
  }

  const updated = await store.update(id, payload);
  if (!updated) throw createValidationError('Producto no encontrado.', 404);
  return updated;
}

async function deleteProduct(id) {
  const deleted = await store.remove(id);
  if (!deleted) throw createValidationError('Producto no encontrado.', 404);
  return deleted;
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
