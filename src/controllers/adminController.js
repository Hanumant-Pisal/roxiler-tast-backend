const { createUserSchema, createStoreSchema } = require('../utils/validators');
const { adminCreateUser, adminListUsers, adminGetUserById } = require('../services/userService');
const { adminCreateStore, adminListStores } = require('../services/storeService');
const User = require('../models/User');
const Store = require('../models/Store');
const Rating = require('../models/Rating');

async function handleAdminCreateUser(req, res, next) {
  try {
    const { error, value } = createUserSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const user = await adminCreateUser(value);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
}

async function handleAdminListUsers(req, res, next) {
  try {
    const result = await adminListUsers(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function handleAdminGetUser(req, res, next) {
  try {
    const user = await adminGetUserById(req.params.id);
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

async function handleAdminCreateStore(req, res, next) {
  try {
    const { error, value } = createStoreSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const store = await adminCreateStore(value);
    res.status(201).json({ store });
  } catch (err) {
    next(err);
  }
}

async function handleAdminListStores(req, res, next) {
  try {
    const result = await adminListStores(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function handleAdminStats(_req, res, next) {
  try {
    const [users, stores, ratings] = await Promise.all([
      User.countDocuments(),
      Store.countDocuments(),
      Rating.countDocuments()
    ]);
    res.json({ users, stores, ratings });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  handleAdminCreateUser,
  handleAdminListUsers,
  handleAdminGetUser,
  handleAdminCreateStore,
  handleAdminListStores,
  handleAdminStats
};
