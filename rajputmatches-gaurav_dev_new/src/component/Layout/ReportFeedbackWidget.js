import React, { useState } from "react";
import { FaExclamationTriangle, FaCommentAlt, FaTimes, FaPaperPlane, FaChevronDown } from "react-icons/fa";
import { MdBugReport, MdFeedback, MdOutlineReport } from "react-icons/md";
import { BASE_URL } from "../../api/client";

const CATEGORIES = [
  "General Feedback",
  "Bug / Technical Issue",
  "Inappropriate Content",
  "Fake Profile",
  "Harassment",
  "Suggestion / Feature Request",
  "Payment Issue",
  "Other",
];

const TYPE_CONFIG = {
  feedback: {
    label: "Feedback",
    icon: <MdFeedback size={18} />,
    color: "#EDB139",
    desc: "Share your experience and thoughts",
  },
  report: {
    label: "Report / Issue",
    icon: <MdOutlineReport size={18} />,
    color: "#c0392b",
    desc: "Report an issue or inappropriate content",
  },
  bug: {
    label: "Bug Report",
    icon: <MdBugReport size={18} />,
    color: "#8B1D5A",
    desc: "Report a technical issue or bug",
  },
  suggestion: {
    label: "Suggestion",
    icon: <FaCommentAlt size={15} />,
    color: "#27ae60",
    desc: "Suggest new features or improvements",
  },
};

export default function ReportFeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("feedback");
  const [form, setForm] = useState({ category: "", subject: "", message: "", name: "", email: "" });
  const [image, setImage] = useState(null);          // { file, preview }
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const resetImage = () => {
    if (image?.preview) URL.revokeObjectURL(image.preview);
    setImage(null);
  };

  const handleOpen = () => { setOpen(true); setSuccess(false); setError(""); };
  const handleClose = () => {
    setOpen(false); setSuccess(false); setError("");
    setForm({ category: "", subject: "", message: "", name: "", email: "" });
    setSelectedType("feedback");
    resetImage();
  };

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleImageFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Only image files are allowed."); return; }
    if (file.size > 5 * 1024 * 1024) { setError("Image size should not exceed 5MB."); return; }
    setError("");
    if (image?.preview) URL.revokeObjectURL(image.preview);
    setImage({ file, preview: URL.createObjectURL(file) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category || !form.subject || !form.message) {
      setError("Please fill in Category, Subject, and Message.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("authToken");

      // Use FormData so we can send image file
      const fd = new FormData();
      fd.append("type", selectedType);
      fd.append("category", form.category);
      fd.append("subject", form.subject);
      fd.append("message", form.message);
      if (form.name) fd.append("submittedByName", form.name);
      if (form.email) fd.append("submittedByEmail", form.email);
      if (image?.file) fd.append("feedbackImage", image.file);

      const res = await fetch(`${BASE_URL}/admin/feedback`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: fd,
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setForm({ category: "", subject: "", message: "", name: "", email: "" });
        resetImage();
      } else {
        setError(data.message || "An error occurred while submitting.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cfg = TYPE_CONFIG[selectedType];

  return (
    <>
      {/* ── Floating Trigger Button ── */}
      <button
        id="report-feedback-fab"
        onClick={handleOpen}
        title="Report / Feedback"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 1030,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "linear-gradient(135deg, #59123B, #3f0c2a)",
          color: "#EDB139",
          border: "2px solid #EDB139",
          borderRadius: "50px",
          padding: "12px 20px",
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 600,
          fontSize: "0.82rem",
          cursor: "pointer",
          boxShadow: "0 6px 24px rgba(89,18,59,0.45)",
          transition: "all 0.3s ease",
          letterSpacing: "0.3px",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-3px) scale(1.04)";
          e.currentTarget.style.boxShadow = "0 12px 32px rgba(89,18,59,0.55)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0) scale(1)";
          e.currentTarget.style.boxShadow = "0 6px 24px rgba(89,18,59,0.45)";
        }}
      >
        <FaExclamationTriangle size={14} />
        Report &amp; Feedback
      </button>

      {/* ── Backdrop ── */}
      {open && (
        <div
          onClick={handleClose}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(4px)", zIndex: 1300,
            animation: "rfFadeIn 0.2s ease",
          }}
        />
      )}

      {/* ── Modal ── */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "24px",
            width: "min(420px, calc(100vw - 32px))",
            maxHeight: "88vh",
            overflowY: "auto",
            background: "#FFFDF5",
            border: "2px solid #EDB139",
            borderRadius: "20px",
            zIndex: 1400,
            boxShadow: "0 24px 60px rgba(89,18,59,0.28)",
            animation: "rfSlideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg, #59123B, #3f0c2a)",
            padding: "18px 20px 14px",
            borderRadius: "17px 17px 0 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <div>
              <div style={{ color: "#EDB139", fontWeight: 700, fontSize: "1rem", display: "flex", alignItems: "center", gap: 8 }}>
                <FaExclamationTriangle size={14} />
                Report &amp; Feedback
              </div>
              <div style={{ color: "rgba(253,245,234,0.7)", fontSize: "0.74rem", marginTop: 2 }}>
                We value your feedback and concerns
              </div>
            </div>
            <button
              onClick={handleClose}
              style={{
                background: "rgba(255,255,255,0.1)", border: "1px solid rgba(237,177,57,0.3)",
                borderRadius: "50%", width: 32, height: 32, display: "flex",
                alignItems: "center", justifyContent: "center", cursor: "pointer",
                color: "#EDB139", transition: "all 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(237,177,57,0.2)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
            >
              <FaTimes size={13} />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: "20px" }}>
            {success ? (
              /* ── Success State ── */
              <div style={{ textAlign: "center", padding: "30px 20px" }}>
                <div style={{
                  width: 64, height: 64, borderRadius: "50%",
                  background: "linear-gradient(135deg, #27ae60, #2ecc71)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 16px", fontSize: 28, color: "#fff",
                }}>✓</div>
                <h3 style={{ color: "#59123B", margin: "0 0 8px", fontSize: "1.05rem" }}>Thank You! 🙏</h3>
                <p style={{ color: "#7A5C66", fontSize: "0.85rem", margin: "0 0 20px" }}>
                  Your {TYPE_CONFIG[selectedType].label} has been successfully submitted.
                  Our support team will look into it promptly.
                </p>
                <button
                  onClick={handleClose}
                  style={{
                    background: "linear-gradient(135deg, #59123B, #3f0c2a)",
                    color: "#EDB139", border: "1px solid #EDB139",
                    borderRadius: 30, padding: "10px 28px",
                    fontWeight: 600, fontSize: "0.85rem", cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Type Selector */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#59123B", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Select Type
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {Object.entries(TYPE_CONFIG).map(([key, val]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedType(key)}
                        style={{
                          display: "flex", flexDirection: "column", alignItems: "flex-start",
                          gap: 4, padding: "10px 12px", borderRadius: 12, cursor: "pointer",
                          border: selectedType === key ? `2px solid ${val.color}` : "2px solid rgba(89,18,59,0.12)",
                          background: selectedType === key ? `${val.color}18` : "rgba(255,255,255,0.7)",
                          transition: "all 0.2s ease", textAlign: "left",
                        }}
                      >
                        <div style={{ color: val.color, display: "flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: "0.8rem" }}>
                          {val.icon} {val.label}
                        </div>
                        <div style={{ color: "#7A5C66", fontSize: "0.68rem", lineHeight: 1.3 }}>{val.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#59123B", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Category *
                  </label>
                  <div style={{ position: "relative" }}>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      required
                      style={{
                        width: "100%", padding: "10px 36px 10px 12px",
                        border: "2px solid rgba(89,18,59,0.15)", borderRadius: 10,
                        background: "#fff", color: form.category ? "#3D232C" : "#aaa",
                        fontSize: "0.82rem", appearance: "none", cursor: "pointer",
                        outline: "none", fontFamily: "'Poppins', sans-serif",
                        boxSizing: "border-box",
                      }}
                    >
                      <option value="">-- Select Category --</option>
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <FaChevronDown size={11} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#59123B", pointerEvents: "none" }} />
                  </div>
                </div>

                {/* Subject */}
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#59123B", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Brief subject..."
                    maxLength={200}
                    required
                    style={{
                      width: "100%", padding: "10px 12px",
                      border: "2px solid rgba(89,18,59,0.15)", borderRadius: 10,
                      fontSize: "0.82rem", outline: "none",
                      fontFamily: "'Poppins', sans-serif", boxSizing: "border-box",
                      background: "#fff", color: "#3D232C",
                    }}
                  />
                </div>

                {/* Message */}
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#59123B", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Describe your feedback or issue here..."
                    maxLength={2000}
                    required
                    rows={4}
                    style={{
                      width: "100%", padding: "10px 12px",
                      border: "2px solid rgba(89,18,59,0.15)", borderRadius: 10,
                      fontSize: "0.82rem", outline: "none", resize: "vertical",
                      fontFamily: "'Poppins', sans-serif", boxSizing: "border-box",
                      background: "#fff", color: "#3D232C", minHeight: 90,
                    }}
                  />
                  <div style={{ textAlign: "right", fontSize: "0.68rem", color: "#aaa" }}>{form.message.length}/2000</div>
                </div>

                {/* Optional name/email for anonymous users */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 600, color: "#59123B", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Your Name (optional)
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Name..."
                      style={{
                        width: "100%", padding: "9px 10px",
                        border: "2px solid rgba(89,18,59,0.15)", borderRadius: 10,
                        fontSize: "0.78rem", outline: "none",
                        fontFamily: "'Poppins', sans-serif", boxSizing: "border-box",
                        background: "#fff", color: "#3D232C",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 600, color: "#59123B", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Email (optional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Email..."
                      style={{
                        width: "100%", padding: "9px 10px",
                        border: "2px solid rgba(89,18,59,0.15)", borderRadius: 10,
                        fontSize: "0.78rem", outline: "none",
                        fontFamily: "'Poppins', sans-serif", boxSizing: "border-box",
                        background: "#fff", color: "#3D232C",
                      }}
                    />
                  </div>
                </div>

                {/* ── Image Upload (Optional) ── */}
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 600, color: "#59123B", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    📸 Screenshot / Image (optional)
                  </label>

                  {!image ? (
                    /* Drop Zone */
                    <div
                      onClick={() => document.getElementById("rfb-img-input").click()}
                      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={e => { e.preventDefault(); setDragOver(false); handleImageFile(e.dataTransfer.files[0]); }}
                      style={{
                        border: `2px dashed ${dragOver ? "#59123B" : "rgba(89,18,59,0.25)"}`,
                        borderRadius: 12,
                        padding: "18px 12px",
                        textAlign: "center",
                        cursor: "pointer",
                        background: dragOver ? "rgba(89,18,59,0.04)" : "rgba(255,255,255,0.6)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <div style={{ fontSize: 28, marginBottom: 6 }}>🖼️</div>
                      <div style={{ fontSize: "0.78rem", color: "#59123B", fontWeight: 600 }}>
                        Click or drag image here
                      </div>
                      <div style={{ fontSize: "0.68rem", color: "#aaa", marginTop: 4 }}>
                        JPEG, PNG, GIF, WebP — max 5MB
                      </div>
                      <input
                        id="rfb-img-input"
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={e => handleImageFile(e.target.files[0])}
                      />
                    </div>
                  ) : (
                    /* Preview */
                    <div style={{
                      position: "relative", borderRadius: 12, overflow: "hidden",
                      border: "2px solid rgba(89,18,59,0.2)", background: "#fff",
                    }}>
                      <img
                        src={image.preview}
                        alt="preview"
                        style={{ width: "100%", maxHeight: 160, objectFit: "cover", display: "block" }}
                      />
                      {/* Info bar */}
                      <div style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "8px 12px", background: "rgba(89,18,59,0.04)",
                        borderTop: "1px solid rgba(89,18,59,0.1)",
                      }}>
                        <div>
                          <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#3D232C" }}>
                            {image.file.name.length > 28 ? image.file.name.slice(0, 28) + "…" : image.file.name}
                          </div>
                          <div style={{ fontSize: "0.68rem", color: "#aaa" }}>
                            {(image.file.size / 1024).toFixed(0)} KB
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={resetImage}
                          style={{
                            background: "#fde8e8", border: "none", borderRadius: "50%",
                            width: 28, height: 28, cursor: "pointer", display: "flex",
                            alignItems: "center", justifyContent: "center", fontSize: 14, color: "#e74c3c",
                          }}
                          title="Remove Image"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Error */}
                {error && (
                  <div style={{
                    background: "#fde8e8", border: "1px solid #e74c3c",
                    borderRadius: 8, padding: "10px 14px", marginBottom: 14,
                    color: "#c0392b", fontSize: "0.8rem",
                  }}>
                    ⚠️ {error}
                  </div>
                )}


                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%", padding: "12px",
                    background: loading ? "#aaa" : "linear-gradient(135deg, #59123B, #3f0c2a)",
                    color: "#EDB139", border: "2px solid #EDB139",
                    borderRadius: 12, fontWeight: 700, fontSize: "0.88rem",
                    cursor: loading ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    gap: 8, transition: "all 0.3s ease",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {loading ? (
                    <>
                      <div style={{ width: 16, height: 16, border: "2px solid #EDB139", borderTop: "2px solid transparent", borderRadius: "50%", animation: "rfSpin 0.8s linear infinite" }} />
                      Submitting...
                    </>
                  ) : (
                    <><FaPaperPlane size={14} /> Submit</>
                  )}
                </button>

                <p style={{ textAlign: "center", fontSize: "0.7rem", color: "#aaa", margin: "10px 0 0" }}>
                  🔒 Your information is secure and sent to administration.
                </p>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── Keyframe animations ── */}
      <style>{`
        @keyframes rfFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes rfSlideUp { from { opacity: 0; transform: translateY(30px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes rfSpin { to { transform: rotate(360deg); } }
        #report-feedback-fab { animation: rfBounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
        @keyframes rfBounceIn { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
        
        /* Mobile responsive */
        @media (max-width: 991px) {
          #report-feedback-fab {
            bottom: 74px !important;
            right: 14px !important;
            padding: 8px 14px !important;
            font-size: 0.78rem !important;
            z-index: 1030 !important;
          }
        }
        @media (max-width: 480px) {
          #report-feedback-fab {
            bottom: 74px !important;
            right: 12px !important;
            padding: 7px 12px !important;
            font-size: 0.75rem !important;
          }
        }
      `}</style>
    </>
  );
}
