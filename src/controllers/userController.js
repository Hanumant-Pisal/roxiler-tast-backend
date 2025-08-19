const { changePasswordSchema } = require('../utils/validators');
const { changeMyPassword } = require('../services/userService');

async function handleChangePassword(req, res, next) {
  try {
    const { error, value } = changePasswordSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    await changeMyPassword(req.user.id, value);
    res.json({ message: 'Password updated' });
  } catch (err) {
    next(err);
  }
}

module.exports = { handleChangePassword };
