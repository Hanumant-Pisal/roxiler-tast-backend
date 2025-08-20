const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { allowRoles } = require('../middlewares/roleMiddleware');
const {
  handleUserStoreList,
  handleGetStoreById,
  handleOwnerStore,
  handleOwnerStoreRatings
} = require('../controllers/storeController');


router.get('/', authMiddleware, allowRoles('user', 'admin', 'owner'), handleUserStoreList);


router.get('/:id', authMiddleware, allowRoles('user', 'admin', 'owner'), handleGetStoreById);


router.get('/owner/me/store', authMiddleware, allowRoles('owner'), handleOwnerStore);
router.get('/owner/me/ratings', authMiddleware, allowRoles('owner'), handleOwnerStoreRatings);

module.exports = router;
