const mongoose = require("mongoose");

const FeedbackReportSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["feedback", "report", "bug", "suggestion"],
      required: true,
      default: "feedback",
    },
    category: {
      type: String,
      enum: [
        "General Feedback",
        "Bug / Technical Issue",
        "Inappropriate Content",
        "Fake Profile",
        "Harassment",
        "Suggestion / Feature Request",
        "Payment Issue",
        "Other",
      ],
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    // Optional: reported profile (for profile-specific reports)
    reportedProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserProfile",
      default: null,
    },
    // Submitted by (if logged in user, else anonymous)
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserProfile",
      default: null,
    },
    submittedByName: {
      type: String,
      default: "Anonymous",
    },
    submittedByEmail: {
      type: String,
      default: "",
    },
    // Admin handling
    status: {
      type: String,
      enum: ["pending", "in_review", "resolved", "dismissed"],
      default: "pending",
    },
    adminNote: {
      type: String,
      default: "",
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    // Optional screenshot / image attachment (stored as base64)
    image: {
      data: { type: String, default: null },        // base64 encoded
      mimetype: { type: String, default: null },
      originalname: { type: String, default: null },
      size: { type: Number, default: null },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FeedbackReport", FeedbackReportSchema);
