import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaInfoCircle,
  FaSave,
  FaCloudUploadAlt,
  FaPlus,
  FaTrash,
  FaImage,
  FaHeading,
  FaParagraph,
  FaCrown
} from "react-icons/fa";

const ManageAboutUs = () => {
  const Base_url = (process.env.REACT_APP_BASE_URL || "http://localhost:5000/admin").replace(/\/$/, "");
  const backendOrigin = Base_url ? Base_url.replace(/\/admin.*$/, "") : "";

  const getImageSrc = (imagePath) => {
    if (!imagePath) return "";
    if (typeof imagePath !== "string") return "";
    if (imagePath.startsWith("data:") || imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    const cleanPath = imagePath.replace(/\\/g, "/");
    const formattedPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
    return `${backendOrigin}${formattedPath}`;
  };

  const { fetchUserData } = useAuth();
  const getToken = () => localStorage.getItem("adminAuthToken");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form Text Fields State
  const [formData, setFormData] = useState({
    heroSubtitle: "Who We Are",
    heroTitleLine1: "Celebrating Rajput Legacy,",
    heroTitleLine2: "Connecting Hearts",
    heroDescription: "Dedicated to uniting Rajput families through meaningful matches, we honor tradition while embracing modern connections.",
    
    card1Text: "Welcome to Rajput Matches, the premier matrimonial platform designed exclusively for the Rajput community. Our mission is to bring together Rajput families from across the globe and help them build meaningful connections rooted in shared values, traditions, and cultural heritage.",
    card2Text: "At Rajput Matches, we understand the importance of preserving Rajput pride and customs, which is why we’ve created a trusted platform tailored specifically to your community's unique needs.",
    
    legacyTitle: "Our Legacy of Trust and Tradition",
    legacyParagraph1: "The Rajput community has a long-standing legacy of honor, pride, and cultural richness. At Rajput Matches, we aim to reflect these values by fostering a trustworthy environment where families can come together to find the perfect match.",
    legacyParagraph2: "We believe that marriage is not just a union of two individuals but a bond between two families. With this philosophy, we ensure that every match we facilitate is built on shared respect and understanding.",
    
    whyChooseHeading: "Why Choose Rajput Matches?",
    
    vvipTitle: "Start Your Journey to a Royal Match Today",
    vvipDescription: "Join Rajput Matches and embark on a journey to find your perfect partner within a community that respects your legacy and honors your privacy. Let us guide you in finding a partner who complements your values, lifestyle, and heritage.",
    vvipButtonText: "Join the Rajput Legacy"
  });

  // Features List State
  const [features, setFeatures] = useState([
    {
      title: "Exclusively for the Rajput Community",
      description: "Our platform is tailored to the needs and preferences of Rajput families, making it easier to find matches within the community."
    },
    {
      title: "Verified Profiles",
      description: "We prioritize your safety by ensuring every profile is thoroughly verified."
    },
    {
      title: "Advanced Matchmaking",
      description: "Our platform suggests compatible matches based on your preferences, including education, profession, lifestyle, and values."
    },
    {
      title: "Respect for Traditions",
      description: "We understand the importance of Rajput customs and ensure they are honored throughout the matchmaking process."
    },
    {
      title: "Dedicated Support",
      description: "Our team is here to assist you at every step, ensuring a seamless experience."
    }
  ]);

  // Image Files & Previews State
  const [images, setImages] = useState({
    heroImage: null,
    card1Image: null,
    card2Image: null,
    bannerImage: null,
    legacyLeftImage: null,
    legacyRightImage: null,
    whyChooseImage: null
  });

  const [previews, setPreviews] = useState({
    heroImage: "",
    card1Image: "",
    card2Image: "",
    bannerImage: "",
    legacyLeftImage: "",
    legacyRightImage: "",
    whyChooseImage: ""
  });

  // Fetch Existing Content
  const fetchAboutContent = async () => {
    setLoading(true);
    try {
      const data = await fetchUserData("about-page");
      const about = data?.data || data;
      if (about) {
        setFormData({
          heroSubtitle: about.heroSubtitle || "Who We Are",
          heroTitleLine1: about.heroTitleLine1 || "Celebrating Rajput Legacy,",
          heroTitleLine2: about.heroTitleLine2 || "Connecting Hearts",
          heroDescription: about.heroDescription || "",

          card1Text: about.card1Text || "",
          card2Text: about.card2Text || "",

          legacyTitle: about.legacyTitle || "Our Legacy of Trust and Tradition",
          legacyParagraph1: about.legacyParagraph1 || "",
          legacyParagraph2: about.legacyParagraph2 || "",

          whyChooseHeading: about.whyChooseHeading || "Why Choose Rajput Matches?",

          vvipTitle: about.vvipTitle || "Start Your Journey to a Royal Match Today",
          vvipDescription: about.vvipDescription || "",
          vvipButtonText: about.vvipButtonText || "Join the Rajput Legacy"
        });

        if (about.whyChooseFeatures && Array.isArray(about.whyChooseFeatures)) {
          setFeatures(about.whyChooseFeatures);
        }

        setPreviews({
          heroImage: getImageSrc(about.heroImage),
          card1Image: getImageSrc(about.card1Image),
          card2Image: getImageSrc(about.card2Image),
          bannerImage: getImageSrc(about.bannerImage),
          legacyLeftImage: getImageSrc(about.legacyLeftImage),
          legacyRightImage: getImageSrc(about.legacyRightImage),
          whyChooseImage: getImageSrc(about.whyChooseImage)
        });
      }
    } catch (error) {
      console.error("Error fetching About page content:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutContent();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Input Change Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Image Upload Handlers
  const handleImageFile = (fieldName, file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be under 5 MB.");
      return;
    }

    setImages((prev) => ({ ...prev, [fieldName]: file }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviews((prev) => ({ ...prev, [fieldName]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Feature List Handlers
  const handleFeatureChange = (index, field, value) => {
    setFeatures((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const addFeature = () => {
    setFeatures((prev) => [
      ...prev,
      { title: "New Feature", description: "Feature description goes here..." }
    ]);
  };

  const removeFeature = (index) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = getToken();
      const fd = new FormData();

      // Append text fields
      Object.keys(formData).forEach((key) => {
        fd.append(key, formData[key]);
      });

      // Append features JSON
      fd.append("whyChooseFeatures", JSON.stringify(features));

      // Append image files if selected
      Object.keys(images).forEach((key) => {
        if (images[key]) {
          fd.append(key, images[key]);
        }
      });

      const res = await axios.post(`${Base_url}/about-page`, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      if (res.data?.success) {
        toast.success("About page content updated successfully!");
        fetchAboutContent();
      } else {
        toast.error(res.data?.message || "Failed to update content.");
      }
    } catch (error) {
      console.error("Error submitting About page form:", error);
      toast.error(error.response?.data?.message || "Failed to save changes.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="d-flex flex-column align-items-center justify-content-center py-5">
          <div className="spinner-border text-warning" role="status" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading About Page Settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <style>{`
        .ab-page {
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          background: #f7f8fc;
          padding: 28px 24px;
        }
        .ab-hero {
          background: linear-gradient(135deg, #59123B 0%, #8B1D5A 50%, #3f0c2a 100%);
          border-radius: 20px;
          padding: 32px 36px;
          margin-bottom: 28px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(89,18,59,0.25);
        }
        .ab-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 700;
          color: #EDB139;
          margin: 0 0 6px 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .ab-hero-sub {
          color: rgba(255,255,255,0.7);
          font-size: 0.95rem;
          margin: 0;
        }

        .ab-section-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 24px 28px;
          margin-bottom: 24px;
          box-shadow: 0 4px 18px rgba(0,0,0,0.04);
          border: 1px solid rgba(212, 175, 55, 0.2);
        }
        .ab-section-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: #59123B;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #f0e6ed;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .ab-label {
          font-weight: 600;
          color: #334155;
          font-size: 0.9rem;
          margin-bottom: 6px;
          display: block;
        }
        .ab-input, .ab-textarea {
          width: 100%;
          padding: 10px 14px;
          border: 1.5px solid #cbd5e1;
          border-radius: 10px;
          font-size: 0.92rem;
          color: #1e293b;
          background: #ffffff;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .ab-input:focus, .ab-textarea:focus {
          border-color: #8B1D5A;
          box-shadow: 0 0 0 3px rgba(139,29,90,0.12);
        }

        .ab-img-upload-box {
          border: 2px dashed #cbd5e1;
          border-radius: 12px;
          padding: 16px;
          background: #f8fafc;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .ab-img-upload-box:hover {
          border-color: #8B1D5A;
          background: #faf0f6;
        }
        .ab-img-preview {
          max-height: 140px;
          width: auto;
          object-fit: cover;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
        }

        .ab-feature-item {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 12px;
          position: relative;
        }

        .ab-submit-bar {
          position: sticky;
          bottom: 20px;
          z-index: 100;
          background: #ffffff;
          padding: 16px 24px;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          border: 2px solid #EDB139;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .ab-save-btn {
          background: linear-gradient(135deg, #59123B, #8B1D5A);
          color: #ffffff;
          font-weight: 700;
          padding: 12px 32px;
          border-radius: 12px;
          border: none;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 4px 15px rgba(89,18,59,0.3);
          transition: all 0.2s;
        }
        .ab-save-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(89,18,59,0.4);
          color: #EDB139;
        }
      `}</style>

      <div className="ab-page">
        {/* Header Hero Banner */}
        <div className="ab-hero">
          <h1 className="ab-hero-title">
            <FaInfoCircle color="#EDB139" /> Manage About Us Page Content
          </h1>
          <p className="ab-hero-sub">
            Customize all texts, titles, descriptions, and uploaded images displayed on the frontend About Us page.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Section 1: Hero Section */}
          <div className="ab-section-card">
            <div className="ab-section-title">
              <FaHeading /> 1. Hero Section Content
            </div>

            <div className="row g-3">
              <div className="col-12 col-md-4">
                <label className="ab-label">Hero Subtitle</label>
                <input
                  type="text"
                  className="ab-input"
                  name="heroSubtitle"
                  value={formData.heroSubtitle}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-12 col-md-4">
                <label className="ab-label">Hero Title Line 1</label>
                <input
                  type="text"
                  className="ab-input"
                  name="heroTitleLine1"
                  value={formData.heroTitleLine1}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-12 col-md-4">
                <label className="ab-label">Hero Title Line 2 (Highlighted)</label>
                <input
                  type="text"
                  className="ab-input"
                  name="heroTitleLine2"
                  value={formData.heroTitleLine2}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-12">
                <label className="ab-label">Hero Description</label>
                <textarea
                  className="ab-textarea"
                  rows="3"
                  name="heroDescription"
                  value={formData.heroDescription}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-12">
                <label className="ab-label">Hero Background Image</label>
                <div className="ab-img-upload-box" onClick={() => document.getElementById("heroImgInput").click()}>
                  {previews.heroImage ? (
                    <div>
                      <img src={previews.heroImage} alt="Hero Preview" className="ab-img-preview mb-2" />
                      <p className="text-success small mb-0"><FaCloudUploadAlt /> Click to change Hero image</p>
                    </div>
                  ) : (
                    <div>
                      <FaCloudUploadAlt size={32} className="text-secondary mb-2" />
                      <p className="ab-label mb-1">Upload Hero Background Image</p>
                      <span className="text-muted small">PNG, JPG, JPEG up to 5MB</span>
                    </div>
                  )}
                  <input
                    id="heroImgInput"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleImageFile("heroImage", e.target.files[0])}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Story Cards */}
          <div className="ab-section-card">
            <div className="ab-section-title">
              <FaParagraph /> 2. Story Cards (Top Grid)
            </div>

            <div className="row g-4">
              {/* Card 1 */}
              <div className="col-12 col-md-6">
                <div className="p-3 border rounded-3 bg-light">
                  <h6 className="fw-bold mb-3 style-maroon">Story Card 1</h6>
                  <div className="mb-3">
                    <label className="ab-label">Card 1 Description Text</label>
                    <textarea
                      className="ab-textarea"
                      rows="4"
                      name="card1Text"
                      value={formData.card1Text}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="ab-label">Card 1 Image</label>
                    <div className="ab-img-upload-box" onClick={() => document.getElementById("card1ImgInput").click()}>
                      {previews.card1Image ? (
                        <div>
                          <img src={previews.card1Image} alt="Card 1 Preview" className="ab-img-preview mb-2" />
                          <p className="text-success small mb-0"><FaCloudUploadAlt /> Click to change Card 1 image</p>
                        </div>
                      ) : (
                        <div>
                          <FaCloudUploadAlt size={28} className="text-secondary mb-1" />
                          <p className="small mb-0">Upload Card 1 Image</p>
                        </div>
                      )}
                      <input
                        id="card1ImgInput"
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => handleImageFile("card1Image", e.target.files[0])}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="col-12 col-md-6">
                <div className="p-3 border rounded-3 bg-light">
                  <h6 className="fw-bold mb-3 style-maroon">Story Card 2</h6>
                  <div className="mb-3">
                    <label className="ab-label">Card 2 Description Text</label>
                    <textarea
                      className="ab-textarea"
                      rows="4"
                      name="card2Text"
                      value={formData.card2Text}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="ab-label">Card 2 Image</label>
                    <div className="ab-img-upload-box" onClick={() => document.getElementById("card2ImgInput").click()}>
                      {previews.card2Image ? (
                        <div>
                          <img src={previews.card2Image} alt="Card 2 Preview" className="ab-img-preview mb-2" />
                          <p className="text-success small mb-0"><FaCloudUploadAlt /> Click to change Card 2 image</p>
                        </div>
                      ) : (
                        <div>
                          <FaCloudUploadAlt size={28} className="text-secondary mb-1" />
                          <p className="small mb-0">Upload Card 2 Image</p>
                        </div>
                      )}
                      <input
                        id="card2ImgInput"
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => handleImageFile("card2Image", e.target.files[0])}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Join Banner Image */}
          <div className="ab-section-card">
            <div className="ab-section-title">
              <FaImage /> 3. Join Features Banner Image
            </div>
            <div>
              <label className="ab-label">Middle Banner Image</label>
              <div className="ab-img-upload-box" onClick={() => document.getElementById("bannerImgInput").click()}>
                {previews.bannerImage ? (
                  <div>
                    <img src={previews.bannerImage} alt="Banner Preview" className="ab-img-preview mb-2" />
                    <p className="text-success small mb-0"><FaCloudUploadAlt /> Click to change Banner image</p>
                  </div>
                ) : (
                  <div>
                    <FaCloudUploadAlt size={28} className="text-secondary mb-1" />
                    <p className="small mb-0">Upload Join Banner Image</p>
                  </div>
                )}
                <input
                  id="bannerImgInput"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => handleImageFile("bannerImage", e.target.files[0])}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Legacy Section */}
          <div className="ab-section-card">
            <div className="ab-section-title">
              <FaCrown /> 4. Legacy Section Content
            </div>

            <div className="row g-3">
              <div className="col-12">
                <label className="ab-label">Legacy Title</label>
                <input
                  type="text"
                  className="ab-input"
                  name="legacyTitle"
                  value={formData.legacyTitle}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="ab-label">Paragraph 1</label>
                <textarea
                  className="ab-textarea"
                  rows="3"
                  name="legacyParagraph1"
                  value={formData.legacyParagraph1}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="ab-label">Paragraph 2</label>
                <textarea
                  className="ab-textarea"
                  rows="3"
                  name="legacyParagraph2"
                  value={formData.legacyParagraph2}
                  onChange={handleInputChange}
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="ab-label">Legacy Left Image</label>
                <div className="ab-img-upload-box" onClick={() => document.getElementById("legacyLeftImgInput").click()}>
                  {previews.legacyLeftImage ? (
                    <div>
                      <img src={previews.legacyLeftImage} alt="Legacy Left Preview" className="ab-img-preview mb-2" />
                      <p className="text-success small mb-0"><FaCloudUploadAlt /> Click to change Left image</p>
                    </div>
                  ) : (
                    <div>
                      <FaCloudUploadAlt size={28} className="text-secondary mb-1" />
                      <p className="small mb-0">Upload Legacy Left Image</p>
                    </div>
                  )}
                  <input
                    id="legacyLeftImgInput"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleImageFile("legacyLeftImage", e.target.files[0])}
                  />
                </div>
              </div>

              <div className="col-12 col-md-6">
                <label className="ab-label">Legacy Right Image</label>
                <div className="ab-img-upload-box" onClick={() => document.getElementById("legacyRightImgInput").click()}>
                  {previews.legacyRightImage ? (
                    <div>
                      <img src={previews.legacyRightImage} alt="Legacy Right Preview" className="ab-img-preview mb-2" />
                      <p className="text-success small mb-0"><FaCloudUploadAlt /> Click to change Right image</p>
                    </div>
                  ) : (
                    <div>
                      <FaCloudUploadAlt size={28} className="text-secondary mb-1" />
                      <p className="small mb-0">Upload Legacy Right Image</p>
                    </div>
                  )}
                  <input
                    id="legacyRightImgInput"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleImageFile("legacyRightImage", e.target.files[0])}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Why Choose Section */}
          <div className="ab-section-card">
            <div className="ab-section-title">
              <FaInfoCircle /> 5. Why Choose Section &amp; Features List
            </div>

            <div className="row g-3 mb-4">
              <div className="col-12 col-md-6">
                <label className="ab-label">Why Choose Section Heading</label>
                <input
                  type="text"
                  className="ab-input"
                  name="whyChooseHeading"
                  value={formData.whyChooseHeading}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="ab-label">Why Choose Main Image</label>
                <div className="ab-img-upload-box" onClick={() => document.getElementById("whyChooseImgInput").click()}>
                  {previews.whyChooseImage ? (
                    <div>
                      <img src={previews.whyChooseImage} alt="Why Choose Preview" className="ab-img-preview mb-2" />
                      <p className="text-success small mb-0"><FaCloudUploadAlt /> Click to change Why Choose image</p>
                    </div>
                  ) : (
                    <div>
                      <FaCloudUploadAlt size={28} className="text-secondary mb-1" />
                      <p className="small mb-0">Upload Why Choose Main Image</p>
                    </div>
                  )}
                  <input
                    id="whyChooseImgInput"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleImageFile("whyChooseImage", e.target.files[0])}
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Features List */}
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="fw-bold mb-0 text-dark">Why Choose Feature Items ({features.length})</h6>
              <button
                type="button"
                className="btn btn-sm btn-outline-success d-flex align-items-center gap-1"
                onClick={addFeature}
              >
                <FaPlus /> Add New Feature Item
              </button>
            </div>

            {features.map((feature, idx) => (
              <div key={idx} className="ab-feature-item">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="badge bg-warning text-dark fw-bold">Feature #{idx + 1}</span>
                  {features.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger py-0 px-2"
                      onClick={() => removeFeature(idx)}
                      title="Remove feature item"
                    >
                      <FaTrash size={12} /> Remove
                    </button>
                  )}
                </div>
                <div className="row g-2">
                  <div className="col-12 col-md-5">
                    <label className="ab-label">Feature Title</label>
                    <input
                      type="text"
                      className="ab-input"
                      value={feature.title}
                      onChange={(e) => handleFeatureChange(idx, "title", e.target.value)}
                    />
                  </div>
                  <div className="col-12 col-md-7">
                    <label className="ab-label">Feature Description</label>
                    <input
                      type="text"
                      className="ab-input"
                      value={feature.description}
                      onChange={(e) => handleFeatureChange(idx, "description", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section 6: VVIP CTA Section */}
          <div className="ab-section-card mb-5">
            <div className="ab-section-title">
              <FaCrown /> 6. VVIP Call to Action Card Section
            </div>

            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="ab-label">VVIP Title</label>
                <input
                  type="text"
                  className="ab-input"
                  name="vvipTitle"
                  value={formData.vvipTitle}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="ab-label">Button Text</label>
                <input
                  type="text"
                  className="ab-input"
                  name="vvipButtonText"
                  value={formData.vvipButtonText}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-12">
                <label className="ab-label">VVIP Description</label>
                <textarea
                  className="ab-textarea"
                  rows="3"
                  name="vvipDescription"
                  value={formData.vvipDescription}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Sticky Bottom Save Bar */}
          <div className="ab-submit-bar">
            <div>
              <span className="fw-bold text-dark me-2">Ready to apply changes?</span>
              <span className="text-muted small">All text &amp; images will instantly update on the About Us page.</span>
            </div>
            <button
              type="submit"
              className="ab-save-btn"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Saving Changes...
                </>
              ) : (
                <>
                  <FaSave /> Save All About Page Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageAboutUs;
