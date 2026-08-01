import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
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
  FaEdit,
} from "react-icons/fa";

const EditStory = () => {
  const { updateData, storyId } = useAuth();
  const Base_url = (process.env.REACT_APP_BASE_URL || "http://localhost:5000/admin").replace(/\/$/, "");
  const backendOrigin = Base_url ? Base_url.replace(/\/admin.*$/, "") : "";

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    avatar: null,
  });

  // currentImage = URL stored in DB (relative path like /uploads/avatar/xxx.jpg)
  const [currentImage, setCurrentImage] = useState(null);
  // newPreview = base64 preview of newly selected file
  const [newPreview, setNewPreview] = useState(null);

  const getToken = () => localStorage.getItem("adminAuthToken");

  // Resolve image src — if it starts with http use as-is, else prepend backend origin
  const resolveImage = (img) => {
    if (!img) return null;
    if (img.startsWith("http")) return img;
    return `${backendOrigin}${img}`;
  };

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const route = "getStory";
        const response = await updateData(route, storyId);
        const { title, description, image } = response.user;
        setFormData({ title: title || "", description: description || "", avatar: null });
        setCurrentImage(image || null);
      } catch (error) {
        console.error("Error fetching story:", error.response?.data?.message || error.message);
        toast.error("Error fetching the story. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStory();
  }, [storyId]); // eslint-disable-line react-hooks/exhaustive-deps

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
    reader.onloadend = () => setNewPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e) => handleFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const clearNewImage = () => {
    setNewPreview(null);
    setFormData((prev) => ({ ...prev, avatar: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) { toast.error("Title is required."); return; }
    if (!formData.description.trim()) { toast.error("Description is required."); return; }

    setSubmitting(true);
    try {
      const token = getToken();
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("description", formData.description);
      if (formData.avatar) {
        fd.append("avatar", formData.avatar);
      }

      const response = await axios.put(
        `${Base_url}/update-story/${storyId}`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(response.data?.message || "Story updated successfully!");
      setTimeout(() => navigate("/Success/Success-Stories"), 1200);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating the story. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const charLimit = 300;
  const descLen = formData.description.length;

  // What to show in the live preview image section
  const previewImage = newPreview || resolveImage(currentImage);

  if (isLoading) {
    return (
      <div className="main-content">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", flexDirection: "column", gap: 16 }}>
          <div style={{ width: 48, height: 48, border: "4px solid #faf0f6", borderTopColor: "#8B1D5A", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <p style={{ color: "#8B1D5A", fontWeight: 600, fontFamily: "Inter, sans-serif" }}>Loading story…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

        .es-page {
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          background: #f7f8fc;
          padding: 28px 24px;
        }

        .es-back {
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
        .es-back:hover { gap: 11px; }

        .es-layout {
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 28px;
          max-width: 1100px;
          margin: 0 auto;
          align-items: start;
        }
        @media (max-width: 860px) {
          .es-layout { grid-template-columns: 1fr; }
          .es-preview-panel { order: -1; }
        }

        .es-card {
          background: #fff;
          border-radius: 22px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          overflow: hidden;
        }
        .es-card-header {
          background: linear-gradient(135deg, #59123B 0%, #8B1D5A 100%);
          padding: 26px 30px;
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .es-header-icon-wrap {
          width: 48px; height: 48px;
          background: rgba(237,177,57,0.18);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #EDB139;
          font-size: 1.3rem;
        }
        .es-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: #EDB139;
          margin: 0 0 2px 0;
        }
        .es-card-sub {
          color: rgba(255,255,255,0.65);
          font-size: 0.85rem;
          margin: 0;
        }
        .es-card-body { padding: 30px; }

        .es-field { margin-bottom: 24px; }
        .es-label {
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
        .es-label-icon { color: #8B1D5A; font-size: 0.85rem; }
        .es-input, .es-textarea {
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
        .es-input:focus, .es-textarea:focus {
          border-color: #8B1D5A;
          box-shadow: 0 0 0 3px rgba(139,29,90,0.11);
          background: #fff;
        }
        .es-textarea {
          resize: vertical;
          min-height: 130px;
          line-height: 1.6;
        }
        .es-char-counter {
          text-align: right;
          font-size: 0.78rem;
          margin-top: 5px;
          font-weight: 500;
        }
        .es-char-counter.warn { color: #e07b00; }
        .es-char-counter.ok { color: #a0aec0; }

        /* Current image strip */
        .es-current-img {
          border-radius: 12px;
          overflow: hidden;
          height: 160px;
          position: relative;
          margin-bottom: 12px;
          border: 2px solid #e2e8f0;
        }
        .es-current-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .es-current-label {
          position: absolute;
          bottom: 8px; left: 10px;
          background: rgba(0,0,0,0.55);
          color: #fff;
          font-size: 0.72rem;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 20px;
          letter-spacing: 0.3px;
        }

        /* Drop zone */
        .es-dropzone {
          border: 2px dashed #d0a8be;
          border-radius: 16px;
          background: #fdf7fb;
          padding: 28px 20px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          position: relative;
        }
        .es-dropzone.drag-over {
          border-color: #8B1D5A;
          background: #faf0f6;
        }
        .es-dropzone-icon {
          font-size: 2.2rem;
          color: #c9a0bd;
          margin-bottom: 8px;
          display: block;
        }
        .es-dropzone-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: #59123B;
          margin-bottom: 3px;
        }
        .es-dropzone-sub { font-size: 0.78rem; color: #a0aec0; }
        .es-dropzone-btn {
          display: inline-block;
          margin-top: 10px;
          background: #59123B;
          color: #EDB139;
          padding: 7px 16px;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 600;
        }

        /* New image preview inside drop zone */
        .es-img-preview {
          position: relative;
          border-radius: 14px;
          overflow: hidden;
          height: 160px;
        }
        .es-img-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .es-img-clear {
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
        .es-img-clear:hover { background: #dc3545; }
        .es-new-badge {
          position: absolute;
          bottom: 10px; left: 10px;
          background: rgba(40,167,69,0.85);
          color: #fff;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 20px;
          letter-spacing: 0.3px;
        }

        /* Submit */
        .es-submit {
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
        .es-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(89,18,59,0.4);
          background: linear-gradient(135deg, #3f0c2a, #59123B);
        }
        .es-submit:disabled { opacity: 0.7; cursor: not-allowed; }
        .es-submit .spin-icon { animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Right preview panel */
        .es-preview-panel {
          display: flex;
          flex-direction: column;
          gap: 20px;
          position: sticky;
          top: 24px;
        }
        .es-preview-card {
          background: #fff;
          border-radius: 22px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          overflow: hidden;
        }
        .es-preview-header {
          padding: 18px 22px;
          border-bottom: 1px solid #f0f0f6;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .es-preview-header-title {
          font-size: 0.88rem;
          font-weight: 700;
          color: #4a5568;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0;
        }
        .es-preview-live-badge {
          margin-left: auto;
          background: #f0fff4;
          color: #28a745;
          border: 1px solid #c3e6cb;
          border-radius: 20px;
          padding: 2px 10px;
          font-size: 0.72rem;
          font-weight: 700;
        }
        .es-preview-img-wrap {
          height: 190px;
          background: #f7f8fc;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #d0a8be;
          flex-direction: column;
          gap: 8px;
          overflow: hidden;
        }
        .es-preview-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .es-preview-body { padding: 20px; }
        .es-preview-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 8px;
          min-height: 28px;
        }
        .es-preview-desc {
          font-size: 0.85rem;
          color: #718096;
          line-height: 1.65;
          min-height: 60px;
        }
        .es-preview-placeholder { color: #d0a8be; font-style: italic; }

        /* Tips card */
        .es-tips-card {
          background: linear-gradient(135deg, #59123B, #3f0c2a);
          border-radius: 22px;
          padding: 22px;
          color: rgba(255,255,255,0.85);
        }
        .es-tips-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Playfair Display', serif;
          font-size: 1rem;
          font-weight: 700;
          color: #EDB139;
          margin-bottom: 14px;
        }
        .es-tips-list {
          list-style: none;
          padding: 0; margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .es-tips-list li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.84rem;
          line-height: 1.5;
        }
        .es-tips-dot {
          width: 6px; height: 6px;
          background: #EDB139;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 6px;
        }
      `}</style>

      <div className="es-page">
        {/* Back button */}
        <button className="es-back" onClick={() => navigate("/Success/Success-Stories")}>
          <FaArrowLeft /> Back to Stories
        </button>

        <div className="es-layout">
          {/* ── Left: Form ── */}
          <div className="es-card">
            <div className="es-card-header">
              <div className="es-header-icon-wrap">
                <FaEdit />
              </div>
              <div>
                <h3 className="es-card-title">Edit Success Story</h3>
                <p className="es-card-sub">Update the details of this love story</p>
              </div>
            </div>
            <div className="es-card-body">
              <form onSubmit={handleSubmit} noValidate>
                {/* Title */}
                <div className="es-field">
                  <label className="es-label">
                    <FaPen className="es-label-icon" /> Story Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    className="es-input"
                    placeholder="e.g. Priya & Rajat's Beautiful Journey"
                    value={formData.title}
                    onChange={handleChange}
                    maxLength={80}
                    required
                  />
                </div>

                {/* Description */}
                <div className="es-field">
                  <label className="es-label">
                    <FaAlignLeft className="es-label-icon" /> Description
                  </label>
                  <textarea
                    name="description"
                    className="es-textarea"
                    placeholder="Tell their story… how they met, their journey to love…"
                    value={formData.description}
                    onChange={(e) => {
                      if (e.target.value.length <= charLimit) handleChange(e);
                    }}
                    required
                  />
                  <div className={`es-char-counter ${descLen > charLimit * 0.85 ? "warn" : "ok"}`}>
                    {descLen} / {charLimit}
                  </div>
                </div>

                {/* Image Upload */}
                <div className="es-field">
                  <label className="es-label">
                    <FaImage className="es-label-icon" /> Cover Image
                  </label>

                  {/* Show current image from DB */}
                  {currentImage && !newPreview && (
                    <div className="es-current-img">
                      <img
                        src={resolveImage(currentImage)}
                        alt="Current cover"
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                      <span className="es-current-label">Current Image</span>
                    </div>
                  )}

                  {/* New image preview after selecting */}
                  {newPreview ? (
                    <div className="es-img-preview">
                      <img src={newPreview} alt="New Preview" />
                      <button type="button" className="es-img-clear" onClick={clearNewImage}>
                        <FaTimes />
                      </button>
                      <span className="es-new-badge">NEW</span>
                    </div>
                  ) : (
                    <div
                      className={`es-dropzone ${dragOver ? "drag-over" : ""}`}
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
                      <FaCloudUploadAlt className="es-dropzone-icon" />
                      <div className="es-dropzone-title">
                        {dragOver ? "Drop it here!" : currentImage ? "Replace image (optional)" : "Drag & drop or click to upload"}
                      </div>
                      <div className="es-dropzone-sub">PNG, JPG, WEBP — max 5 MB</div>
                      <span className="es-dropzone-btn">Browse File</span>
                    </div>
                  )}
                </div>

                {/* Submit */}
                <button type="submit" className="es-submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <FaHeart className="spin-icon" /> Updating Story…
                    </>
                  ) : (
                    <>
                      <FaCheckCircle /> Save Changes
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* ── Right: Preview + Tips ── */}
          <div className="es-preview-panel">
            {/* Live Preview Card */}
            <div className="es-preview-card">
              <div className="es-preview-header">
                <FaEye style={{ color: "#8B1D5A" }} />
                <p className="es-preview-header-title">Live Preview</p>
                <span className="es-preview-live-badge">LIVE</span>
              </div>
              <div className="es-preview-img-wrap">
                {previewImage ? (
                  <img src={previewImage} alt="Cover preview" onError={(e) => { e.target.style.display = "none"; }} />
                ) : (
                  <>
                    <FaImage style={{ fontSize: "2.5rem" }} />
                    <span style={{ fontSize: "0.82rem" }}>Cover image appears here</span>
                  </>
                )}
              </div>
              <div className="es-preview-body">
                <div className="es-preview-title">
                  {formData.title || (
                    <span className="es-preview-placeholder">Story title…</span>
                  )}
                </div>
                <div className="es-preview-desc">
                  {formData.description || (
                    <span className="es-preview-placeholder">
                      Your description will appear here…
                    </span>
                  )}
                </div>
                {(formData.title || formData.description || previewImage) && (
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
            <div className="es-tips-card">
              <div className="es-tips-title">
                <FaHeart style={{ animation: "heartPulse 1.8s ease-in-out infinite" }} />
                Tips for Editing
              </div>
              <ul className="es-tips-list">
                <li>
                  <span className="es-tips-dot" />
                  Leave the image field empty to keep the existing cover photo.
                </li>
                <li>
                  <span className="es-tips-dot" />
                  You can upload a new image to replace the current one.
                </li>
                <li>
                  <span className="es-tips-dot" />
                  Keep the title short and memorable — under 60 characters.
                </li>
                <li>
                  <span className="es-tips-dot" />
                  Keep the description authentic — real stories inspire others.
                </li>
                <li>
                  <span className="es-tips-dot" />
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

// heartPulse keyframe for tips card
const style = document.createElement("style");
style.textContent = `
  @keyframes heartPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.18); }
  }
`;
document.head.appendChild(style);

export default EditStory;
