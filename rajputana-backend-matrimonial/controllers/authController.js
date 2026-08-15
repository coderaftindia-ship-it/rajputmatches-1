const User = require("../models/UserProfile.js");
const HoroscopeDetails = require("../models/HoroscopeDetails");
const FamilyDetails = require("../models/FamilyDetails");
const ProfessionalDetails = require("../models/ProfessionalDetails");
const ExtendedFamily = require("../models/ExtendedFamilyDetails.js");
const { ProfileView, VisitedProfile } = require("../models/profileView.js");
const Notification = require("../models/NotificationSchema.js");
const Limit = require("../models/LimitSchema.js");

const files = require("../models/PhotoSchema.js");
const Stories = require("../models/StoriesSchema.js");
const Reviews = require("../models/ReviewSchema.js");
const UserLimit = require("../models/UserLimit.js");
const UserRequestLimit = require("../models/UserRequestLimit.js");
const VerifiedEmail = require("../models/VerifiedEmailSchema.js");
const ContactRequest = require("../models/ContactRequest.js");
const UserContactRequest = require("../models/UserContactRequest.js");

const Message = require("../models/Messages.js");
const Chat = require("../models/Chat.js");
const fs = require("fs-extra");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const {
  generateOTP,
  verifyOTP,
  sendNotificationToAdmin,
} = require("../middlewares/middleware.js");

const { generateToken, getNextMatrimonyId } = require("../utils/utility.js");
const { sendEmail } = require("../utils/email.js");
const express = require("express");
const mongoose = require("mongoose");

exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      mobile,
      email,
      dateOfBirth,
      gender,
      profilefor,
      password,
      countryCode,
    } = req.body;

    if (!firstName || !email || !mobile || !password || !countryCode) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "Invalid email format", success: false });
    }

    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobile)) {
      return res
        .status(400)
        .json({ message: "Invalid mobile number format", success: false });
    }

    const cleanEmail = email ? email.trim().toLowerCase() : "";
    const safeEmailRegex = new RegExp(`^${cleanEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");

    const existingUser = await User.findOne({
      $or: [
        { email: safeEmailRegex },
        { email: cleanEmail },
        { mobile: mobile }
      ],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email or mobile",
        success: false,
      });
    }

    const verifiedEmail = await VerifiedEmail.findOne({
      $or: [{ email: safeEmailRegex }, { email: cleanEmail }]
    });

    if (!verifiedEmail || !verifiedEmail.isVerified) {
      return res.status(404).json({
        message:
          "Email is not verified. Please verify your email before signing up.",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const matrimoniId = await getNextMatrimonyId();

    const user = await User.create({
      martrId: matrimoniId,
      firstName,
      middleName: req.body.middleName || "",
      lastName,
      countryCode,
      mobile,
      email: cleanEmail,
      dateOfBirth,
      gender,
      password: hashedPassword,
      profilefor,
      address: {
        country: req.body.country,
        state: req.body.state,
        city: req.body.city,
        district: req.body.district || "",
        street: req.body.street || "",
        zipCode: req.body.zipCode || "",
      },
    });

    res.status(201).json({
      message: "Khama Ghani, Hukum!\n\nThank you for registering with Rajput Alliances. We will verify your account and email you once it is approved, so you can log in and create your profile.",
      user,
      success: true,
    });
  } catch (error) {
    console.log("Error during signup:", error);
    res.status(500).json({
      message: "Server error. Please try again later.",
      success: false,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log(username);
    console.log(password);

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const cleanUsername = username.trim();
    const safeUsernameRegex = new RegExp(`^${cleanUsername.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");

    const user = await User.findOne({
      $or: [
        { email: safeUsernameRegex },
        { email: cleanUsername.toLowerCase() },
        { mobile: cleanUsername }
      ],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    if (user.isEnable === false) {
      return res.status(403).json({
        message: "Your account has been deleted. You cannot log in with this account.",
        success: false,
      });
    }

    if (user.role !== "admin" && !user.isApproved) {
      return res.status(403).json({
        message: "Khama Ghani, Hukum! Thank you for registering with Rajput Alliances. We will verify your account and email you once it is approved, so you can log in and create your profile.",
        success: false
      });
    }

    const token = generateToken(user._id);

    // await Notification.create({
    //   userId: user._id,
    //   type: "login",
    //   message: `${firstName}! logged in .`,
    // });
    console.log(token);
    res.status(200).json({ message: "Login successful", token: token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: "Email or Mobile is required." });
    }

    const user = await User.findOne({
      $or: [{ email: username }, { mobile: username }],
    }).select("name email mobile");

    if (!user) {
      return res.status(404).json({ message: "User not found with this Email or Mobile." });
    }

    if (!user.email) {
      return res.status(400).json({ message: "No registered email address found for this user." });
    }

    const resetToken = generateToken(user._id);
    let frontendUrl = process.env.FRONTEND_URL || "https://rajputalliances.com";
    if (frontendUrl.includes("localhost")) {
      frontendUrl = "https://rajputalliances.com";
    }
    frontendUrl = frontendUrl.replace(/\/$/, "");
    const resetLink = `${frontendUrl}/set-new-password?token=${resetToken}&userid=${user._id}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 25px; background-color: #fff8f0; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0c8b0; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #6b0f24; font-family: Georgia, serif; margin-bottom: 5px;">Rajput Alliances</h2>
          <p style="color: #b8860b; font-style: italic; margin-top: 0;">Connecting Rajputs Worldwide</p>
        </div>
        <hr style="border: none; border-top: 1px solid #d4af37; margin: 20px 0;" />
        <p style="font-size: 16px;">Hello <strong>${user.name || "Member"}</strong>,</p>
        <p style="font-size: 15px; line-height: 1.5;">We received a request to reset your password. Click the button below to set up a new password for your account:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #6b0f24; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 10px rgba(107,15,36,0.25);">
            Reset Password
          </a>
        </div>
        <p style="font-size: 13px; color: #666;">If the button above does not work, copy and paste this link into your browser:</p>
        <p style="font-size: 13px; word-break: break-all;"><a href="${resetLink}" style="color: #6b0f24;">${resetLink}</a></p>
        <hr style="border: none; border-top: 1px solid #e0c8b0; margin: 25px 0 15px 0;" />
        <p style="font-size: 12px; color: #888; text-align: center;">If you did not request a password reset, please ignore this email.</p>
      </div>
    `;

    await sendEmail(user.email, "Reset Your Password - Rajput Alliances", htmlContent);

    return res.status(200).json({ message: "Password reset link sent successfully to your email." });
  } catch (error) {
    console.error("Error during forgot password:", error);
    return res.status(500).json({ message: "Failed to send password reset email.", error: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { username, otp } = req.body;

    console.log(req.body);

    let resp = await verifyOTP(username, otp);

    if (!resp.success) {
      return res.status(400).json({ message: "Invalid or Expired Otp" });
    }
    const user = await User.findOne({
      $or: [{ email: username }, { mobile: username }],
    });
    if (user && user.isEnable === false) {
      return res.status(403).json({
        message: "Your account has been deleted. You cannot log in with this account.",
        success: false,
      });
    }
    const token = generateToken(user._id);
    return res
      .status(200)
      .json({ message: "Otp Verified Successful", token: token });
  } catch (error) {
    console.error("Error during forgot password:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
exports.sendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ message: "Email is required", success: false });
    }

    let resp = await generateOTP(email);

    if (!resp?.success) {
      return res.status(400).json({
        message: resp?.message || "Failed to send OTP. Please try again.",
        success: false,
      });
    }

    res
      .status(200)
      .json({ message: "OTP sent successfully to your email.", success: true });
  } catch (error) {
    console.error("Error during sendVerification:", error);
    res.status(500).json({ message: "Server error sending OTP", success: false, error: error.message });
  }
};

exports.emailVerifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ message: "Email and OTP are required", success: false });
    }

    const cleanEmail = email.trim().toLowerCase();
    let resp = await verifyOTP(cleanEmail, otp);

    if (!resp?.success) {
      return res
        .status(400)
        .json({ message: "Invalid or Expired OTP", success: false });
    }

    let existingRecord = await VerifiedEmail.findOne({
      $or: [
        { email: cleanEmail },
        { email: new RegExp(`^${cleanEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") }
      ]
    });

    if (existingRecord) {
      if (existingRecord.isVerified) {
        return res
          .status(200)
          .json({ message: "Email is already verified", success: true });
      }
      existingRecord.isVerified = true;
      await existingRecord.save();
    } else {
      await VerifiedEmail.create({ email: cleanEmail, isVerified: true });
    }

    return res
      .status(200)
      .json({ message: "OTP Verified Successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: "Server error", success: false, error });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password, newPassword } = req.body;

    console.log(req.body);
    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    console.log(user);
    // Compare old password
    const isMatch = await bcrypt.compare(newPassword, user.password);
    if (isMatch) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from the old password",
      });
    }

    // Hash and update the new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error,
    });
  }
};

const getBlockedIdsSet = async (userId) => {
  try {
    const userObj = await User.findById(userId).select("blocked").lean();
    const blockedByMe = (userObj?.blocked || []).map((id) => id.toString());
    const mongoose = require("mongoose");
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const usersWhoBlockedMe = await User.find({ blocked: userObjectId }).select("_id").lean();
    const blockedByOthers = (usersWhoBlockedMe || []).map((u) => u._id.toString());
    return new Set([...blockedByMe, ...blockedByOthers]);
  } catch (err) {
    return new Set();
  }
};

exports.getshortlistedData = async (req, res) => {
  try {
    const userId = req.user.id;
    const blockedIds = await getBlockedIdsSet(userId);

    const user = await User.findById(userId)
      .select("shortlisted photoReqSent")
      .populate([
        {
          path: "shortlisted.profile",
          select:
            "firstName middleName lastName height dateOfBirth gender martrId isEnable isbloacked",
          populate: [
            { path: "HoroscopicId", select: "clan" },
            { path: "filesId", select: "photos isPrivate" },
            { path: "profdetailsId", select: "qualifications class" },
            { path: "familydetailsId", select: "occupation" },
          ],
        },
        {
          path: "photoReqSent.userId",
          select: "status",
        },
      ])
      .lean(); // Ensures better performance

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract photoReqSent for quick lookup
    const acceptedPhotoReqs = new Set(
      user.photoReqSent
        ?.filter((req) => req.status === "accepted")
        .map((req) => req.userId.toString())
    );

    // Modify shortlisted profiles while keeping structure same
    user.shortlisted = (user.shortlisted || [])
      .filter((entry) => {
        const p = entry && entry.profile;
        return (
          p &&
          p._id &&
          p.isEnable !== false &&
          p.isbloacked !== true &&
          !blockedIds.has((p._id || p).toString())
        );
      })
      .map((entry) => {
        if (!entry.profile || !entry.profile.filesId) return entry; // Return unchanged if no filesId exists

        const { filesId } = entry.profile;
        const isAccepted = acceptedPhotoReqs.has(entry.profile._id.toString());

        return {
          ...entry, // Keep the original structure intact
          profile: {
            ...entry.profile,
            filesId: {
              ...filesId,
              photos:
                !filesId.isPrivate || isAccepted
                  ? filesId.photos.filter((photo) => photo.isAvatar)
                  : [], // If private and not accepted, send an empty array
            },
          },
        };
      });

    return res.status(200).json({
      message: "Shortlisted profiles fetched successfully.",
      user,
    });
  } catch (error) {
    console.error("Error fetching shortlisted profiles:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.getviewedData = async (req, res) => {
  try {
    const userId = req.user.id;
    const blockedIds = await getBlockedIdsSet(userId);

    const user = await User.findById(userId)
      .select("visitedAt photoReqSent")
      .populate([
        {
          path: "visitedAt",
          select:
            "firstName lastName height gender dateOfBirth HoroscopicId filesId profdetailsId address familydetailsId martrId photoReqReceived isEnable isbloacked",
          populate: [
            { path: "HoroscopicId", select: "clan" },
            { path: "filesId", select: "photos isPrivate" },
            { path: "profdetailsId", select: "qualifications class" },
            { path: "familydetailsId", select: "occupation" },
          ],
        },
        {
          path: "photoReqSent.userId",
          select: "status",
        },
      ])
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Visited Data Before Processing:", user.visitedAt);

    const acceptedPhotoReqs = new Set(
      user.photoReqSent
        ?.filter((req) => req.status === "accepted")
        .map((req) => req.userId.toString())
    );

    user.visitedAt = (user.visitedAt || [])
      .filter(
        (profile) =>
          profile &&
          profile._id &&
          profile.isEnable !== false &&
          profile.isbloacked !== true &&
          !blockedIds.has(profile._id.toString())
      )
      .map((profile) => {
        const isAccepted = acceptedPhotoReqs.has(profile._id.toString());

        const hasReceivedPhotoRequest = profile.photoReqReceived?.some(
          (req) => req.userId.toString() === userId && req.status === "accepted"
        );

        let filteredPhotos = [];

        if (profile.filesId) {
          if (
            !profile.filesId.isPrivate ||
            isAccepted ||
            hasReceivedPhotoRequest
          ) {
            filteredPhotos = profile.filesId.photos.filter(
              (photo) => photo.isAvatar === true
            );
          }
        }

        return {
          ...profile,
          HoroscopicId: profile.HoroscopicId || {},
          profdetailsId: profile.profdetailsId || {},
          familydetailsId: profile.familydetailsId || {},
          filesId: {
            ...profile.filesId,
            photos: filteredPhotos,
          },
        };
      });

    console.log("Visited Data After Processing:", user.visitedAt);

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching visited profiles:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.getvisitedData = async (req, res) => {
  try {
    const userId = req.user.id;
    const blockedIds = await getBlockedIdsSet(userId);

    // Fetch user and apply full population
    const user = await User.findById(userId)
      .select("viewedBy photoReqReceived photoReqSent")
      .populate([
        {
          path: "viewedBy",
          select:
            "firstName lastName height gender dateOfBirth HoroscopicId filesId profdetailsId address familydetailsId martrId photoReqReceived isEnable isbloacked",
          populate: [
            { path: "HoroscopicId", select: "clan" },
            { path: "filesId", select: "photos isPrivate" },
            { path: "profdetailsId", select: "qualifications class" },
            { path: "familydetailsId", select: "occupation" },
          ],
        },
        {
          path: "photoReqSent.userId",
          select: "status",
        },
      ])
      .lean(); // Converts Mongoose document to plain JS object

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract accepted photo requests
    const acceptedPhotoReqs = new Set(
      user.photoReqSent
        ?.filter((req) => req.status === "accepted")
        .map((req) => req.userId.toString())
    );

    // Modify the `viewedBy` array
    user.viewedBy = (user.viewedBy || [])
      .filter(
        (profile) =>
          profile &&
          profile._id &&
          profile.isEnable !== false &&
          profile.isbloacked !== true &&
          !blockedIds.has(profile._id.toString())
      )
      .map((profile) => {
      const isAccepted = acceptedPhotoReqs.has(profile._id.toString());

      // Check if current user's ID is in profile's photoReqReceived and accepted
      const hasReceivedPhotoRequest = profile.photoReqReceived?.some(
        (req) => req.userId.toString() === userId && req.status === "accepted"
      );

      let profileData = JSON.parse(JSON.stringify(profile)); // Ensure deep cloning

      if (profileData.filesId) {
        if (
          !profileData.filesId.isPrivate ||
          isAccepted ||
          hasReceivedPhotoRequest
        ) {
          // If files are public, request was accepted, or user received an accepted photo request, show avatar photos
          profileData.filesId.photos = profileData.filesId.photos.filter(
            (photo) => photo.isAvatar === true
          );
        } else {
          // Files are private and not accepted
          profileData.filesId.photos = [];
        }
      }

      return profileData;
    });

    console.log("Processed viewedBy data:", user.viewedBy);
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching viewed data:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.deleteShortlistedProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileId = req.body.data;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Filter out the profile to be deleted
    const initialLength = user.shortlisted?.length;

    user.shortlisted = user.shortlisted.filter(
      (shortlisted) => shortlisted.profile.toString() !== profileId
    );

    // Check if anything was removed
    if (user.shortlisted.length === initialLength) {
      return res
        .status(404)
        .json({ message: "Profile not found in the shortlist" });
    }
    await user.save();
    res
      .status(200)
      .json({ message: "Profile removed from shortlist successfully", user });
  } catch (error) {
    console.error("Error while removing profile from shortlist:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
exports.profilebookmark = async (req, res) => {
  try {
    const userId = req.user?.id;
    const profileId = req.body?.data;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }

    if (!profileId) {
      return res
        .status(400)
        .json({ message: "Bad request: Profile ID is required" });
    }

    const user = await User.findById(userId).select("shortlisted");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!Array.isArray(user.shortlisted)) {
      user.shortlisted = [];
    }

    const shortlistedProfile = user.shortlisted.find(
      (item) => item.profile.toString() === profileId
    );

    if (shortlistedProfile) {
      shortlistedProfile.isbookmarked = !shortlistedProfile.isbookmarked;
    } else {
      user.shortlisted.push({ profile: profileId, isbookmarked: true });
    }

    await user.save();

    return res.status(200).json({
      message: "Bookmark status updated successfully",
      isbookmarked: shortlistedProfile ? shortlistedProfile.isbookmarked : true,
      user,
    });
  } catch (error) {
    console.error("Error updating bookmark status:", error);

    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid profile ID format" });
    }
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation error", details: error.errors });
    }

    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

exports.sendRequest = async (req, res) => {
  const userId = req.user.id;
  const profileId = req.body.data;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile = await User.findById(profileId);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const limit = await Limit.findOne();
    if (!limit) {
      return res.status(500).json({ message: "Limit configuration not found" });
    }

    if (user.role !== "admin") {
      const customLimit = await UserRequestLimit.findOne({ userId });
      let maxAllowedRequests = user.isSubscribed
        ? (limit.premiumRequestSendLimit !== undefined ? limit.premiumRequestSendLimit : 100)
        : (limit.freeRequestSendLimit !== undefined ? limit.freeRequestSendLimit : 5);

      if (customLimit) {
        if (customLimit.periodType === "custom") {
          const now = new Date();
          const start = customLimit.startDate ? new Date(customLimit.startDate) : null;
          const end = customLimit.endDate ? new Date(customLimit.endDate) : null;
          if ((!start || now >= start) && (!end || now <= end)) {
            maxAllowedRequests = customLimit.count;
          }
        } else {
          maxAllowedRequests = customLimit.count;
        }
      }

      if (user.reqSentCount >= maxAllowedRequests) {
        return res.status(403).json({
          message: `Request limit exceeded. You can only send up to ${maxAllowedRequests} requests.`,
          limitExceeded: true,
          limitCount: maxAllowedRequests,
          currentCount: user.reqSentCount,
        });
      }
    }

    // Add request to the profile if not already sent
    const isFirstTime = !user.reqSent.some((req) => req.userId.equals(profileId));

    if (!profile.reqReceived.some((req) => req.userId.equals(userId))) {
      profile.reqReceived.push({ userId: userId, status: "pending" });
    }

    if (isFirstTime) {
      user.reqSent.push({ userId: profileId, status: "pending" });
      // Only count new (first-time) requests toward the limit
      user.reqSentCount++;
    }

    await user.save();
    await profile.save();

    return res.status(200).json({ message: "Request sent successfully" });
  } catch (error) {
    console.error("Error sending request:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.sendphotoRequest = async (req, res) => {
  try {
    const userId = req.user?.id;
    const profileId = req.body?.data;

    if (!profileId) {
      return res.status(400).json({ message: "Profile ID is required." });
    }

    if (userId === profileId) {
      return res
        .status(400)
        .json({ message: "You cannot send a request to yourself." });
    }

    const user = await User.findById(userId)
      .select("photoReqSent filesId")
      .populate("filesId", "isPrivate photos");

    const profile = await User.findById(profileId)
      .select("photoReqReceived filesId")
      .populate("filesId", "isPrivate photos");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (!profile) {
      return res.status(404).json({ message: "Profile not found." });
    }

    user.photoReqSent = user.photoReqSent || [];
    profile.photoReqReceived = profile.photoReqReceived || [];
    const isValidObjectId = (id) =>
      id && id.toString().match(/^[0-9a-fA-F]{24}$/);

    if (!isValidObjectId(userId) || !isValidObjectId(profileId)) {
      return res.status(400).json({ message: "Invalid user or profile ID." });
    }

    const hasSentRequest = user.photoReqSent.some(
      (req) => req.userId?.toString() === profileId.toString()
    );
    const hasReceivedRequest = profile.photoReqReceived.some(
      (req) => req.userId?.toString() === userId.toString()
    );

    if (!hasSentRequest) {
      user.photoReqSent.push({ userId: profileId, status: "pending" });
    }
    if (!hasReceivedRequest) {
      profile.photoReqReceived.push({ userId: userId, status: "pending" });
    }

    await user.save();
    await profile.save();

    return res.status(200).json({ message: "Request sent successfully." });
  } catch (error) {
    console.error("Error sending request:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.withdrawal = async (req, res) => {
  const userId = req.user.id;
  const profileId = req.body.data;

  if (!profileId) {
    return res.status(400).json({ message: "Profile ID is required" });
  }

  try {
    // Perform atomic deletion using MongoDB $pull
    const [userUpdate, profileUpdate] = await Promise.all([
      User.findByIdAndUpdate(
        userId,
        { $pull: { photoReqSent: { userId: profileId } } },
        { new: true }
      ),
      User.findByIdAndUpdate(
        profileId,
        { $pull: { photoReqReceived: { userId: userId } } },
        { new: true }
      ),
    ]);

    if (!userUpdate || !profileUpdate) {
      return res.status(404).json({ message: "User or Profile not found" });
    }

    return res.status(200).json({ message: "Request withdrawn successfully" });
  } catch (error) {
    console.error("Error withdrawing request:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileId = req.body.data;

    if (!profileId) {
      return res.status(400).json({ message: "Profile ID is required" });
    }

    // Convert to ObjectId if needed
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const profileObjectId = new mongoose.Types.ObjectId(profileId);

    // Check if the request exists in both users' lists
    const userExists = await User.findById({
      _id: userObjectId,
      "photoReqReceived.userId": profileObjectId,
    });

    const profileExists = await User.findById({
      _id: profileObjectId,
      "photoReqSent.userId": userObjectId,
    });

    console.log(userExists);
    console.log(profileExists);

    if (!userExists) {
      return res
        .status(404)
        .json({ message: "Request not found in sent list" });
    }

    if (!profileExists) {
      return res
        .status(404)
        .json({ message: "Request not found in received list" });
    }

    const [userUpdate, profileUpdate] = await Promise.all([
      User.updateOne(
        { _id: userObjectId, "photoReqReceived.userId": profileObjectId },
        { $set: { "photoReqReceived.$.status": "accepted" } }
      ),
      User.updateOne(
        { _id: profileObjectId, "photoReqSent.userId": userObjectId },
        { $set: { "photoReqSent.$.status": "accepted" } }
      ),
    ]);

    // console.log(userUpdate);
    // console.log(profileUpdate);

    if (userUpdate.modifiedCount === 0 || profileUpdate.modifiedCount === 0) {
      return res.status(500).json({ message: "Failed to update status" });
    }

    // Auto-create or update Chat document so both users immediately see each other in /message
    let chat = await Chat.findOne({
      participants: { $all: [userObjectId, profileObjectId] },
    });
    if (!chat) {
      chat = new Chat({
        participants: [userObjectId, profileObjectId],
        status: "accepted",
      });
      await chat.save();
    } else if (chat.status !== "accepted") {
      chat.status = "accepted";
      await chat.save();
    }

    return res.status(200).json({ message: "Request accepted successfully", chatId: chat._id });
  } catch (error) {
    console.error("Error accepting request:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileId = req.body.data;

    if (!profileId) {
      return res.status(400).json({ message: "Profile ID is required" });
    }

    // Convert to ObjectId if needed
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const profileObjectId = new mongoose.Types.ObjectId(profileId);

    // Check if the request exists in both users' lists
    const userExists = await User.findById({
      _id: userObjectId,
      "photoReqReceived.userId": profileObjectId,
    });

    const profileExists = await User.findById({
      _id: profileObjectId,
      "photoReqSent.userId": userObjectId,
    });

    console.log(userExists);
    console.log(profileExists);

    if (!userExists) {
      return res
        .status(404)
        .json({ message: "Request not found in sent list" });
    }

    if (!profileExists) {
      return res
        .status(404)
        .json({ message: "Request not found in received list" });
    }

    const [userUpdate, profileUpdate] = await Promise.all([
      User.updateOne(
        { _id: userObjectId, "photoReqReceived.userId": profileObjectId },
        { $set: { "photoReqReceived.$.status": "rejected" } }
      ),
      User.updateOne(
        { _id: profileObjectId, "photoReqSent.userId": userObjectId },
        { $set: { "photoReqSent.$.status": "rejected" } }
      ),
    ]);

    // console.log(userUpdate);
    // console.log(profileUpdate);

    if (userUpdate.modifiedCount === 0 || profileUpdate.modifiedCount === 0) {
      return res.status(500).json({ message: "Failed to update status" });
    }

    return res.status(200).json({ message: "Request rejected successfully" });
  } catch (error) {
    console.error("Error rejecting request:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.reqwithdrawal = async (req, res) => {
  const userId = req.user.id;
  const profileId = req.body.data;

  if (!profileId) {
    return res.status(400).json({ message: "Profile ID is required" });
  }

  try {
    // Perform atomic deletion using MongoDB $pull
    const [userUpdate, profileUpdate] = await Promise.all([
      User.findByIdAndUpdate(
        userId,
        { $pull: { reqSent: { userId: profileId } } },
        { new: true }
      ),
      User.findByIdAndUpdate(
        profileId,
        { $pull: { reqReceived: { userId: userId } } },
        { new: true }
      ),
    ]);

    if (!userUpdate || !profileUpdate) {
      return res.status(404).json({ message: "User or Profile not found" });
    }

    return res.status(200).json({ message: "Request withdrawn successfully" });
  } catch (error) {
    console.error("Error withdrawing request:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.reqacceptRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileId = req.body.data;

    if (!profileId) {
      return res.status(400).json({ message: "Profile ID is required" });
    }

    // Convert to ObjectId if needed
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const profileObjectId = new mongoose.Types.ObjectId(profileId);

    // Check if the request exists in both users' lists
    const userExists = await User.findById({
      _id: userObjectId,
      "reqReceived.userId": profileObjectId,
    });

    const profileExists = await User.findById({
      _id: profileObjectId,
      "reqSent.userId": userObjectId,
    });

    console.log(userExists);
    console.log(profileExists);

    if (!userExists) {
      return res
        .status(404)
        .json({ message: "Request not found in sent list" });
    }

    if (!profileExists) {
      return res
        .status(404)
        .json({ message: "Request not found in received list" });
    }

    const [userUpdate, profileUpdate] = await Promise.all([
      User.updateOne(
        { _id: userObjectId, "reqReceived.userId": profileObjectId },
        { $set: { "reqReceived.$.status": "accepted" } }
      ),
      User.updateOne(
        { _id: profileObjectId, "reqSent.userId": userObjectId },
        { $set: { "reqSent.$.status": "accepted" } }
      ),
    ]);

    if (userUpdate.modifiedCount === 0 || profileUpdate.modifiedCount === 0) {
      return res.status(500).json({ message: "Failed to update status" });
    }

    // Auto-create or update Chat document so both users immediately see each other in /message
    let chat = await Chat.findOne({
      participants: { $all: [userObjectId, profileObjectId] },
    });
    if (!chat) {
      chat = new Chat({
        participants: [userObjectId, profileObjectId],
        status: "accepted",
      });
      await chat.save();
    } else if (chat.status !== "accepted") {
      chat.status = "accepted";
      await chat.save();
    }

    return res.status(200).json({ message: "Request accepted successfully", chatId: chat._id });
  } catch (error) {
    console.error("Error accepting request:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.reqrejectRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileId = req.body.data;

    if (!profileId) {
      return res.status(400).json({ message: "Profile ID is required" });
    }

    // Convert to ObjectId if needed
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const profileObjectId = new mongoose.Types.ObjectId(profileId);

    // Check if the request exists in both users' lists
    const userExists = await User.findById({
      _id: userObjectId,
      "reqReceived.userId": profileObjectId,
    });

    const profileExists = await User.findById({
      _id: profileObjectId,
      "reqSent.userId": userObjectId,
    });

    console.log(userExists.reqReceived);
    console.log(profileExists.reqSent);

    if (!userExists) {
      return res
        .status(404)
        .json({ message: "Request not found in sent list" });
    }

    if (!profileExists) {
      return res
        .status(404)
        .json({ message: "Request not found in received list" });
    }

    const [userUpdate, profileUpdate] = await Promise.all([
      User.updateOne(
        { _id: userObjectId, "reqReceived.userId": profileObjectId },
        { $set: { "reqReceived.$.status": "rejected" } }
      ),
      User.updateOne(
        { _id: profileObjectId, "reqSent.userId": userObjectId },
        { $set: { "reqSent.$.status": "rejected" } }
      ),
    ]);

    console.log(userUpdate);
    console.log(profileUpdate);

    if (userUpdate.modifiedCount === 0 || profileUpdate.modifiedCount === 0) {
      return res.status(500).json({ message: "Failed to update status" });
    }

    return res.status(200).json({ message: "Request rejected successfully" });
  } catch (error) {
    console.error("Error rejecting request:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.getphotoRequests = async (req, res) => {
  const userId = req.user.id;

  try {
    const blockedIds = await getBlockedIdsSet(userId);
    const user = await User.findById(userId)
      .select("photoReqSent photoReqReceived")
      .populate([
        {
          path: "photoReqSent.userId",
          select:
            "dateOfBirth gender martrId address HoroscopicId filesId profdetailsId familydetailsId isEnable isbloacked",
          populate: [
            { path: "HoroscopicId", select: "clan" },
            { path: "filesId", select: "photos isPrivate" },
            { path: "profdetailsId", select: "qualifications class" },
            { path: "familydetailsId", select: "occupation" },
          ],
        },
        {
          path: "photoReqReceived.userId",
          select:
            "dateOfBirth gender martrId address HoroscopicId filesId profdetailsId familydetailsId isEnable isbloacked",
          populate: [
            { path: "HoroscopicId", select: "clan" },
            { path: "filesId", select: "photos isPrivate" },
            { path: "profdetailsId", select: "qualifications class" },
            { path: "familydetailsId", select: "occupation" },
          ],
        },
      ])
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.photoReqSent = (user.photoReqSent || [])
      .filter((profile) => {
        const p = profile && profile.userId;
        return (
          p &&
          p._id &&
          p.isEnable !== false &&
          p.isbloacked !== true &&
          !blockedIds.has((p._id || p).toString())
        );
      })
      .map((profile) => {
        const photos = profile.userId?.filesId?.photos || [];
        const isPrivate = profile.userId?.filesId?.isPrivate ?? false;
        const totalPhotos = photos.length;
        const rawPhotos = profile.status === "accepted" || !isPrivate ? photos : [];
        const avatars = rawPhotos.filter((p) => p?.isAvatar);
        const filteredPhotos = avatars.length > 0 ? avatars : rawPhotos;

        return {
          ...profile,
          userId: {
            ...profile.userId,
            filesId: {
              ...(profile.userId?.filesId || {}),
              photos: filteredPhotos,
              totalPhotos,
            },
          },
        };
      });

    user.photoReqReceived = (user.photoReqReceived || [])
      .filter((profile) => {
        const p = profile && profile.userId;
        return (
          p &&
          p._id &&
          p.isEnable !== false &&
          p.isbloacked !== true &&
          !blockedIds.has((p._id || p).toString())
        );
      })
      .map((profile) => {
        const photos = profile.userId?.filesId?.photos || [];
        const isPrivate = profile.userId?.filesId?.isPrivate ?? false;
        const totalPhotos = photos.length;
        const rawPhotos = profile.status === "accepted" || !isPrivate ? photos : [];
        const avatars = rawPhotos.filter((p) => p?.isAvatar);
        const filteredPhotos = avatars.length > 0 ? avatars : rawPhotos;

        return {
          ...profile,
          userId: {
            ...profile.userId,
            filesId: {
              ...(profile.userId?.filesId || {}),
              photos: filteredPhotos,
              totalPhotos,
            },
          },
        };
      });

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching photo requests:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.getDocumentRequests = async (req, res) => {
  const userId = req.user.id;
  try {
    const blockedIds = await getBlockedIdsSet(userId);
    const user = await User.findById(userId)
      .select("documentReqSent documentReqReceived")
      .populate([
        {
          path: "documentReqSent.userId",
          select: "firstName middleName lastName dateOfBirth gender martrId address HoroscopicId filesId profdetailsId isEnable isbloacked",
          populate: [
            { path: "HoroscopicId", select: "clan" },
            { path: "filesId", select: "photos isPrivate documents isDocPrivate" },
            { path: "profdetailsId", select: "qualifications" },
          ],
        },
        {
          path: "documentReqReceived.userId",
          select: "firstName middleName lastName dateOfBirth gender martrId address HoroscopicId filesId profdetailsId isEnable isbloacked",
          populate: [
            { path: "HoroscopicId", select: "clan" },
            { path: "filesId", select: "photos isPrivate documents isDocPrivate" },
            { path: "profdetailsId", select: "qualifications" },
          ],
        },
      ])
      .lean();

    if (!user) return res.status(404).json({ message: "User not found" });

    const filterValid = (arr) =>
      (arr || []).filter((e) => {
        const p = e && e.userId;
        return (
          p &&
          p._id &&
          p.isEnable !== false &&
          p.isbloacked !== true &&
          !blockedIds.has((p._id || p).toString())
        );
      });

    return res.status(200).json({
      documentReqSent: filterValid(user.documentReqSent),
      documentReqReceived: filterValid(user.documentReqReceived),
    });
  } catch (error) {
    console.error("Error fetching document requests:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.sendDocumentRequest = async (req, res) => {
  try {
    const userId = req.user?.id;
    const profileId = req.body?.data;

    if (!profileId) return res.status(400).json({ message: "Profile ID is required." });
    if (userId === profileId) return res.status(400).json({ message: "Cannot send request to yourself." });

    const user = await User.findById(userId).select("documentReqSent");
    const profile = await User.findById(profileId).select("documentReqReceived");

    if (!user) return res.status(404).json({ message: "User not found." });
    if (!profile) return res.status(404).json({ message: "Profile not found." });

    user.documentReqSent = user.documentReqSent || [];
    profile.documentReqReceived = profile.documentReqReceived || [];

    const alreadySent = user.documentReqSent.some(
      (r) => r.userId?.toString() === profileId.toString()
    );
    const alreadyReceived = profile.documentReqReceived.some(
      (r) => r.userId?.toString() === userId.toString()
    );

    if (!alreadySent) user.documentReqSent.push({ userId: profileId, status: "pending" });
    if (!alreadyReceived) profile.documentReqReceived.push({ userId: userId, status: "pending" });

    await user.save();
    await profile.save();

    return res.status(200).json({ message: "Document request sent successfully." });
  } catch (error) {
    console.error("Error sending document request:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.withdrawDocumentRequest = async (req, res) => {
  const userId = req.user.id;
  const profileId = req.body.data;
  if (!profileId) return res.status(400).json({ message: "Profile ID is required" });
  try {
    await Promise.all([
      User.findByIdAndUpdate(userId, { $pull: { documentReqSent: { userId: profileId } } }),
      User.findByIdAndUpdate(profileId, { $pull: { documentReqReceived: { userId: userId } } }),
    ]);
    return res.status(200).json({ message: "Document request withdrawn." });
  } catch (error) {
    console.error("Error withdrawing document request:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.acceptDocumentRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileId = req.body.data;
    if (!profileId) return res.status(400).json({ message: "Profile ID is required" });

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const profileObjectId = new mongoose.Types.ObjectId(profileId);

    await Promise.all([
      User.updateOne(
        { _id: userObjectId, "documentReqReceived.userId": profileObjectId },
        { $set: { "documentReqReceived.$.status": "accepted" } }
      ),
      User.updateOne(
        { _id: profileObjectId, "documentReqSent.userId": userObjectId },
        { $set: { "documentReqSent.$.status": "accepted" } }
      ),
    ]);

    return res.status(200).json({ message: "Document request accepted." });
  } catch (error) {
    console.error("Error accepting document request:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.rejectDocumentRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileId = req.body.data;
    if (!profileId) return res.status(400).json({ message: "Profile ID is required" });

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const profileObjectId = new mongoose.Types.ObjectId(profileId);

    await Promise.all([
      User.updateOne(
        { _id: userObjectId, "documentReqReceived.userId": profileObjectId },
        { $set: { "documentReqReceived.$.status": "rejected" } }
      ),
      User.updateOne(
        { _id: profileObjectId, "documentReqSent.userId": userObjectId },
        { $set: { "documentReqSent.$.status": "rejected" } }
      ),
    ]);

    return res.status(200).json({ message: "Document request rejected." });
  } catch (error) {
    console.error("Error rejecting document request:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.getRequests = async (req, res) => {
  const userId = req.user.id;

  try {
    const blockedIds = await getBlockedIdsSet(userId);
    const user = await User.findById(userId)
      .select("reqSent reqReceived photoReqSent photoReqReceived")
      .populate([
        {
          path: "reqSent.userId",
          select:
            "dateOfBirth HoroscopicId filesId profdetailsId address familydetailsId martrId gender isEnable isbloacked",
          populate: [
            { path: "HoroscopicId", select: "clan" },
            { path: "filesId", select: "photos isPrivate" },
            { path: "profdetailsId", select: "qualifications class" },
            { path: "familydetailsId", select: "occupation" },
          ],
        },
        {
          path: "reqReceived.userId",
          select:
            "dateOfBirth HoroscopicId filesId profdetailsId address familydetailsId martrId gender isEnable isbloacked",
          populate: [
            { path: "HoroscopicId", select: "clan" },
            { path: "filesId", select: "photos isPrivate" },
            { path: "profdetailsId", select: "qualifications class" },
            { path: "familydetailsId", select: "occupation" },
          ],
        },
      ])
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const getPhotoReqStatus = (targetUserId) => {
      if (!targetUserId) return "none";
      const targetIdStr = (targetUserId._id || targetUserId).toString();

      const sent = (user.photoReqSent || []).find(
        (r) => r && r.userId && (r.userId._id || r.userId).toString() === targetIdStr
      );
      if (sent) return sent.status;

      const received = (user.photoReqReceived || []).find(
        (r) => r && r.userId && (r.userId._id || r.userId).toString() === targetIdStr
      );
      if (received) return received.status;

      return "none";
    };

    user.reqSent = (user.reqSent || [])
      .filter((profile) => {
        const p = profile && profile.userId;
        return (
          p &&
          p._id &&
          p.isEnable !== false &&
          p.isbloacked !== true &&
          !blockedIds.has((p._id || p).toString())
        );
      })
      .map((profile) => {
        const photoRequestStatus = getPhotoReqStatus(profile.userId?._id);
        const photos = profile.userId?.filesId?.photos || [];
        const isPrivate = profile.userId?.filesId?.isPrivate ?? false;
        const totalPhotos = photos.length;
        const isPhotoReqAccepted = photoRequestStatus === "accepted";
        const rawPhotos = !isPrivate || isPhotoReqAccepted ? photos : [];
        const avatars = rawPhotos.filter((p) => p?.isAvatar);
        const filteredPhotos = avatars.length > 0 ? avatars : rawPhotos;

        return {
          ...profile,
          userId: {
            ...profile.userId,
            photoRequestStatus,
            filesId: {
              ...(profile.userId?.filesId || {}),
              photos: filteredPhotos,
              totalPhotos,
            },
          },
        };
      });

    user.reqReceived = (user.reqReceived || [])
      .filter((profile) => {
        const p = profile && profile.userId;
        return (
          p &&
          p._id &&
          p.isEnable !== false &&
          p.isbloacked !== true &&
          !blockedIds.has((p._id || p).toString())
        );
      })
      .map((profile) => {
        const photoRequestStatus = getPhotoReqStatus(profile.userId?._id);
        const photos = profile.userId?.filesId?.photos || [];
        const isPrivate = profile.userId?.filesId?.isPrivate ?? false;
        const totalPhotos = photos.length;
        const isPhotoReqAccepted = photoRequestStatus === "accepted";
        const rawPhotos = !isPrivate || isPhotoReqAccepted ? photos : [];
        const avatars = rawPhotos.filter((p) => p?.isAvatar);
        const filteredPhotos = avatars.length > 0 ? avatars : rawPhotos;

        return {
          ...profile,
          userId: {
            ...profile.userId,
            photoRequestStatus,
            filesId: {
              ...(profile.userId?.filesId || {}),
              photos: filteredPhotos,
              totalPhotos,
            },
          },
        };
      });

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching requests:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.viewProfileById = async (req, res) => {
  const userId = req.user.id;
  const profileId = req.body.profileId;

  try {
    const user = await User.findById(userId).select("photoReqSent");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const acceptedPhotoReqs = new Set(
      user.photoReqSent
        .filter((req) => req.status === "accepted")
        .map((req) => req.userId.toString())
    );

    const profile = await User.findById(profileId)
      .select(
        "firstName lastName height gender dateOfBirth martrId HoroscopicId filesId profdetailsId address familydetailsId"
      )
      .populate([
        { path: "HoroscopicId", select: "clan" },
        { path: "filesId", select: "photos isPrivate" },
        { path: "profdetailsId", select: "qualifications class" },
        { path: "familydetailsId", select: "occupation" },
      ]);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const isAccepted = acceptedPhotoReqs.has(profile._id.toString());

    if (profile.filesId) {
      profile.filesId.photos =
        !profile.filesId.isPrivate || isAccepted ? profile.filesId.photos : [];
    }

    console.log("profile", profile);
    const paternalDetailsData = await ExtendedFamily.find({
      userId: profile._id,
    });

    const paternaldetails = paternalDetailsData.map(
      ({ createdAt, updatedAt, _id, userId, ...filteredData }) => filteredData
    );
    console.log("ppppppp", paternaldetails);
    const profileData = {
      ...profile.toObject(),
      paternaldetails: paternaldetails,
    };

    return res.status(200).json({ profile: profileData });
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.addProfileView = async (req, res) => {
  const userId = req.user.id;
  const profileId = req.body.data;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile = await User.findById(profileId);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const isAlreadyVisited = Array.isArray(user.visitedAt) && user.visitedAt.some(
      (id) => id.toString() === profileId
    );

    if (!isAlreadyVisited && user.role !== "admin") {
      const limit = await Limit.findOne();
      const limitCount = user.isSubscribed ? (limit?.premiumLimit?.count || 50) : (limit?.freeProfileViews || 2);
      const currentViews = Array.isArray(user.visitedAt) ? user.visitedAt.length : 0;

      if (currentViews >= limitCount) {
        return res.status(403).json({
          message: `You have reached your limit of ${limitCount} profile views. Please upgrade your plan.`,
          limitExceeded: true,
          limitCount,
          currentViews,
          periodType: "lifetime"
        });
      }
    }

    if (!profile.viewedBy.some((viewer) => viewer.equals(userId))) {
      profile.viewedBy.push(userId); // Add the viewer to `viewedBy`
      profile.view = (profile.view || 0) + 1; // Increment the view counter
    }

    if (!user.visitedAt.some((visited) => visited.equals(profileId))) {
      user.visitedAt.push(profileId);
    }

    if (user.role && user.role.includes('"')) {
      user.role = user.role.replace(/"/g, '');
    }
    if (profile.role && profile.role.includes('"')) {
      profile.role = profile.role.replace(/"/g, '');
    }

    await user.save();
    await profile.save();

    return res.status(200).json({ message: "View recorded successfully" });
  } catch (error) {
    console.error("Error recording view:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};
exports.getuserData = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
exports.shortlist = async (req, res) => {
  try {
    console.log(req.body);
    const userId = req.user.id;
    const profileId = req.body.data;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the profile is already shortlisted
    const isAlreadyShortlisted = user.shortlisted.some(
      (shortlisted) => shortlisted.profile.toString() === profileId
    );

    if (isAlreadyShortlisted) {
      return res
        .status(200)
        .json({ message: "Profile already shortlisted", user });
    }
    // Add the profile to the shortlisted array
    user.shortlisted.push({
      profile: new mongoose.Types.ObjectId(profileId),
    });
    await user.save();
    res.status(200).json({ message: "Profile shortlisted successfully", user });
  } catch (error) {
    console.error("Error while shortlisting profile:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.profiledelete = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileId = req.body.data;

    console.log(profileId);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile = await User.findById(profileId);
    if (!profile) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.updateOne(
      { _id: new mongoose.Types.ObjectId(userId) },
      {
        $pull: {
          reqSent: { userId: new mongoose.Types.ObjectId(profileId) },
        },
      }
    );

    await User.updateOne(
      { _id: new mongoose.Types.ObjectId(profileId) },
      {
        $pull: {
          reqReceived: { userId: new mongoose.Types.ObjectId(userId) },
        },
      }
    );

    res.status(200).json({ message: "Profile deleted successfully", user });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.profilerequestdelete = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileId = req.body.data;

    console.log(profileId);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile = await User.findById(profileId);
    if (!profile) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.updateOne(
      { _id: new mongoose.Types.ObjectId(userId) },
      {
        $pull: {
          photoReqSent: { userId: new mongoose.Types.ObjectId(profileId) },
        },
      }
    );

    await User.updateOne(
      { _id: new mongoose.Types.ObjectId(profileId) },
      {
        $pull: {
          photoReqReceived: { userId: new mongoose.Types.ObjectId(userId) },
        },
      }
    );

    res.status(200).json({ message: "Profile deleted successfully", user });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.Removerequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileId = req.body.data;

    console.log(profileId);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile = await User.findById(profileId);
    if (!profile) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.updateOne(
      { _id: new mongoose.Types.ObjectId(userId) },
      {
        $pull: {
          reqReceived: { userId: new mongoose.Types.ObjectId(profileId) },
        },
      }
    );

    await User.updateOne(
      { _id: new mongoose.Types.ObjectId(profileId) },
      {
        $pull: {
          reqSent: { userId: new mongoose.Types.ObjectId(userId) },
        },
      }
    );

    res.status(200).json({ message: "Profile deleted successfully", user });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
exports.getprofiles = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      searchName,
      matrId,
      searchId,
      minAge,
      maxAge,
      gender,
      occupation,
      class: userClass,
      HeightFeetfrom,
      HeightFeetto,
      maritalStatus,
      country,
      state,
      manglik,
      clan,
    } = req.body.data;

    console.log(req.body.data);

    const user = await User.findById(userId)
      .select("gender isSubscribed photoReqSent reqSent reqReceived shortlisted blocked")
      .lean();

    if (!user) return res.status(404).json({ message: "User not found" });

    const mongoose = require("mongoose");
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Exclude users blocked by current user, users who blocked current user, and current user themselves
    const usersWhoBlockedMe = await User.find({ blocked: userObjectId }).select("_id").lean();
    const blockedByMe = Array.isArray(user.blocked) ? user.blocked : [];
    const blockedByOthers = Array.isArray(usersWhoBlockedMe) ? usersWhoBlockedMe.map((u) => u._id) : [];
    const excludedIds = [userObjectId, ...blockedByMe, ...blockedByOthers];

    const query = {
      isbloacked: false,
      isApproved: true,
      isEnable: true,
      role: { $ne: "admin" },
      _id: { $nin: excludedIds },
    };

    // Always strictly enforce opposite gender for logged-in user
    if (user.gender === "Male") {
      query.gender = "Female";
    } else if (user.gender === "Female") {
      query.gender = "Male";
    } else if (gender) {
      query.gender = gender;
    }

    if (minAge || maxAge) {
      query.dateOfBirth = {};
      if (minAge)
        query.dateOfBirth.$lte = new Date(
          new Date().setFullYear(new Date().getFullYear() - minAge)
        );
      if (maxAge)
        query.dateOfBirth.$gte = new Date(
          new Date().setFullYear(new Date().getFullYear() - maxAge)
        );
    }

    const queryMatrId = matrId || searchId;
    if (queryMatrId) {
      const cleanId = String(queryMatrId).replace(/^RA/i, "").trim();
      if (!isNaN(cleanId) && cleanId.length > 0) {
        query.martrId = parseInt(cleanId, 10);
      }
    }

    const queryName = name || searchName;
    if (queryName) {
      if (!isNaN(queryName)) {
        query.martrId = parseInt(queryName, 10);
      } else {
        const regex = new RegExp(queryName.trim(), "i");
        query.$or = [
          { firstName: regex },
          { lastName: regex },
          { middleName: regex },
          {
            $expr: {
              $regexMatch: {
                input: {
                  $trim: {
                    input: {
                      $concat: [
                        "$firstName",
                        " ",
                        {
                          $cond: {
                            if: { $eq: ["$middleName", ""] },
                            then: "",
                            else: "$middleName",
                          },
                        },
                        " ",
                        "$lastName",
                      ],
                    },
                  },
                },
                regex: regex,
              },
            },
          },
        ];
      }
    }

    if (HeightFeetfrom || HeightFeetto) {
      query["height.feet"] = {};
      if (HeightFeetfrom)
        query["height.feet"].$gte = parseInt(HeightFeetfrom, 10);
      if (HeightFeetto) query["height.feet"].$lte = parseInt(HeightFeetto, 10);
    }

    if (maritalStatus) query.maritalStatus = maritalStatus;

    if (country) query["address.country"] = country;
    if (state)   query["address.state"]   = state;

    const profileLimitDoc = await Limit.findOne().select("freeProfileViews");
    const profileLimit = user.isSubscribed ? 50 : 10;

    let profiles = await User.find(query)
      .populate("filesId")
      .populate("HoroscopicId")
      .populate({ path: "familydetailsId", select: "occupation" })
      .populate({ path: "profdetailsId", select: "class" })
      .lean();

    if (occupation) {
      profiles = profiles.filter(
        (profile) =>
          profile.familydetailsId &&
          profile.familydetailsId.occupation &&
          profile.familydetailsId.occupation
            .toLowerCase()
            .includes(occupation.toLowerCase())
      );
    }

    if (userClass) {
      profiles = profiles.filter(
        (profile) =>
          profile.profdetailsId &&
          profile.profdetailsId.class &&
          profile.profdetailsId.class
            .toLowerCase()
            .includes(userClass.toLowerCase())
      );
    }
    if (manglik) {
      profiles = profiles.filter(
        (profile) =>
          profile.HoroscopicId &&
          profile.HoroscopicId.maglik &&
          profile.HoroscopicId.maglik.toLowerCase() === manglik.toLowerCase()
      );
    }

    if (clan) {
      const clanLower = clan.toLowerCase();
      profiles = profiles.filter(
        (profile) =>
          (profile.HoroscopicId?.clan && profile.HoroscopicId.clan.toLowerCase().includes(clanLower)) ||
          (profile.HoroscopicId?.subclan && profile.HoroscopicId.subclan.toLowerCase().includes(clanLower)) ||
          (profile.lastName && profile.lastName.toLowerCase().includes(clanLower))
      );
    }

    profiles = profiles.slice(0, profileLimit);

    const filterProfiles = profiles.map((profile) => {
      const isRequested = user.photoReqSent?.some(
        (req) =>
          req.userId?.toString() === profile._id.toString() &&
          req.status === "accepted"
      );

      const sentReq = user.reqSent?.find(
        (r) => r.userId?.toString() === profile._id.toString()
      );
      const recvReq = user.reqReceived?.find(
        (r) => r.userId?.toString() === profile._id.toString()
      );
      let connectionStatus = null;
      if (sentReq) {
        connectionStatus = sentReq.status;
      } else if (recvReq) {
        connectionStatus = recvReq.status;
      }

      const sentPhotoReq = user.photoReqSent?.find(
        (r) => r.userId?.toString() === profile._id.toString()
      );
      let photoRequestStatus = null;
      if (sentPhotoReq) {
        photoRequestStatus = sentPhotoReq.status;
      }

      const isShortlisted = user.shortlisted?.some(
        (s) => (s.profile?._id || s.profile || s)?.toString() === profile._id.toString()
      );

      let updatedFilesId = profile.filesId;
      if (profile.filesId && profile.filesId.photos) {
        const { isPrivate, photos } = profile.filesId;
        const totalPhotos = photos?.length || 0;
        const rawPhotos = isPrivate
          ? (isRequested ? photos : [])
          : photos;
        const avatars = rawPhotos.filter((p) => p?.isAvatar);
        const finalPhotos = avatars.length > 0 ? avatars : rawPhotos;

        updatedFilesId = {
          ...profile.filesId,
          totalPhotos,
          photos: finalPhotos,
        };
      }

      return {
        ...profile,
        filesId: updatedFilesId,
        connectionStatus,
        photoRequestStatus,
        isShortlisted: !!isShortlisted,
      };
    });

    res.status(200).json({
      message: "Profiles fetched successfully.",
      data: filterProfiles,
    });
  } catch (error) {
    console.error("Error fetching profiles:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getprofessionaldata = async (req, res) => {
  try {
    const userId = req.user.id;
    let user = await ProfessionalDetails.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });
    console.log(user);
    if (!user) {
      user = await ProfessionalDetails.create({
        userId: new mongoose.Types.ObjectId(userId),
      });
      const userRecord = await User.findById(userId);
      userRecord.profdetailsId = user._id;
      await userRecord.save();
      await user.save();

      return res.status(201).json({ message: "User created", user });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
exports.saveprofessionaldata = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body.data;
    // console.log(updateData);
    // console.log(userId);

    if (!updateData) {
      return res
        .status(400)
        .json({ message: "Missing updateData in request body." });
    }

    console.log("Update data received:", updateData);

    const updatedProfile = await ProfessionalDetails.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    // const updatedProfile = await ProfessionalDetails.find({ userId: userId });

    console.log("Update:", updatedProfile);

    if (!updatedProfile) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "Profile updated successfully.",
      data: updatedProfile,
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return res
        .status(400)
        .json({ message: "Malformed JSON in request body." });
    }

    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the profile." });
  }
};
exports.updateBasicdetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body.data;

    if (!updateData) {
      return res
        .status(400)
        .json({ message: "Missing updateData in request body." });
    }

    console.log("Update data received:", updateData);

    // Validate height fields
    if (updateData.height) {
      const { feet, inches } = updateData.height;

      if (
        (feet && typeof feet !== "number") ||
        (inches && typeof inches !== "number")
      ) {
        return res.status(400).json({
          message: "Height must contain numeric values for feet and inches.",
        });
      }
    }

    // Validate maritalStatus
    if (
      updateData.maritalStatus &&
      !["Single", "Married", "Divorced", "Widowed"].includes(
        updateData.maritalStatus
      )
    ) {
      return res.status(400).json({ message: "Invalid marital status." });
    }

    // Update the user profile
    const updatedProfile = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProfile) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "Profile updated successfully.",
      data: updatedProfile,
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return res
        .status(400)
        .json({ message: "Malformed JSON in request body." });
    }

    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the profile." });
  }
};

exports.saveRiligionDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    let user = await HoroscopeDetails.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });
    console.log(user);
    if (!user) {
      user = await HoroscopeDetails.create({
        userId: new mongoose.Types.ObjectId(userId),
      });

      const userRecord = await User.findById(userId);

      userRecord.HoroscopicId = user._id;
      await userRecord.save();
      await user.save();
      return res.status(201).json({ message: "User created", user });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
exports.updateRiligionDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body.data;
    if (!updateData) {
      return res
        .status(400)
        .json({ message: "Missing updateData in request body." });
    }

    console.log("Update data received:", updateData);

    const updatedProfile = await HoroscopeDetails.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({
      message: "Profile updated successfully.",
      data: updatedProfile,
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return res
        .status(400)
        .json({ message: "Malformed JSON in request body." });
    }
    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the profile." });
  }
};

exports.saveFamilyDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    let user = await FamilyDetails.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!user) {
      user = await FamilyDetails.create({
        userId: new mongoose.Types.ObjectId(userId),
      });
      const userRecord = await User.findById(userId);

      userRecord.familydetailsId = user._id;
      await userRecord.save();
      await user.save();

      return res.status(201).json({ message: "User created", user });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
exports.updateFamilyDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body.data;

    if (!updateData) {
      return res
        .status(400)
        .json({ message: "Missing updateData in request body." });
    }

    // console.log("Update data received:", updateData);
    const updatedProfile = await FamilyDetails.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );
    // console.log("Update:", updatedProfile);

    if (!updatedProfile) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "Profile updated successfully.",
      data: updatedProfile,
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return res
        .status(400)
        .json({ message: "Malformed JSON in request body." });
    }

    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the profile." });
  }
};

exports.saveExtendedFamilyDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    let user = await ExtendedFamily.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!user) {
      user = await ExtendedFamily.create({
        userId: new mongoose.Types.ObjectId(userId),
        grandFatherName: "",
        grandFathersonOf: "",
        grandFatheroccupation: "",
        grandFatherthikana: "",
        grandMotherName: "",
        grandMotherdaughterOf: "",
        grandmotherthikana: "",
        badePapa: [{ name: "", marriedto: "", daughterof: "", thikana: "" }],
        kakosa: [{ name: "", marriedto: "", daughterof: "", thikana: "" }],
        bhuasa: [{ name: "", marriedto: "", sonof: "", thikana: "" }],
        maternalGrandFatherName: "",
        maternalGrandFatherthikana: "",
        maternalGrandFathersonOf: "",
        maternalGrandFatheroccupation: "",
        maternalGrandMotherName: "",
        maternalGrandMotherdaughterOf: "",
        maternalGrandMotherthikana: "",
        mamosa: [{ name: "", marriedto: "", daughterof: "", thikana: "" }],
        masisa: [{ name: "", marriedto: "", sonof: "", thikana: "" }],
      });
      return res.status(201).json({ message: "User created", user });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.updateExtendedFamilyDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body.data;
    console.log(userId);

    if (!updateData) {
      return res
        .status(400)
        .json({ message: "Missing updateData in request body." });
    }

    console.log("Update data received:", updateData);
    let user = await ExtendedFamily.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });
    Object.keys(updateData).forEach((key) => {
      if (Array.isArray(updateData[key])) {
        if (Array.isArray(user[key])) {
          user[key] = updateData[key];
        } else {
          user[key] = updateData[key];
          console.log(`Created new array key '${key}' in user object.`);
        }
      } else {
        if (!(key in user)) {
          console.log(`Created new key '${key}' in user object.`);
        }
        user[key] = updateData[key];
      }
    });

    console.log("Updated User Data:", user);
    await user.save();

    console.log("Update:", user);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "Profile updated successfully.",
      data: user,
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return res
        .status(400)
        .json({ message: "Malformed JSON in request body." });
    }

    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the profile." });
  }
};

exports.uploadPhotos = async (req, res) => {
  try {
    const token = req.headers.token;
    if (!token)
      return res.status(401).json({ message: "Authorization token required" });

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id)
      return res.status(401).json({ message: "Invalid token" });

    const userId = decoded.id;
    const { photos, documents, isPrivate } = req.body;

    if (!Array.isArray(photos) || !Array.isArray(documents)) {
      return res
        .status(400)
        .json({ message: "Photos and documents must be arrays" });
    }

    // Check if photos exceed the maximum limit of 10
    if (photos.length > 10) {
      return res.status(400).json({ message: "Maximum of 10 photos allowed" });
    }

    const photoDocument = await Photo.findOne({ userId });

    if (photoDocument) {
      // Update existing photo and document entries
      photoDocument.photos = photos;
      photoDocument.documents = documents;
      photoDocument.isPrivate = isPrivate || photoDocument.isPrivate;

      await photoDocument.save();
      return res.status(200).json({
        message: "Photos and documents updated successfully",
        photoDocument,
      });
    } else {
      // Create a new photo document entry
      const newPhotoDocument = new Photo({
        userId,
        photos,
        documents,
        isPrivate,
      });

      await newPhotoDocument.save();
      return res.status(201).json({
        message: "Photos and documents uploaded successfully",
        newPhotoDocument,
      });
    }
  } catch (error) {
    console.error("Error uploading photos:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.createStory = async (req, res) => {
  try {
    const { title, description } = req.body;
    console.log(req.body);
    console.log(req.file);
    // Validate input
    if (!title || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newStory = new Stories({
      title,
      image: req.file,
      description,
    });

    await newStory.save();

    res.status(201).json({
      message: "Story created successfully",
      story: newStory,
    });
  } catch (error) {
    console.error("Error creating story:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.createContactRequest = async (req, res) => {
  try {
    const payload = req.body.data || req.body;
    const { firstName, lastName, mobile, email, additionalInfo } = payload;

    const existingUser = await ContactRequest.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existingUser) {
      return res.status(201).json({
        message: "Contact request Saved",
        existingUser,
      });
    }

    // Create a new contact request
    const newContactRequest = new ContactRequest({
      firstName,
      lastName,
      mobile,
      email,
      additionalInfo,
    });

    // Save the contact request to the database
    await newContactRequest.save();

    return res.status(201).json({
      message: "Contact request created successfully",
      contactRequest: newContactRequest,
    });
  } catch (error) {
    console.error("Error creating contact request:", error);

    // Handle duplicate key error
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        message: `A record with the same ${duplicateField} already exists.`,
      });
    }

    // Generic server error
    res.status(500).json({ message: error, error });
  }
};

exports.updateimageprivacy = async (req, res) => {
  try {
    const userId = req.user.id;
    const payload = req.body.data !== undefined && typeof req.body.data === "object" ? req.body.data : req.body;

    const isDocPrivate = payload.isDocPrivate !== undefined ? payload.isDocPrivate : req.body.isDocPrivate;
    const type = payload.type || req.body.type;
    const val = typeof req.body.data === "boolean" ? req.body.data : (typeof payload === "boolean" ? payload : payload.data);

    console.log("Privacy update:", { payload, isDocPrivate, type, val });

    const user = await files.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (type === "document" || isDocPrivate !== undefined) {
      const docVal = isDocPrivate !== undefined ? isDocPrivate : val;
      user.isDocPrivate = Boolean(docVal);
    } else {
      user.isPrivate = Boolean(val);
    }
    await user.save();

    res.status(200).json({
      message: "Privacy setting updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error updating image privacy:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getLimits = async (req, res) => {
  try {
    const limits = await Limit.findOne();
    if (!limits) {
      return res.status(404).json({ message: "Limits not found" });
    }
    res.json(limits);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
exports.updateLimits = async (req, res) => {
  try {
    if (!req.body.data) {
      return res.status(400).json({ message: "No data provided for update" });
    }

    const {
      freeMessageLimit,
      freeProfileViews,
      freeLimit,
      premiumLimit,
      freeRequestSendLimit,
      premiumRequestSendLimit,
    } = req.body.data;
    const updateFields = {};

    // Validate and add only provided fields
    if (freeMessageLimit !== undefined) {
      if (freeMessageLimit < 0 || freeMessageLimit > 999) {
        return res
          .status(400)
          .json({ message: "freeMessageLimit must be between 0 and 999" });
      }
      updateFields.freeMessageLimit = freeMessageLimit;
    }

    if (freeProfileViews !== undefined) {
      if (freeProfileViews < 0 || freeProfileViews > 100000) {
        return res
          .status(400)
          .json({ message: "freeProfileViews must be between 0 and 100000" });
      }
      updateFields.freeProfileViews = freeProfileViews;
    }

    if (freeLimit !== undefined) {
      updateFields.freeLimit = freeLimit;
      if (freeLimit.count !== undefined) {
        updateFields.freeProfileViews = freeLimit.count; // sync legacy field if needed
      }
    }

    if (premiumLimit !== undefined) {
      updateFields.premiumLimit = premiumLimit;
    }

    if (freeRequestSendLimit !== undefined) {
      if (freeRequestSendLimit < 0 || freeRequestSendLimit > 99999) {
        return res
          .status(400)
          .json({ message: "freeRequestSendLimit must be between 0 and 99999" });
      }
      updateFields.freeRequestSendLimit = freeRequestSendLimit;
    }

    if (premiumRequestSendLimit !== undefined) {
      if (premiumRequestSendLimit < 0 || premiumRequestSendLimit > 99999) {
        return res
          .status(400)
          .json({ message: "premiumRequestSendLimit must be between 0 and 99999" });
      }
      updateFields.premiumRequestSendLimit = premiumRequestSendLimit;
    }

    if (Object.keys(updateFields).length === 0) {
      return res
        .status(400)
        .json({ message: "No valid fields provided for update" });
    }

    // Find the existing limits or create a new one
    let updatedLimit = await Limit.findOneAndUpdate(
      {}, // Find any document (assuming there's only one record)
      { $set: updateFields },
      { new: true, upsert: true } // If not found, create a new one
    );

    res.json({ message: "Limits updated successfully", updatedLimit });
  } catch (error) {
    console.error("Error updating limits:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getusersData = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.find({
      isEnable: { $ne: false },
      isbloacked: { $ne: true }
    }).select(
      "gender firstName middleName lastName dateOfBirth martrId view isVisible isbloacked isApproved isVerified avatar isEnable mobile email isSubscribed"
    );
    // console.log(user);
    res.status(200).json({
      message: "Profiles fetched successfully.",
      user,
    });
  } catch (error) {
    console.error("Error fetching profiles:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
exports.getBlockedProfiles = async (req, res) => {
  try {
    const user = await User.find({ isbloacked: true }).select(
      "gender firstName middleName lastName dateOfBirth martrId view isVisible isbloacked isApproved isVerified avatar isEnable mobile email isSubscribed"
    );

    res.status(200).json({
      message: "Blocked profiles fetched successfully.",
      user,
    });
  } catch (error) {
    console.error("Error fetching blocked profiles:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getDeletedprofiles = async (req, res) => {
  try {
    const user = await User.find({ isEnable: false }).select(
      "gender firstName middleName lastName dateOfBirth martrId view isVisible isbloacked isApproved isVerified avatar isEnable mobile email isSubscribed"
    );

    res.status(200).json({
      message: "Enable profiles fetched successfully.",
      user,
    });
  } catch (error) {
    console.error("Error fetching blocked profiles:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
exports.blockuser = async (req, res) => {
  const userId = req.user.id;
  const profileId = req.body.data;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const profile = await User.findById(profileId).select("isbloacked");
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    profile.isbloacked = !profile.isbloacked;
    await profile.save();

    return res.status(200).json({ message: "View recorded successfully" });
  } catch (error) {
    console.error("Error recording view:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};
exports.disableuser = async (req, res) => {
  const userId = req.user.id;
  const profileId = req.body.data;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const profile = await User.findById(profileId).select("isEnable");
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    profile.isEnable = !profile.isEnable;
    await profile.save();

    return res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    console.error("Error recording Updated:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.approveuser = async (req, res) => {
  const userId = req.user.id;
  const profileId = req.body.data;

  console.log(req.body);
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const profile = await User.findById(profileId).select("isApproved");
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    profile.isApproved = !profile.isApproved;
    await profile.save();

    return res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    console.error("Error recording Updated:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.verifyuser = async (req, res) => {
  const userId = req.user.id;
  const profileId = req.body.data;

  console.log(req.body);
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const profile = await User.findById(profileId).select("isVerified");
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    profile.isVerified = !profile.isVerified;
    await profile.save();

    return res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    console.error("Error verifying user:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.viewuser = async (req, res) => {
  const userId = req.user.id;
  const profileId = req.body.data;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile = await User.findById(profileId)
      .populate("visitedAt")
      .populate("viewedBy")
      .populate("shortlisted.profile")
      .populate("filesId")
      .populate("HoroscopicId")
      .populate("profdetailsId")
      .populate("familydetailsId")
      .populate("photoReqSent.userId")
      .populate("photoReqReceived.userId")
      .populate("reqSent.userId")
      .populate("reqReceived.userId");

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    profile.isEnable = !profile.isEnable;
    await profile.save();

    return res.status(200).json({
      message: "Updated successfully",
      profile,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.changestatus = async (req, res) => {
  const storyId = req.body.data;
  console.log(storyId);

  try {
    const story = await Stories.findById(storyId).select("status");
    if (!story) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(story);

    story.status = !story.status;
    await story.save();

    return res.status(200).json({
      message: "Updated successfully",
      story,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.getStories = async (req, res) => {
  try {
    const stories = await Stories.find();

    return res.status(200).json({
      message: "Stories data found",
      stories, // Updated key for clarity
    });
  } catch (error) {
    console.error("Error fetching stories:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.storiesData = async (req, res) => {
  try {
    const stories = await Stories.find({ status: true }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Stories data found",
      user: stories || [],
      stories: stories || [],
    });
  } catch (error) {
    console.error("Error fetching stories:", error);

    return res.status(500).json({
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

exports.editstory = async (req, res) => {
  try {
    const storyId = req.body.data;
    console.log(storyId);
    const user = await Stories.findById(storyId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(user);
    return res.status(200).json({
      message: "Stories data found",
      user,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.editRequestStatus = async (req, res) => {
  try {
    const { contactReqId, status } = req.body.data;

    // Validate input
    console.log(contactReqId);
    console.log(status);

    if (!contactReqId || !status) {
      return res.status(400).json({
        message: "Invalid input. Both contactReqId and status are required.",
      });
    }

    // Find contact request by ID
    const user = await ContactRequest.findById(contactReqId);
    if (!user) {
      return res.status(404).json({ message: "Contact request not found." });
    }

    // Update status
    user.status = status;
    await user.save();

    return res.status(200).json({
      message: "Contact request status updated successfully.",
      user,
    });
  } catch (error) {
    console.error("Error updating contact request status:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

//chat app api's

exports.sendMessage = async (req, res) => {
  try {
    const { chatId, message } = req.body;
    console.log(req.body);
    const sender = req.user.id;

    if (!chatId || !sender || !message) {
      return res
        .status(400)
        .json({ error: "Chat ID, sender, and message are required." });
    }

    let chat = await Chat.findById(chatId).populate("lastMessage");

    if (!chat) {
      return res.status(404).json({ error: "Chat not found." });
    }

    // If the chat was declined by user2, block sending messages
    if (chat && chat.status == "rejected") {
      return res
        .status(200)
        .json({ message: "This chat has been declined and cannot be used." });
    }

    if (chat && chat.status === "other") {
      const otherParticipant = chat.participants.find(p => p.toString() !== sender.toString());
      if (otherParticipant) {
        const senderUser = await User.findById(sender).select("reqSent reqReceived").lean();
        const isConnAccepted = (senderUser?.reqSent || []).some(r => r.userId?.toString() === otherParticipant.toString() && r.status === "accepted") ||
                               (senderUser?.reqReceived || []).some(r => r.userId?.toString() === otherParticipant.toString() && r.status === "accepted");
        if (isConnAccepted) {
          chat.status = "accepted";
        } else {
          return res.status(200).json({ message: "This chat has to be Accepted." });
        }
      }
    }

    

    // Create new message
    const newMessage = new Message({
      chatId,
      sender,
      message,
      seenBy: [sender],
    });

    await newMessage.save();

    // Update chat with the new lastMessage
    chat.lastMessage = newMessage._id;
    chat.updatedAt = Date.now();
    await chat.save();

    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender", "firstName lastName")
      .lean();

    return res.status(201).json({ populatedMessage });
  } catch (err) {
    console.error("Error in sendMessage:", err);
    return res
      .status(500)
      .json({ error: "Server error. Please try again later." });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { chatId } = req.body;
    const userId = req.user.id;

    if (!chatId) {
      return res.status(400).json({ error: "Chat ID is required." });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found." });
    }

    const clearedEntry = chat.clearedBy.find(
      (entry) => entry.user.toString() === userId
    );
    const clearedAt = clearedEntry ? clearedEntry.clearedAt : null;

    let messageQuery = { chatId };
    if (clearedAt) {
      messageQuery.createdAt = { $gt: clearedAt };
    }

    const messages = await Message.find(messageQuery)
      .populate("sender")
      .sort({ createdAt: 1 })
      .lean();

    if (!messages.length) {
      return res
        .status(404)
        .json({ error: "No messages found for this chat." });
    }

    await Message.updateMany(
      { chatId, seenBy: { $ne: userId } },
      { $addToSet: { seenBy: userId } }
    );

    res.status(200).json(messages);
  } catch (err) {
    console.error("Error in getMessages:", err);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

// exports.deleteMessage = async (req, res) => {
//   try {
//     const { chatId, deleteForAll } = req.body;
//     const userId = req.user.id;

//     if (!chatId) {
//       return res.status(400).json({ error: "Chat ID is required." });
//     }

//     const chat = await Chat.findById(chatId);
//     if (!chat) {
//       return res.status(404).json({ error: "Chat not found." });
//     }

//     if (!chat.participants.includes(userId)) {
//       return res
//         .status(403)
//         .json({ error: "You are not a participant in this chat." });
//     }

//     if (deleteForAll) {
//       await Message.deleteMany({ chatId, _id: { $ne: lastMessage } });
//       await chat.save();

//       return res.status(200).json({ message: "Chat deleted for everyone." });
//     } else {
//       const clearedAt = new Date();
//       const clearedIndex = chat.clearedBy.findIndex(
//         (entry) => entry.user.toString() === userId
//       );

//       if (clearedIndex !== -1) {
//         chat.clearedBy[clearedIndex].clearedAt = clearedAt;
//       } else {
//         chat.clearedBy.push({ user: userId, clearedAt });
//       }

//       await chat.save();

//       return res.status(200).json({ message: "Chat deleted successfully." });
//     }
//   } catch (err) {
//     console.error("Error in deleteMessage:", err);
//     res.status(500).json({ error: "Server error. Please try again later." });
//   }
// };

exports.deleteMessage = async (req, res) => {
  try {
    const { chatId, deleteForAll } = req.body;
    const userId = req.user.id;

    if (!chatId) {
      return res.status(400).json({ error: "Chat ID is required." });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found." });
    }

    if (!chat.participants.includes(userId)) {
      return res
        .status(403)
        .json({ error: "You are not a participant in this chat." });
    }

    if (deleteForAll) {
      const clearedAt = new Date();
      chat.clearedBy.forEach((entry) => {
        entry.clearedAt = clearedAt;
      });
      await chat.save();

      return res.status(200).json({ message: "Chat cleared for everyone." });
    } else {
      const clearedAt = new Date();
      const clearedIndex = chat.clearedBy.findIndex(
        (entry) => entry.user.toString() === userId
      );

      if (clearedIndex !== -1) {
        chat.clearedBy[clearedIndex].clearedAt = clearedAt;
      } else {
        chat.clearedBy.push({ user: userId, clearedAt });
      }

      await chat.save();

      return res.status(200).json({ message: "Chat cleared successfully." });
    }
  } catch (err) {
    console.error("Error in deleteMessage:", err);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

exports.createOrGetChat = async (req, res) => {
  try {
    const user1 = req.user.id;
    const { user2, message } = req.body.data;

    if (!user1 || !user2) {
      return res
        .status(400)
        .json({ message: "Both user1 and user2 IDs are required." });
    }

    const userExists1 = await User.findById(user1);
    const userExists2 = await User.findById(user2);

    if (!userExists1 || !userExists2) {
      return res.status(404).json({ message: "One or both users not found." });
    }

    const user = await User.findById(user1)
      .select("reqSent reqReceived photoReqSent")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User1 not found." });
    }

    const isInReqSent = user.reqSent.some(
      (req) => req.userId.toString() === user2 && req.status !== "rejected"
    );

    if (!isInReqSent) {
      return res
        .status(403)
        .json({ message: "You cannot start a chat with this user." });
    }

    let chat = await Chat.findOne({
      participants: { $all: [user1, user2] },
    }).populate("participants lastMessage");

    // If the chat exists and was declined by user2, block messages
    if (chat && chat.status === "rejected") {
      return res
        .status(403)
        .json({ error: "This chat has been declined and cannot be used." });
    }

    if (chat && chat.status === "other") {
      return res.status(200).json({ error: "This chat has to be Accepted." });
    }

    // If chat doesn't exist OR has no lastMessage, create a new chat and first message
    if (!chat || !chat.lastMessage) {
      chat = new Chat({ participants: [user1, user2], status: "accepted" });
      await chat.save();

      const newMessage = new Message({
        chatId: chat._id,
        sender: user1,
        message,
        seenBy: [user1],
      });

      await newMessage.save();

      chat.lastMessage = newMessage._id;
      chat.updatedAt = Date.now();
      await chat.save();

      return res.status(200).json(chat);
    }

    
    const newMessage = new Message({
      chatId: chat._id,
      sender: user1,
      message,
      seenBy: [user1],
    });
    await newMessage.save();
    chat.lastMessage = newMessage._id;
    chat.updatedAt = Date.now();
    await chat.save();

    res.status(200).json(chat);
  } catch (err) {
    console.error("Error in createOrGetChat:", err);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

exports.getUserChats = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Auto-create Chat documents for any accepted requests (interest, photo, or contact requests)
    const currentUser = await User.findById(userId).select("reqSent reqReceived photoReqSent photoReqReceived").lean();
    if (currentUser) {
      const acceptedUserIds = new Set();
      (currentUser.reqSent || []).forEach(r => { if (r.status === "accepted" && r.userId) acceptedUserIds.add(r.userId.toString()); });
      (currentUser.reqReceived || []).forEach(r => { if (r.status === "accepted" && r.userId) acceptedUserIds.add(r.userId.toString()); });
      (currentUser.photoReqSent || []).forEach(r => { if (r.status === "accepted" && r.userId) acceptedUserIds.add(r.userId.toString()); });
      (currentUser.photoReqReceived || []).forEach(r => { if (r.status === "accepted" && r.userId) acceptedUserIds.add(r.userId.toString()); });

      try {
        const acceptedContactReqs = await UserContactRequest.find({
          $or: [{ senderId: userId }, { receiverId: userId }],
          status: "accepted"
        }).lean();

        acceptedContactReqs.forEach(c => {
          const otherId = c.senderId?.toString() === userId ? c.receiverId?.toString() : c.senderId?.toString();
          if (otherId) acceptedUserIds.add(otherId);
        });
      } catch (e) {
        // UserContactRequest collection optional check
      }

      for (const otherUserIdStr of acceptedUserIds) {
        if (!otherUserIdStr || otherUserIdStr === userId) continue;
        const otherObjectId = new mongoose.Types.ObjectId(otherUserIdStr);
        const existingChat = await Chat.findOne({
          participants: { $all: [userObjectId, otherObjectId] },
        });
        if (!existingChat) {
          await Chat.create({
            participants: [userObjectId, otherObjectId],
            status: "accepted",
          });
        }
      }
    }

    const chats = await Chat.find({
      participants: userId,
    })
      .populate("lastMessage")
      .populate({
        path: "participants",
        select: "firstName lastName martrId avatar filesId",
        populate: { path: "filesId", select: "photos" }
      })
      .sort({ updatedAt: -1 })
      .lean();

    if (!chats.length) {
      return res.status(200).json([]);
    }

    // Filter messages based on `clearedBy`
    const filteredChats = chats.map((chat) => {
      const clearedEntry = (chat.clearedBy || []).find(
        (entry) => entry.user?.toString() === userId
      );
      const clearedAt = clearedEntry ? clearedEntry.clearedAt : null;

      if (clearedAt && chat.lastMessage?.createdAt < clearedAt) {
        chat.lastMessage = null;
      }

      return chat;
    });

    return res.status(200).json(filteredChats);
  } catch (err) {
    console.error("Error in getUserChats:", err);
    return res.status(500).json({ error: "Server error. Please try again later." });
  }
};

exports.getallchatsRequest = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const chats = await Chat.find({ participants: userId })
      .populate("lastMessage")
      .populate("participants", "firstName lastName martrId")
      .sort({ updatedAt: -1 });

    if (!chats.length) {
      return res.status(404).json({ error: "No chats found for this user." });
    }

    // Convert Mongoose docs to plain objects (if needed)
    const chatObjects = chats.map((chat) => chat.toObject());

    const filteredChats = chatObjects.filter(
      (chat) =>
        chat.status === "other" &&
        chat.lastMessage &&
        chat.lastMessage?.sender.toString() !== userId
    );

    res.status(200).json({
      success: true,
      user: filteredChats,
      message: "Chat status fetched",
    });
  } catch (err) {
    console.error("Error in getAllChatsRequest:", err);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

exports.updateChatStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId, action } = req.body.data;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    if (!chatId || !action) {
      return res
        .status(400)
        .json({ message: "Chat ID and action are required." });
    }

    console.log(chatId);

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found." });
    }

    chat.status = action;
    await chat.save();

    console.log(chat);
    res.status(200).json({
      message: `Chat status updated to '${action}' for chat ${chatId} by user ${userId}.`,
    });
  } catch (err) {
    console.error("Error in updateChatStatus:", err);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

exports.viewDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileId = req.params.id;
    if (!profileId) {
      return res.status(400).json({ message: "Profile ID is required" });
    }

    const [user, profile, contactReqDoc] = await Promise.all([
      User.findById(userId).select("photoReqSent documentReqSent reqSent visitedAt isSubscribed role"),
      User.findById(profileId)
        .populate("filesId")
        .populate("HoroscopicId")
        .populate("profdetailsId"),
      UserContactRequest.findOne({
        $or: [
          { senderId: userId, receiverId: profileId },
          { senderId: profileId, receiverId: userId },
        ],
      }),
    ]);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (
      profile.isVisible === false &&
      contactReqDoc?.status !== "accepted" &&
      userId.toString() !== profileId.toString() &&
      user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "This profile is hidden until connection request is accepted.",
      });
    }

    const isAlreadyVisited = Array.isArray(user.visitedAt) && user.visitedAt.some(
      (id) => id.toString() === profileId
    );

    if (!isAlreadyVisited && user.role !== "admin") {
      const limit = await Limit.findOne();
      const limitCount = user.isSubscribed ? (limit?.premiumLimit?.count || 50) : (limit?.freeProfileViews || 2);
      const currentViews = Array.isArray(user.visitedAt) ? user.visitedAt.length : 0;

      if (currentViews >= limitCount) {
        return res.status(403).json({
          message: `You have reached your limit of ${limitCount} profile views. Please upgrade your plan.`,
          limitExceeded: true,
          limitCount,
          currentViews,
          periodType: "lifetime"
        });
      }
    }

    // Update view count and visited list if it's not the user's own profile and user is not admin
    if (userId.toString() !== profileId.toString() && user.role !== "admin") {
      let profileUpdated = false;
      let userUpdated = false;

      if (!profile.viewedBy.some((viewer) => viewer.equals(userId))) {
        profile.viewedBy.push(userId);
        profileUpdated = true;
      }

      profile.view = (profile.view || 0) + 1;
      profileUpdated = true;

      if (!user.visitedAt.some((visited) => visited.equals(profileId))) {
        user.visitedAt.push(profileId);
        userUpdated = true;
      }

      if (profileUpdated || userUpdated) {
        await Promise.all([
          userUpdated ? user.save() : Promise.resolve(),
          profileUpdated ? profile.save() : Promise.resolve()
        ]);
      }
    }

    const isPhotoReqSent =
      Array.isArray(user.photoReqSent) &&
      user.photoReqSent.some(
        (req) =>
          req.userId && req.userId.toString() === profileId && req.status === "accepted"
      );
    const isDocumentReqSent =
      Array.isArray(user.documentReqSent) &&
      user.documentReqSent.some(
        (req) =>
          req.userId && req.userId.toString() === profileId && req.status === 'accepted'
      );

    // Exact status for the viewer's own requests (for button state)
    const sentPhotoReq = Array.isArray(user.photoReqSent)
      ? user.photoReqSent.find((r) => r.userId && r.userId.toString() === profileId)
      : null;
    const photoRequestStatus = sentPhotoReq ? sentPhotoReq.status : null;

    const sentDocReq = Array.isArray(user.documentReqSent)
      ? user.documentReqSent.find((r) => r.userId && r.userId.toString() === profileId)
      : null;
    const documentRequestStatus = sentDocReq ? sentDocReq.status : null;

    const isReqSent =
      Array.isArray(user.reqSent) &&
      user.reqSent.some(
        (req) =>
          req.userId && req.userId.toString() === profileId && req.status === "accepted"
      );

    let contactRequestStatus = contactReqDoc ? contactReqDoc.status : null;
    if (!contactRequestStatus && isReqSent) {
      contactRequestStatus = "accepted";
    }

    console.log("isPhotoReqSent:", isPhotoReqSent);
    console.log("isReqSent:", isReqSent);
    console.log("documentRequestStatus:", documentRequestStatus);
    console.log("photoRequestStatus:", photoRequestStatus);
    console.log("contactRequestStatus:", contactRequestStatus);

    let userResponse = profile.toObject();

    // Ensure filesId exists before accessing its properties
    userResponse.filesId = userResponse.filesId || { photos: [], documents: [], isPrivate: false, isDocPrivate: false };
    const photos = userResponse.filesId.photos || [];
    const isPrivate = !!userResponse.filesId.isPrivate;
    const isDocPrivate = userResponse.filesId.isDocPrivate !== undefined ? !!userResponse.filesId.isDocPrivate : false;

    userResponse.filesId.photos =
      (photos.length !== 0 && !isPrivate) ||
      (isPrivate && isPhotoReqSent)
        ? photos
        : [];

    // Documents: only expose if documents are public OR photo request accepted
    if (userResponse.filesId.documents) {
      const docsVisible = !isDocPrivate || isDocumentReqSent;
      userResponse.filesId.documents = docsVisible ? userResponse.filesId.documents : [];
      userResponse.filesId.documentsPrivate = isDocPrivate && !isDocumentReqSent;
      userResponse.filesId.isDocPrivate = isDocPrivate;
    }

    // Attach request statuses so the frontend can show correct button state
    userResponse.photoRequestStatus    = photoRequestStatus;
    userResponse.documentRequestStatus = documentRequestStatus;
    userResponse.contactRequestStatus  = contactRequestStatus;

    // Mask mobile and email unless accepted, own profile, or admin
    const isContactAccepted = contactRequestStatus === "accepted";
    const isOwnProfile = userId.toString() === profileId.toString();
    const isAdminUser = user.role === "admin";

    if (isOwnProfile || isAdminUser || isContactAccepted) {
      userResponse.mobile = profile.mobile;
      userResponse.email = profile.email;
    } else {
      userResponse.mobile = maskMobile(profile.mobile);
      userResponse.email = maskEmail(profile.email);
    }

    // Always fetch familyInfo (Partner Preferences) — it's non-sensitive
    const familyInfoDoc = await User.findById(profileId)
      .populate({ path: "familydetailsId", select: "familyInfo" })
      .lean()
      .then((u) => u?.familydetailsId);

    if (familyInfoDoc?.familyInfo) {
      userResponse.familyInfo = familyInfoDoc.familyInfo;
    }

    if (isReqSent || isOwnProfile || isAdminUser) {
      const [paternaldetails, familyDetails] = await Promise.all([
        ExtendedFamily.findOne({ userId: profileId }),
        User.findById(profileId)
          .populate("familydetailsId")
          .then((user) => user?.familydetailsId),
      ]);

      userResponse.paternaldetails = paternaldetails;
      userResponse.familyDetails = familyDetails;
    }

    console.log(userResponse);

    res.status(200).json({ user: userResponse });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.viewPhotos = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileId = req.params.id;
    if (!profileId) {
      return res.status(400).json({ message: "Profile ID is required" });
    }
    const user = await User.findById(userId).select("photoReqSent");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPhotoReqSent = user.photoReqSent.some(
      (req) => req.userId.toString() === profileId && req.status == "accepted"
    );

    console.log(isPhotoReqSent);

    const profile = await User.findById(profileId)
      .populate("filesId")
      .populate("HoroscopicId")
      .populate("profdetailsId")
      .populate("familydetailsId");

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    profile.filesId.photos =
      (profile.filesId.photos.length !== 0 && !profile.filesId.isPrivate) ||
      (profile.filesId.isPrivate && isPhotoReqSent)
        ? profile.filesId.photos
        : [];

    let userResponse = profile.toObject();

    // Compute exact request status so frontend shows correct button
    const sentPhotoReq = user.photoReqSent.find(
      (r) => r.userId.toString() === profileId
    );
    userResponse.photoRequestStatus = sentPhotoReq ? sentPhotoReq.status : null;

    // Mask mobile and email
    userResponse.mobile = maskMobile(profile.mobile);
    userResponse.email = maskEmail(profile.email);

    res.status(200).json({ user: userResponse });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getPublicRecentProfiles = async (req, res) => {
  try {
    const query = {
      isVisible: true,
      isbloacked: false,
      isApproved: true,
      isEnable: true,
      role: { $ne: "admin" },
    };

    const profiles = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(9)
      .populate("filesId")
      .populate("HoroscopicId")
      .populate({ path: "familydetailsId", select: "occupation" })
      .populate({ path: "profdetailsId", select: "class" })
      .lean();

    const filterProfiles = profiles.map((profile) => {
      if (profile.mobile) {
        profile.mobile = maskMobile(profile.mobile);
      }
      if (profile.email) {
        profile.email = maskEmail(profile.email);
      }

      if (profile.filesId && profile.filesId.photos) {
        const { isPrivate, photos } = profile.filesId;
        const totalPhotos = photos?.length || 0;
        return {
          ...profile,
          filesId: {
            totalPhotos,
            photos: isPrivate ? [] : photos.filter((p) => p.isAvatar),
          },
        };
      }
      return profile;
    });

    res.status(200).json({
      message: "Recent public profiles fetched successfully.",
      data: filterProfiles,
    });
  } catch (error) {
    console.error("Error fetching public recent profiles:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.toggleBlockProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const blockUserId = req.body.blockUserId || req.body.profileId || req.body.userId || req.body.data;

    if (!blockUserId) {
      return res.status(400).json({ message: "Block User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const targetUser = await User.findById(blockUserId);
    if (!targetUser) {
      return res.status(404).json({ message: "Target user not found" });
    }

    const isBlocked = user.blocked.includes(blockUserId);
    if (isBlocked) {
      user.blocked = user.blocked.filter((id) => id.toString() !== blockUserId.toString());
    } else {
      user.blocked.push(blockUserId);
    }

    await user.save();

    res.status(200).json({
      message: isBlocked ? "User unblocked successfully" : "User blocked successfully",
      blocked: user.blocked,
      success: true,
    });
  } catch (error) {
    console.error("Error toggling block profile:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getUsersBlockedByMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId)
      .populate({
        path: "blocked",
        select: "gender firstName middleName lastName dateOfBirth martrId avatar isSubscribed",
        populate: { path: "filesId" },
      })
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Blocked users fetched successfully",
      blockedUsers: user.blocked || [],
      success: true,
    });
  } catch (error) {
    console.error("Error fetching blocked users:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getIndividualLimits = async (req, res) => {
  try {
    const userLimits = await UserLimit.find()
      .populate("userId", "firstName middleName lastName email mobile martrId")
      .lean();
    res.status(200).json({
      message: "Individual user limits fetched successfully",
      userLimits,
    });
  } catch (error) {
    console.error("Error fetching individual limits:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.saveIndividualLimit = async (req, res) => {
  try {
    const { userId, count, periodType, startDate, endDate } = req.body;
    if (!userId || count === undefined) {
      return res.status(400).json({ message: "userId and count are required" });
    }

    let userLimit = await UserLimit.findOne({ userId });
    if (userLimit) {
      userLimit.count = count;
      userLimit.periodType = periodType || userLimit.periodType;
      userLimit.startDate = startDate || userLimit.startDate;
      userLimit.endDate = endDate || userLimit.endDate;
      userLimit.updatedAt = Date.now();
      await userLimit.save();
    } else {
      userLimit = await UserLimit.create({
        userId,
        count,
        periodType: periodType || "lifetime",
        startDate,
        endDate,
      });
    }

    res.status(200).json({
      message: "Individual user limit saved successfully",
      userLimit,
    });
  } catch (error) {
    console.error("Error saving individual limit:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.deleteIndividualLimit = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "userId parameter is required" });
    }

    const deleted = await UserLimit.findOneAndDelete({ userId });
    if (!deleted) {
      return res.status(404).json({ message: "Individual limit not found for this user" });
    }

    res.status(200).json({
      message: "Individual user limit deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting individual limit:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getIndividualRequestLimits = async (req, res) => {
  try {
    const userLimits = await UserRequestLimit.find()
      .populate("userId", "firstName middleName lastName email mobile martrId")
      .lean();
    res.status(200).json({
      message: "Individual user request limits fetched successfully",
      userLimits,
    });
  } catch (error) {
    console.error("Error fetching individual request limits:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.saveIndividualRequestLimit = async (req, res) => {
  try {
    const { userId, count, periodType, startDate, endDate } = req.body;
    if (!userId || count === undefined) {
      return res.status(400).json({ message: "userId and count are required" });
    }

    let userLimit = await UserRequestLimit.findOne({ userId });
    if (userLimit) {
      userLimit.count = count;
      userLimit.periodType = periodType || userLimit.periodType;
      userLimit.startDate = startDate || userLimit.startDate;
      userLimit.endDate = endDate || userLimit.endDate;
      userLimit.updatedAt = Date.now();
      await userLimit.save();
    } else {
      userLimit = await UserRequestLimit.create({
        userId,
        count,
        periodType: periodType || "lifetime",
        startDate,
        endDate,
      });
    }

    res.status(200).json({
      message: "Individual user request limit saved successfully",
      userLimit,
    });
  } catch (error) {
    console.error("Error saving individual request limit:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.deleteIndividualRequestLimit = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "userId parameter is required" });
    }

    const deleted = await UserRequestLimit.findOneAndDelete({ userId });
    if (!deleted) {
      return res.status(404).json({ message: "Individual request limit not found for this user" });
    }

    res.status(200).json({
      message: "Individual user request limit deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting individual request limit:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.searchUsersForLimits = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Query string is required" });
    }

    const searchRegex = new RegExp(query, "i");
    const users = await User.find({
      $or: [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { mobile: searchRegex },
      ],
    })
      .select("firstName middleName lastName email mobile martrId")
      .limit(10)
      .lean();

    res.status(200).json({
      message: "Users fetched successfully for limits",
      users,
    });
  } catch (error) {
    console.error("Error searching users for limits:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.changereviewstatus = async (req, res) => {
  const reviewId = req.body.data;
  console.log(reviewId);

  try {
    const review = await Reviews.findById(reviewId).select("status");
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    console.log(review);

    review.status = !review.status;
    await review.save();

    return res.status(200).json({
      message: "Updated successfully",
      review,
    });
  } catch (error) {
    console.error("Error updating review status:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Reviews.find();
    res.status(200).json({
      message: "Reviews data found",
      reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

exports.reviewsData = async (req, res) => {
  try {
    const reviews = await Reviews.find({ status: true });

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({
        message: "No reviews found",
        reviews: [],
      });
    }

    return res.status(200).json({
      message: "Reviews data found",
      user: reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

exports.editreview = async (req, res) => {
  try {
    const reviewId = req.body.data;
    console.log(reviewId);
    const review = await Reviews.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    console.log(review);
    return res.status(200).json({
      message: "Reviews data found",
      user: review,
    });
  } catch (error) {
    console.error("Error fetching review:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.sendFileMessage = async (req, res) => {
  try {
    const { chatId } = req.body;
    const sender = req.user.id;

    if (!chatId) {
      if (req.file && req.file.path) {
        try { fs.unlinkSync(req.file.path); } catch (e) {}
      }
      return res.status(400).json({ error: "Chat ID is required." });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    let chat = await Chat.findById(chatId).populate("lastMessage");
    if (!chat) {
      if (req.file && req.file.path) {
        try { fs.unlinkSync(req.file.path); } catch (e) {}
      }
      return res.status(404).json({ error: "Chat not found." });
    }

    // Convert file to Base64
    const fileBuffer = req.file.buffer || await fs.readFile(req.file.path);
    const attachmentUrl = `data:${req.file.mimetype};base64,${fileBuffer.toString("base64")}`;
    if (req.file.path) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }

    // Create new message with attachment
    const newMessage = new Message({
      chatId,
      sender,
      message: req.body.message || "Sent an attachment",
      attachmentUrl,
      seenBy: [sender],
    });

    await newMessage.save();

    // Update chat with the new lastMessage
    chat.lastMessage = newMessage._id;
    chat.updatedAt = Date.now();
    await chat.save();

    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender", "firstName lastName")
      .lean();

    return res.status(201).json({ populatedMessage });
  } catch (err) {
    console.error("Error in sendFileMessage:", err);
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (_) {}
    }
    return res
      .status(500)
      .json({ error: "Server error. Please try again later." });
  }
};

exports.deleteSingleMessage = async (req, res) => {
  try {
    const { messageId, deleteForAll } = req.body;
    const userId = req.user.id;

    if (!messageId) {
      return res.status(400).json({ error: "Message ID is required." });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found." });
    }

    if (deleteForAll) {
      if (message.sender.toString() !== userId.toString()) {
        return res.status(403).json({ error: "You can only delete your own messages for everyone." });
      }
      message.isDeletedForAll = true;
    } else {
      if (!message.deletedFor.includes(userId)) {
        message.deletedFor.push(userId);
      }
    }

    await message.save();
    return res.status(200).json({ message: "Message deleted successfully.", messageId });
  } catch (err) {
    console.error("Error in deleteSingleMessage:", err);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

function maskMobile(mobile) {
  if (!mobile || mobile.length < 4) return mobile;
  const visibleLength = Math.floor(mobile.length / 2);
  return (
    mobile.slice(0, visibleLength) + "*".repeat(mobile.length - visibleLength)
  );
}

function maskEmail(email) {
  if (!email || !email.includes("@")) return email;
  const [local, domain] = email.split("@");
  const visibleLength = Math.floor(local.length / 2);
  return (
    local.slice(0, visibleLength) +
    "*".repeat(local.length - visibleLength) +
    "@" +
    domain
  );
}


// ==========================================
// DOCUMENT REQUEST LOGIC
// ==========================================

exports.senddocumentRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { profileId } = req.body;
    if (!profileId) return res.status(400).json({ message: "Profile ID is required." });
    
    if (userId === profileId) return res.status(400).json({ message: "Cannot send request to yourself." });

    const userObjectId = new (require('mongoose')).Types.ObjectId(userId);
    const profileObjectId = new (require('mongoose')).Types.ObjectId(profileId);

    const User = require('../models/UserProfile');

    const user = await User.findById(userId).select("documentReqSent filesId");
    const profile = await User.findById(profileId).select("documentReqReceived filesId");

    if (!user || !profile) return res.status(404).json({ message: "User or Profile not found." });

    user.documentReqSent = user.documentReqSent || [];
    profile.documentReqReceived = profile.documentReqReceived || [];

    const hasSentRequest = user.documentReqSent.some(req => req.userId.toString() === profileId);
    if (hasSentRequest) return res.status(400).json({ message: "Document request already sent." });

    const hasReceivedRequest = profile.documentReqReceived.some(req => req.userId.toString() === userId);
    if (hasReceivedRequest) return res.status(400).json({ message: "They have already sent you a document request." });

    user.documentReqSent.push({ userId: profileId, status: "pending" });
    profile.documentReqReceived.push({ userId: userId, status: "pending" });

    await Promise.all([user.save(), profile.save()]);

    res.status(200).json({ message: "Document request sent successfully." });
  } catch (error) {
    console.error("Error in senddocumentRequest:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.handledocumentRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { profileId, action } = req.body;
    
    if (!profileId || !action) return res.status(400).json({ message: "Profile ID and action are required." });
    if (!["accepted", "rejected", "withdrawn"].includes(action)) {
      return res.status(400).json({ message: "Invalid action." });
    }

    const User = require('../models/UserProfile');
    const mongoose = require('mongoose');

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const profileObjectId = new mongoose.Types.ObjectId(profileId);

    if (action === "withdrawn") {
      await User.updateOne(
        { _id: userObjectId },
        { $pull: { documentReqSent: { userId: profileObjectId } } }
      );
      await User.updateOne(
        { _id: profileObjectId },
        { $pull: { documentReqReceived: { userId: userObjectId } } }
      );
      return res.status(200).json({ message: "Document request withdrawn successfully." });
    } else if (action === "accepted") {
      await User.updateOne(
        { _id: userObjectId, "documentReqReceived.userId": profileObjectId },
        { $set: { "documentReqReceived.$.status": "accepted" } }
      );
      await User.updateOne(
        { _id: profileObjectId, "documentReqSent.userId": userObjectId },
        { $set: { "documentReqSent.$.status": "accepted" } }
      );
      return res.status(200).json({ message: "Document request accepted successfully." });
    } else if (action === "rejected") {
      await User.updateOne(
        { _id: userObjectId, "documentReqReceived.userId": profileObjectId },
        { $set: { "documentReqReceived.$.status": "rejected" } }
      );
      await User.updateOne(
        { _id: profileObjectId, "documentReqSent.userId": userObjectId },
        { $set: { "documentReqSent.$.status": "rejected" } }
      );
      return res.status(200).json({ message: "Document request rejected successfully." });
    }
  } catch (error) {
    console.error("Error in handledocumentRequest:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.getdocumentRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const User = require('../models/UserProfile');
    
    const user = await User.findById(userId)
      .select("documentReqSent documentReqReceived")
      .populate({
        path: "documentReqSent.userId",
        select: "firstName lastName filesId avatar gender",
        populate: { path: "filesId", select: "photos" }
      })
      .populate({
        path: "documentReqReceived.userId",
        select: "firstName lastName filesId avatar gender",
        populate: { path: "filesId", select: "photos" }
      });

    if (!user) return res.status(404).json({ message: "User not found." });

    user.documentReqSent = user.documentReqSent || [];
    user.documentReqReceived = user.documentReqReceived || [];

    const sent = user.documentReqSent.map(req => ({
      _id: req.userId?._id || null,
      userId: req.userId?._id || null,
      firstName: req.userId?.firstName || "Unknown",
      lastName: req.userId?.lastName || "",
      gender: req.userId?.gender || "",
      avatar: req.userId?.avatar || null,
      filesId: req.userId?.filesId || null,
      status: req.status
    })).filter(req => req._id !== null);

    const received = user.documentReqReceived.map(req => ({
      _id: req.userId?._id || null,
      userId: req.userId?._id || null,
      firstName: req.userId?.firstName || "Unknown",
      lastName: req.userId?.lastName || "",
      gender: req.userId?.gender || "",
      avatar: req.userId?.avatar || null,
      filesId: req.userId?.filesId || null,
      status: req.status
    })).filter(req => req._id !== null && req.status === "pending");

    res.status(200).json({ sent, received });
  } catch (error) {
    console.error("Error in getdocumentRequests:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// ── GET DISTINCT CLAN / SUBCLAN VALUES ──────────────────────────────────────
exports.getDistinctClans = async (req, res) => {
  try {
    const [clans, subclans, lastNames] = await Promise.all([
      HoroscopeDetails.distinct("clan"),
      HoroscopeDetails.distinct("subclan"),
      User.distinct("lastName"),
    ]);

    // Filter out empty / null values, trim whitespace
    const cleanClans    = clans.filter(Boolean).map(c => String(c).trim()).filter(c => c.length > 0);
    const cleanSubclans = subclans.filter(Boolean).map(s => String(s).trim()).filter(s => s.length > 0);
    const cleanLastNames= lastNames.filter(Boolean).map(l => String(l).trim()).filter(l => l.length > 0);

    // Merge clans & lastNames into one sorted, de-duplicated list for clans
    const allClans = [...new Set([...cleanClans, ...cleanLastNames])].sort((a, b) => a.localeCompare(b));
    const allSubclans = [...new Set(cleanSubclans)].sort((a, b) => a.localeCompare(b));

    const combined = [...new Set([...allClans, ...allSubclans])].sort((a, b) => a.localeCompare(b));

    return res.status(200).json({ clans: allClans, subclans: allSubclans, combined });
  } catch (error) {
    console.error("Error fetching distinct clans:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

// USER-TO-USER CONTACT REQUEST LOGIC (Stored in standalone UserContactRequest collection)
exports.sendUserContactRequest = async (req, res) => {
  const userId = req.user.id;
  const profileId = req.body.data;

  try {
    if (!profileId) {
      return res.status(400).json({ message: "Profile ID is required" });
    }
    if (userId === profileId) {
      return res.status(400).json({ message: "Cannot send contact request to yourself." });
    }

    const [user, profile] = await Promise.all([
      User.findById(userId),
      User.findById(profileId)
    ]);

    if (!user || !profile) {
      return res.status(404).json({ message: "User or target profile not found." });
    }

    let contactReq = await UserContactRequest.findOne({
      senderId: userId,
      receiverId: profileId,
    });

    if (contactReq) {
      if (contactReq.status === "pending" || contactReq.status === "accepted") {
        return res.status(400).json({ message: `Contact request already ${contactReq.status}.` });
      }
      contactReq.status = "pending";
      contactReq.updatedAt = Date.now();
      await contactReq.save();
    } else {
      contactReq = new UserContactRequest({
        senderId: userId,
        receiverId: profileId,
        status: "pending",
      });
      await contactReq.save();
    }

    return res.status(200).json({ message: "Contact request sent successfully." });
  } catch (error) {
    console.error("Error sending contact request:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.withdrawUserContactRequest = async (req, res) => {
  const userId = req.user.id;
  const profileId = req.body.data;

  if (!profileId) {
    return res.status(400).json({ message: "Profile ID is required" });
  }

  try {
    const deleted = await UserContactRequest.findOneAndDelete({
      senderId: userId,
      receiverId: profileId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Contact request not found." });
    }

    return res.status(200).json({ message: "Contact request withdrawn successfully." });
  } catch (error) {
    console.error("Error withdrawing contact request:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.acceptUserContactRequest = async (req, res) => {
  const userId = req.user.id;
  const profileId = req.body.data; // sender ID who sent the request to current user (receiver)

  if (!profileId) {
    return res.status(400).json({ message: "Profile ID is required" });
  }

  try {
    const contactReq = await UserContactRequest.findOneAndUpdate(
      { senderId: profileId, receiverId: userId },
      { status: "accepted", updatedAt: Date.now() },
      { new: true }
    );

    if (!contactReq) {
      return res.status(404).json({ message: "Contact request not found." });
    }

    return res.status(200).json({ message: "Contact request accepted successfully." });
  } catch (error) {
    console.error("Error accepting contact request:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.rejectUserContactRequest = async (req, res) => {
  const userId = req.user.id;
  const profileId = req.body.data; // sender ID who sent the request to current user (receiver)

  if (!profileId) {
    return res.status(400).json({ message: "Profile ID is required" });
  }

  try {
    const contactReq = await UserContactRequest.findOneAndUpdate(
      { senderId: profileId, receiverId: userId },
      { status: "rejected", updatedAt: Date.now() },
      { new: true }
    );

    if (!contactReq) {
      return res.status(404).json({ message: "Contact request not found." });
    }

    return res.status(200).json({ message: "Contact request rejected successfully." });
  } catch (error) {
    console.error("Error rejecting contact request:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.getUserContactRequests = async (req, res) => {
  const userId = req.user.id;

  try {
    const blockedIds = await getBlockedIdsSet(userId);
    const userPopulateSelect =
      "dateOfBirth HoroscopicId filesId profdetailsId address familydetailsId martrId gender mobile email firstName lastName isEnable isbloacked";
    const userPopulateOptions = [
      { path: "HoroscopicId", select: "clan" },
      { path: "filesId", select: "photos isPrivate" },
      { path: "profdetailsId", select: "qualifications class" },
      { path: "familydetailsId", select: "occupation" },
    ];

    const [sentDocs, receivedDocs] = await Promise.all([
      UserContactRequest.find({ senderId: userId })
        .populate({ path: "receiverId", select: userPopulateSelect, populate: userPopulateOptions })
        .lean(),
      UserContactRequest.find({ receiverId: userId })
        .populate({ path: "senderId", select: userPopulateSelect, populate: userPopulateOptions })
        .lean(),
    ]);

    const contactReqSent = sentDocs
      .filter((doc) => {
        const p = doc && doc.receiverId;
        return (
          p &&
          p._id &&
          p.isEnable !== false &&
          p.isbloacked !== true &&
          !blockedIds.has((p._id || p).toString())
        );
      })
      .map((doc) => {
        let userObj = { ...doc.receiverId };
        if (doc.status !== "accepted") {
          userObj.mobile = undefined;
          userObj.email = undefined;
        }
        return {
          _id: doc._id,
          status: doc.status,
          createdAt: doc.createdAt,
          userId: userObj,
        };
      });

    const contactReqReceived = receivedDocs
      .filter((doc) => {
        const p = doc && doc.senderId;
        return (
          p &&
          p._id &&
          p.isEnable !== false &&
          p.isbloacked !== true &&
          !blockedIds.has((p._id || p).toString())
        );
      })
      .map((doc) => {
        let userObj = { ...doc.senderId };
        if (doc.status !== "accepted") {
          userObj.mobile = undefined;
          userObj.email = undefined;
        }
        return {
          _id: doc._id,
          status: doc.status,
          createdAt: doc.createdAt,
          userId: userObj,
        };
      });

    return res.status(200).json({ user: { contactReqSent, contactReqReceived } });
  } catch (error) {
    console.error("Error fetching contact requests:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const SocialLinks = require("../models/SocialLinks");

exports.getSocialLinks = async (req, res) => {
  try {
    let links = await SocialLinks.findOne();
    if (!links) {
      links = await SocialLinks.create({
        facebook: "#",
        instagram: "#",
        whatsapp: "#",
        telegram: "#",
      });
    }
    return res.status(200).json({ success: true, links });
  } catch (error) {
    console.error("Error fetching social links:", error);
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

exports.updateSocialLinks = async (req, res) => {
  try {
    const payload = req.body?.data || req.body;
    const { facebook, instagram, whatsapp, telegram, youtube, twitter, linkedin, phone, email } = payload;
    let links = await SocialLinks.findOne();
    if (!links) {
      links = new SocialLinks();
    }
    if (facebook !== undefined) links.facebook = facebook;
    if (instagram !== undefined) links.instagram = instagram;
    if (whatsapp !== undefined) links.whatsapp = whatsapp;
    if (telegram !== undefined) links.telegram = telegram;
    if (youtube !== undefined) links.youtube = youtube;
    if (twitter !== undefined) links.twitter = twitter;
    if (linkedin !== undefined) links.linkedin = linkedin;
    if (phone !== undefined) links.phone = phone;
    if (email !== undefined) links.email = email;

    await links.save();
    return res.status(200).json({ success: true, message: "Social media links updated successfully", links });
  } catch (error) {
    console.error("Error updating social links:", error);
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};
