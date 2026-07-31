import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaSave, FaBook, FaWindowMaximize, FaStar } from "react-icons/fa";

const ManageStoriesCMS = () => {
  const Base_url = (process.env.REACT_APP_BASE_URL || "http://localhost:5000/admin").replace(/\/$/, "");
  const getToken = () => localStorage.getItem("adminAuthToken");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    heroSupertitle: "Real Love Stories",
    heroTitle: "Where Tradition Meets <br/> True Love.",
    heroDescription: "Discover how our exclusive matchmaking has helped countless couples build a beautiful legacy together. Your forever begins right here.",
    vvipTitle: "VVIP Services for Ultimate Discretion",
    vvipDescription: "For those seeking an even more exclusive experience, our VVIP membership provides a personal matchmaking manager, access to non-listed profiles, and personalized introductions.",
    vvipButtonText: "Join the Rajput Legacy"
  });

  useEffect(() => {
    fetchStoriesCMS();
  }, []);

  const fetchStoriesCMS = async () => {
    try {
      const { data } = await axios.get(`${Base_url}/stories-cms`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (data.success && data.data) {
        const d = data.data;
        setFormData({
          heroSupertitle: d.heroSupertitle || "",
          heroTitle: d.heroTitle || "",
          heroDescription: d.heroDescription || "",
          vvipTitle: d.vvipTitle || "",
          vvipDescription: d.vvipDescription || "",
          vvipButtonText: d.vvipButtonText || "",
        });
      }
    } catch (error) {
      console.error("Error fetching Stories CMS:", error);
      toast.error("Failed to load Stories CMS data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data } = await axios.post(`${Base_url}/stories-cms`, formData, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (data.success) {
        toast.success(data.message || "Stories page content updated!");
        fetchStoriesCMS();
      } else {
        toast.error(data.message || "Failed to update Stories page");
      }
    } catch (error) {
      console.error("Error saving Stories CMS:", error);
      toast.error(error.response?.data?.message || "Server error while updating");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="d-flex flex-column align-items-center justify-content-center py-5" style={{ minHeight: "60vh" }}>
          <div className="spinner-border text-warning" role="status" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading Stories Page CMS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="container-fluid px-3 py-4">
        {/* Header Banner */}
        <div className="card border-0 mb-4 shadow-sm" style={{ background: "linear-gradient(135deg, #59123B 0%, #8B1D5A 50%, #3f0c2a 100%)", borderRadius: "16px", color: "#fff" }}>
          <div className="card-body p-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h3 className="mb-1 fw-bold" style={{ color: "#EDB139", fontFamily: "'Playfair Display', serif" }}>
                <FaBook className="me-2" /> Manage Stories Page CMS
              </h3>
              <p className="mb-0 text-white-50 small">Update textual content and headers for the Success Stories page.</p>
            </div>
            <button 
              className="btn px-4 py-2 fw-semibold" 
              style={{ background: "#EDB139", color: "#59123B", border: "none", borderRadius: "10px", boxShadow: "0 4px 12px rgba(237, 177, 57, 0.3)" }}
              onClick={handleSubmit} 
              disabled={submitting}
            >
              {submitting ? (
                <><span className="spinner-border spinner-border-sm me-2" /> Saving...</>
              ) : (
                <><FaSave className="me-2" /> Save Changes</>
              )}
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            
            {/* Hero Section Card */}
            <div className="card shadow-sm mb-4 border-0" style={{ borderRadius: "14px" }}>
              <div className="card-header bg-white border-bottom-0 pt-4 pb-0 px-4">
                <h5 className="mb-0 fw-bold" style={{ color: "#59123B" }}>
                  <FaWindowMaximize className="me-2 text-warning" /> Hero Section
                </h5>
              </div>
              <div className="card-body p-4">
                <div className="row g-4">
                  <div className="col-md-12">
                    <label className="form-label fw-semibold text-secondary small">Hero Super Title (Badge)</label>
                    <input
                      type="text"
                      className="form-control"
                      name="heroSupertitle"
                      value={formData.heroSupertitle}
                      onChange={handleInputChange}
                      placeholder="e.g. Real Love Stories"
                    />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label fw-semibold text-secondary small">Hero Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="heroTitle"
                      value={formData.heroTitle}
                      onChange={handleInputChange}
                      placeholder="e.g. Where Tradition Meets <br/> True Love."
                    />
                    <small className="text-muted">Use &lt;br/&gt; for line breaks.</small>
                  </div>
                  <div className="col-md-12">
                    <label className="form-label fw-semibold text-secondary small">Hero Description</label>
                    <textarea
                      className="form-control"
                      name="heroDescription"
                      rows="3"
                      value={formData.heroDescription}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* VVIP Section Card */}
            <div className="card shadow-sm mb-4 border-0" style={{ borderRadius: "14px" }}>
              <div className="card-header bg-white border-bottom-0 pt-4 pb-0 px-4">
                <h5 className="mb-0 fw-bold" style={{ color: "#59123B" }}>
                  <FaStar className="me-2 text-warning" /> VVIP Section
                </h5>
              </div>
              <div className="card-body p-4">
                <div className="row g-4">
                  <div className="col-md-12">
                    <label className="form-label fw-semibold text-secondary small">VVIP Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="vvipTitle"
                      value={formData.vvipTitle}
                      onChange={handleInputChange}
                      placeholder="e.g. VVIP Services for Ultimate Discretion"
                    />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label fw-semibold text-secondary small">VVIP Description</label>
                    <textarea
                      className="form-control"
                      name="vvipDescription"
                      rows="3"
                      value={formData.vvipDescription}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-secondary small">VVIP Button Text</label>
                    <input
                      type="text"
                      className="form-control"
                      name="vvipButtonText"
                      value={formData.vvipButtonText}
                      onChange={handleInputChange}
                      placeholder="e.g. Join the Rajput Legacy"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageStoriesCMS;
