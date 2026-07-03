const store = require('./store');

async function evaluateAfterStockChange(product, previousStock, options = {}) {
  const stockActual = Number(product.stockActual) || 0;
  const stockMinimo = Number(product.stockMinimo) || 0;
  const productId = product._id;

  if (stockActual <= stockMinimo) {
    const existing = await store.getActiveByProduct(productId, options);
    if (!existing) {
      return store.add({
        producto: productId,
        tipo: 'STOCK_BAJO',
        estado: 'ACTIVA',
      }, options);
    }
    return existing;
  }

  if (stockActual > stockMinimo) {
    return store.resolveActiveByProduct(productId, options);
  }

  return null;
}

module.exports = {
  evaluateAfterStockChange,
};
