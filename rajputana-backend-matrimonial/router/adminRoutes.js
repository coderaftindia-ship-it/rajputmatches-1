const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
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

// POST /admin/stories — Create a new success story (with image upload)
router.post('/stories', isAuth, sanitizeAdminUser, (req, res, next) => {
  singleFileUpload(req, res, async (err) => {
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

// POST /admin/reviews — Create a new client review (with image upload)
router.post('/reviews', isAuth, sanitizeAdminUser, (req, res, next) => {
  singleFileUpload(req, res, async (err) => {
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
  singleFileUpload(req, res, async (err) => {
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
const multer = require("multer");
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

module.exports = router;
