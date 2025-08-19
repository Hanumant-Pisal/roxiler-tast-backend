const { verifyAccessToken } = require('../utils/tokenUtils');
const User = require('../models/User');

async function authMiddleware(req, res, next) {
  try {
    let token = null;

   
    if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const payload = verifyAccessToken(token);
    if (!payload) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    const user = await User.findById(payload.id).lean();
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = { id: user._id.toString(), role: user.role, email: user.email, name: user.name, storeId: user.storeId || null };
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = authMiddleware;
