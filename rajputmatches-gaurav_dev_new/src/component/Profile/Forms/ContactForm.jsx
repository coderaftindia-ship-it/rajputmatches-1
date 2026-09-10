import React from "react";
import style from "./Form.module.css";
import { X } from "lucide-react";

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
                <input
                  type="text"
                  name="mobile"
                  placeholder="Enter Mobile Number"
                  value={formData.mobile || ""}
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
