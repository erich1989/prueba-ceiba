const Model = require('./model');

async function getByEmail(email, options = {}) {
  return Model.findOne({ email: String(email).trim().toLowerCase() }, null, options);
}

async function getById(id, options = {}) {
  return Model.findById(id, null, options);
}

async function add(userData, options = {}) {
  const user = new Model(userData);
  return user.save(options);
}

module.exports = {
  getByEmail,
  getById,
  add,
};
