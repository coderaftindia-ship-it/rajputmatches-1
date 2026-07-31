const mongoose = require("mongoose");

const featureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true }
});

const aboutUsSchema = new mongoose.Schema(
  {
    // Hero Section
    heroSubtitle: {
      type: String,
      default: "Who We Are"
    },
    heroTitleLine1: {
      type: String,
      default: "Celebrating Rajput Legacy,"
    },
    heroTitleLine2: {
      type: String,
      default: "Connecting Hearts"
    },
    heroDescription: {
      type: String,
      default: "Dedicated to uniting Rajput families through meaningful matches, we honor tradition while embracing modern connections."
    },
    heroImage: {
      type: String,
      default: ""
    },

    // Story Cards Section
    card1Text: {
      type: String,
      default: "Welcome to Rajput Matches, the premier matrimonial platform designed exclusively for the Rajput community. Our mission is to bring together Rajput families from across the globe and help them build meaningful connections rooted in shared values, traditions, and cultural heritage."
    },
    card1Image: {
      type: String,
      default: ""
    },
    card2Text: {
      type: String,
      default: "At Rajput Matches, we understand the importance of preserving Rajput pride and customs, which is why we’ve created a trusted platform tailored specifically to your community's unique needs."
    },
    card2Image: {
      type: String,
      default: ""
    },

    // Join Banner Image Section
    bannerImage: {
      type: String,
      default: ""
    },

    // Legacy Section
    legacyTitle: {
      type: String,
      default: "Our Legacy of Trust and Tradition"
    },
    legacyParagraph1: {
      type: String,
      default: "The Rajput community has a long-standing legacy of honor, pride, and cultural richness. At Rajput Matches, we aim to reflect these values by fostering a trustworthy environment where families can come together to find the perfect match."
    },
    legacyParagraph2: {
      type: String,
      default: "We believe that marriage is not just a union of two individuals but a bond between two families. With this philosophy, we ensure that every match we facilitate is built on shared respect and understanding."
    },
    legacyLeftImage: {
      type: String,
      default: ""
    },
    legacyRightImage: {
      type: String,
      default: ""
    },

    // Why Choose Section
    whyChooseHeading: {
      type: String,
      default: "Why Choose Rajput Matches?"
    },
    whyChooseImage: {
      type: String,
      default: ""
    },
    whyChooseFeatures: {
      type: [featureSchema],
      default: [
        {
          title: "Exclusively for the Rajput Community",
          description: "Our platform is tailored to the needs and preferences of Rajput families, making it easier to find matches within the community."
        },
        {
          title: "Verified Profiles",
          description: "We prioritize your safety by ensuring every profile is thoroughly verified."
        },
        {
          title: "Advanced Matchmaking",
          description: "Our platform suggests compatible matches based on your preferences, including education, profession, lifestyle, and values."
        },
        {
          title: "Respect for Traditions",
          description: "We understand the importance of Rajput customs and ensure they are honored throughout the matchmaking process."
        },
        {
          title: "Dedicated Support",
          description: "Our team is here to assist you at every step, ensuring a seamless experience."
        }
      ]
    },

    // CTA VVIP Section
    vvipTitle: {
      type: String,
      default: "Start Your Journey to a Royal Match Today"
    },
    vvipDescription: {
      type: String,
      default: "Join Rajput Matches and embark on a journey to find your perfect partner within a community that respects your legacy and honors your privacy. Let us guide you in finding a partner who complements your values, lifestyle, and heritage."
    },
    vvipButtonText: {
      type: String,
      default: "Join the Rajput Legacy"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("AboutUs", aboutUsSchema);
