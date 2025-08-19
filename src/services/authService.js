const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const { signAccessToken, signRefreshToken } = require('../utils/tokenUtils');

async function signup({ name, email, address, password }) {
  const exists = await User.findOne({ email });
  if (exists) throw new Error('Email already registered');

  const passwordHash = await hashPassword(password);
  const user = await User.create({
    name,
    email,
    address,
    passwordHash,
    role: 'user'
  });

  const payload = { id: user._id.toString(), role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  return { user, accessToken, refreshToken };
}

async function login({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');

  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) throw new Error('Invalid credentials');

  const payload = { id: user._id.toString(), role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  return { user, accessToken, refreshToken };
}

module.exports = { signup, login };
