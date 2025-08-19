const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { handleChangePassword } = require('../controllers/userController');

router.patch('/me/password', authMiddleware, handleChangePassword);

module.exports = router;
