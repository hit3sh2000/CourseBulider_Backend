const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: true
    },
    cartItems: [
      {
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Course'
        },
        universityId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'University'
        }
      }
    ]
  }, { timestamps: true });

module.exports = mongoose.model("Cart", cartSchema);