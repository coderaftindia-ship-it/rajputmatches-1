const express = require("express");
const ContactRequest = require("../models/ContactRequest.js");
const { Jimp } = require("jimp");
const mongoose = require("mongoose");
const {
  viewDetails,
  viewPhotos,
  sendVerification,
  emailVerifyOtp,
  verifyOtp,
  signup,
  login,
  shortlist,
  profiledelete,
  profilerequestdelete,
  Removerequest,

  forgotPassword,
  deleteShortlistedProfile,
  profilebookmark,
  resetPassword,
  addProfileView,
  getRequests,
  viewProfileById,
  getphotoRequests,
  sendphotoRequest,

  withdrawal,
  acceptRequest,
  rejectRequest,

  reqwithdrawal,
  reqacceptRequest,
  reqrejectRequest,

  sendRequest,
  getviewedData,
  getvisitedData,
  getshortlistedData,
  getuserData,
  getprofiles,
  getPublicRecentProfiles,
  toggleBlockProfile,
  getUsersBlockedByMe,
  getprofessionaldata,
  saveprofessionaldata,
  updateBasicdetails,
  saveRiligionDetails,
  updateRiligionDetails,
  saveFamilyDetails,
  updateFamilyDetails,
  saveExtendedFamilyDetails,
  updateExtendedFamilyDetails,
  updateimageprivacy,
  createContactRequest,

  getusersData,
  getBlockedProfiles,
  getDeletedprofiles,
  blockuser,
  disableuser,
  approveuser,
  viewuser,
  editRequestStatus,

  changestatus,
  storiesData,
  getStories,
  editstory,
  changereviewstatus,
  reviewsData,
  getReviews,
  editreview,

  updateLimits,
  getLimits,
  getIndividualLimits,
  saveIndividualLimit,
  deleteIndividualLimit,
  searchUsersForLimits,

  getallchatsRequest,
  updateChatStatus,
  sendMessage,
  sendFileMessage,
  getMessages,
  deleteMessage,
  deleteSingleMessage,
  createOrGetChat,
  getUserChats,
  getDocumentRequests,
  sendDocumentRequest,
  withdrawDocumentRequest,
  acceptDocumentRequest,
  rejectDocumentRequest,
  sendUserContactRequest,
  withdrawUserContactRequest,
  acceptUserContactRequest,
  rejectUserContactRequest,
  getUserContactRequests,
  getDistinctClans,
  getSocialLinks,
  updateSocialLinks,
} = require("../controllers/authController");

const {
  isAuth,
  isAdmin,
  isUser,
  fileFilter,
  multipleFileUpload,
  singleFileUpload,
} = require("../middlewares/middleware.js");

const router = express.Router();
const fs = require("fs-extra");
const path = require("path");
const multer = require("multer");
const files = require("../models/PhotoSchema.js");
const User = require("../models/UserProfile.js");
const Stories = require("../models/StoriesSchema.js");
const Reviews = require("../models/ReviewSchema.js");
const Message = require("../models/Messages.js");

router.get("/social-links", getSocialLinks);
router.put("/social-links", isAuth, updateSocialLinks);
router.get("/profile/view/:id", isAuth, viewDetails);
router.get("/profile/view/images/:id", isAuth, viewPhotos);
router.get("/profile/clans", getDistinctClans);

router.put("/getprofiles", isAuth, getprofiles);
router.get("/public/recent-profiles", getPublicRecentProfiles);
router.put("/profile/block-toggle", isAuth, toggleBlockProfile);
router.get("/profile/show-blocked", isAuth, getUsersBlockedByMe);
router.put("/profile/shortlist", isAuth, shortlist);
router.put("/profile/view", isAuth, addProfileView);
router.put("/profile/request", isAuth, sendRequest);
router.put("/profile/photoRequest", isAuth, sendphotoRequest);

router.put("/profile/withdrawal", isAuth, withdrawal);
router.put("/profile/accept", isAuth, acceptRequest);
router.put("/profile/reject", isAuth, rejectRequest);

router.put("/profile/reqsent/withdrawal", isAuth, reqwithdrawal);
router.put("/profile/reqsent/accept", isAuth, reqacceptRequest);
router.put("/profile/reqsent/reject", isAuth, reqrejectRequest);

router.put("/profile/shortlisted/delete", isAuth, deleteShortlistedProfile);
router.put("/profile/shortlisted/edit", isAuth, profilebookmark);

router.get("/profile/show-shortlisted", isAuth, getshortlistedData);
router.get("/profile/viewed", isAuth, getviewedData);
router.get("/profile/visited", isAuth, getvisitedData);
router.get("/profile/myrequests", isAuth, getRequests);
router.get("/profile/view", isAuth, viewProfileById);
router.get("/profile/photorequests", isAuth, getphotoRequests);
router.get("/profile/documentrequests", isAuth, getDocumentRequests);
router.put("/profile/documentRequest", isAuth, sendDocumentRequest);
router.put("/profile/document/withdrawal", isAuth, withdrawDocumentRequest);
router.put("/profile/document/accept", isAuth, acceptDocumentRequest);
router.put("/profile/document/reject", isAuth, rejectDocumentRequest);

router.get("/profile/contactrequests", isAuth, getUserContactRequests);
router.put("/profile/contactRequest", isAuth, sendUserContactRequest);
router.put("/profile/contact/withdrawal", isAuth, withdrawUserContactRequest);
router.put("/profile/contact/accept", isAuth, acceptUserContactRequest);
router.put("/profile/contact/reject", isAuth, rejectUserContactRequest);

router.put("/profile/delete", isAuth, profiledelete);
router.put("/profile/delete/delete", isAuth, profilerequestdelete);
//remove profile
router.put("/profile/req/delete", isAuth, Removerequest);

const convertFileToBase64 = async (file) => {
  try {
    const mimetype = file.mimetype;
    const imageTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (imageTypes.includes(mimetype)) {
      const image = await Jimp.read(file.buffer || file.path);

      const maxWidth = 800;
      const maxHeight = 800;
      let w = image.width;
      let h = image.height;

      if (w > maxWidth || h > maxHeight) {
        const aspectRatio = w / h;
        if (w > h) {
          w = maxWidth;
          h = Math.round(maxWidth / aspectRatio);
        } else {
          h = maxHeight;
          w = Math.round(maxHeight * aspectRatio);
        }
        image.resize({ w, h });
      }

      return await image.getBase64("image/jpeg");
    }

    const fileBuffer = file.buffer || await fs.readFile(file.path);
    return `data:${mimetype};base64,${fileBuffer.toString("base64")}`;
  } catch (err) {
    console.error("Error processing file:", err.message);
    return null;
  }
};

// const sharp = require("sharp");

// const convertImageToBase64 = async (imagePath) => {
//   try {
//     const maxWidth = 800;
//     const maxHeight = 800;

//     // Load and resize the image while maintaining aspect ratio
//     const imageBuffer = await sharp(imagePath)
//       .resize({ width: maxWidth, height: maxHeight, fit: "inside" }) // Keeps aspect ratio
//       .jpeg({ quality: 80 }) // Compress image
//       .toBuffer();

//     // Convert to Base64 format
//     const compressedBase64 = `data:image/jpeg;base64,${imageBuffer.toString("base64")}`;

//     return compressedBase64;
//   } catch (err) {
//     console.error("Error processing image file:", err.message);
//     return null;
//   }
// };




router.post("/upload-files", isAuth, multipleFileUpload, async (req, res) => {
  try {
    const userId = req.user.id;
    let user = await files.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const filePaths = await Promise.all(
      req.files.map(async (file) => {
        const base64 = await convertFileToBase64(file);
        if (file.path) {
          try { fs.unlinkSync(file.path); } catch (e) {}
        }
        return base64;
      })
    );

    const photoPaths = filePaths.map((file) => ({
      url: file,
      isAvatar: false,
    }));

    if (!user) {
      user = new files({
        userId: new mongoose.Types.ObjectId(userId),
        photos: [],
        documents: [],
      });
    }

    user.photos.push(...photoPaths);
    await user.save();

    res.status(200).json({
      message: "Files uploaded successfully",
      photos: user.photos,
      documents: user.documents,
    });
  } catch (error) {
    console.error("Error uploading files:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post(
  "/upload-documents",
  isAuth,
  multipleFileUpload,
  async (req, res) => {
    try {
      const userId = req.user.id;

      let user = await files.findOne({
        userId: new mongoose.Types.ObjectId(userId),
      });

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const filePaths = await Promise.all(
        req.files.map(async (file) => {
          const base64 = await convertFileToBase64(file);
          if (file.path) {
            try { fs.unlinkSync(file.path); } catch (e) {}
          }
          return base64;
        })
      );

      if (!user) {
        user = new files({
          userId: new mongoose.Types.ObjectId(userId),
          photos: [],
          documents: [],
        });
      }

      const documentPaths = filePaths.map((file) => ({ url: file }));
      user.documents.push(...documentPaths);
      await user.save();

      res.status(200).json({
        message: "Documents uploaded successfully",
        photos: user.photos,
        documents: user.documents,
      });
    } catch (error) {
      console.error("Error uploading documents:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

router.get("/files", isAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    let user = await files.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!user) {
      user = await files.create({
        userId: new mongoose.Types.ObjectId(userId),
      });

      const userRecord = await User.findById(userId);
      console.log("userr", userRecord);
      userRecord.filesId = user._id;
      await userRecord.save();
      await user.save();
      return res.status(201).json({ message: "User files created", user });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/profile", isAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await files.findOne(
      {
        userId: new mongoose.Types.ObjectId(userId),
        "photos.isAvatar": true,
      },
      {
        "photos.$": 1,
        isPrivate: 1,
        _id: 0,
      }
    );

    if (!user || !user.photos || user.photos.length === 0) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.status(200).json({
      message: "Data found",
      user: {
        userProfile: user.photos[0],
        isPrivate: user.isPrivate,
      },
    });
  } catch (error) {
    console.error("Error fetching files:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});

router.put("/set-profile-image", isAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const profileId = req.body.data;

    const user = await files.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    const profile = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!profileId) {
      return res.status(400).json({ message: "Profile ID is required" });
    }

    user.photos = user.photos.map((photo) => ({
      ...photo.toObject(),
      isAvatar: photo._id.toString() === profileId,
    }));

    const avatarPhoto = user.photos.find(
      (photo) => photo._id.toString() == profileId
    );

    if (avatarPhoto) {
      profile.avatar = avatarPhoto.url;
    }

    // Save the changes
    await user.save();
    await profile.save();

    res.status(200).json({
      message: "Profile image updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error setting profile image:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/delete-image", isAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const profileId = req.body.data;

    if (!profileId) {
      return res.status(400).json({ message: "Profile ID is required" });
    }

    const user = await files.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find and delete from photos array
    let photoToDelete = user.photos.find(
      (photo) => photo._id.toString() === profileId
    );

    if (photoToDelete) {
      user.photos = user.photos.filter(
        (photo) => photo._id.toString() !== profileId
      );
    } else {
      // Find and delete from documents array
      photoToDelete = user.documents.find(
        (document) => document._id.toString() === profileId
      );

      if (photoToDelete) {
        user.documents = user.documents.filter(
          (document) => document._id.toString() !== profileId
        );
      } else {
        return res.status(404).json({ message: "Image not found" });
      }
    }

    // Remove avatar reference if it was deleted
    const profile = await User.findById(userId);
    if (profile && profile.avatar === photoToDelete.url) {
      profile.avatar = "";
      await profile.save();
    }

    await user.save();

    res.status(200).json({
      message: "Image deleted successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/update-privacy", isAuth, updateimageprivacy);

// User authentication routes
router.post("/signup", signup);
// Alias for frontend: POST /api/v1/auth/register
router.post("/register", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/password/forgot", forgotPassword);
router.post("/send-verification-otp", sendVerification);
router.post("/email/send-verification", sendVerification);
router.post("/email/verify-otp", emailVerifyOtp);
router.post("/verify-otp", verifyOtp);
// verify-otp

router.post("/reset-password", isAuth, resetPassword);
router.post("/password/reset", isAuth, resetPassword);
router.get("/user", isAuth, getuserData);
router.put("/update-profile", isAuth, updateBasicdetails);

router.get("/get-professional-data", isAuth, getprofessionaldata);
router.put("/save-professional-data", isAuth, saveprofessionaldata);

// Religion details routes

router.get("/get-religiondetails", isAuth, saveRiligionDetails);
router.put("/update-religiondetails", isAuth, updateRiligionDetails);

// Family details routes
router.get("/get-family-details", isAuth, saveFamilyDetails);
router.put("/update-family-details", isAuth, updateFamilyDetails);

// Extended family details routes
router.get("/getpaternal-details", isAuth, saveExtendedFamilyDetails);
router.put("/updatepaternal-details", isAuth, updateExtendedFamilyDetails);

// Admin-only story creation
router.post("/stories", isAuth, singleFileUpload, async (req, res) => {
  try {
    const { title, description } = req.body;
    // console.log(req.body);
    // console.log(req.file);

    if (!title || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const base64 = await convertFileToBase64(req.file);
    if (req.file.path) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }

    const newStory = new Stories({
      title,
      image: base64,
      description,
    });

    await newStory.save();

    res.status(201).json({
      message: "Story created successfully",
      newStory,
    });
  } catch (error) {
    console.error("Error creating story:", error);
    res.status(500).json({ message: "Server error", error });
  }
});
router.put(
  `/admin/update-story/:id`,
  isAuth,
  singleFileUpload,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description } = req.body;

      // Validate request fields
      if (!title || !description) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Find the existing story
      const story = await Stories.findById(id); // Use the id from params
      if (!story) {
        return res.status(404).json({ message: "Story not found" });
      }

      // Handle image upload, if provided
      let updatedImage = story.image; // Keep the old image if no new one is uploaded
      if (req.file) {
        const base64 = await convertFileToBase64(req.file); // Convert new image to base64
        if (req.file.path) {
          try { fs.unlinkSync(req.file.path); } catch (e) {}
        }
        updatedImage = base64; // Update image
      }

      // Update story fields
      story.title = title;
      story.description = description;
      story.image = updatedImage;
      await story.save(); // Save updated story

      res.status(200).json({
        message: "Story updated successfully",
        story,
      });
    } catch (error) {
      console.error("Error updating story:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }
);

router.put("/admin/change-status", isAuth, changestatus);
router.get("/admin/getallstory", isAuth, getStories);
router.get("/profile/stories", storiesData);
router.put("/admin/getStory", isAuth, editstory);

router.put("/admin/change-review-status", isAuth, changereviewstatus);
router.get("/admin/getallreviews", isAuth, getReviews);
router.get("/profile/reviews", reviewsData);
router.put("/admin/getReview", isAuth, editreview);

// Public contact request
router.put("/contactus", createContactRequest);
router.put("/admin/Edit-request", isAuth, editRequestStatus);

router.get("/admin/profile", isAuth, getusersData);
router.get("/admin/blocked-profile", isAuth, getBlockedProfiles);
router.get("/admin/deleted-profile", isAuth, getDeletedprofiles);
router.get("/admin/contact-requests", async (req, res) => {
  try {
    const messages = await ContactRequest.find();
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

router.put("/admin/block-member", isAuth, blockuser);
router.put("/admin/delete-member", isAuth, disableuser);
router.put("/admin/Approve-member", isAuth, approveuser);
router.put("/admin/view-member", isAuth, viewuser);

router.get("/limits", isAuth, getLimits);
router.put("/limits/update", isAuth, updateLimits);
router.get("/limits/individual", isAuth, getIndividualLimits);
router.post("/limits/individual", isAuth, saveIndividualLimit);
router.delete("/limits/individual/:userId", isAuth, deleteIndividualLimit);
router.get("/limits/users/search", isAuth, searchUsersForLimits);

const UserProfile = require("../models/UserProfile");

router.get("/admin/dashboard/user-counts", async (req, res) => {
  try {
    // Total members
    const totalMembers = await User.countDocuments();

    // Free members: These will be users whose `isSubscribed` is false
    const freeMembers = await User.countDocuments({
      isSubscribed: false,
    });

    // Blocked members: These are users with `isBlocked` set to true
    const blockedMembers = await User.countDocuments({
      isbloacked: true,
    });

    // Premium members: These will be users whose `isSubscribed` is true
    const premiumMembers = await User.countDocuments({
      isSubscribed: true,
    });

    return res.status(200).json({
      message: "User counts fetched successfully",
      data: {
        totalMembers,
        freeMembers,
        blockedMembers,
        premiumMembers,
      },
    });
  } catch (error) {
    console.error("Error fetching user counts:", error);
    return res.status(500).json({ message: "Server error", error });
  }
});

// chat app routes
router.get("/messages", isAuth, async (req, res) => {
  try {
    const senderId = req.user.id;
    console.log(senderId);

    if (!senderId) {
      return res.status(400).json({ message: "Sender ID is required" });
    }
    if (!senderId) {
      return res.status(400).json({ message: "Invalid sender ID" });
    }
    const user = await User.findById(senderId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const messages = await Message.find({ sender: senderId }).sort({
      timestamp: -1,
    });

    console.log(messages);
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/chat/status", isAuth, getallchatsRequest);
router.put("/chat/status/update", isAuth, updateChatStatus);
router.post("/message/send", isAuth, sendMessage);
router.post("/message/send-file", isAuth, singleFileUpload, sendFileMessage);
router.put("/message", isAuth, getMessages);
router.post("/delete/message", isAuth, deleteMessage);
router.post("/delete/single-message", isAuth, deleteSingleMessage);
router.put("/profile/message", isAuth, createOrGetChat);
router.get("/message/chat", isAuth, getUserChats);
router.get("/user", isAuth, (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(userId);
    res.status(200).json({ userId });
  } catch (error) {
    console.log("Error fetching user:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/", (req, res) => {
  res.send("Welcome! server is running");
});

const AboutUs = require("../models/AboutUs");
const HomeCMS = require("../models/HomeCMS");
const ContactCMS = require("../models/ContactCMS");
const StoriesCMS = require("../models/StoriesCMS");
const SiteSettings = require("../models/SiteSettings");

// Additional alias endpoints for contact submission
router.post("/contactus", createContactRequest);
router.post("/contact", createContactRequest);
router.put("/contact", createContactRequest);
router.post("/public/contact", createContactRequest);
router.put("/public/contact", createContactRequest);

// GET /api/v1/auth/about - Public endpoint to get About Us content
router.get("/about", async (req, res) => {
  try {
    let about = await AboutUs.findOne();
    if (!about) {
      about = await AboutUs.create({});
    }
    return res.status(200).json({ success: true, data: about });
  } catch (error) {
    console.error("Error fetching About Us content:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch About Us content" });
  }
});

// GET /api/v1/auth/home-cms - Public endpoint to get Home page CMS
router.get("/home-cms", async (req, res) => {
  try {
    let home = await HomeCMS.findOne();
    if (!home) home = await HomeCMS.create({});
    return res.status(200).json({ success: true, data: home });
  } catch (error) {
    console.error("Error fetching Home CMS:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch Home CMS" });
  }
});

// GET /api/v1/auth/contact-cms - Public endpoint to get Contact page CMS
router.get("/contact-cms", async (req, res) => {
  try {
    let contact = await ContactCMS.findOne();
    if (!contact) contact = await ContactCMS.create({});
    return res.status(200).json({ success: true, data: contact });
  } catch (error) {
    console.error("Error fetching Contact CMS:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch Contact CMS" });
  }
});

// GET /api/v1/auth/stories-cms - Public endpoint to get Stories page CMS
router.get("/stories-cms", async (req, res) => {
  try {
    let stories = await StoriesCMS.findOne();
    if (!stories) stories = await StoriesCMS.create({});
    return res.status(200).json({ success: true, data: stories });
  } catch (error) {
    console.error("Error fetching Stories CMS:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch Stories CMS" });
  }
});

// GET /api/v1/auth/site-settings - Public endpoint to get Site Settings (Branding, Logo)
router.get("/site-settings", async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = await SiteSettings.create({});
    return res.status(200).json({ success: true, data: settings });
  } catch (error) {
    console.error("Error fetching Site Settings:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch Site Settings" });
  }
});

module.exports = router;

