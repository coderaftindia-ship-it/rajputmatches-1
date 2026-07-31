const mongoose = require("mongoose");

const ContactCMSSchema = new mongoose.Schema(
  {
    // ── Hero Section ────────────────────────────────────────────────
    heroSupertitle: { type: String, default: "At Your Service" },
    heroTitle: { type: String, default: "Premium Support & Concierge" },
    heroDescription: {
      type: String,
      default:
        "Experience personalized assistance from our dedicated team. Whether you need help with your profile or wish to learn more about our exclusive services, we are here for you.",
    },
    heroBgImage: { type: String, default: "" },

    // ── Info Cards ──────────────────────────────────────────────────
    addressTitle: { type: String, default: "Headquarters" },
    addressText: {
      type: String,
      default: "Flat No. 203, Green Heights,\nNear Kunal Tower, Sector 47,\nGurugram, Haryana, 122018",
    },
    emailTitle: { type: String, default: "Email Concierge" },
    email1: { type: String, default: "support@rajputmatch.com" },
    email2: { type: String, default: "parakram125@gmail.com" },
    phoneTitle: { type: String, default: "Direct Lines" },
    phone1: { type: String, default: "+91 123 456 7892" },
    phone2: { type: String, default: "+1 565 2145 962" },

    // ── Form Section ────────────────────────────────────────────────
    formHeading: { type: String, default: "Send a Message" },
    formSubheading: {
      type: String,
      default: "Fill out the form below and our team will get back to you promptly.",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactCMS", ContactCMSSchema);
