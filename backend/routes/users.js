const router = require('express').Router();

const {
  getUsers,
  getUserById,
  // ✂️ Eliminamos createUser de aquí
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);

// ✂️ Eliminamos la ruta router.post('/', createUser);

router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router;

