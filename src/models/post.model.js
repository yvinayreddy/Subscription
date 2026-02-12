const mongoose = require('mongoose');

const postSchema = mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
      trim: true,
    },
    caption: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    user: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

postSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);