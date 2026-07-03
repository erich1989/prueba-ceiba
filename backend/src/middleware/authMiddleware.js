const jwt = require('jsonwebtoken');
const response = require('../network/response');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

  if (!token) {
    return response.error(req, res, 'Acceso denegado. Token no provisto.', 401, 'Por favor provee un token de autorización en el header.');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return response.error(req, res, 'Acceso denegado. Token inválido o expirado.', 403, err);
    }
    req.user = user;
    next();
  });
}

function optionalAuthenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(); // Proceed without req.user
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // If a token was provided but is invalid, we reject the request rather than silently ignoring it
      return response.error(req, res, 'Token inválido o expirado.', 403, err);
    }
    req.user = user;
    next();
  });
}

function checkRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return response.error(req, res, 'Usuario no autenticado', 401);
    }

    const { role } = req.user;
    if (!allowedRoles.includes(role)) {
      return response.error(req, res, 'Acceso denegado. Permisos insuficientes.', 403, `Rol requerido: ${allowedRoles.join(' o ')}. Tu rol: ${role}`);
    }

    next();
  };
}

module.exports = {
  authenticateToken,
  optionalAuthenticateToken,
  checkRole
};
