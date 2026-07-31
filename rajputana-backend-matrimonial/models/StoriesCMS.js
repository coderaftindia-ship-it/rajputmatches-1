const mongoose = require("mongoose");

const StoriesCMSSchema = new mongoose.Schema(
  {
    heroSupertitle: { type: String, default: "Real Love Stories" },
    heroTitle: { type: String, default: "Where Tradition Meets <br/> True Love." },
    heroDescription: {
      type: String,
      default:
        "Discover how our exclusive matchmaking has helped countless couples build a beautiful legacy together. Your forever begins right here.",
    },
    vvipTitle: { type: String, default: "VVIP Services for Ultimate Discretion" },
    vvipDescription: {
      type: String,
      default:
        "For those seeking an even more exclusive experience, our VVIP membership provides a personal matchmaking manager, access to non-listed profiles, and personalized introductions.",
    },
    vvipButtonText: { type: String, default: "Join the Rajput Legacy" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StoriesCMS", StoriesCMSSchema);
