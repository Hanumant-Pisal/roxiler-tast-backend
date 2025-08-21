const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { allowRoles } = require('../middlewares/roleMiddleware');
const {
  handleUserStoreList,
  handleGetStoreById,
  handleOwnerStore,
  handleOwnerStoreRatings,
  handleOwnerStoresList
} = require('../controllers/storeController');


router.get('/', authMiddleware, allowRoles('user', 'admin', 'owner'), handleUserStoreList);


router.get('/:id', authMiddleware, allowRoles('user', 'admin', 'owner'), handleGetStoreById);


router.get('/owner/me/store', authMiddleware, allowRoles('owner'), handleOwnerStore);
// Get ratings for owner's stores
// Optional query params: 
// - storeId: filter by specific store
// - page: pagination page number
// - limit: items per page
// - search: search by user name/email/address
router.get('/owner/me/ratings', authMiddleware, allowRoles('owner'), handleOwnerStoreRatings);
router.get('/owner/me/stores', authMiddleware, allowRoles('owner'), handleOwnerStoresList);

module.exports = router;
