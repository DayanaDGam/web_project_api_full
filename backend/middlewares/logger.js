const winston = require('winston');
const expressWinston = require('express-winston');

// Creamos el logger de solicitudes
const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'request.log' }), // Archivo para solicitudes
  ],
  format: winston.format.json(), // Formato JSON
});

// Creamos el logger de errores
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log' }), // Archivo para errores
  ],
  format: winston.format.json(),
});

module.exports = {
  requestLogger,
  errorLogger,
};