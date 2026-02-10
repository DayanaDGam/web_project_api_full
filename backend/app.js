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


mongoose.connect('mongodb://127.0.0.1:27017/aroundb');
mongoose.connection.on('connected', () => console.log('Conectado a MongoDB: aroundb'));


app.use(requestLogger);


app.post('/signin', validateAuthentication, login);
app.post('/signup', validateUserBody, createUser);


app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(404).json({ message: 'Recurso solicitado no encontrado' });
});

app.use(errorLogger);

app.use(errors());

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