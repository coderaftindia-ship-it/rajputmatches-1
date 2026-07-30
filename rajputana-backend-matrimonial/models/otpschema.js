const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: function () {
      return !this.mobile;
    },
  },
  mobile: {
    type: String,
    required: function () {
      return !this.email;
    },
  },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 120 },
});

const OTP = mongoose.model("OTP", otpSchema);

module.exports = OTP;
