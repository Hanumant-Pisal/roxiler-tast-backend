const { signupSchema, loginSchema } = require('../utils/validators');
const { signup, login } = require('../services/authService');
const { verifyRefreshToken, signAccessToken, signRefreshToken } = require('../utils/tokenUtils');
const { env } = require('../config/env');
const User = require('../models/User');

const cookieOpts = (maxAgeMs) => ({
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: maxAgeMs
});

function sanitizeUser(u) {
  return { id: u._id, name: u.name, email: u.email, role: u.role, address: u.address, storeId: u.storeId || null };
}

async function handleSignup(req, res, next) {
  try {
    const { error, value } = signupSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const { user, accessToken, refreshToken } = await signup(value);

    res
      .cookie('accessToken', accessToken, cookieOpts(15 * 60 * 1000))
      .cookie('refreshToken', refreshToken, cookieOpts(7 * 24 * 60 * 60 * 1000))
      .status(201)
      .json({ user: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
}

async function handleLogin(req, res, next) {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const { user, accessToken, refreshToken } = await login(value);

    res
      .cookie('accessToken', accessToken, cookieOpts(15 * 60 * 1000))
      .cookie('refreshToken', refreshToken, cookieOpts(7 * 24 * 60 * 60 * 1000))
      .json({ user: sanitizeUser(user), tokens: {
        accessToken,
        refreshToken,
      } });
  } catch (err) {
    next(err);
  }
}

async function handleLogout(_req, res) {
  res.clearCookie('accessToken').clearCookie('refreshToken').json({ message: 'Logged out' });
}




async function handleMe(req, res, next) {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
}

async function handleRefresh(req, res, next) {
  try {
    const rToken = req.cookies?.refreshToken;
    if (!rToken) return res.status(401).json({ message: 'No refresh token' });

    const payload = verifyRefreshToken(rToken);
    if (!payload) return res.status(401).json({ message: 'Invalid refresh token' });

    const user = await User.findById(payload.id).lean();
    if (!user) return res.status(401).json({ message: 'User not found' });

    const newAccess = signAccessToken({ id: user._id.toString(), role: user.role });
    const newRefresh = signRefreshToken({ id: user._id.toString(), role: user.role });

    res
      .cookie('accessToken', newAccess, cookieOpts(15 * 60 * 1000))
      .cookie('refreshToken', newRefresh, cookieOpts(7 * 24 * 60 * 60 * 1000))
      .json({ message: 'refreshed' });
  } catch (err) {
    next(err);
  }
}

module.exports = { handleSignup, handleLogin, handleLogout, handleMe, handleRefresh };
