const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
  {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true

    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    value: {
      type: Number,
      min: 1, max: 5,
      required: true
    }
  },
  { timestamps: true }
);

ratingSchema.index({ storeId: 1, userId: 1 }, { unique: true });
ratingSchema.index({ storeId: 1 });
ratingSchema.index({ userId: 1 });

module.exports = mongoose.model('Rating', ratingSchema);
