const User = require('../models/User');
const Store = require('../models/Store');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');

function buildUserFilters({ name, email, address, role }) {
  const filter = {};
  if (role) filter.role = role;
  const regex = (v) => ({ $regex: v, $options: 'i' });

  if (name) filter.name = regex(name);
  if (email) filter.email = regex(email);
  if (address) filter.address = regex(address);

  return filter;
}


async function adminCreateUser({ name, email, address, password, role }) {
  const exists = await User.findOne({ email });
  if (exists) throw new Error('Email already registered');
  const passwordHash = await hashPassword(password);
  const user = await User.create({ name, email, address, passwordHash, role });
  return user;
}


async function adminListUsers(query) {
  const { page = 1, limit = 10 } = query;
  const filter = buildUserFilters(query);

  const [items, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)).lean(),
    User.countDocuments(filter)
  ]);

  return { items, total, page: Number(page), limit: Number(limit) };
}


async function adminGetUserById(userId) {
  const user = await User.findById(userId).lean();
  if (!user) throw new Error('User not found');

  let ownerStore = null;
  if (user.role === 'owner') {
    ownerStore = await Store.findOne({ ownerId: user._id }, 'name avgRating ratingsCount').lean();
  }

  return { ...user, ownerStore };
}


async function changeMyPassword(userId, { currentPassword, newPassword }) {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const ok = await comparePassword(currentPassword, user.passwordHash);
  if (!ok) throw new Error('Current password is incorrect');

  user.passwordHash = await hashPassword(newPassword);
  await user.save();
  return true;
}

module.exports = {
  adminCreateUser,
  adminListUsers,
  adminGetUserById,
  changeMyPassword
};
