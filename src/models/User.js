const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 20,
      maxlength: 60,
      required: true,
      trim: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    address: {
      type: String,
      maxlength: 400,
      default: ''
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'owner'],
      default: 'user',
      required: true
    },
    storeIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      default: []
    }],
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ name: 'text', address: 'text' });

module.exports = mongoose.model('User', userSchema);
