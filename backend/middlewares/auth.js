const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // 1. Obtenemos el encabezado de autorización
  const { authorization } = req.headers;

  // 2. Verificamos que el encabezado exista y empiece por 'Bearer '
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Error de autorización' });
  }

  // 3. Extraemos el token (quitamos la palabra 'Bearer ')
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    // 4. Verificamos el token con la clave secreta
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    // Si el token es inválido o expiró
    return res.status(401).send({ message: 'Error de autorización' });
  }

  // 5. Añadimos el payload al objeto user y pasamos al siguiente middleware
  req.user = payload;
  next();
};