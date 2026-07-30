const mongoose = require("mongoose");

const LimitSchema = new mongoose.Schema({
  freeMessageLimit: {
    type: Number,
    required: true,
    min: 0,
    max: 999,
    default: 5,
  },
  freeProfileViews: {
    type: Number,
    required: true,
    min: 0,
    max: 100000,
    default: 2,
  },
  freeRequestSendLimit: {
    type: Number,
    required: true,
    min: 0,
    max: 99999,
    default: 5,
  },
  premiumRequestSendLimit: {
    type: Number,
    required: true,
    min: 0,
    max: 99999,
    default: 100,
  },
  freeLimit: {
    count: { type: Number, default: 2 },
    periodType: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly", "custom", "lifetime"],
      default: "lifetime",
    },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  premiumLimit: {
    count: { type: Number, default: 50 },
    periodType: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly", "custom", "lifetime"],
      default: "lifetime",
    },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Limit", LimitSchema);

