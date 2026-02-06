const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Importamos JWT
const User = require('../models/user');

// ... tus otras constantes y controladores (getUsers, createUser, etc) ...

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  // 1. Buscamos al usuario por correo y pedimos explícitamente el password
  // (porque en el esquema solemos ocultarlo con select: false)
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        // Si no hay usuario, lanzamos error 401
        return Promise.reject(new Error('Correo o contraseña incorrectos'));
      }

      // 2. Comparamos la contraseña enviada con el hash de la base de datos
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            // Si la contraseña no coincide, error 401
            return Promise.reject(new Error('Correo o contraseña incorrectos'));
          }

          // 3. Si todo es correcto, creamos el token que expira en 7 días
          const token = jwt.sign(
            { _id: user._id }, // El payload solo lleva el id
            'some-secret-key', // Esta clave debe ser secreta (luego la pondremos en un .env)
            { expiresIn: '7d' } // Expira en una semana
          );

          // 4. Enviamos el token al cliente en el cuerpo de la respuesta
          res.send({ token });
        });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};