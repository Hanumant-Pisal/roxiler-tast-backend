const { listStoresForUser, getOwnerStore, getOwnerStoreRatings } = require('../services/storeService');
const Store = require('../models/Store');

async function handleUserStoreList(req, res, next) {
  try {
    const data = await listStoresForUser(req.user.id, req.query);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function handleGetStoreById(req, res, next) {
  try {
    const store = await Store.findById(req.params.id, 'name address avgRating ratingsCount ownerId').lean();
    if (!store) return res.status(404).json({ message: 'Store not found' });
    res.json({ store });
  } catch (err) {
    next(err);
  }
}

async function handleOwnerStore(req, res, next) {
  try {
    const store = await getOwnerStore(req.user.id);
    res.json({ store });
  } catch (err) {
    next(err);
  }
}

async function handleOwnerStoreRatings(req, res, next) {
  try {
    const data = await getOwnerStoreRatings(req.user.id, req.query);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  handleUserStoreList,
  handleGetStoreById,
  handleOwnerStore,
  handleOwnerStoreRatings
};
