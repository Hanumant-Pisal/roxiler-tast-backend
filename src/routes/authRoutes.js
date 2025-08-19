const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { handleSignup, handleLogin, handleLogout, handleMe, handleRefresh } = require('../controllers/authController');

router.post('/signup', handleSignup);
router.post('/login', handleLogin);
router.post('/logout', handleLogout);
router.get('/me', authMiddleware, handleMe);
router.post('/refresh', handleRefresh);

module.exports = router;
