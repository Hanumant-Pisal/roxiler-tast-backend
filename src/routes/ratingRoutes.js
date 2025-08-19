const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { allowRoles } = require('../middlewares/roleMiddleware');
const { handleUpsertRating } = require('../controllers/ratingController');


router.put('/:storeId', authMiddleware, allowRoles('user'), handleUpsertRating);

module.exports = router;
