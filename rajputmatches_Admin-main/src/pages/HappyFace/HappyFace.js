import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaPlus,
  FaEdit,
  FaToggleOn,
  FaToggleOff,
  FaSmile,
  FaSearch,
  FaStar,
  FaUser,
  FaTimes,
  FaCloudUploadAlt,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";

const HappyFace = () => {
  const Base_url = (process.env.REACT_APP_BASE_URL || "").replace(/\/$/, "");
  // Derive backend origin (e.g. http://localhost:5000) from Base_url
  const backendOrigin = Base_url ? Base_url.replace(/\/admin.*$/, "") : "";

  const getImageSrc = (image) => {
    if (!image) return "";
    if (image.startsWith("http")) return image;
    return `${backendOrigin}${image}`;
  };

  const { fetchUserData, updateData } = useAuth();
  const fileInputRef = useRef(null);

  // State
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [togglingId, setTogglingId] = useState(null);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    rating: 5,
    designation: "Verified Match",
    review: "",
    avatar: null
  });
  const [preview, setPreview] = useState(null);

  const getToken = () => localStorage.getItem("adminAuthToken");

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await fetchUserData("getallreviews");
      setReviews(data?.reviews || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleStatus = async (reviewId) => {
    setTogglingId(reviewId);
    try {
      await updateData("change-review-status", reviewId);
      await fetchReviews();
    } catch (error) {
      console.error("Error toggling status:", error);
    } finally {
      setTogglingId(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (ratingVal) => {
    setFormData((prev) => ({ ...prev, rating: ratingVal }));
  };

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2 MB.");
      return;
    }
    setFormData((prev) => ({ ...prev, avatar: file }));
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e) => handleFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const clearImage = () => {
    setPreview(null);
    setFormData((prev) => ({ ...prev, avatar: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openAddModal = () => {
    setFormData({
      name: "",
      rating: 5,
      designation: "Verified Match",
      review: "",
      avatar: null
    });
    setPreview(null);
    setShowAddModal(true);
  };

  const openEditModal = async (reviewId) => {
    try {
      const res = await updateData("getReview", reviewId);
      if (res?.user) {
        setFormData({
          name: res.user.name || "",
          rating: res.user.rating || 5,
          designation: res.user.designation || "Verified Match",
          review: res.user.review || "",
          avatar: null
        });
        setPreview(res.user.image ? getImageSrc(res.user.image) : null);
        setSelectedReviewId(reviewId);
        setShowEditModal(true);
      } else {
        toast.error("Failed to load review details.");
      }
    } catch (error) {
      console.error("Error loading review details:", error);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) { toast.error("Client Name is required."); return; }
    if (!formData.review.trim()) { toast.error("Review content is required."); return; }

    setSubmitting(true);
    try {
      const token = getToken();
      const fd = new FormData();
      fd.append("name", formData.name.trim());
      fd.append("rating", formData.rating);
      fd.append("designation", formData.designation.trim());
      fd.append("review", formData.review.trim());
      if (formData.avatar) {
        fd.append("avatar", formData.avatar);
      }

      const response = await axios.post(
        `${Base_url}/reviews`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if (response.data?.message) {
        toast.success(response.data.message);
      } else {
        toast.success("Review added successfully!");
      }
      setShowAddModal(false);
      fetchReviews();
    } catch (error) {
      const errMsg = error.response?.data?.message || "Failed to add review.";
      toast.error(errMsg);
      console.error("Add review error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) { toast.error("Client Name is required."); return; }
    if (!formData.review.trim()) { toast.error("Review content is required."); return; }

    setSubmitting(true);
    try {
      const token = getToken();
      const fd = new FormData();
      fd.append("name", formData.name.trim());
      fd.append("rating", formData.rating);
      fd.append("designation", formData.designation.trim());
      fd.append("review", formData.review.trim());
      if (formData.avatar) {
        fd.append("avatar", formData.avatar);
      }

      const response = await axios.put(
        `${Base_url}/update-review/${selectedReviewId}`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if (response.data?.message) {
        toast.success(response.data.message);
      } else {
        toast.success("Review updated successfully!");
      }
      setShowEditModal(false);
      fetchReviews();
    } catch (error) {
      const errMsg = error.response?.data?.message || "Failed to update review.";
      toast.error(errMsg);
      console.error("Edit review error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReviews = reviews.filter(
    (item) =>
      item?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.review?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.designation?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const enabledCount = reviews.filter((r) => r.status === true).length;
  const disabledCount = reviews.filter((r) => r.status !== true).length;

  return (
    <div className="main-content">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

        .rf-page {
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          background: #f7f8fc;
          padding: 28px 24px;
        }
        .rf-hero {
          background: linear-gradient(135deg, #59123B 0%, #8B1D5A 50%, #3f0c2a 100%);
          border-radius: 20px;
          padding: 32px 36px;
          margin-bottom: 28px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(89,18,59,0.25);
        }
        .rf-hero::before {
          content: '';
          position: absolute;
          top: -40px; right: -40px;
          width: 200px; height: 200px;
          border-radius: 50%;
          background: rgba(237,177,57,0.12);
        }
        .rf-hero::after {
          content: '';
          position: absolute;
          bottom: -60px; left: -30px;
          width: 250px; height: 250px;
          border-radius: 50%;
          background: rgba(237,177,57,0.07);
        }
        .rf-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 700;
          color: #EDB139;
          margin: 0 0 6px 0;
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
          z-index: 1;
        }
        .rf-hero-sub {
          color: rgba(255,255,255,0.7);
          font-size: 0.95rem;
          margin: 0;
          position: relative;
          z-index: 1;
        }
        .rf-smile-icon {
          color: #EDB139;
          animation: smilePulse 2s ease-in-out infinite;
        }
        @keyframes smilePulse {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.15) rotate(10deg); }
        }

        /* Stats Row */
        .rf-stats-row {
          display: flex;
          gap: 16px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }
        .rf-stat-card {
          flex: 1;
          min-width: 180px;
          background: #fff;
          border-radius: 16px;
          padding: 20px 24px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          display: flex;
          align-items: center;
          gap: 16px;
          border-left: 5px solid transparent;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .rf-stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.10);
        }
        .rf-stat-card.total { border-left-color: #8B1D5A; }
        .rf-stat-card.enabled { border-left-color: #28a745; }
        .rf-stat-card.disabled { border-left-color: #dc3545; }
        .rf-stat-icon {
          width: 50px; height: 50px;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.3rem;
        }
        .rf-stat-card.total .rf-stat-icon { background: #faf0f6; color: #8B1D5A; }
        .rf-stat-card.enabled .rf-stat-icon { background: #f0fff4; color: #28a745; }
        .rf-stat-card.disabled .rf-stat-icon { background: #fff5f5; color: #dc3545; }
        .rf-stat-num {
          font-size: 1.9rem;
          font-weight: 700;
          color: #2d3748;
          line-height: 1;
        }
        .rf-stat-label {
          font-size: 0.82rem;
          color: #718096;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Toolbar */
        .rf-toolbar {
          background: #fff;
          border-radius: 16px;
          padding: 18px 22px;
          margin-bottom: 24px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          flex-wrap: wrap;
        }
        .rf-search-wrap {
          position: relative;
          flex: 1;
          min-width: 220px;
          max-width: 380px;
        }
        .rf-search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #a0aec0;
          font-size: 0.9rem;
          pointer-events: none;
        }
        .rf-search-input {
          width: 100%;
          padding: 11px 14px 11px 40px;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          font-size: 0.9rem;
          font-family: 'Inter', sans-serif;
          color: #2d3748;
          background: #f7f8fc;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
        }
        .rf-search-input:focus {
          border-color: #8B1D5A;
          box-shadow: 0 0 0 3px rgba(139,29,90,0.12);
          background: #fff;
        }
        .rf-add-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #59123B, #8B1D5A);
          color: #fff;
          border: none;
          padding: 11px 22px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.92rem;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(89,18,59,0.3);
          transition: all 0.2s;
          white-space: nowrap;
        }
        .rf-add-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(89,18,59,0.4);
          color: #EDB139;
        }
        .rf-count-badge {
          background: #f7f8fc;
          border: 1.5px solid #e2e8f0;
          border-radius: 20px;
          padding: 6px 14px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #4a5568;
          white-space: nowrap;
        }

        /* Review Grid */
        .rf-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }
        .rf-card {
          background: #fff;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 18px rgba(0,0,0,0.05);
          border: 1.5px solid #f0f0f6;
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), border-color 0.3s ease;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .rf-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 18px 40px rgba(89,18,59,0.12);
          border-color: #EDB139;
        }

        /* Review Card Components */
        .rf-card-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }
        .rf-card-avatar {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #e2e8f0;
          background: #faf0f6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #8B1D5A;
          font-size: 1.2rem;
        }
        .rf-card-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: #2d3748;
          margin: 0 0 2px 0;
        }
        .rf-card-desig {
          font-size: 0.82rem;
          color: #718096;
          font-weight: 500;
          margin: 0;
        }
        .rf-stars {
          display: flex;
          gap: 3px;
          color: #EDB139;
          font-size: 0.9rem;
          margin-bottom: 12px;
        }
        .rf-card-text {
          font-size: 0.88rem;
          color: #4a5568;
          line-height: 1.6;
          flex: 1;
          margin: 0 0 20px 0;
          white-space: pre-line;
        }
        .rf-card-actions {
          display: flex;
          gap: 10px;
          border-top: 1px solid #f0f0f6;
          padding-top: 16px;
        }
        .rf-btn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 9px 12px;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }
        .rf-btn-edit {
          background: #faf0f6;
          color: #8B1D5A;
          border: 1.5px solid #e8c9da;
        }
        .rf-btn-edit:hover {
          background: #8B1D5A;
          color: #fff;
          border-color: #8B1D5A;
        }
        .rf-btn-enable {
          background: #f0fff4;
          color: #28a745;
          border: 1.5px solid #c3e6cb;
        }
        .rf-btn-enable:hover {
          background: #28a745;
          color: #fff;
          border-color: #28a745;
        }
        .rf-btn-disable {
          background: #fff5f5;
          color: #dc3545;
          border: 1.5px solid #f5c6cb;
        }
        .rf-btn-disable:hover {
          background: #dc3545;
          color: #fff;
          border-color: #dc3545;
        }
        .rf-card-status-pill {
          position: absolute;
          top: 16px;
          right: 16px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 8px;
          border-radius: 12px;
          font-size: 0.72rem;
          font-weight: 700;
        }
        .rf-card-status-pill.published {
          background: #e6fcf5;
          color: #0ca678;
        }
        .rf-card-status-pill.hidden {
          background: #fff5f5;
          color: #fa5252;
        }

        /* Modal Overlay & Card styling */
        .rf-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(45, 12, 28, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1050;
          padding: 20px;
        }
        .rf-modal {
          background: #fff;
          border-radius: 20px;
          width: 100%;
          max-width: 540px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 15px 45px rgba(0,0,0,0.18);
          border: 2px solid #EDB139;
          animation: modalSlideUp 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes modalSlideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .rf-modal-header {
          padding: 20px 24px;
          border-bottom: 1.5px solid #f0f0f6;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #faf6f8;
        }
        .rf-modal-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem;
          font-weight: 700;
          color: #59123B;
          margin: 0;
        }
        .rf-close-btn {
          background: none;
          border: none;
          color: #a0aec0;
          font-size: 1.2rem;
          cursor: pointer;
          transition: color 0.2s;
        }
        .rf-close-btn:hover { color: #dc3545; }
        .rf-modal-body {
          padding: 24px;
        }

        /* Form Styling */
        .rf-form-group {
          margin-bottom: 18px;
        }
        .rf-label {
          display: block;
          font-size: 0.88rem;
          font-weight: 600;
          color: #4a5568;
          margin-bottom: 7px;
        }
        .rf-input, .rf-textarea {
          width: 100%;
          padding: 10px 14px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.9rem;
          font-family: 'Inter', sans-serif;
          color: #2d3748;
          outline: none;
          transition: border-color 0.2s;
        }
        .rf-input:focus, .rf-textarea:focus {
          border-color: #8B1D5A;
        }
        .rf-textarea {
          resize: vertical;
          min-height: 90px;
        }
        
        /* Interactive Star Rating Selector */
        .rf-star-selector {
          display: flex;
          gap: 6px;
          font-size: 1.6rem;
          color: #e2e8f0;
        }
        .rf-star-selector svg {
          cursor: pointer;
          transition: color 0.15s, transform 0.15s;
        }
        .rf-star-selector svg:hover {
          transform: scale(1.2);
        }
        .rf-star-selector svg.active {
          color: #EDB139;
        }

        /* Upload styling */
        .rf-upload-box {
          border: 2px dashed #cbd5e1;
          border-radius: 12px;
          padding: 22px;
          text-align: center;
          background: #f8fafc;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }
        .rf-upload-box.drag-over {
          border-color: #8B1D5A;
          background: #faf0f6;
        }
        .rf-upload-icon {
          font-size: 2.2rem;
          color: #94a3b8;
          margin-bottom: 8px;
        }
        .rf-upload-text {
          font-size: 0.85rem;
          color: #64748b;
          margin: 0;
        }
        .rf-upload-preview-wrap {
          display: flex;
          align-items: center;
          gap: 16px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          padding: 12px 16px;
          border-radius: 12px;
        }
        .rf-preview-img {
          width: 52px;
          height: 52px;
          border-radius: 8px;
          object-fit: cover;
          border: 1.5px solid #cbd5e1;
        }

        /* Footer buttons */
        .rf-modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
        }
        .rf-btn-submit {
          background: linear-gradient(135deg, #59123B, #8B1D5A);
          color: #fff;
          font-weight: 600;
          padding: 10px 24px;
          border-radius: 10px;
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 12px rgba(89,18,59,0.25);
          transition: all 0.2s;
        }
        .rf-btn-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(89,18,59,0.35);
          color: #EDB139;
        }
        .rf-btn-cancel {
          background: #f1f5f9;
          color: #475569;
          font-weight: 600;
          padding: 10px 24px;
          border-radius: 10px;
          cursor: pointer;
          border: 1.5px solid #e2e8f0;
          transition: all 0.2s;
        }
        .rf-btn-cancel:hover {
          background: #e2e8f0;
        }

        /* Loading */
        .rf-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          gap: 18px;
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }
        .rf-spinner {
          width: 48px; height: 48px;
          border: 4px solid #faf0f6;
          border-top-color: #8B1D5A;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Empty state */
        .rf-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          gap: 16px;
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          text-align: center;
        }
        .rf-empty-icon {
          font-size: 4.2rem;
          color: #e2d0d8;
          animation: smilePulse 2.5s ease-in-out infinite;
        }
        .rf-empty-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: #4a5568;
          margin: 0;
        }
        .rf-empty-sub {
          font-size: 0.9rem;
          color: #a0aec0;
          margin: 0;
        }
      `}</style>

      <div className="rf-page">
        {/* Hero Banner */}
        <div className="rf-hero">
          <h2 className="rf-hero-title">
            <FaSmile className="rf-smile-icon" />
            Happy Faces
          </h2>
          <p className="rf-hero-sub">Manage and moderate beautiful client reviews and testimonials shown on the website</p>
        </div>

        {/* Metrics/Stats Row */}
        <div className="rf-stats-row">
          <div className="rf-stat-card total">
            <div className="rf-stat-icon"><FaSmile /></div>
            <div>
              <div className="rf-stat-num">{reviews.length}</div>
              <div className="rf-stat-label">Total Reviews</div>
            </div>
          </div>
          <div className="rf-stat-card enabled">
            <div className="rf-stat-icon"><FaEye /></div>
            <div>
              <div className="rf-stat-num">{enabledCount}</div>
              <div className="rf-stat-label">Published</div>
            </div>
          </div>
          <div className="rf-stat-card disabled">
            <div className="rf-stat-icon"><FaEyeSlash /></div>
            <div>
              <div className="rf-stat-num">{disabledCount}</div>
              <div className="rf-stat-label">Hidden</div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="rf-toolbar">
          <div className="rf-search-wrap">
            <FaSearch className="rf-search-icon" />
            <input
              type="text"
              className="rf-search-input"
              placeholder="Search by client name, review, or designation…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span className="rf-count-badge">
              {filteredReviews.length} result{filteredReviews.length !== 1 ? "s" : ""}
            </span>
            <button className="rf-add-btn" onClick={openAddModal}>
              <FaPlus />
              Add Review
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        {loading ? (
          <div className="rf-loading">
            <div className="rf-spinner" />
            <p style={{ color: "#8B1D5A", fontWeight: 600, margin: 0 }}>Loading reviews…</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="rf-empty">
            <FaSmile className="rf-empty-icon" />
            <p className="rf-empty-title">
              {searchTerm ? "No reviews match your search" : "No reviews found"}
            </p>
            <p className="rf-empty-sub">
              {searchTerm
                ? "Try searching for a different keyword"
                : "Click 'Add Review' to share the first client testimonial!"}
            </p>
            {!searchTerm && (
              <button className="rf-add-btn" style={{ marginTop: 12 }} onClick={openAddModal}>
                <FaPlus /> Add Your First Review
              </button>
            )}
          </div>
        ) : (
          <div className="rf-grid">
            {filteredReviews.map((item) => (
              <div key={item._id} className="rf-card">
                <span className={`rf-card-status-pill ${item.status === true ? "published" : "hidden"}`}>
                  {item.status === true ? "Published" : "Hidden"}
                </span>

                <div className="rf-card-header">
                  {item.image ? (
                    <img
                      src={getImageSrc(item.image)}
                      alt={item.name}
                      className="rf-card-avatar"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "";
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className="rf-card-avatar"
                    style={{
                      display: item.image ? "none" : "flex",
                      background: "#faf0f6",
                      color: "#8B1D5A"
                    }}
                  >
                    {item.name ? item.name.substring(0, 2).toUpperCase() : "RM"}
                  </div>

                  <div>
                    <h5 className="rf-card-name">{item.name}</h5>
                    <p className="rf-card-desig">{item.designation || "Verified Match"}</p>
                  </div>
                </div>

                <div className="rf-stars">
                  {[...Array(item.rating || 5)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                  {[...Array(5 - (item.rating || 5))].map((_, i) => (
                    <FaStar key={i} style={{ color: "#cbd5e1" }} />
                  ))}
                </div>

                <p className="rf-card-text">{item.review}</p>

                <div className="rf-card-actions">
                  <button className="rf-btn rf-btn-edit" onClick={() => openEditModal(item._id)}>
                    <FaEdit /> Edit
                  </button>
                  <button
                    className={`rf-btn ${item.status === true ? "rf-btn-disable" : "rf-btn-enable"}`}
                    onClick={() => toggleStatus(item._id)}
                    disabled={togglingId === item._id}
                  >
                    {togglingId === item._id ? (
                      "…"
                    ) : item.status === true ? (
                      <><FaToggleOff /> Disable</>
                    ) : (
                      <><FaToggleOn /> Enable</>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Review Modal */}
      {showAddModal && (
        <div className="rf-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="rf-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rf-modal-header">
              <h4 className="rf-modal-title">Add Happy Face Review</h4>
              <button className="rf-close-btn" onClick={() => setShowAddModal(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="rf-modal-body">
                <div className="rf-form-group">
                  <label className="rf-label">Client Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="rf-input"
                    placeholder="e.g. Priya & Arjun Singh"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="rf-form-group">
                  <label className="rf-label">Designation / Label</label>
                  <input
                    type="text"
                    name="designation"
                    className="rf-input"
                    placeholder="e.g. Verified Match, Jodhpur"
                    value={formData.designation}
                    onChange={handleChange}
                  />
                </div>

                <div className="rf-form-group">
                  <label className="rf-label">Rating *</label>
                  <div className="rf-star-selector">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={formData.rating >= star ? "active" : ""}
                        onClick={() => handleRatingChange(star)}
                      />
                    ))}
                  </div>
                </div>

                <div className="rf-form-group">
                  <label className="rf-label">Review / Testimonial *</label>
                  <textarea
                    name="review"
                    className="rf-textarea"
                    placeholder="Describe their happy experience..."
                    value={formData.review}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="rf-form-group">
                  <label className="rf-label">Profile Photo (Optional)</label>
                  {preview ? (
                    <div className="rf-upload-preview-wrap">
                      <img src={preview} alt="Preview" className="rf-preview-img" />
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 600, color: "#2d3748" }}>
                          {formData.avatar ? formData.avatar.name : "Current Photo"}
                        </p>
                        <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b" }}>
                          {formData.avatar ? `${(formData.avatar.size / 1024).toFixed(1)} KB` : ""}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="rf-close-btn"
                        onClick={clearImage}
                        style={{ padding: 4 }}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`rf-upload-box ${dragOver ? "drag-over" : ""}`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                      }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    >
                      <FaCloudUploadAlt className="rf-upload-icon" />
                      <p className="rf-upload-text">
                        Drag and drop your image here, or <strong>Browse</strong>
                      </p>
                      <p style={{ margin: "4px 0 0 0", fontSize: "0.72rem", color: "#94a3b8" }}>
                        Supports JPG, JPEG, PNG up to 2MB
                      </p>
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </div>
                  )}
                </div>

                <div className="rf-modal-footer">
                  <button type="button" className="rf-btn-cancel" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="rf-btn-submit" disabled={submitting}>
                    {submitting ? "Saving…" : "Save Review"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Review Modal */}
      {showEditModal && (
        <div className="rf-modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="rf-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rf-modal-header">
              <h4 className="rf-modal-title">Edit Happy Face Review</h4>
              <button className="rf-close-btn" onClick={() => setShowEditModal(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="rf-modal-body">
                <div className="rf-form-group">
                  <label className="rf-label">Client Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="rf-input"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="rf-form-group">
                  <label className="rf-label">Designation / Label</label>
                  <input
                    type="text"
                    name="designation"
                    className="rf-input"
                    value={formData.designation}
                    onChange={handleChange}
                  />
                </div>

                <div className="rf-form-group">
                  <label className="rf-label">Rating *</label>
                  <div className="rf-star-selector">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={formData.rating >= star ? "active" : ""}
                        onClick={() => handleRatingChange(star)}
                      />
                    ))}
                  </div>
                </div>

                <div className="rf-form-group">
                  <label className="rf-label">Review / Testimonial *</label>
                  <textarea
                    name="review"
                    className="rf-textarea"
                    value={formData.review}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="rf-form-group">
                  <label className="rf-label">Profile Photo (Optional)</label>
                  {preview ? (
                    <div className="rf-upload-preview-wrap">
                      <img src={preview} alt="Preview" className="rf-preview-img" />
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 600, color: "#2d3748" }}>
                          {formData.avatar ? formData.avatar.name : "Current Photo"}
                        </p>
                        <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b" }}>
                          {formData.avatar ? `${(formData.avatar.size / 1024).toFixed(1)} KB` : "Stored Image"}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="rf-close-btn"
                        onClick={clearImage}
                        style={{ padding: 4 }}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`rf-upload-box ${dragOver ? "drag-over" : ""}`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                      }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    >
                      <FaCloudUploadAlt className="rf-upload-icon" />
                      <p className="rf-upload-text">
                        Drag and drop your image here, or <strong>Browse</strong>
                      </p>
                      <p style={{ margin: "4px 0 0 0", fontSize: "0.72rem", color: "#94a3b8" }}>
                        Supports JPG, JPEG, PNG up to 2MB
                      </p>
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </div>
                  )}
                </div>

                <div className="rf-modal-footer">
                  <button type="button" className="rf-btn-cancel" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="rf-btn-submit" disabled={submitting}>
                    {submitting ? "Updating…" : "Update Review"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HappyFace;
