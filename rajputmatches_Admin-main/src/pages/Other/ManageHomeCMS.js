import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaSave, FaCloudUploadAlt, FaImage, FaHome, FaStar, FaUsers } from "react-icons/fa";

const ManageHomeCMS = () => {
  const Base_url = (process.env.REACT_APP_BASE_URL || "").replace(/\/$/, "");
  const backendOrigin = Base_url ? Base_url.replace(/\/admin.*$/, "") : "";

  const getImageSrc = (p) => {
    if (!p) return "";
    if (p.startsWith("http")) return p;
    return `${backendOrigin}${p}`;
  };

  const getToken = () => localStorage.getItem("adminAuthToken");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("banner");

  const [form, setForm] = useState({
    heroBadgeText: "",
    heroTitleLine1: "",
    heroTitleLine2: "",
    heroDescription: "",
    heroCTA1Text: "",
    heroCTA2Text: "",
    heroFooterNote: "",
    stat1Value: "", stat1Label: "",
    stat2Value: "", stat2Label: "",
    stat3Value: "", stat3Label: "",
    stat4Value: "", stat4Label: "",
    matchBadgeText: "",
    matchHeading: "",
    matchDescription: "",
    matchBullet1Title: "", matchBullet1Desc: "",
    matchBullet2Title: "", matchBullet2Desc: "",
    matchCTAText: "",
    featureSectionHeading: "",
    feature1Title: "", feature2Title: "", feature3Title: "", feature4Title: "", feature5Title: "",
    statsHeading: "", statsSubheading: "",
    stat_members_value: "", stat_members_label: "",
    stat_matches_value: "", stat_matches_label: "",
    stat_marriages_value: "", stat_marriages_label: "",
    stat_satisfaction_value: "", stat_satisfaction_label: "",
    bannerBgImage: "",
    matchmakingImage: "",
  });

  const [bannerBgFile, setBannerBgFile] = useState(null);
  const [bannerBgPreview, setBannerBgPreview] = useState("");
  const [matchImgFile, setMatchImgFile] = useState(null);
  const [matchImgPreview, setMatchImgPreview] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${Base_url}/home-cms`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (res.data?.success && res.data?.data) {
          setForm((prev) => ({ ...prev, ...res.data.data }));
        }
      } catch (e) {
        toast.error("Failed to load Home CMS data");
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

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    if (type === "banner") { setBannerBgFile(file); setBannerBgPreview(preview); }
    if (type === "match") { setMatchImgFile(file); setMatchImgPreview(preview); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k !== "bannerBgImage" && k !== "matchmakingImage" && v !== undefined && v !== null) {
          fd.append(k, v);
        }
      });
      if (bannerBgFile) fd.append("bannerBgImage", bannerBgFile);
      if (matchImgFile) fd.append("matchmakingImage", matchImgFile);

      const res = await axios.post(`${Base_url}/home-cms`, fd, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data?.success) {
        toast.success("Home page updated successfully!");
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

  const tabs = [
    { key: "banner", label: "🏠 Banner" },
    { key: "stats", label: "📊 Stats" },
    { key: "matchmaking", label: "💍 Matchmaking" },
    { key: "features", label: "⭐ Features" },
    { key: "community", label: "👥 Community" },
  ];

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
      <div className="spinner-border text-danger" role="status" />
    </div>
  );

  return (
    <div style={{ padding: "24px", maxWidth: "1100px", margin: "0 auto" }}>
      <div className="d-flex align-items-center gap-3 mb-4">
        <div style={{ width: 44, height: 44, background: "linear-gradient(135deg, #8B0000, #b8860b)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <FaHome color="#fff" size={20} />
        </div>
        <div>
          <h4 className="mb-0 fw-bold">Home Page CMS</h4>
          <p className="text-muted small mb-0">Edit all content & images shown on the home page</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <ul className="nav nav-tabs mb-4">
        {tabs.map((t) => (
          <li key={t.key} className="nav-item">
            <button
              className={`nav-link ${activeTab === t.key ? "active fw-bold" : ""}`}
              onClick={() => setActiveTab(t.key)}
              style={{ cursor: "pointer", color: activeTab === t.key ? "#8B0000" : "#666", borderBottom: activeTab === t.key ? "2px solid #8B0000" : "none" }}
            >
              {t.label}
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>

        {/* ── BANNER TAB ── */}
        {activeTab === "banner" && (
          <div className="card border-0 shadow-sm p-4 mb-4">
            <h6 className="fw-bold mb-4 text-danger">🏠 Hero Banner Section</h6>
            <div className="row g-3">
              <div className="col-12">
                <label className={labelClass}>Badge Text (e.g. "Trusted Since 2009")</label>
                <input name="heroBadgeText" value={form.heroBadgeText} onChange={handleChange} className={inputClass} />
              </div>
              <div className="col-md-6">
                <label className={labelClass}>Title Line 1 (e.g. "Where Royalty")</label>
                <input name="heroTitleLine1" value={form.heroTitleLine1} onChange={handleChange} className={inputClass} />
              </div>
              <div className="col-md-6">
                <label className={labelClass}>Title Line 2 (gold colored, e.g. "Meets Destiny")</label>
                <input name="heroTitleLine2" value={form.heroTitleLine2} onChange={handleChange} className={inputClass} />
              </div>
              <div className="col-12">
                <label className={labelClass}>Hero Description</label>
                <textarea name="heroDescription" value={form.heroDescription} onChange={handleChange} className={inputClass} rows={3} />
              </div>
              <div className="col-md-6">
                <label className={labelClass}>CTA Button 1 Text</label>
                <input name="heroCTA1Text" value={form.heroCTA1Text} onChange={handleChange} className={inputClass} />
              </div>
              <div className="col-md-6">
                <label className={labelClass}>CTA Button 2 Text</label>
                <input name="heroCTA2Text" value={form.heroCTA2Text} onChange={handleChange} className={inputClass} />
              </div>
              <div className="col-12">
                <label className={labelClass}>Footer Note (below search form)</label>
                <input name="heroFooterNote" value={form.heroFooterNote} onChange={handleChange} className={inputClass} />
              </div>

              {/* Banner Background Image */}
              <div className="col-12 mt-3">
                <label className={labelClass}><FaImage className="me-1" /> Banner Background Image</label>
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "banner")} className="form-control form-control-sm" />
                <div className="mt-2 d-flex gap-3 flex-wrap">
                  {(bannerBgPreview || form.bannerBgImage) && (
                    <div>
                      <p className="small text-muted mb-1">{bannerBgPreview ? "New:" : "Current:"}</p>
                      <img
                        src={bannerBgPreview || getImageSrc(form.bannerBgImage)}
                        alt="Banner BG"
                        style={{ width: 180, height: 100, objectFit: "cover", borderRadius: 8, border: "2px solid #dee2e6" }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STATS TAB ── */}
        {activeTab === "stats" && (
          <div className="card border-0 shadow-sm p-4 mb-4">
            <h6 className="fw-bold mb-4 text-danger">📊 Banner Stats (shown below heading)</h6>
            <div className="row g-3">
              {[1, 2, 3, 4].map((n) => (
                <div className="col-md-6" key={n}>
                  <div className="p-3 bg-light rounded-3">
                    <h6 className="small fw-bold text-muted mb-2">Stat {n}</h6>
                    <div className="row g-2">
                      <div className="col-5">
                        <label className={labelClass}>Value</label>
                        <input name={`stat${n}Value`} value={form[`stat${n}Value`]} onChange={handleChange} className={inputClass} placeholder="e.g. 25,000+" />
                      </div>
                      <div className="col-7">
                        <label className={labelClass}>Label</label>
                        <input name={`stat${n}Label`} value={form[`stat${n}Label`]} onChange={handleChange} className={inputClass} placeholder="e.g. Members" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── MATCHMAKING TAB ── */}
        {activeTab === "matchmaking" && (
          <div className="card border-0 shadow-sm p-4 mb-4">
            <h6 className="fw-bold mb-4 text-danger">💍 Matchmaking Section</h6>
            <div className="row g-3">
              <div className="col-12">
                <label className={labelClass}>Heritage Badge Text</label>
                <input name="matchBadgeText" value={form.matchBadgeText} onChange={handleChange} className={inputClass} />
              </div>
              <div className="col-12">
                <label className={labelClass}>Main Heading</label>
                <input name="matchHeading" value={form.matchHeading} onChange={handleChange} className={inputClass} />
              </div>
              <div className="col-12">
                <label className={labelClass}>Description</label>
                <textarea name="matchDescription" value={form.matchDescription} onChange={handleChange} className={inputClass} rows={3} />
              </div>
              <div className="col-md-6">
                <div className="p-3 bg-light rounded-3">
                  <h6 className="small fw-bold text-muted mb-2">Bullet Point 1</h6>
                  <label className={labelClass}>Title</label>
                  <input name="matchBullet1Title" value={form.matchBullet1Title} onChange={handleChange} className={inputClass + " mb-2"} />
                  <label className={labelClass}>Description</label>
                  <input name="matchBullet1Desc" value={form.matchBullet1Desc} onChange={handleChange} className={inputClass} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-3 bg-light rounded-3">
                  <h6 className="small fw-bold text-muted mb-2">Bullet Point 2</h6>
                  <label className={labelClass}>Title</label>
                  <input name="matchBullet2Title" value={form.matchBullet2Title} onChange={handleChange} className={inputClass + " mb-2"} />
                  <label className={labelClass}>Description</label>
                  <input name="matchBullet2Desc" value={form.matchBullet2Desc} onChange={handleChange} className={inputClass} />
                </div>
              </div>
              <div className="col-md-6">
                <label className={labelClass}>CTA Button Text</label>
                <input name="matchCTAText" value={form.matchCTAText} onChange={handleChange} className={inputClass} />
              </div>

              {/* Matchmaking Image */}
              <div className="col-12 mt-2">
                <label className={labelClass}><FaImage className="me-1" /> Section Image (Jharokha frame)</label>
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "match")} className="form-control form-control-sm" />
                <div className="mt-2 d-flex gap-3 flex-wrap">
                  {(matchImgPreview || form.matchmakingImage) && (
                    <div>
                      <p className="small text-muted mb-1">{matchImgPreview ? "New:" : "Current:"}</p>
                      <img
                        src={matchImgPreview || getImageSrc(form.matchmakingImage)}
                        alt="Matchmaking"
                        style={{ width: 160, height: 180, objectFit: "cover", borderRadius: 8, border: "2px solid #dee2e6" }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── FEATURES TAB ── */}
        {activeTab === "features" && (
          <div className="card border-0 shadow-sm p-4 mb-4">
            <h6 className="fw-bold mb-4 text-danger">⭐ Features Section</h6>
            <div className="row g-3">
              <div className="col-12">
                <label className={labelClass}>Section Heading</label>
                <input name="featureSectionHeading" value={form.featureSectionHeading} onChange={handleChange} className={inputClass} />
              </div>
              {[1, 2, 3, 4, 5].map((n) => (
                <div className="col-md-6" key={n}>
                  <label className={labelClass}>Feature {n} Title</label>
                  <input name={`feature${n}Title`} value={form[`feature${n}Title`]} onChange={handleChange} className={inputClass} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── COMMUNITY TAB ── */}
        {activeTab === "community" && (
          <div className="card border-0 shadow-sm p-4 mb-4">
            <h6 className="fw-bold mb-4 text-danger">👥 Happy Clients / Community Section</h6>
            <div className="row g-3">
              <div className="col-12">
                <label className={labelClass}>Section Heading</label>
                <input name="statsHeading" value={form.statsHeading} onChange={handleChange} className={inputClass} />
              </div>
              <div className="col-12">
                <label className={labelClass}>Section Subheading</label>
                <textarea name="statsSubheading" value={form.statsSubheading} onChange={handleChange} className={inputClass} rows={2} />
              </div>
              {[
                { key: "members", label: "Registered Members" },
                { key: "matches", label: "Successful Matches" },
                { key: "marriages", label: "Happy Marriages" },
                { key: "satisfaction", label: "Satisfaction Rate" },
              ].map((stat) => (
                <div className="col-md-6" key={stat.key}>
                  <div className="p-3 bg-light rounded-3">
                    <h6 className="small fw-bold text-muted mb-2">{stat.label}</h6>
                    <div className="row g-2">
                      <div className="col-5">
                        <label className={labelClass}>Number</label>
                        <input type="number" name={`stat_${stat.key}_value`} value={form[`stat_${stat.key}_value`]} onChange={handleChange} className={inputClass} />
                      </div>
                      <div className="col-7">
                        <label className={labelClass}>Label</label>
                        <input name={`stat_${stat.key}_label`} value={form[`stat_${stat.key}_label`]} onChange={handleChange} className={inputClass} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="d-flex justify-content-end mt-2">
          <button
            type="submit"
            disabled={saving}
            className="btn btn-danger px-5 py-2 fw-bold"
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

export default ManageHomeCMS;
