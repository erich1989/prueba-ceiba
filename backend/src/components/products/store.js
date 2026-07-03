const Model = require('./model');

async function add(data, options = {}) {
  const product = new Model(data);
  return product.save(options);
}

async function list(filters = {}) {
  return Model.find(filters).sort({ createdAt: -1 });
}

async function getById(id, options = {}) {
  return Model.findById(id, null, options);
}

async function getBySku(sku, options = {}) {
  return Model.findOne({ sku: String(sku).trim().toUpperCase() }, null, options);
}

async function update(id, data, options = {}) {
  return Model.findByIdAndUpdate(id, { $set: data }, {
    new: true,
    runValidators: true,
    ...options,
  });
}

async function remove(id, options = {}) {
  return Model.findByIdAndDelete(id, options);
}

module.exports = {
  add,
  list,
  getById,
  getBySku,
  update,
  remove,
};
