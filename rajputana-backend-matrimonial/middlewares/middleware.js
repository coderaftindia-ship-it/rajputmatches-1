const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs-extra");
const path = require("path");
const nodemailer = require("nodemailer");
const OTP = require("../models/otpschema");
const crypto = require("crypto");
const axios = require("axios");
const qs = require("qs");
const twilio = require("twilio");
const User = require("../models/UserProfile");
const VerifiedEmail = require("../models/VerifiedEmailSchema.js");

// Simple in-memory rate limiter for OTP sends (email => { count, firstSent, lastSent })
const otpRateLimit = new Map();

const sendOtp = async (to, otp) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn(`[OTP INFO] EMAIL_USER / EMAIL_PASS not configured in .env. OTP for ${to} is: ${otp}`);
      return { success: true, info: { dev: true } };
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Rajput Alliances" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: `Your Rajput Alliances Verification OTP`,
      html: `<p>Your OTP for email verification is <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, info };
  } catch (error) {
    console.error("Error sending OTP email:", error);
    if (process.env.NODE_ENV !== "production" || process.env.DEV_BYPASS_VERIFY === "true" || !process.env.EMAIL_USER) {
      console.log(`[DEV FALLBACK] OTP for ${to} is: ${otp}`);
      return { success: true, info: { dev: true } };
    }
    return { success: false, error: error.message };
  }
};

const generateOTP = async (identifier) => {
  try {
    // Basic rate-limiting: max 5 sends per hour per identifier, min 30s between sends
    const now = Date.now();
    const limit = otpRateLimit.get(identifier) || {
      count: 0,
      firstSent: now,
      lastSent: 0,
    };
    // reset hourly window
    if (now - limit.firstSent > 60 * 60 * 1000) {
      limit.count = 0;
      limit.firstSent = now;
    }
    // enforce 30s cooldown
    if (now - limit.lastSent < 30 * 1000) {
      return { success: false, message: "Too many requests. Please wait 30 seconds." };
    }
    // increment and check hourly limit
    limit.count += 1;
    limit.lastSent = now;
    otpRateLimit.set(identifier, limit);
    if (limit.count > 5) {
      return { success: false, message: "Exceeded maximum OTP requests. Try again later." };
    }

    const otpCode = crypto.randomInt(100000, 1000000).toString();
    const isEmail = identifier.includes("@");
    const expirationTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiration

    const filter = isEmail ? { email: identifier } : { mobile: identifier };
    const update = { otp: otpCode, expiresAt: expirationTime };

    // Store or update OTP in the database
    await OTP.findOneAndUpdate(filter, update, { upsert: true, new: true });

    if (isEmail) {
      const info = await sendOtp(identifier, otpCode);
      if (info.success) {
        console.log(`✅ OTP sent to email: ${identifier}`);

        // Dev bypass: automatically mark email as verified in dev mode
        if (process.env.DEV_BYPASS_VERIFY === "true") {
          try {
            await VerifiedEmail.updateOne(
              { email: identifier },
              { email: identifier, isVerified: true, verifiedAt: new Date() },
              { upsert: true }
            );
            console.log(`⚠️ DEV_BYPASS_VERIFY enabled: ${identifier} auto-verified.`);
          } catch (err) {
            console.error("Error auto-verifying email in dev bypass:", err.message);
          }
        }

        return { success: true, message: "OTP sent to email." };
      } else {
        console.error("❌ Error sending OTP email:", info.error);
        return { success: false, message: "Failed to send OTP email." };
      }
    } else {
      console.log(`✅ OTP sent to mobile: ${identifier}`);
      return { success: true, message: "OTP sent to mobile." };
    }
  } catch (error) {
    console.error("❌ Error generating OTP:", error);
    return { success: false, message: "Server error generating OTP." };
  }
};

const verifyOTP = async (identifier, enteredOTP) => {
  try {
    const query = identifier.includes("@")
      ? { email: identifier, otp: enteredOTP }
      : { mobile: identifier, otp: enteredOTP };

    const otpRecord = await OTP.findOne(query);

    if (!otpRecord) {
      return { success: false, message: "Invalid or expired OTP." };
    }

    await OTP.deleteOne({ _id: otpRecord._id });
    return { success: true, message: "OTP verified successfully." };
  } catch (error) {
    console.error("❌ Error verifying OTP:", error);
    return { success: false, message: "Server error verifying OTP." };
  }
};

// const verifyOTP = async (identifier, enteredOTP) => {
//   const query = identifier.includes("@")
//     ? { email: identifier, otp: enteredOTP }
//     : { mobile: identifier, otp: enteredOTP };

//   const otpRecord = await OTP.findOne(query);

//   if (!otpRecord) {
//     return 0;
//   }

//   await OTP.deleteOne({ _id: otpRecord._id });
//   return 1;
// };

const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    
    const userId = decoded.id || decoded._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.role !== "admin" && user.isEnable === false) {
      return res.status(403).json({ message: "Your account has been deleted." });
    }

    if (user.role !== "admin" && !user.isApproved) {
      return res.status(403).json({ message: "Khama Ghani, Hukum! Thank you for registering with Rajput Alliances. We will verify your account and email you once it is approved, so you can log in and create your profile." });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

const sendNotificationToAdmin = async (message) => {
  try {
    // Configure the email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL, // Send to admin email
      subject: "New User Registration Notification",
      text: message,
    };

    await transporter.sendMail(mailOptions);
    console.log("Admin notification sent successfully.");
  } catch (error) {
    console.error("Error sending admin notification:", error);
  }
};

const isUser = async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findById(userId).select("gender role");
  if (user?.role !== "user") {
    return res
      .status(403)
      .json({ message: "Access denied. User role required." });
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Access denied. Admin role required." });
  }
  next();
};

const ensureFolderExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

// Configure multer storage
const storage = multer.memoryStorage();

// File filter for valid image types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPEG, PNG, JPG, PDF, DOC, and DOCX are allowed."
      ),
      false
    );
  }
};

const multipleFileUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024, files: 10 }, // 2MB limit per file
}).array("avatars", 10);

const singleFileUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
}).single("avatar");

module.exports = {
  isAuth,
  isAdmin,
  isUser,
  generateOTP,
  verifyOTP,
  fileFilter,
  multipleFileUpload,
  singleFileUpload,
  sendNotificationToAdmin,
};
