const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 5,
  },
  review: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  image: {
    type: String,
    trim: true,
  },
  designation: {
    type: String,
    trim: true,
    default: "Verified Match",
  },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Reviews", ReviewSchema);
