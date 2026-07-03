exports.success = function (req, res, message, status) {
  res.status(status || 200).send({
    status: status || 200,
    error: '',
    response: message
  });
};

exports.error = function (req, res, message, status, details) {
  let errorMsg = message || 'Unexpected Error';
  let technicalDetails = null;
  let statusCode = status || 500;

  // 1. Handle Mongoose Validation Errors (Security: prevents verbose Schema internal leaks)
  if (details && details.name === 'ValidationError') {
    statusCode = 400;
    errorMsg = 'Error de validación en los datos provistos';
    // Clean, readable list of field validation messages for the client
    technicalDetails = Object.values(details.errors).map(err => err.message);
  }
  // 2. Handle Mongoose Duplicate Key Errors (Security: prevents leaking collection index constraints)
  else if (details && details.code === 11000) {
    statusCode = 409;
    errorMsg = 'El registro ya existe en el sistema';
    technicalDetails = 'El valor ingresado para uno de los campos únicos está duplicado.';
  }
  // 3. MongoDB not connected (queries buffer until timeout)
  else if (
    details
    && details.name === 'MongooseError'
    && String(details.message || '').includes('buffering timed out')
  ) {
    statusCode = 503;
    errorMsg = 'Base de datos no disponible. Reinicia el backend y verifica la conexión a MongoDB Atlas.';
    technicalDetails = details.message;
  }
  // 4. Fallback for generic errors
  else if (details) {
    technicalDetails = details.message || details;
  }

  // Safe Server-Side Logging (Full stack trace logged securely on server, invisible to client)
  console.error('[API Secure Error Log]:', details || message);

  res.status(statusCode).send({
    error: errorMsg,
    message: technicalDetails,
    status: statusCode
  });
};
