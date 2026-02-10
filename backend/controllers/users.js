const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Constantes de estados de error (se mantienen para construir los objetos de error)
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const NOT_FOUND = 404;
const CONFLICT = 409;

// Obtener todos los usuarios
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next); // Pasa cualquier error al manejador central (500 por defecto)
};

// Obtener usuario por ID
module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new Error('ID de usuario inválido');
        error.statusCode = BAD_REQUEST;
        return next(error);
      }
      if (err.name === 'DocumentNotFoundError') {
        const error = new Error('Usuario no encontrado');
        error.statusCode = NOT_FOUND;
        return next(error);
      }
      next(err);
    });
};

// OBTENER USUARIO ACTUAL
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        const error = new Error('Usuario no encontrado');
        error.statusCode = NOT_FOUND;
        return next(error);
      }
      next(err);
    });
};

// CREAR USUARIO / SIGNUP
module.exports.createUser = (req, res, next) => {
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
      if (err.code === 11000) {
        const error = new Error('El correo ya existe');
        error.statusCode = CONFLICT;
        return next(error);
      }
      if (err.name === 'ValidationError') {
        const error = new Error('Datos de usuario inválidos');
        error.statusCode = BAD_REQUEST;
        return next(error);
      }
      next(err);
    });
};

// LOGIN
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        const error = new Error('Correo o contraseña incorrectos');
        error.statusCode = UNAUTHORIZED;
        throw error;
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            const error = new Error('Correo o contraseña incorrectos');
            error.statusCode = UNAUTHORIZED;
            throw error;
          }

          // MODIFICACIÓN AQUÍ: Usamos tu clave secreta de 2026
          const secretKey = process.env.NODE_ENV === 'production'
            ? process.env.JWT_SECRET
            : 'proyecto_api_full_19_tripleten_2026';

          const token = jwt.sign(
            { _id: user._id },
            secretKey,
            { expiresIn: '7d' }
          );

          res.send({ token });
        });
    })
    .catch(next);
};

// Actualizar Perfil
module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new Error('Datos inválidos para actualizar perfil');
        error.statusCode = BAD_REQUEST;
        return next(error);
      }
      next(err);
    });
};

// Actualizar Avatar
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new Error('URL de avatar inválida');
        error.statusCode = BAD_REQUEST;
        return next(error);
      }
      next(err);
    });
};