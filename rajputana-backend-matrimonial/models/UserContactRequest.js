const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserContactRequestSchema = new Schema({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: "UserProfile",
    required: true,
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: "UserProfile",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

UserContactRequestSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });

module.exports = mongoose.model("UserContactRequest", UserContactRequestSchema);
