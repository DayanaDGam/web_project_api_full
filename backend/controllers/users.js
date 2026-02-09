const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Constantes de estados de error
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const NOT_FOUND = 404;
const CONFLICT = 409;
const DEFAULT_ERROR = 500;

// Obtener todos los usuarios
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(DEFAULT_ERROR).send({ message: 'Error del servidor' }));
};

// Obtener usuario por ID
module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') return res.status(BAD_REQUEST).send({ message: 'ID inválido' });
      if (err.name === 'DocumentNotFoundError') return res.status(NOT_FOUND).send({ message: 'Usuario no encontrado' });
      return res.status(DEFAULT_ERROR).send({ message: 'Error del servidor' });
    });
};

// OBTENER USUARIO ACTUAL (Paso 6)
module.exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') return res.status(NOT_FOUND).send({ message: 'Usuario no encontrado' });
      return res.status(DEFAULT_ERROR).send({ message: 'Error del servidor' });
    });
};

// CREAR USUARIO / SIGNUP (Paso 2)
module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      const userResponse = user.toObject();
      delete userResponse.password;
      res.status(201).send(userResponse);
    })
    .catch((err) => {
      if (err.code === 11000) return res.status(CONFLICT).send({ message: 'El correo ya existe' });
      if (err.name === 'ValidationError') return res.status(BAD_REQUEST).send({ message: 'Datos inválidos' });
      return res.status(DEFAULT_ERROR).send({ message: 'Error del servidor' });
    });
};

// LOGIN (Paso 3)
module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) return Promise.reject(new Error('Correo o contraseña incorrectos'));
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) return Promise.reject(new Error('Correo o contraseña incorrectos'));
          const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
          res.send({ token });
        });
    })
    .catch((err) => res.status(UNAUTHORIZED).send({ message: err.message }));
};

// Actualizar Perfil
module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => res.status(BAD_REQUEST).send({ message: 'Error al actualizar' }));
};

// Actualizar Avatar
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => res.status(BAD_REQUEST).send({ message: 'Error al actualizar avatar' }));
};