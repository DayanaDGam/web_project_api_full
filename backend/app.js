const express = require('express');
const mongoose = require('mongoose');

// Importamos las rutas
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

// Importamos los controladores para las rutas públicas
const { login, createUser } = require('./controllers/users');

// Importamos el nuevo middleware de autorización
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());

// Conexión a la base de datos
mongoose.connect('mongodb://localhost:27017/aroundb');

mongoose.connection.on('connected', () => {
  console.log('Conectado a MongoDB: aroundb');
});

mongoose.connection.on('error', (err) => {
  console.error('Error conectando a MongoDB:', err);
});

// --- RUTAS PÚBLICAS ---
// Estas rutas no requieren token porque son para entrar o registrarse
app.post('/signin', login);
app.post('/signup', createUser);

// --- PROTECCIÓN DE RUTAS ---
// A partir de aquí, el middleware 'auth' verificará el token JWT
app.use(auth);

// --- RUTAS PROTEGIDAS ---
// Solo se puede acceder a estas si el middleware 'auth' da el visto bueno
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

// 404 para todo lo demás
app.use((req, res) => {
  res.status(404).json({ message: 'Recurso solicitado no encontrado' });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});