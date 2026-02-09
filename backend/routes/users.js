const router = require('express').Router();
const {
  getUsers,
  getUserById,
  getCurrentUser, // Importamos el nuevo controlador
  updateProfile,
  updateAvatar
} = require('../controllers/users');

router.get('/me', getCurrentUser); // Esta es la nueva ruta
router.get('/', getUsers);
router.get('/:userId', getUserById);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router;

