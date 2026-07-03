const store = require('./store');
const productStore = require('../products/store');
const alertService = require('../alerts/service');

function createValidationError(message, status = 400) {
  const err = new Error(message);
  err.status = status;
  return err;
}

async function adjustStock(productId, data) {
  const tipo = String(data.tipo || '').toUpperCase();
  const cantidad = Number(data.cantidad);
  const motivo = String(data.motivo || '').trim();

  if (!['ENTRADA', 'SALIDA'].includes(tipo)) {
    throw createValidationError('El tipo debe ser ENTRADA o SALIDA.');
  }
  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    throw createValidationError('La cantidad debe ser un entero mayor a 0.');
  }
  if (motivo.length < 3) {
    throw createValidationError('El motivo es obligatorio y debe tener al menos 3 caracteres.');
  }

  const product = await productStore.getById(productId);
  if (!product) throw createValidationError('Producto no encontrado.', 404);

  const previousStock = product.stockActual;
  let newStock = previousStock;

  if (tipo === 'ENTRADA') {
    newStock = previousStock + cantidad;
  } else {
    newStock = previousStock - cantidad;
    if (newStock < 0) {
      const faltante = cantidad - previousStock;
      throw createValidationError(
        `No hay stock suficiente. Stock actual: ${previousStock}. Faltan ${faltante} unidad(es) para completar la salida.`
      );
    }
  }

  const updatedProduct = await productStore.update(productId, { stockActual: newStock });
  const movement = await store.add({
    producto: productId,
    tipo,
    cantidad,
    fecha: new Date(),
    motivo,
  });

  await alertService.evaluateAfterStockChange(updatedProduct, previousStock);

  return {
    producto: updatedProduct,
    movimiento: movement,
  };
}

async function getMovementsByProduct(productId) {
  const product = await productStore.getById(productId);
  if (!product) throw createValidationError('Producto no encontrado.', 404);
  return store.listByProduct(productId);
}

module.exports = {
  adjustStock,
  getMovementsByProduct,
};
