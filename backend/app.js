const express = require('express');
const mongoose = require('mongoose');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

// 🔐 Middleware temporal de autorización
app.use((req, res, next) => {
  req.user = {
    _id: '695c5006c30604f0b9692f6b',
  };

  next();
});

mongoose.connect('mongodb://localhost:27017/aroundb');

mongoose.connection.on('connected', () => {
  // eslint-disable-next-line no-console
  console.log('Conectado a MongoDB: aroundb');
});

mongoose.connection.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error('Error conectando a MongoDB:', err);
});

// Rutas
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

// 404 para todo lo demás
app.use((req, res) => {
  res.status(404).json({ message: 'Recurso solicitado no encontrado' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
