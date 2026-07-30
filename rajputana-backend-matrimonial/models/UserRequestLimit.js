const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserRequestLimitSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "UserProfile",
    required: true,
    unique: true,
  },
  count: {
    type: Number,
    required: true,
    min: 0,
  },
  periodType: {
    type: String,
    enum: ["daily", "weekly", "monthly", "yearly", "custom", "lifetime"],
    required: true,
    default: "lifetime",
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("UserRequestLimit", UserRequestLimitSchema);
