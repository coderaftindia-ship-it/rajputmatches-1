const mongoose = require("mongoose");

const SiteSettingsSchema = new mongoose.Schema(
  {
    companyName: { type: String, default: "Rajput Alliances" },
    tagline: { type: String, default: "Royal Matrimonial" },
    logo: { type: String, default: "" },
    copyrightText: {
      type: String,
      default: "© 2025-26 Rajput Alliances Matrimony. All Rights Reserved.",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteSettings", SiteSettingsSchema);
