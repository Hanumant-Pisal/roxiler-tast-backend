const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { allowRoles } = require('../middlewares/roleMiddleware');
const {
    handleAdminCreateUser,
    handleAdminListUsers,
    handleAdminGetUser,
    handleAdminCreateStore,
    handleAdminListStores,
    handleAdminStats
} = require('../controllers/adminController');

router.use(authMiddleware, allowRoles('admin'));


router.post('/users', handleAdminCreateUser);
router.get('/users', handleAdminListUsers);
router.get('/users/:id', handleAdminGetUser);


router.post('/stores', handleAdminCreateStore);
router.get('/stores', handleAdminListStores);


router.get('/stats', handleAdminStats);

module.exports = router;
