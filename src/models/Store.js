const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      default: '',
      trim: true,
      lowercase: true
    },
    address: {
      type: String,
      required: true,
      maxlength: 400,
      trim: true
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    avgRating: {
      type: Number,
      default: 0
    },
    ratingsCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

storeSchema.index({ name: 'text', address: 'text' });
storeSchema.index({ ownerId: 1 });

module.exports = mongoose.model('Store', storeSchema);
