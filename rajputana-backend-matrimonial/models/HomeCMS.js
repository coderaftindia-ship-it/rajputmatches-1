const mongoose = require("mongoose");

const HomeCMSSchema = new mongoose.Schema(
  {
    // ── Banner Section ──────────────────────────────────────────────
    heroBadgeText: { type: String, default: "Trusted Since 2009" },
    heroTitleLine1: { type: String, default: "Where Royalty" },
    heroTitleLine2: { type: String, default: "Meets Destiny" },
    heroDescription: {
      type: String,
      default:
        "India's premium royal matrimonial service. Discover verified, dignified matches from distinguished families — crafted for unions that honour tradition and celebrate love.",
    },
    heroCTA1Text: { type: String, default: "Begin Your Journey" },
    heroCTA2Text: { type: String, default: "Explore Matches" },
    heroFooterNote: { type: String, default: "Free registration • No hidden charges" },
    bannerBgImage: { type: String, default: "" },

    // ── Banner Stats ────────────────────────────────────────────────
    stat1Value: { type: String, default: "100%" },
    stat1Label: { type: String, default: "Verified" },
    stat2Value: { type: String, default: "25,000+" },
    stat2Label: { type: String, default: "Members" },
    stat3Value: { type: String, default: "4.9" },
    stat3Label: { type: String, default: "Rating" },
    stat4Value: { type: String, default: "All" },
    stat4Label: { type: String, default: "Communities" },

    // ── Matchmaking Section ─────────────────────────────────────────
    matchBadgeText: { type: String, default: "Heritage & Rajput Legacy Matrimony" },
    matchHeading: {
      type: String,
      default: "Connecting Rajput Families with Trust Tradition & Lasting bonds",
    },
    matchDescription: {
      type: String,
      default:
        "Step into an exclusive, highly-trusted network designed for noble families. Here, every single profile is strictly verified, connections are deeply meaningful, and matches carry the potential for a lasting royal legacy.",
    },
    matchBullet1Title: { type: String, default: "Strict Verification" },
    matchBullet1Desc: { type: String, default: "100% ID & family check" },
    matchBullet2Title: { type: String, default: "Royal Custom Filters" },
    matchBullet2Desc: { type: String, default: "Match by heritage & values" },
    matchCTAText: { type: String, default: "Find Your Royal Match" },
    matchmakingImage: { type: String, default: "" },

    // ── Feature Section ─────────────────────────────────────────────
    featureSectionHeading: { type: String, default: "Premium Features" },
    feature1Title: { type: String, default: "Elite Rajput Profiles" },
    feature2Title: { type: String, default: "100% Privacy" },
    feature3Title: { type: String, default: "Personalized Matchmaking" },
    feature4Title: { type: String, default: "Connect with Trust" },
    feature5Title: { type: String, default: "Traditional Values" },

    // ── Happy Clients Stats Section ─────────────────────────────────
    statsHeading: { type: String, default: "Happy Clients, Real Stories" },
    statsSubheading: {
      type: String,
      default:
        "Thousands of Rajput families have found their perfect match through our platform. Here are their heartfelt stories.",
    },
    stat_members_value: { type: Number, default: 12500 },
    stat_members_label: { type: String, default: "Registered Members" },
    stat_matches_value: { type: Number, default: 3200 },
    stat_matches_label: { type: String, default: "Successful Matches" },
    stat_marriages_value: { type: Number, default: 980 },
    stat_marriages_label: { type: String, default: "Happy Marriages" },
    stat_satisfaction_value: { type: Number, default: 98 },
    stat_satisfaction_label: { type: String, default: "Satisfaction Rate" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HomeCMS", HomeCMSSchema);
