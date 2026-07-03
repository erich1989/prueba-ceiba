const Model = require('./model');

async function add(data, options = {}) {
  const order = new Model(data);
  return order.save(options);
}

async function list(filters = {}) {
  return Model.find(filters).populate('producto').populate('alerta').sort({ createdAt: -1 });
}

async function getById(id, options = {}) {
  return Model.findById(id, null, options).populate('producto').populate('alerta');
}

async function update(id, data, options = {}) {
  return Model.findByIdAndUpdate(id, { $set: data }, {
    new: true,
    runValidators: true,
    ...options,
  }).populate('producto').populate('alerta');
}

module.exports = {
  add,
  list,
  getById,
  update,
};
