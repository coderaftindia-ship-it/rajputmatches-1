const mongoose = require("mongoose");

const SocialLinksSchema = new mongoose.Schema(
  {
    facebook:  { type: String, default: "#" },
    instagram: { type: String, default: "#" },
    whatsapp:  { type: String, default: "#" },
    telegram:  { type: String, default: "#" },
    youtube:   { type: String, default: ""  },
    twitter:   { type: String, default: ""  },
    linkedin:  { type: String, default: ""  },
    phone:     { type: String, default: ""  },
    email:     { type: String, default: ""  },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SocialLinks", SocialLinksSchema);
