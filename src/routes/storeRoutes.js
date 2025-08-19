const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { allowRoles } = require('../middlewares/roleMiddleware');
const {
  handleUserStoreList,
  handleGetStoreById,
  handleOwnerStore,
  handleOwnerStoreRatings
} = require('../controllers/storeController');

// Normal user: list/search stores
router.get('/', authMiddleware, allowRoles('user', 'admin', 'owner'), handleUserStoreList);

// Details (any logged-in role)
router.get('/:id', authMiddleware, allowRoles('user', 'admin', 'owner'), handleGetStoreById);

// Owner dashboard
router.get('/owner/me/store', authMiddleware, allowRoles('owner'), handleOwnerStore);
router.get('/owner/me/ratings', authMiddleware, allowRoles('owner'), handleOwnerStoreRatings);

module.exports = router;
