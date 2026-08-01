const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { generateToken } = require('../utils/utility');
const {
  getStories,
  editstory,
  changestatus,
  getReviews,
  editreview,
  changereviewstatus,
  editRequestStatus,
  getusersData,
  getBlockedProfiles,
  getDeletedprofiles,
  blockuser,
  disableuser,
  approveuser,
  verifyuser,
  viewuser,
  getLimits,
  updateLimits,
  getIndividualLimits,
  saveIndividualLimit,
  deleteIndividualLimit,
  getIndividualRequestLimits,
  saveIndividualRequestLimit,
  deleteIndividualRequestLimit,
  searchUsersForLimits,
  getSocialLinks,
  updateSocialLinks,
} = require("../controllers/authController");

const { isAuth, singleFileUpload } = require("../middlewares/middleware");
const ContactRequest = require("../models/ContactRequest");
const User = require("../models/UserProfile");
const Notification = require("../models/NotificationSchema");
const Stories = require("../models/StoriesSchema");
const Reviews = require("../models/ReviewSchema");
const AboutUs = require("../models/AboutUs");
const HomeCMS = require("../models/HomeCMS");
const ContactCMS = require("../models/ContactCMS");
const StoriesCMS = require("../models/StoriesCMS");
const SiteSettings = require("../models/SiteSettings");

// Admin credentials — set via environment variables or use defaults
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'mohit@12345';

// Middleware to sanitize req.user.id for admin routes to prevent CastError with old tokens
const sanitizeAdminUser = async (req, res, next) => {
  if (req.user && (!mongoose.Types.ObjectId.isValid(req.user.id) || req.user.id === 'admin')) {
    try {
      const dbAdmin = await User.findOne({ email: ADMIN_USERNAME });
      if (dbAdmin) {
        req.user.id = dbAdmin._id.toString();
      } else {
        req.user.id = '6a4d32f2647c9bf203a77149'; // Fallback valid ObjectId
      }
    } catch (err) {
      req.user.id = '6a4d32f2647c9bf203a77149'; // Fallback valid ObjectId
    }
  }
  next();
};

// POST /admin/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    // Validate credentials
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // Try to find the admin user in the database to get a valid ObjectId
    let adminUserId = '6a4d32f2647c9bf203a77149'; // Fallback to the known admin ObjectId if DB search fails or doesn't find it
    try {
      const dbAdmin = await User.findOne({ email: username });
      if (dbAdmin) {
        adminUserId = dbAdmin._id.toString();
      }
    } catch (dbErr) {
      console.error('Could not fetch admin user from database:', dbErr);
    }

    // Generate JWT token for the admin session
    const token = generateToken(adminUserId);

    return res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

// GET /admin/notifications
router.get('/notifications', isAuth, sanitizeAdminUser, async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    console.error('Error fetching admin notifications:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /admin/notifications/mark-all-read
router.put('/notifications/mark-all-read', isAuth, sanitizeAdminUser, async (req, res) => {
  try {
    await Notification.updateMany({ isRead: false }, { isRead: true });
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (err) {
    console.error('Error marking notifications as read:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /admin/dashboard/user-counts
router.get('/dashboard/user-counts', async (req, res) => {
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

// Map admin routes to existing controller functions
router.get('/profile', isAuth, sanitizeAdminUser, getusersData);
router.get('/blocked-profile', isAuth, sanitizeAdminUser, getBlockedProfiles);
router.get('/deleted-profile', isAuth, sanitizeAdminUser, getDeletedprofiles);
router.get('/getallstory', isAuth, sanitizeAdminUser, getStories);
router.put('/getStory', isAuth, sanitizeAdminUser, editstory);
router.put('/change-status', isAuth, sanitizeAdminUser, changestatus);
router.get('/getallreviews', isAuth, sanitizeAdminUser, getReviews);
router.put('/getReview', isAuth, sanitizeAdminUser, editreview);
router.put('/change-review-status', isAuth, sanitizeAdminUser, changereviewstatus);
router.put('/Edit-request', isAuth, sanitizeAdminUser, editRequestStatus);

const avatarDiskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/avatar");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    const filename = `avatar-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, filename);
  }
});

const avatarDiskUpload = multer({ storage: avatarDiskStorage }).single("avatar");

// POST /admin/stories — Create a new success story (with image upload)
router.post('/stories', isAuth, sanitizeAdminUser, (req, res, next) => {
  avatarDiskUpload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || 'File upload error.' });
    }
    try {
      const { title, description } = req.body;

      if (!title || !title.trim()) {
        return res.status(400).json({ message: 'Title is required.' });
      }
      if (!description || !description.trim()) {
        return res.status(400).json({ message: 'Description is required.' });
      }
      if (!req.file) {
        return res.status(400).json({ message: 'Cover image is required.' });
      }

      const imageUrl = `/uploads/avatar/${req.file.filename}`;

      const story = new Stories({
        title: title.trim(),
        description: description.trim(),
        image: imageUrl,
        status: true,
      });

      await story.save();

      return res.status(201).json({
        message: 'Story created successfully!',
        story,
      });
    } catch (error) {
      console.error('Error creating story:', error);
      return res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
  });
});

// PUT /admin/update-story/:id — Update an existing story
router.put('/update-story/:id', isAuth, sanitizeAdminUser, (req, res, next) => {
  avatarDiskUpload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || 'File upload error.' });
    }
    try {
      const { id } = req.params;
      const { title, description } = req.body;

      const story = await Stories.findById(id);
      if (!story) {
        return res.status(404).json({ message: 'Story not found.' });
      }

      if (title && title.trim()) story.title = title.trim();
      if (description && description.trim()) story.description = description.trim();
      if (req.file) {
        story.image = `/uploads/avatar/${req.file.filename}`;
      }

      await story.save();
      return res.status(200).json({ message: 'Story updated successfully!', story });
    } catch (error) {
      console.error('Error updating story:', error);
      return res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
  });
});

// POST /admin/reviews — Create a new client review (with image upload)
router.post('/reviews', isAuth, sanitizeAdminUser, (req, res, next) => {
  avatarDiskUpload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || 'File upload error.' });
    }
    try {
      const { name, rating, review, designation } = req.body;

      if (!name || !name.trim()) {
        return res.status(400).json({ message: 'Name is required.' });
      }
      if (!review || !review.trim()) {
        return res.status(400).json({ message: 'Review is required.' });
      }
      if (!rating) {
        return res.status(400).json({ message: 'Rating is required.' });
      }

      const ratingNum = parseInt(rating);
      if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
      }

      let imageUrl = "";
      if (req.file) {
        imageUrl = `/uploads/avatar/${req.file.filename}`;
      }

      const clientReview = new Reviews({
        name: name.trim(),
        rating: ratingNum,
        review: review.trim(),
        designation: designation ? designation.trim() : "Verified Match",
        image: imageUrl,
        status: true,
      });

      await clientReview.save();

      return res.status(201).json({
        message: 'Review created successfully!',
        review: clientReview,
      });
    } catch (error) {
      console.error('Error creating review:', error);
      return res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
  });
});

// PUT /admin/update-review/:id — Update client review
router.put('/update-review/:id', isAuth, sanitizeAdminUser, (req, res, next) => {
  avatarDiskUpload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || 'File upload error.' });
    }
    try {
      const { id } = req.params;
      const { name, rating, review, designation } = req.body;

      if (!name || !name.trim()) {
        return res.status(400).json({ message: 'Name is required.' });
      }
      if (!review || !review.trim()) {
        return res.status(400).json({ message: 'Review content is required.' });
      }
      if (!rating) {
        return res.status(400).json({ message: 'Rating is required.' });
      }

      const ratingNum = parseInt(rating);
      if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
      }

      const clientReview = await Reviews.findById(id);
      if (!clientReview) {
        return res.status(404).json({ message: 'Review not found.' });
      }

      let updatedImage = clientReview.image;
      if (req.file) {
        updatedImage = `/uploads/avatar/${req.file.filename}`;
      }

      clientReview.name = name.trim();
      clientReview.rating = ratingNum;
      clientReview.review = review.trim();
      clientReview.designation = designation ? designation.trim() : "Verified Match";
      clientReview.image = updatedImage;

      await clientReview.save();

      return res.status(200).json({
        message: 'Review updated successfully!',
        review: clientReview,
      });
    } catch (error) {
      console.error('Error updating review:', error);
      return res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
  });
});

router.get('/contact-requests', isAuth, sanitizeAdminUser, async (req, res) => {
  try {
    const messages = await ContactRequest.find();
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

router.put('/block-member', isAuth, sanitizeAdminUser, blockuser);
router.put('/delete-member', isAuth, sanitizeAdminUser, disableuser);
router.put('/Approve-member', isAuth, sanitizeAdminUser, approveuser);
router.put('/Verify-member', isAuth, sanitizeAdminUser, verifyuser);
router.put('/view-member', isAuth, sanitizeAdminUser, viewuser);

router.get("/limits", isAuth, sanitizeAdminUser, getLimits);
router.put("/limits/update", isAuth, sanitizeAdminUser, updateLimits);
router.get("/limits/individual", isAuth, sanitizeAdminUser, getIndividualLimits);
router.post("/limits/individual", isAuth, sanitizeAdminUser, saveIndividualLimit);
router.delete("/limits/individual/:userId", isAuth, sanitizeAdminUser, deleteIndividualLimit);
router.get("/limits/request-send/individual", isAuth, sanitizeAdminUser, getIndividualRequestLimits);
router.post("/limits/request-send/individual", isAuth, sanitizeAdminUser, saveIndividualRequestLimit);
router.delete("/limits/request-send/individual/:userId", isAuth, sanitizeAdminUser, deleteIndividualRequestLimit);
router.get("/limits/users/search", isAuth, sanitizeAdminUser, searchUsersForLimits);

// GET /admin/dashboard/analytics
router.get('/dashboard/analytics', isAuth, sanitizeAdminUser, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const registrationTrend = await User.aggregate([
      {
        $project: {
          createdAt: { $toDate: "$_id" }
        }
      },
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const genderRatio = await User.aggregate([
      {
        $group: {
          _id: { $ifNull: [ "$gender", "Unknown" ] },
          count: { $sum: 1 }
        }
      }
    ]);

    const subscriptionRatio = await User.aggregate([
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: [ "$isbloacked", true ] },
              then: "Blocked",
              else: {
                $cond: { if: { $eq: [ "$isSubscribed", true ] }, then: "Premium", else: "Free" }
              }
            }
          },
          count: { $sum: 1 }
        }
      }
    ]);

    const profileForRatio = await User.aggregate([
      {
        $group: {
          _id: { $ifNull: [ "$profilefor", "Unknown" ] },
          count: { $sum: 1 }
        }
      }
    ]);

    const stateRatio = await User.aggregate([
      {
        $group: {
          _id: { $ifNull: [ "$address.state", "Unknown" ] },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 8 }
    ]);

    res.status(200).json({
      registrationTrend,
      genderRatio,
      subscriptionRatio,
      profileForRatio,
      stateRatio
    });
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /admin/reports/filter
router.get('/reports/filter', isAuth, sanitizeAdminUser, async (req, res) => {
  try {
    const {
      search,
      gender,
      isSubscribed,
      isbloacked,
      isApproved,
      state,
      city,
      startDate,
      endDate,
      page = 1,
      limit = 10
    } = req.query;

    const query = {};

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { mobile: searchRegex }
      ];
      
      const parsedId = parseInt(search);
      if (!isNaN(parsedId)) {
        query.$or.push({ martrId: parsedId });
      }
    }

    if (gender) query.gender = gender;
    
    if (isSubscribed !== undefined && isSubscribed !== "") {
      query.isSubscribed = isSubscribed === "true";
    }
    if (isbloacked !== undefined && isbloacked !== "") {
      query.isbloacked = isbloacked === "true";
    }
    if (isApproved !== undefined && isApproved !== "") {
      query.isApproved = isApproved === "true";
    }
    if (state) {
      query["address.state"] = new RegExp(state, "i");
    }
    if (city) {
      query["address.city"] = new RegExp(city, "i");
    }

    if (startDate || endDate) {
      const idQuery = {};
      if (startDate) {
        const startSecs = Math.floor(new Date(startDate).getTime() / 1000);
        if (!isNaN(startSecs)) {
          idQuery.$gte = new mongoose.Types.ObjectId(startSecs.toString(16).padEnd(24, '0'));
        }
      }
      if (endDate) {
        const endDay = new Date(endDate);
        endDay.setHours(23, 59, 59, 999);
        const endSecs = Math.floor(endDay.getTime() / 1000);
        if (!isNaN(endSecs)) {
          idQuery.$lte = new mongoose.Types.ObjectId(endSecs.toString(16).padEnd(24, '0'));
        }
      }
      query._id = idQuery;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    const users = await User.find(query)
      .select("-password")
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      users,
      total,
      pages: Math.ceil(total / limitNum),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error("Error in reports filter:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /admin/
router.get('/', (req, res) => {
  res.json({ message: 'Admin API is running.' });
});

// ══════════════════════════════════════════════════════════
// FEEDBACK / REPORT ROUTES
// ══════════════════════════════════════════════════════════
const FeedbackReport = require("../models/FeedbackReport");

// Multer for feedback image (optional, max 5MB, images only)
const feedbackUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Sirf image files allowed hain (JPEG, PNG, GIF, WebP)"), false);
  },
}).single("feedbackImage");

// POST /admin/feedback  — Public: anyone (guest or logged-in) can submit
router.post("/feedback", (req, res) => {
  feedbackUpload(req, res, async (uploadErr) => {
    if (uploadErr) {
      return res.status(400).json({ success: false, message: uploadErr.message });
    }
    try {
      const { type, category, subject, message, reportedProfileId, submittedByName, submittedByEmail } = req.body;

      if (!category || !subject || !message) {
        return res.status(400).json({ success: false, message: "Category, subject aur message required hain." });
      }

      // Try to get logged-in user if token present
      let submittedBy = null;
      let userName = submittedByName || "Anonymous";
      let userEmail = submittedByEmail || "";

      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        try {
          const jwt = require("jsonwebtoken");
          const decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
          if (decoded && decoded.id) {
            const user = await User.findById(decoded.id).select("name email");
            if (user) {
              submittedBy = user._id;
              userName = user.name || userName;
              userEmail = user.email || userEmail;
            }
          }
        } catch (_) { /* ignore auth errors for public endpoint */ }
      }

      // Handle optional image
      let imageData = null;
      if (req.file) {
        imageData = {
          data: `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
          mimetype: req.file.mimetype,
          originalname: req.file.originalname,
          size: req.file.size,
        };
      }

      const feedback = await FeedbackReport.create({
        type: type || "feedback",
        category,
        subject,
        message,
        reportedProfileId: reportedProfileId || null,
        submittedBy,
        submittedByName: userName,
        submittedByEmail: userEmail,
        image: imageData,
      });

      res.status(201).json({ success: true, message: "Aapka feedback/report safaltapurvak submit ho gaya!", data: feedback });
    } catch (error) {
      console.error("Feedback submit error:", error);
      res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  });
});

// GET /admin/feedback  — Admin: get all feedbacks with filters
router.get("/feedback", isAuth, async (req, res) => {
  try {
    const { status, type, category, page = 1, limit = 20, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { subject: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
        { submittedByName: { $regex: search, $options: "i" } },
        { submittedByEmail: { $regex: search, $options: "i" } },
      ];
    }

    const limitNum = parseInt(limit);
    const skip = (parseInt(page) - 1) * limitNum;
    const total = await FeedbackReport.countDocuments(filter);
    const items = await FeedbackReport.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate("submittedBy", "name email")
      .populate("reportedProfileId", "name email");

    res.json({ success: true, data: items, total, pages: Math.ceil(total / limitNum), currentPage: parseInt(page) });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// GET /admin/feedback/stats  — Admin: quick stats (must be BEFORE /:id routes)
router.get("/feedback/stats", isAuth, async (req, res) => {
  try {
    const [total, pending, resolved, reports, feedbacks] = await Promise.all([
      FeedbackReport.countDocuments(),
      FeedbackReport.countDocuments({ status: "pending" }),
      FeedbackReport.countDocuments({ status: "resolved" }),
      FeedbackReport.countDocuments({ type: "report" }),
      FeedbackReport.countDocuments({ type: "feedback" }),
    ]);
    res.json({ success: true, data: { total, pending, resolved, reports, feedbacks } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// PATCH /admin/feedback/:id  — Admin: update status / add note
router.patch("/feedback/:id", isAuth, async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const update = {};
    if (status) {
      update.status = status;
      if (status === "resolved") update.resolvedAt = new Date();
    }
    if (adminNote !== undefined) update.adminNote = adminNote;

    const updated = await FeedbackReport.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Record nahi mila." });

    res.json({ success: true, message: "Status update ho gaya!", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// DELETE /admin/feedback/:id  — Admin: delete record
router.delete("/feedback/:id", isAuth, async (req, res) => {
  try {
    await FeedbackReport.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Record delete ho gaya." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// Dynamic Social Media Links
router.get("/social-links", getSocialLinks);
router.put("/social-links", isAuth, updateSocialLinks);

// ── About Page Dynamic CMS Endpoints ──────────────────────────
const aboutStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/avatar");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `about-${file.fieldname}-${Date.now()}${ext}`;
    cb(null, filename);
  }
});

const aboutUpload = multer({ storage: aboutStorage }).fields([
  { name: "heroImage", maxCount: 1 },
  { name: "card1Image", maxCount: 1 },
  { name: "card2Image", maxCount: 1 },
  { name: "bannerImage", maxCount: 1 },
  { name: "legacyLeftImage", maxCount: 1 },
  { name: "legacyRightImage", maxCount: 1 },
  { name: "whyChooseImage", maxCount: 1 }
]);

// GET /admin/about-page — Fetch About page content for admin
router.get("/about-page", isAuth, async (req, res) => {
  try {
    let about = await AboutUs.findOne();
    if (!about) {
      about = await AboutUs.create({});
    }
    res.json({ success: true, data: about });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// POST /admin/about-page — Update About page content and uploaded images
router.post("/about-page", isAuth, (req, res) => {
  aboutUpload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message || "File upload error" });
    }
    try {
      let about = await AboutUs.findOne();
      if (!about) {
        about = new AboutUs();
      }

      const fields = [
        "heroSubtitle", "heroTitleLine1", "heroTitleLine2", "heroDescription",
        "card1Text", "card2Text",
        "legacyTitle", "legacyParagraph1", "legacyParagraph2",
        "whyChooseHeading",
        "vvipTitle", "vvipDescription", "vvipButtonText"
      ];

      fields.forEach((field) => {
        if (req.body[field] !== undefined) {
          about[field] = req.body[field];
        }
      });

      if (req.body.whyChooseFeatures) {
        try {
          const parsed = typeof req.body.whyChooseFeatures === "string"
            ? JSON.parse(req.body.whyChooseFeatures)
            : req.body.whyChooseFeatures;
          if (Array.isArray(parsed)) {
            about.whyChooseFeatures = parsed;
          }
        } catch (e) {
          console.error("Error parsing whyChooseFeatures:", e);
        }
      }

      // Handle uploaded files
      const imageFields = [
        "heroImage", "card1Image", "card2Image", "bannerImage",
        "legacyLeftImage", "legacyRightImage", "whyChooseImage"
      ];

      imageFields.forEach((imgField) => {
        if (req.files && req.files[imgField] && req.files[imgField][0]) {
          about[imgField] = `/uploads/avatar/${req.files[imgField][0].filename}`;
        }
      });

      await about.save();
      res.json({ success: true, message: "About page content updated successfully!", data: about });
    } catch (error) {
      console.error("Error updating About page:", error);
      res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  });
});

// ── Home Page CMS Endpoints ────────────────────────────────────
const homeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/avatar");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `home-${file.fieldname}-${Date.now()}${ext}`);
  }
});
const homeUpload = multer({ storage: homeStorage }).fields([
  { name: "bannerBgImage", maxCount: 1 },
  { name: "matchmakingImage", maxCount: 1 }
]);

router.get("/home-cms", isAuth, async (req, res) => {
  try {
    let home = await HomeCMS.findOne();
    if (!home) home = await HomeCMS.create({});
    res.json({ success: true, data: home });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

router.post("/home-cms", isAuth, (req, res) => {
  homeUpload(req, res, async (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message || "File upload error" });
    try {
      let home = await HomeCMS.findOne();
      if (!home) home = new HomeCMS();

      const fields = [
        "heroBadgeText", "heroTitleLine1", "heroTitleLine2", "heroDescription",
        "heroCTA1Text", "heroCTA2Text", "heroFooterNote",
        "stat1Value", "stat1Label", "stat2Value", "stat2Label",
        "stat3Value", "stat3Label", "stat4Value", "stat4Label",
        "matchBadgeText", "matchHeading", "matchDescription",
        "matchBullet1Title", "matchBullet1Desc", "matchBullet2Title", "matchBullet2Desc", "matchCTAText",
        "featureSectionHeading",
        "feature1Title", "feature2Title", "feature3Title", "feature4Title", "feature5Title",
        "statsHeading", "statsSubheading",
        "stat_members_label", "stat_matches_label", "stat_marriages_label", "stat_satisfaction_label"
      ];
      const numberFields = ["stat_members_value", "stat_matches_value", "stat_marriages_value", "stat_satisfaction_value"];

      fields.forEach((field) => { if (req.body[field] !== undefined) home[field] = req.body[field]; });
      numberFields.forEach((field) => { if (req.body[field] !== undefined) home[field] = Number(req.body[field]); });

      const imageFields = ["bannerBgImage", "matchmakingImage"];
      imageFields.forEach((field) => {
        if (req.files && req.files[field] && req.files[field][0]) {
          home[field] = `/uploads/avatar/${req.files[field][0].filename}`;
        }
      });

      await home.save();
      res.json({ success: true, message: "Home page content updated!", data: home });
    } catch (error) {
      console.error("Error updating Home CMS:", error);
      res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  });
});

// ── Contact Page CMS Endpoints ─────────────────────────────────
const contactCmsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/avatar");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `contact-${file.fieldname}-${Date.now()}${ext}`);
  }
});
const contactCmsUpload = multer({ storage: contactCmsStorage }).fields([
  { name: "heroBgImage", maxCount: 1 }
]);

router.get("/contact-cms", isAuth, async (req, res) => {
  try {
    let contact = await ContactCMS.findOne();
    if (!contact) contact = await ContactCMS.create({});
    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

router.post("/contact-cms", isAuth, (req, res) => {
  contactCmsUpload(req, res, async (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message || "File upload error" });
    try {
      let contact = await ContactCMS.findOne();
      if (!contact) contact = new ContactCMS();

      const fields = [
        "heroSupertitle", "heroTitle", "heroDescription",
        "addressTitle", "addressText",
        "emailTitle", "email1", "email2",
        "phoneTitle", "phone1", "phone2",
        "formHeading", "formSubheading"
      ];
      fields.forEach((field) => { if (req.body[field] !== undefined) contact[field] = req.body[field]; });

      if (req.files && req.files["heroBgImage"] && req.files["heroBgImage"][0]) {
        contact.heroBgImage = `/uploads/avatar/${req.files["heroBgImage"][0].filename}`;
      }

      await contact.save();
      res.json({ success: true, message: "Contact page content updated!", data: contact });
    } catch (error) {
      console.error("Error updating Contact CMS:", error);
      res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  });
});

// ── Stories Page CMS Endpoints ─────────────────────────────────
router.get("/stories-cms", isAuth, async (req, res) => {
  try {
    let stories = await StoriesCMS.findOne();
    if (!stories) stories = await StoriesCMS.create({});
    res.json({ success: true, data: stories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

router.post("/stories-cms", isAuth, async (req, res) => {
  try {
    let stories = await StoriesCMS.findOne();
    if (!stories) stories = new StoriesCMS();

    const fields = [
      "heroSupertitle", "heroTitle", "heroDescription",
      "vvipTitle", "vvipDescription", "vvipButtonText"
    ];
    fields.forEach((field) => { if (req.body[field] !== undefined) stories[field] = req.body[field]; });

    await stories.save();
    res.json({ success: true, message: "Stories page content updated!", data: stories });
  } catch (error) {
    console.error("Error updating Stories CMS:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// ── Site Settings & Branding Endpoints ────────────────────────
const siteSettingsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/avatar");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `logo-${Date.now()}${ext}`);
  }
});
const siteSettingsUpload = multer({ storage: siteSettingsStorage }).fields([
  { name: "logo", maxCount: 1 }
]);

router.get("/site-settings", isAuth, async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = await SiteSettings.create({});
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

router.post("/site-settings", isAuth, (req, res) => {
  siteSettingsUpload(req, res, async (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message || "File upload error" });
    try {
      let settings = await SiteSettings.findOne();
      if (!settings) settings = new SiteSettings();

      const fields = ["companyName", "tagline", "copyrightText"];
      fields.forEach((field) => {
        if (req.body[field] !== undefined) settings[field] = req.body[field];
      });

      if (req.files && req.files["logo"] && req.files["logo"][0]) {
        settings.logo = `/uploads/avatar/${req.files["logo"][0].filename}`;
      }

      await settings.save();
      res.json({ success: true, message: "Site settings updated successfully!", data: settings });
    } catch (error) {
      console.error("Error updating Site settings:", error);
      res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  });
});

module.exports = router;
