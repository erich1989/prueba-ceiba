const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const store = require('./store');

function createValidationError(message, status = 400) {
  const err = new Error(message);
  err.status = status;
  return err;
}

async function registerUser(userData) {
  const nombre = String(userData.nombre || '').trim();
  const email = String(userData.email || '').trim().toLowerCase();
  const password = String(userData.password || '');

  if (!nombre || !email || !password) {
    throw createValidationError('Los campos nombre, email y password son obligatorios.');
  }

  const existing = await store.getByEmail(email);
  if (existing) {
    throw createValidationError('El correo electrónico ya está registrado.', 409);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await store.add({
    nombre,
    email,
    password: hashedPassword,
    role: 'admin',
  });

  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
}

async function loginUser({ email, password }) {
  if (!email || !password) {
    throw createValidationError('Email y password son obligatorios.');
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await store.getByEmail(normalizedEmail);
  if (!user) {
    throw createValidationError('Credenciales inválidas.', 401);
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw createValidationError('Credenciales inválidas.', 401);
  }

  const token = jwt.sign({
    id: user._id,
    nombre: user.nombre,
    email: user.email,
    role: user.role,
  }, process.env.JWT_SECRET, { expiresIn: '24h' });

  return {
    token,
    user: {
      id: user._id,
      nombre: user.nombre,
      email: user.email,
      role: user.role,
    },
  };
}

async function getUserProfile(userId) {
  const user = await store.getById(userId);
  if (!user) throw createValidationError('Usuario no encontrado.', 404);
  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
}

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
