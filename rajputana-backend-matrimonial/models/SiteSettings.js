const mongoose = require("mongoose");

const SiteSettingsSchema = new mongoose.Schema(
  {
    companyName: { type: String, default: "Rajput Matches" },
    tagline: { type: String, default: "Royal Matrimonial" },
    logo: { type: String, default: "" },
    copyrightText: {
      type: String,
      default: "© 2025-26 Rajput Matches Matrimony. All Rights Reserved.",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteSettings", SiteSettingsSchema);
