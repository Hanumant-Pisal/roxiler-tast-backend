const { listStoresForUser, getOwnerStore, getOwnerStoreRatings } = require('../services/storeService');
const Store = require('../models/Store');

async function handleOwnerStoresList(req, res, next) {
  try {
    const stores = await Store.find({ ownerId: req.user.id })
      .select('name address avgRating ratingsCount createdAt')
      .sort({ createdAt: -1 });
    
    res.json({ 
      success: true,
      count: stores.length,
      data: stores 
    });
  } catch (err) {
    next(err);
  }
}

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
  handleOwnerStoreRatings,
  handleOwnerStoresList
};
