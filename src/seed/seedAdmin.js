// Creates an initial admin user if not present.
const { connectDB } = require('../config/db');
const User = require('../models/User');
const { hashPassword } = require('../utils/passwordUtils');

(async () => {
  try {
    await connectDB();

    const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
    const name = process.env.SEED_ADMIN_NAME || 'System Administrator Account';
    const address = process.env.SEED_ADMIN_ADDRESS || 'HQ';
    const password = process.env.SEED_ADMIN_PASSWORD || 'Admin@123';

    let user = await User.findOne({ email });
    if (user) {
      console.log('Admin already exists:', email);
      process.exit(0);
    }

    const passwordHash = await hashPassword(password);
    user = await User.create({
      name,
      email,
      address,
      passwordHash,
      role: 'admin'
    });

    console.log('Admin created:', { email, password });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
