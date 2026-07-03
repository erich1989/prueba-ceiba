const rateLimit = require('express-rate-limit');
const response = require('../network/response');

const isProduction = process.env.NODE_ENV === 'production';

// Global API rate limiter (protects against DDoS and general abuse)
const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProduction ? 100 : 2000, // Relaxed in local dev (admin loads many endpoints at once)
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => !isProduction && process.env.RATE_LIMIT_DEV !== 'true',
  message: 'Has excedido el límite de peticiones globales. Por favor, intenta de nuevo más tarde.',
  handler: (req, res, next, options) => {
    response.error(req, res, options.message, 429, 'Demasiadas peticiones desde esta IP. Límite: 100 peticiones cada 15 minutos.');
  }
});

// Strict rate limiter for auth / login / register and checkouts (prevents brute force)
const strictRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Demasiados intentos de autenticación o transacciones. Por favor, espera un minuto e intenta de nuevo.',
  handler: (req, res, next, options) => {
    response.error(req, res, options.message, 429, 'Fuerza bruta prevenida. Límite de 5 intentos por minuto excedido.');
  }
});

module.exports = {
  globalRateLimiter,
  strictRateLimiter
};
