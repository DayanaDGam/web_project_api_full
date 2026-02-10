const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Error de autorización' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {

    const secretKey = process.env.NODE_ENV === 'production'
      ? process.env.JWT_SECRET
      : 'proyecto_api_full_19_tripleten_2026';


    payload = jwt.verify(token, secretKey);
  } catch (err) {
    return res.status(401).send({ message: 'Error de autorización' });
  }

  req.user = payload;
  next();
};