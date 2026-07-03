const Model = require('./model');

async function add(data, options = {}) {
  const movement = new Model(data);
  return movement.save(options);
}

async function listByProduct(productId) {
  return Model.find({ producto: productId }).sort({ fecha: -1, createdAt: -1 });
}

module.exports = {
  add,
  listByProduct,
};
