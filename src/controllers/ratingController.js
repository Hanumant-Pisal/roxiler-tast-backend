const { ratingSchema } = require('../utils/validators');
const { upsertRating } = require('../services/ratingService');

async function handleUpsertRating(req, res, next) {
  try {
    const { error, value } = ratingSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const rating = await upsertRating({
      userId: req.user.id,
      storeId: req.params.storeId,
      value: value.value
    });

    res.json({ rating });
  } catch (err) {
    next(err);
  }
}

module.exports = { handleUpsertRating };
