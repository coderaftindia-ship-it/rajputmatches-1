import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaSave, FaImage, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { MdContactPhone } from "react-icons/md";

const ManageContactCMS = () => {
  const Base_url = (process.env.REACT_APP_BASE_URL || "http://localhost:5000/admin").replace(/\/$/, "");
  const backendOrigin = Base_url ? Base_url.replace(/\/admin.*$/, "") : "";

  const getImageSrc = (p) => {
    if (!p) return "";
    if (p.startsWith("http")) return p;
    return `${backendOrigin}${p}`;
  };

  const getToken = () => localStorage.getItem("adminAuthToken");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    heroSupertitle: "",
    heroTitle: "",
    heroDescription: "",
    heroBgImage: "",
    addressTitle: "",
    addressText: "",
    emailTitle: "",
    email1: "",
    email2: "",
    phoneTitle: "",
    phone1: "",
    phone2: "",
    formHeading: "",
    formSubheading: "",
  });

  const [heroBgFile, setHeroBgFile] = useState(null);
  const [heroBgPreview, setHeroBgPreview] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${Base_url}/contact-cms`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (res.data?.success && res.data?.data) {
          setForm((prev) => ({ ...prev, ...res.data.data }));
        }
      } catch (e) {
        toast.error("Failed to load Contact CMS data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setHeroBgFile(file);
    setHeroBgPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k !== "heroBgImage" && v !== undefined && v !== null) {
          fd.append(k, v);
        }
      });
      if (heroBgFile) fd.append("heroBgImage", heroBgFile);

      const res = await axios.post(`${Base_url}/contact-cms`, fd, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data?.success) {
        toast.success("Contact page updated successfully!");
        if (res.data.data) setForm((prev) => ({ ...prev, ...res.data.data }));
      } else {
        toast.error(res.data?.message || "Update failed");
      }
    } catch (err) {
      toast.error("Error saving: " + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "form-control form-control-sm";
  const labelClass = "form-label fw-semibold text-secondary small mb-1";

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
      <div className="spinner-border text-danger" role="status" />
    </div>
  );

  return (
    <div style={{ padding: "24px", maxWidth: "1000px", margin: "0 auto" }}>
      <div className="d-flex align-items-center gap-3 mb-4">
        <div style={{ width: 44, height: 44, background: "linear-gradient(135deg, #8B0000, #b8860b)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <MdContactPhone color="#fff" size={22} />
        </div>
        <div>
          <h4 className="mb-0 fw-bold">Contact Page CMS</h4>
          <p className="text-muted small mb-0">Edit all content shown on the /contact page</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>

        {/* Hero Section */}
        <div className="card border-0 shadow-sm p-4 mb-4">
          <h6 className="fw-bold mb-4" style={{ color: "#8B0000" }}>🎬 Hero Section</h6>
          <div className="row g-3">
            <div className="col-md-6">
              <label className={labelClass}>Supertitle (small text above heading)</label>
              <input name="heroSupertitle" value={form.heroSupertitle} onChange={handleChange} className={inputClass} placeholder="e.g. At Your Service" />
            </div>
            <div className="col-md-6">
              <label className={labelClass}>Main Heading</label>
              <input name="heroTitle" value={form.heroTitle} onChange={handleChange} className={inputClass} placeholder="e.g. Premium Support & Concierge" />
            </div>
            <div className="col-12">
              <label className={labelClass}>Hero Description</label>
              <textarea name="heroDescription" value={form.heroDescription} onChange={handleChange} className={inputClass} rows={3} />
            </div>
            <div className="col-12">
              <label className={labelClass}><FaImage className="me-1" /> Hero Background Image</label>
              <input type="file" accept="image/*" onChange={handleFileChange} className="form-control form-control-sm" />
              <div className="mt-2 d-flex gap-3 flex-wrap">
                {(heroBgPreview || form.heroBgImage) && (
                  <div>
                    <p className="small text-muted mb-1">{heroBgPreview ? "New Preview:" : "Current:"}</p>
                    <img
                      src={heroBgPreview || getImageSrc(form.heroBgImage)}
                      alt="Hero BG"
                      style={{ width: 220, height: 120, objectFit: "cover", borderRadius: 8, border: "2px solid #dee2e6" }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="card border-0 shadow-sm p-4 mb-4">
          <h6 className="fw-bold mb-4" style={{ color: "#8B0000" }}>📋 Info Cards</h6>
          <div className="row g-4">

            {/* Address */}
            <div className="col-md-4">
              <div className="p-3 bg-light rounded-3 h-100">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <FaMapMarkerAlt color="#8B0000" />
                  <h6 className="mb-0 small fw-bold text-muted">Address Card</h6>
                </div>
                <label className={labelClass}>Card Title</label>
                <input name="addressTitle" value={form.addressTitle} onChange={handleChange} className={inputClass + " mb-2"} placeholder="e.g. Headquarters" />
                <label className={labelClass}>Address Text (use newline for line breaks)</label>
                <textarea name="addressText" value={form.addressText} onChange={handleChange} className={inputClass} rows={4} placeholder={"Line 1\nLine 2\nLine 3"} />
              </div>
            </div>

            {/* Email */}
            <div className="col-md-4">
              <div className="p-3 bg-light rounded-3 h-100">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <FaEnvelope color="#8B0000" />
                  <h6 className="mb-0 small fw-bold text-muted">Email Card</h6>
                </div>
                <label className={labelClass}>Card Title</label>
                <input name="emailTitle" value={form.emailTitle} onChange={handleChange} className={inputClass + " mb-2"} placeholder="e.g. Email Concierge" />
                <label className={labelClass}>Email 1</label>
                <input name="email1" value={form.email1} onChange={handleChange} className={inputClass + " mb-2"} type="email" />
                <label className={labelClass}>Email 2</label>
                <input name="email2" value={form.email2} onChange={handleChange} className={inputClass} type="email" />
              </div>
            </div>

            {/* Phone */}
            <div className="col-md-4">
              <div className="p-3 bg-light rounded-3 h-100">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <FaPhone color="#8B0000" />
                  <h6 className="mb-0 small fw-bold text-muted">Phone Card</h6>
                </div>
                <label className={labelClass}>Card Title</label>
                <input name="phoneTitle" value={form.phoneTitle} onChange={handleChange} className={inputClass + " mb-2"} placeholder="e.g. Direct Lines" />
                <label className={labelClass}>Phone 1</label>
                <input name="phone1" value={form.phone1} onChange={handleChange} className={inputClass + " mb-2"} />
                <label className={labelClass}>Phone 2</label>
                <input name="phone2" value={form.phone2} onChange={handleChange} className={inputClass} />
              </div>
            </div>

          </div>
        </div>

        {/* Form Section */}
        <div className="card border-0 shadow-sm p-4 mb-4">
          <h6 className="fw-bold mb-4" style={{ color: "#8B0000" }}>📨 Contact Form Section</h6>
          <div className="row g-3">
            <div className="col-md-6">
              <label className={labelClass}>Form Heading</label>
              <input name="formHeading" value={form.formHeading} onChange={handleChange} className={inputClass} placeholder="e.g. Send a Message" />
            </div>
            <div className="col-12">
              <label className={labelClass}>Form Subheading</label>
              <textarea name="formSubheading" value={form.formSubheading} onChange={handleChange} className={inputClass} rows={2} />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="d-flex justify-content-end mt-2">
          <button
            type="submit"
            disabled={saving}
            className="btn px-5 py-2 fw-bold text-white"
            style={{ background: "linear-gradient(135deg, #8B0000, #b8860b)", border: "none", borderRadius: 8 }}
          >
            {saving ? (
              <><span className="spinner-border spinner-border-sm me-2" role="status" /> Saving...</>
            ) : (
              <><FaSave className="me-2" /> Save Changes</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManageContactCMS;
