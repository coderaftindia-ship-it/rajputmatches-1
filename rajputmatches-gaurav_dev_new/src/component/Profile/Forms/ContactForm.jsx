import React from "react";
import style from "./Form.module.css";
import { X } from "lucide-react";

const COUNTRY_CODES = [
  { code: "+91", label: "India (+91)" },
  { code: "+1", label: "USA/Canada (+1)" },
  { code: "+971", label: "UAE (+971)" },
  { code: "+44", label: "UK (+44)" },
  { code: "+61", label: "Australia (+61)" },
  { code: "+966", label: "Saudi Arabia (+966)" },
  { code: "+65", label: "Singapore (+65)" },
  { code: "+965", label: "Kuwait (+965)" },
  { code: "+974", label: "Qatar (+974)" },
  { code: "+968", label: "Oman (+968)" },
  { code: "+49", label: "Germany (+49)" },
  { code: "+33", label: "France (+33)" },
  { code: "+39", label: "Italy (+39)" },
  { code: "+34", label: "Spain (+34)" },
  { code: "+81", label: "Japan (+81)" },
  { code: "+92", label: "Pakistan (+92)" },
  { code: "+977", label: "Nepal (+977)" },
  { code: "+94", label: "Sri Lanka (+94)" },
  { code: "+880", label: "Bangladesh (+880)" },
  { code: "+60", label: "Malaysia (+60)" },
  { code: "+64", label: "New Zealand (+64)" },
  { code: "+27", label: "South Africa (+27)" },
  { code: "+31", label: "Netherlands (+31)" },
  { code: "+46", label: "Sweden (+46)" },
  { code: "+41", label: "Switzerland (+41)" },
  { code: "+47", label: "Norway (+47)" },
  { code: "+45", label: "Denmark (+45)" },
  { code: "+353", label: "Ireland (+353)" },
  { code: "+973", label: "Bahrain (+973)" },
];

function ContactForm({
  handleCancelClick,
  formData,
  handleInputChange,
  handleSaveClick,
  error,
}) {
  return (
    <div className={style.modalContainer}>
      <div className={style.modalContent} style={{ maxWidth: "520px" }}>
        {/* Header */}
        <div className={style.modalHeader}>
          <span className={style.headerTitle}>Contact Information</span>
          <X
            size={18}
            className={style.closeIcon}
            onClick={handleCancelClick}
          />
        </div>

        {/* Form Body */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
          <div style={{ overflowY: "auto", flex: 1, padding: "16px 20px" }}>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveClick(); }}>
              {error && (
                <div className="alert alert-danger py-2 px-3 mb-3" style={{ fontSize: "0.82rem" }}>
                  {error}
                </div>
              )}

              <div className="mb-3">
                <label style={{ fontSize: "0.75rem", fontWeight: "700", color: "#59123B", letterSpacing: "0.05em", marginBottom: "4px", display: "block" }}>
                  MOBILE NUMBER
                </label>
                <div className="d-flex gap-2">
                  <select
                    name="countryCode"
                    value={formData.countryCode || "+91"}
                    onChange={handleInputChange}
                    style={{
                      width: "140px",
                      flexShrink: 0,
                      padding: "8px 10px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.88rem",
                      outline: "none",
                      backgroundColor: "#fff",
                      fontWeight: "600",
                      color: "#334155"
                    }}
                  >
                    {COUNTRY_CODES.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.code} ({item.label.split("(")[0].trim()})
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    name="mobile"
                    placeholder="Enter Mobile Number"
                    value={formData.mobile || ""}
                    onChange={handleInputChange}
                    style={{
                      flexGrow: 1,
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.9rem",
                      outline: "none"
                    }}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label style={{ fontSize: "0.75rem", fontWeight: "700", color: "#59123B", letterSpacing: "0.05em", marginBottom: "4px", display: "block" }}>
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email Address"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.9rem",
                    outline: "none"
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="d-flex justify-content-end gap-2 mt-4 pt-2" style={{ borderTop: "1px solid #f1f5f9" }}>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary px-3 py-1.5 rounded-pill"
                  onClick={handleCancelClick}
                  style={{ fontWeight: "600", fontSize: "0.85rem" }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-sm text-white px-4 py-1.5 rounded-pill"
                  onClick={handleSaveClick}
                  style={{
                    background: "linear-gradient(135deg, #59123B 0%, #3d0826 100%)",
                    fontWeight: "700",
                    fontSize: "0.85rem",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(89, 18, 59, 0.2)"
                  }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactForm;
