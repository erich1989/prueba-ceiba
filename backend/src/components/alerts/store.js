const Model = require('./model');

async function add(data, options = {}) {
  const alert = new Model(data);
  return alert.save(options);
}

async function list(filters = {}) {
  return Model.find(filters).populate('producto').sort({ createdAt: -1 });
}

async function getById(id, options = {}) {
  return Model.findById(id, null, options).populate('producto');
}

async function getActiveByProduct(productId, options = {}) {
  return Model.findOne({ producto: productId, estado: 'ACTIVA' }, null, options);
}

async function resolveActiveByProduct(productId, options = {}) {
  return Model.findOneAndUpdate(
    { producto: productId, estado: 'ACTIVA' },
    { $set: { estado: 'RESUELTA', resueltaEn: new Date() } },
    { new: true, ...options }
  );
}

module.exports = {
  add,
  list,
  getById,
  getActiveByProduct,
  resolveActiveByProduct,
};
