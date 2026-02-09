const Card = require('../models/card');

const BAD_REQUEST = 400;
const FORBIDDEN = 403; // Nuevo: Para cuando no eres el dueño
const NOT_FOUND = 404;
const DEFAULT_ERROR = 500;

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(DEFAULT_ERROR).send({ message: 'Error del servidor' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Datos inválidos' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Error del servidor' });
    });
};

// --- AJUSTE EN DELETECARD (Paso 9) ---
module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .orFail() // Si no existe, lanza DocumentNotFoundError
    .then((card) => {
      // Verificamos si el dueño de la tarjeta es el mismo que está logueado
      // Usamos .toString() porque card.owner es un ObjectId de MongoDB
      if (card.owner.toString() !== req.user._id) {
        return res.status(FORBIDDEN).send({ message: 'No tienes permiso para borrar esta tarjeta' });
      }

      // Si pasa la validación, la borramos
      return Card.findByIdAndDelete(cardId)
        .then((deletedCard) => res.send(deletedCard));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'ID de tarjeta inválido' });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'Tarjeta no encontrada' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Error del servidor' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Datos inválidos' });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'Tarjeta no encontrada' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Error del servidor' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Datos inválidos' });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'Tarjeta no encontrada' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Error del servidor' });
    });
};
