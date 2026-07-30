import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import {
  FaFacebook, FaInstagram, FaWhatsapp, FaTelegram,
  FaYoutube, FaTwitter, FaLinkedin, FaPhone, FaEnvelope, FaSave, FaShareAlt
} from "react-icons/fa";

const SocialLinks = () => {
  const { fetchUserData, updateData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    facebook: "",
    instagram: "",
    whatsapp: "",
    telegram: "",
    youtube: "",
    twitter: "",
    linkedin: "",
    phone: "",
    email: "",
  });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadLinks = async () => {
    try {
      setLoading(true);
      const res = await fetchUserData("social-links");
      if (res?.links) {
        setFormData({
          facebook:  res.links.facebook  || "",
          instagram: res.links.instagram || "",
          whatsapp:  res.links.whatsapp  || "",
          telegram:  res.links.telegram  || "",
          youtube:   res.links.youtube   || "",
          twitter:   res.links.twitter   || "",
          linkedin:  res.links.linkedin  || "",
          phone:     res.links.phone     || "",
          email:     res.links.email     || "",
        });
      }
    } catch (error) {
      console.error("Error loading social links:", error);
      showToast("Failed to load social links.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLinks();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateData("social-links", formData, "PUT");
      showToast("Social Media Links updated successfully!", "success");
    } catch (error) {
      console.error("Error updating social links:", error);
      showToast("Failed to update social links.", "error");
    } finally {
      setSaving(false);
    }
  };

  const fieldConfig = [
    { name: "facebook",  label: "Facebook URL",  icon: <FaFacebook size={18} color="#1877F2" />, placeholder: "https://facebook.com/yourpage" },
    { name: "instagram", label: "Instagram URL", icon: <FaInstagram size={18} color="#E1306C" />, placeholder: "https://instagram.com/yourhandle" },
    { name: "whatsapp",  label: "WhatsApp URL / Phone", icon: <FaWhatsapp size={18} color="#25D366" />, placeholder: "https://wa.me/919999999999" },
    { name: "telegram",  label: "Telegram URL",  icon: <FaTelegram size={18} color="#0088cc" />, placeholder: "https://t.me/yourchannel" },
    { name: "youtube",   label: "YouTube Channel", icon: <FaYoutube size={18} color="#FF0000" />, placeholder: "https://youtube.com/@channel" },
    { name: "twitter",   label: "Twitter / X URL", icon: <FaTwitter size={18} color="#1DA1F2" />, placeholder: "https://x.com/yourhandle" },
    { name: "linkedin",  label: "LinkedIn URL",  icon: <FaLinkedin size={18} color="#0A66C2" />, placeholder: "https://linkedin.com/in/profile" },
    { name: "phone",     label: "Support Phone", icon: <FaPhone size={16} color="#EDB139" />, placeholder: "+91 9999999999" },
    { name: "email",     label: "Support Email", icon: <FaEnvelope size={16} color="#EDB139" />, placeholder: "support@rajputmatches.com" },
  ];

  return (
    <div className="main-content">
      <section className="section">
        <div className="section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1><FaShareAlt style={{ marginRight: 10, color: "#EDB139" }} /> Social Media &amp; Contact Links</h1>
          <div className="section-header-breadcrumb">
            <div className="breadcrumb-item active"><a href="/dashboard">Dashboard</a></div>
            <div className="breadcrumb-item">Attributes</div>
            <div className="breadcrumb-item">Social Links</div>
          </div>
        </div>

        {toast && (
          <div
            className={`alert ${toast.type === "success" ? "alert-success" : "alert-danger"} alert-dismissible show fade`}
            style={{ borderRadius: 10, marginBottom: 20 }}
          >
            {toast.msg}
          </div>
        )}

        <div className="section-body">
          <div className="row">
            <div className="col-12 col-lg-10 offset-lg-1">
              <div
                className="card"
                style={{
                  borderRadius: "16px",
                  borderTop: "4px solid #EDB139",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                }}
              >
                <div className="card-header" style={{ background: "linear-gradient(135deg, #59123B, #3f0c2a)", color: "#fff", borderTopLeftRadius: "12px", borderTopRightRadius: "12px" }}>
                  <h4 style={{ color: "#EDB139", margin: 0, fontSize: "1.15rem" }}>
                    Configure Public Social Media &amp; Support Links
                  </h4>
                </div>

                <div className="card-body p-4">
                  {loading ? (
                    <div style={{ textAlign: "center", padding: "40px 0" }}>
                      <div className="spinner-border text-warning" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                      <p className="mt-2 text-muted">Loading settings...</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        {fieldConfig.map((f) => (
                          <div key={f.name} className="col-12 col-md-6 mb-3">
                            <label style={{ fontWeight: 600, color: "#59123B", fontSize: "0.9rem" }}>
                              {f.label}
                            </label>
                            <div className="input-group">
                              <div className="input-group-prepend">
                                <span className="input-group-text" style={{ background: "#fffdf7", borderColor: "rgba(237,177,57,0.3)" }}>
                                  {f.icon}
                                </span>
                              </div>
                              <input
                                type="text"
                                className="form-control"
                                name={f.name}
                                value={formData[f.name]}
                                onChange={handleChange}
                                placeholder={f.placeholder}
                                style={{ borderColor: "rgba(237,177,57,0.3)", background: "#fffdf7" }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <hr style={{ margin: "24px 0", borderColor: "rgba(237,177,57,0.2)" }} />

                      <div style={{ textAlign: "right" }}>
                        <button
                          type="submit"
                          disabled={saving}
                          className="btn btn-primary btn-lg"
                          style={{
                            background: "linear-gradient(135deg, #59123B, #3f0c2a)",
                            borderColor: "#EDB139",
                            color: "#EDB139",
                            fontWeight: 700,
                            padding: "10px 32px",
                            borderRadius: "30px",
                            boxShadow: "0 4px 14px rgba(89,18,59,0.25)",
                          }}
                        >
                          <FaSave style={{ marginRight: 8 }} />
                          {saving ? "Saving..." : "Save Links"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SocialLinks;
