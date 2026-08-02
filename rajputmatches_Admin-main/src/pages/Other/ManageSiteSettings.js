import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaSave, FaGlobe, FaImage, FaFont, FaCopyright } from "react-icons/fa";

const ManageSiteSettings = () => {
  const Base_url = (process.env.REACT_APP_BASE_URL || "http://localhost:5000/admin").replace(/\/$/, "");
  const backendOrigin = Base_url ? Base_url.replace(/\/admin.*$/, "") : "";

  const getToken = () => localStorage.getItem("adminAuthToken");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    companyName: "Rajput Alliances",
    tagline: "Royal Matrimonial",
    logo: "",
    copyrightText: "© 2025-26 Rajput Alliances Matrimony. All Rights Reserved.",
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");

  const getLogoSrc = (p) => {
    if (!p) return "";
    if (typeof p !== "string") return "";
    if (p.startsWith("data:") || p.startsWith("http://") || p.startsWith("https://")) return p;
    const cleanPath = p.replace(/\\/g, "/");
    const formattedPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
    return `${backendOrigin}${formattedPath}`;
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${Base_url}/site-settings`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.data?.success && res.data?.data) {
        const d = res.data.data;
        setForm({
          companyName: d.companyName || "",
          tagline: d.tagline || "",
          logo: d.logo || "",
          copyrightText: d.copyrightText || "",
        });
        if (d.logo) {
          setLogoPreview(getLogoSrc(d.logo));
        }
      }
    } catch (e) {
      console.error("Error loading site settings:", e);
      toast.error("Failed to load Site Settings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const fd = new FormData();
      fd.append("companyName", form.companyName);
      fd.append("tagline", form.tagline);
      fd.append("copyrightText", form.copyrightText);
      if (logoFile) {
        fd.append("logo", logoFile);
      }

      const res = await axios.post(`${Base_url}/site-settings`, fd, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data?.success) {
        toast.success("Site Branding & Logo updated successfully!");
        if (res.data.data) {
          const d = res.data.data;
          setForm((prev) => ({ ...prev, ...d }));
          if (d.logo) setLogoPreview(getLogoSrc(d.logo));
        }
      } else {
        toast.error(res.data?.message || "Update failed");
      }
    } catch (err) {
      toast.error("Error saving: " + (err.response?.data?.message || err.message));
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
          <p className="mt-3 text-muted">Loading Site Settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="container-fluid px-3 py-4">
        {/* Header Banner */}
        <div
          className="card border-0 mb-4 shadow-sm"
          style={{
            background: "linear-gradient(135deg, #59123B 0%, #8B1D5A 50%, #3f0c2a 100%)",
            borderRadius: "16px",
            color: "#fff",
          }}
        >
          <div className="card-body p-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h3 className="mb-1 fw-bold" style={{ color: "#EDB139", fontFamily: "'Playfair Display', serif" }}>
                <FaGlobe className="me-2" /> Site Branding &amp; Logo Settings
              </h3>
              <p className="mb-0 text-white-50 small">
                Dynamically manage the Website Logo, Company Name, Tagline, and Copyright Text.
              </p>
            </div>
            <button
              className="btn px-4 py-2 fw-semibold"
              style={{
                background: "#EDB139",
                color: "#59123B",
                border: "none",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(237, 177, 57, 0.3)",
              }}
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

        <div className="row g-4">
          {/* Logo Upload Card */}
          <div className="col-lg-5">
            <div className="card shadow-sm border-0 h-100" style={{ borderRadius: "14px" }}>
              <div className="card-header bg-white border-bottom-0 pt-4 pb-0 px-4">
                <h5 className="mb-0 fw-bold" style={{ color: "#59123B" }}>
                  <FaImage className="me-2 text-warning" /> Website Logo
                </h5>
              </div>
              <div className="card-body p-4 text-center d-flex flex-column justify-content-between">
                <div className="mb-3">
                  <div
                    style={{
                      width: "100%",
                      minHeight: "180px",
                      background: "#f8f9fa",
                      border: "2px dashed #dee2e6",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "20px",
                      marginBottom: "15px",
                    }}
                  >
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo Preview"
                        style={{ maxHeight: "140px", maxWidth: "100%", objectFit: "contain" }}
                      />
                    ) : (
                      <span className="text-muted small">No custom logo uploaded yet. (Default asset will be used)</span>
                    )}
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    id="logoInput"
                    className="d-none"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="logoInput"
                    className="btn btn-outline-primary px-4 rounded-pill fw-semibold"
                    style={{ cursor: "pointer" }}
                  >
                    <FaImage className="me-2" /> Upload New Logo
                  </label>
                </div>

                <small className="text-muted">
                  Recommended Format: PNG / Transparent SVG or WebP. Max height: 120px.
                </small>
              </div>
            </div>
          </div>

          {/* Text Settings Card */}
          <div className="col-lg-7">
            <div className="card shadow-sm border-0 h-100" style={{ borderRadius: "14px" }}>
              <div className="card-header bg-white border-bottom-0 pt-4 pb-0 px-4">
                <h5 className="mb-0 fw-bold" style={{ color: "#59123B" }}>
                  <FaFont className="me-2 text-warning" /> Company &amp; Branding Details
                </h5>
              </div>
              <div className="card-body p-4">
                <div className="row g-4">
                  <div className="col-md-12">
                    <label className="form-label fw-semibold text-secondary small">Company / Brand Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="companyName"
                      value={form.companyName}
                      onChange={handleChange}
                      placeholder="e.g. Rajput Alliances"
                    />
                  </div>

                  <div className="col-md-12">
                    <label className="form-label fw-semibold text-secondary small">Tagline / Subtitle</label>
                    <input
                      type="text"
                      className="form-control"
                      name="tagline"
                      value={form.tagline}
                      onChange={handleChange}
                      placeholder="e.g. Royal Matrimonial"
                    />
                  </div>

                  <div className="col-md-12">
                    <label className="form-label fw-semibold text-secondary small">
                      <FaCopyright className="me-1" /> Footer Copyright Text
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="copyrightText"
                      value={form.copyrightText}
                      onChange={handleChange}
                      placeholder="e.g. © 2025-26 Rajput Alliances Matrimony. All Rights Reserved."
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

export default ManageSiteSettings;
