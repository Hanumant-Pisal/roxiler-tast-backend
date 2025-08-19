const mongoose = require('mongoose');
const Rating = require('../models/Rating');
const Store = require('../models/Store');

async function upsertRating({ userId, storeId, value }) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const store = await Store.findById(storeId).session(session);
    if (!store) throw new Error('Store not found');

    const existing = await Rating.findOne({ storeId, userId }).session(session);

    let newRatingDoc = null;

    if (!existing) {
      newRatingDoc = await Rating.create([{ storeId, userId, value }], { session });
      const newCount = store.ratingsCount + 1;
      const newAvg = (store.avgRating * store.ratingsCount + value) / newCount;

      store.ratingsCount = newCount;
      store.avgRating = Number(newAvg.toFixed(2));
      await store.save({ session });
    } else if (existing.value !== value) {
      const old = existing.value;
      existing.value = value;
      await existing.save({ session });

      
      const newAvg = (store.avgRating * store.ratingsCount - old + value) / store.ratingsCount;
      store.avgRating = Number(newAvg.toFixed(2));
      await store.save({ session });
      newRatingDoc = existing;
    } else {
    
      newRatingDoc = existing;
    }

    await session.commitTransaction();
    session.endSession();
    return Array.isArray(newRatingDoc) ? newRatingDoc[0] : newRatingDoc;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}

module.exports = { upsertRating };
