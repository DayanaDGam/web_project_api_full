const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { validateUserBody, validateAuthentication } = require('./middlewares/validation');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();


app.use(express.json());

// Conexión a la base de datos
mongoose.connect('mongodb://127.0.0.1:27017/aroundb');
mongoose.connection.on('connected', () => console.log('Conectado a MongoDB: aroundb'));

// 1. Logger de solicitudes (Debe ir antes de todas las rutas)
app.use(requestLogger);

// --- RUTAS PÚBLICAS ---
app.post('/signin', validateAuthentication, login);
app.post('/signup', validateUserBody, createUser);

// --- BARRERA DE AUTORIZACIÓN ---
app.use(auth);

// --- RUTAS PROTEGIDAS ---
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

// Manejo de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ message: 'Recurso solicitado no encontrado' });
});

// 2. Logger de errores (Debe ir después de las rutas y antes de los manejadores de errores)
app.use(errorLogger);

// --- MANEJO DE ERRORES CENTRALIZADO ---

// Manejador de errores de 'celebrate'
app.use(errors());

// Middleware centralizado de errores
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? 'Se ha producido un error en el servidor'
      : message,
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});