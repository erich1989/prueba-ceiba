const mongoSanitize = require('express-mongo-sanitize');

function configureSecurity(app) {
  // Prevent NoSQL Injection attacks by stripping out $, . and other operator characters
  app.use(mongoSanitize());
}

module.exports = configureSecurity;
