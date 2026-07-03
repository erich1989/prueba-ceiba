const store = require('./store');

function createValidationError(message, status = 400) {
  const err = new Error(message);
  err.status = status;
  return err;
}

async function getAlerts(query = {}) {
  const filters = {};
  if (query.estado) {
    const estado = String(query.estado).toUpperCase();
    if (!['ACTIVA', 'RESUELTA'].includes(estado)) {
      throw createValidationError('El estado debe ser ACTIVA o RESUELTA.');
    }
    filters.estado = estado;
  }
  return store.list(filters);
}

async function getAlert(id) {
  const alert = await store.getById(id);
  if (!alert) throw createValidationError('Alerta no encontrada.', 404);
  return alert;
}

module.exports = {
  getAlerts,
  getAlert,
};
