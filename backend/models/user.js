const mongoose = require('mongoose');
const validator = require('validator'); // Importamos la librería que acabas de instalar

// Mantenemos tu regex para el avatar
const urlRegex = /^(https?:\/\/)(www\.)?[\w\-._~:/?#[\]@!$&'()*+,;=]+#?$/;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Jacques Cousteau' // Valor por defecto recomendado
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Explorador'
  },
  avatar: {
    type: String,
    required: true,
    match: urlRegex,
    default: 'https://practicum-content.s3.us-west-1.amazonaws.com/resources/frontend-developer/common/avatar.jpg'
  },
  // --- AÑADIMOS LOS NUEVOS CAMPOS AQUÍ ---
  email: {
    type: String,
    required: true,
    unique: true, // El email debe ser único
    validate: {
      validator: (v) => validator.isEmail(v), // Usamos el módulo validator
      message: 'Formato de correo electrónico incorrecto',
    },
  },
  password: {
    type: String,
    required: true,
    select: true, // Por ahora se devuelve en las solicitudes
  },
});

// Exportamos solo el modelo como es estándar en Node.js
module.exports = mongoose.model('user', userSchema);

