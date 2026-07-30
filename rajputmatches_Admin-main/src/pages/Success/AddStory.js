import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaHeart,
  FaArrowLeft,
  FaCloudUploadAlt,
  FaCheckCircle,
  FaTimes,
  FaImage,
  FaPen,
  FaAlignLeft,
  FaEye,
} from "react-icons/fa";

const AddStory = () => {
  const Base_url = (process.env.REACT_APP_BASE_URL || "").replace(/\/$/, "");
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    avatar: null,
  });
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const getToken = () => localStorage.getItem("adminAuthToken");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB.");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) { toast.error("Title is required."); return; }
    if (!formData.description.trim()) { toast.error("Description is required."); return; }
    if (!formData.avatar) { toast.error("Please upload a cover image."); return; }

    setSubmitting(true);
    try {
      const token = getToken();
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("description", formData.description);
      fd.append("avatar", formData.avatar);

      const response = await axios.post(
        `${Base_url}/stories`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data?.message) {
        toast.success(response.data.message);
      } else {
        toast.success("Story added successfully!");
      }
      setFormData({ title: "", description: "", avatar: null });
      setPreview(null);
      setTimeout(() => navigate("/Success/Success-Stories"), 1200);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error submitting the story. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const charLimit = 300;
  const descLen = formData.description.length;

  return (
    <div className="main-content">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

        .as-page {
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          background: #f7f8fc;
          padding: 28px 24px;
        }

        /* Back link */
        .as-back {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #8B1D5A;
          font-weight: 600;
          font-size: 0.9rem;
          text-decoration: none;
          margin-bottom: 24px;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          transition: gap 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .as-back:hover { gap: 11px; }

        .as-layout {
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 28px;
          max-width: 1100px;
          margin: 0 auto;
          align-items: start;
        }
        @media (max-width: 860px) {
          .as-layout { grid-template-columns: 1fr; }
          .as-preview-panel { order: -1; }
        }

        /* Form Card */
        .as-card {
          background: #fff;
          border-radius: 22px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          overflow: hidden;
        }
        .as-card-header {
          background: linear-gradient(135deg, #59123B 0%, #8B1D5A 100%);
          padding: 26px 30px;
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .as-header-icon-wrap {
          width: 48px; height: 48px;
          background: rgba(237,177,57,0.18);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #EDB139;
          font-size: 1.3rem;
        }
        .as-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: #EDB139;
          margin: 0 0 2px 0;
        }
        .as-card-sub {
          color: rgba(255,255,255,0.65);
          font-size: 0.85rem;
          margin: 0;
        }
        .as-card-body { padding: 30px; }

        /* Field */
        .as-field { margin-bottom: 24px; }
        .as-label {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 0.87rem;
          font-weight: 600;
          color: #4a5568;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }
        .as-label-icon { color: #8B1D5A; font-size: 0.85rem; }
        .as-input, .as-textarea {
          width: 100%;
          padding: 13px 16px;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          font-size: 0.93rem;
          font-family: 'Inter', sans-serif;
          color: #2d3748;
          background: #f9fafb;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          box-sizing: border-box;
        }
        .as-input:focus, .as-textarea:focus {
          border-color: #8B1D5A;
          box-shadow: 0 0 0 3px rgba(139,29,90,0.11);
          background: #fff;
        }
        .as-textarea {
          resize: vertical;
          min-height: 130px;
          line-height: 1.6;
        }
        .as-char-counter {
          text-align: right;
          font-size: 0.78rem;
          margin-top: 5px;
          font-weight: 500;
        }
        .as-char-counter.warn { color: #e07b00; }
        .as-char-counter.ok { color: #a0aec0; }

        /* Image drop zone */
        .as-dropzone {
          border: 2px dashed #d0a8be;
          border-radius: 16px;
          background: #fdf7fb;
          padding: 36px 20px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          position: relative;
        }
        .as-dropzone.drag-over {
          border-color: #8B1D5A;
          background: #faf0f6;
        }
        .as-dropzone input[type="file"] {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
          width: 100%;
          height: 100%;
        }
        .as-dropzone-icon {
          font-size: 2.5rem;
          color: #c9a0bd;
          margin-bottom: 10px;
          display: block;
        }
        .as-dropzone-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: #59123B;
          margin-bottom: 4px;
        }
        .as-dropzone-sub {
          font-size: 0.8rem;
          color: #a0aec0;
        }
        .as-dropzone-btn {
          display: inline-block;
          margin-top: 12px;
          background: #59123B;
          color: #EDB139;
          padding: 8px 18px;
          border-radius: 8px;
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
          pointer-events: none;
        }

        /* Preview inside dropzone */
        .as-img-preview {
          position: relative;
          border-radius: 14px;
          overflow: hidden;
          height: 180px;
        }
        .as-img-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .as-img-clear {
          position: absolute;
          top: 10px; right: 10px;
          background: rgba(0,0,0,0.6);
          color: #fff;
          border: none;
          width: 30px; height: 30px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          font-size: 0.85rem;
          transition: background 0.2s;
        }
        .as-img-clear:hover { background: #dc3545; }

        /* Submit button */
        .as-submit {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #59123B, #8B1D5A);
          color: #fff;
          border: none;
          border-radius: 14px;
          font-size: 1rem;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 5px 20px rgba(89,18,59,0.3);
          transition: all 0.3s;
          letter-spacing: 0.3px;
          margin-top: 8px;
        }
        .as-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(89,18,59,0.4);
          background: linear-gradient(135deg, #3f0c2a, #59123B);
        }
        .as-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .as-submit .spin-icon {
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Right preview panel */
        .as-preview-panel {
          display: flex;
          flex-direction: column;
          gap: 20px;
          position: sticky;
          top: 24px;
        }
        .as-preview-card {
          background: #fff;
          border-radius: 22px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          overflow: hidden;
        }
        .as-preview-header {
          padding: 18px 22px;
          border-bottom: 1px solid #f0f0f6;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .as-preview-header-title {
          font-size: 0.88rem;
          font-weight: 700;
          color: #4a5568;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0;
        }
        .as-preview-live-badge {
          margin-left: auto;
          background: #f0fff4;
          color: #28a745;
          border: 1px solid #c3e6cb;
          border-radius: 20px;
          padding: 2px 10px;
          font-size: 0.72rem;
          font-weight: 700;
        }
        .as-preview-img-wrap {
          height: 190px;
          background: #f7f8fc;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #d0a8be;
          flex-direction: column;
          gap: 8px;
        }
        .as-preview-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .as-preview-body { padding: 20px; }
        .as-preview-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 8px;
          min-height: 28px;
        }
        .as-preview-desc {
          font-size: 0.85rem;
          color: #718096;
          line-height: 1.65;
          min-height: 60px;
        }
        .as-preview-placeholder {
          color: #d0a8be;
          font-style: italic;
        }

        /* Tips card */
        .as-tips-card {
          background: linear-gradient(135deg, #59123B, #3f0c2a);
          border-radius: 22px;
          padding: 22px;
          color: rgba(255,255,255,0.85);
        }
        .as-tips-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Playfair Display', serif;
          font-size: 1rem;
          font-weight: 700;
          color: #EDB139;
          margin-bottom: 14px;
        }
        .as-tips-list {
          list-style: none;
          padding: 0; margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .as-tips-list li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.84rem;
          line-height: 1.5;
        }
        .as-tips-dot {
          width: 6px; height: 6px;
          background: #EDB139;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 6px;
        }
      `}</style>

      <div className="as-page">
        {/* Back button */}
        <button className="as-back" onClick={() => navigate("/Success/Success-Stories")}>
          <FaArrowLeft /> Back to Stories
        </button>

        <div className="as-layout">
          {/* ── Left: Form ── */}
          <div className="as-card">
            <div className="as-card-header">
              <div className="as-header-icon-wrap">
                <FaHeart />
              </div>
              <div>
                <h3 className="as-card-title">Add Success Story</h3>
                <p className="as-card-sub">Share an inspiring love story with your community</p>
              </div>
            </div>
            <div className="as-card-body">
              <form onSubmit={handleSubmit} noValidate>
                {/* Title */}
                <div className="as-field">
                  <label className="as-label">
                    <FaPen className="as-label-icon" /> Story Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    className="as-input"
                    placeholder="e.g. Priya & Rajat's Beautiful Journey"
                    value={formData.title}
                    onChange={handleChange}
                    maxLength={80}
                    required
                  />
                </div>

                {/* Description */}
                <div className="as-field">
                  <label className="as-label">
                    <FaAlignLeft className="as-label-icon" /> Description
                  </label>
                  <textarea
                    name="description"
                    className="as-textarea"
                    placeholder="Tell their story… how they met, their journey to love…"
                    value={formData.description}
                    onChange={(e) => {
                      if (e.target.value.length <= charLimit) handleChange(e);
                    }}
                    required
                  />
                  <div className={`as-char-counter ${descLen > charLimit * 0.85 ? "warn" : "ok"}`}>
                    {descLen} / {charLimit}
                  </div>
                </div>

                {/* Image Upload */}
                <div className="as-field">
                  <label className="as-label">
                    <FaImage className="as-label-icon" /> Cover Image
                  </label>
                  {preview ? (
                    <div className="as-img-preview">
                      <img src={preview} alt="Preview" />
                      <button type="button" className="as-img-clear" onClick={clearImage}>
                        <FaTimes />
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`as-dropzone ${dragOver ? "drag-over" : ""}`}
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: "none" }}
                      />
                      <FaCloudUploadAlt className="as-dropzone-icon" />
                      <div className="as-dropzone-title">
                        {dragOver ? "Drop it here!" : "Drag & drop or click to upload"}
                      </div>
                      <div className="as-dropzone-sub">PNG, JPG, WEBP — max 5 MB</div>
                      <span className="as-dropzone-btn">Browse File</span>
                    </div>
                  )}
                </div>

                {/* Submit */}
                <button type="submit" className="as-submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <FaHeart className="spin-icon" /> Publishing Story…
                    </>
                  ) : (
                    <>
                      <FaCheckCircle /> Publish Story
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* ── Right: Preview + Tips ── */}
          <div className="as-preview-panel">
            {/* Live Preview Card */}
            <div className="as-preview-card">
              <div className="as-preview-header">
                <FaEye style={{ color: "#8B1D5A" }} />
                <p className="as-preview-header-title">Live Preview</p>
                <span className="as-preview-live-badge">LIVE</span>
              </div>
              <div className="as-preview-img-wrap">
                {preview ? (
                  <img src={preview} alt="Cover preview" />
                ) : (
                  <>
                    <FaImage style={{ fontSize: "2.5rem" }} />
                    <span style={{ fontSize: "0.82rem" }}>Cover image appears here</span>
                  </>
                )}
              </div>
              <div className="as-preview-body">
                <div className="as-preview-title">
                  {formData.title || (
                    <span className="as-preview-placeholder">Story title…</span>
                  )}
                </div>
                <div className="as-preview-desc">
                  {formData.description || (
                    <span className="as-preview-placeholder">
                      Your description will appear here…
                    </span>
                  )}
                </div>
                {(formData.title || formData.description || preview) && (
                  <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 6 }}>
                    <FaHeart style={{ color: "#EDB139", fontSize: "0.85rem" }} />
                    <span style={{ fontSize: "0.78rem", color: "#a0aec0", fontWeight: 500 }}>
                      Published by Admin
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Tips Card */}
            <div className="as-tips-card">
              <div className="as-tips-title">
                <FaHeart style={{ animation: "heartPulse 1.8s ease-in-out infinite" }} />
                Tips for a Great Story
              </div>
              <ul className="as-tips-list">
                <li>
                  <span className="as-tips-dot" />
                  Use a warm, high-quality couple photo as the cover image.
                </li>
                <li>
                  <span className="as-tips-dot" />
                  Keep the title short and memorable — under 60 characters.
                </li>
                <li>
                  <span className="as-tips-dot" />
                  Tell how they met and what made them choose this platform.
                </li>
                <li>
                  <span className="as-tips-dot" />
                  Keep the description authentic — real stories inspire others.
                </li>
                <li>
                  <span className="as-tips-dot" />
                  You can enable or disable stories from the Stories Gallery anytime.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Make heartPulse keyframe available globally for the tips card
const style = document.createElement("style");
style.textContent = `
  @keyframes heartPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.18); }
  }
`;
document.head.appendChild(style);

export default AddStory;
