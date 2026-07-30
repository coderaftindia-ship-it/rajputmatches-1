import React from "react";
import style from "./Form.module.css";
import { X } from "lucide-react";

function FormCard({
  handleCancelClick,
  details,
  handleInputChange,
  formData,
  handleSaveClick,
  error,
}) {
  const clans = [
    "Rathore",
    "Chauhan",
    "Gehlot",
    "Sisodia",
    "Parmar",
    "Solanki",
    "Bhati",
    "Shekhawat",
    "Tanwar",
    "Kachhawa",
    "Jadeja",
    "Hada",
    "Jhala",
    "Other",
  ];

  const cities = [
    "Jaipur, Rajasthan",
    "Jodhpur, Rajasthan",
    "Udaipur, Rajasthan",
    "Bikaner, Rajasthan",
    "Kota, Rajasthan",
    "Ajmer, Rajasthan",
    "Delhi NCR",
    "Mumbai, Maharashtra",
    "Ahmedabad, Gujarat",
    "Indore, Madhya Pradesh",
    "Other",
  ];

  const thikanas = [
    "Jodhpur (Marwar)",
    "Mewar (Udaipur)",
    "Jaipur (Dhundhar)",
    "Bikaner",
    "Jaisalmer",
    "Kota (Hadoti)",
    "Bundi",
    "Nagaur",
    "Kishangarh",
    "Alwar",
    "Other",
  ];

  const heights = [
    "4 ft 10 in",
    "4 ft 11 in",
    "5 ft 0 in",
    "5 ft 1 in",
    "5 ft 2 in",
    "5 ft 3 in",
    "5 ft 4 in",
    "5 ft 5 in",
    "5 ft 6 in",
    "5 ft 7 in",
    "5 ft 8 in",
    "5 ft 9 in",
    "5 ft 10 in",
    "5 ft 11 in",
    "6 ft 0 in",
    "6 ft 1 in",
    "6 ft 2 in",
    "6 ft 3 in",
    "6 ft 4 in",
  ];

  const weights = Array.from({ length: 55 }, (_, i) => `${45 + i} kg`);

  const rashis = [
    "Aries (Mesh)",
    "Taurus (Vrishabh)",
    "Gemini (Mithun)",
    "Cancer (Kark)",
    "Leo (Simha)",
    "Virgo (Kanya)",
    "Libra (Tula)",
    "Scorpio (Vrishchik)",
    "Sagittarius (Dhanu)",
    "Capricorn (Makar)",
    "Aquarius (Kumbh)",
    "Pisces (Meen)",
  ];

  const manglikOptions = [
    "Non Manglik",
    "Manglik",
    "Anshik Manglik",
    "Don't Know",
  ];

  const maritalStatuses = [
    "Never Married",
    "Divorced",
    "Widowed",
    "Awaiting Divorce",
  ];

  return (
    <div className={style.modalContainer}>
      <div
        className={style.modalContent}
        style={{
          maxWidth: "820px",
          borderRadius: "14px",
          background: "#ffffff",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          border: "none",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 24px",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <span
            style={{
              fontSize: "0.85rem",
              fontWeight: "700",
              color: "#4b5563",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Personal & Lineage Details
          </span>
          <X
            size={22}
            style={{ cursor: "pointer", color: "#6b7280" }}
            onClick={handleCancelClick}
          />
        </div>

        {/* Form Content */}
        <form style={{ padding: "24px 28px 16px" }}>
          {/* ROW 1: NAME, MIDDLE NAME, CLAN / SUBCLAN */}
          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <label style={labelStyle}>NAME</label>
              <input
                type="text"
                name="firstName"
                style={inputStyle}
                placeholder="Parakaram"
                value={formData.firstName || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-4">
              <label style={labelStyle}>MIDDLE NAME</label>
              <input
                type="text"
                name="middleName"
                style={inputStyle}
                placeholder="Singh"
                value={formData.middleName || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-4">
              <label style={labelStyle}>CLAN / SUBCLAN</label>
              <input
                type="text"
                name="clan"
                style={inputStyle}
                placeholder="Select Clan"
                value={formData.clan || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* ROW 2: CURRENT CITY, NATIVE PLACE */}
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label style={labelStyle}>CURRENT CITY</label>
              <input
                type="text"
                name="currentCity"
                style={inputStyle}
                placeholder="Select Current City"
                value={formData.currentCity || formData.city || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-6">
              <label style={labelStyle}>
                NATIVE PLACE (THIKANA / PRINCELY STATE)
              </label>
              <input
                type="text"
                name="nativePlace"
                style={inputStyle}
                placeholder="Select Native Place"
                value={formData.nativePlace || formData.thikana || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* ROW 3: DATE OF BIRTH, PLACE OF BIRTH, TIME OF BIRTH */}
          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <label style={labelStyle}>DATE OF BIRTH</label>
              <input
                type="date"
                name="dateOfBirth"
                style={inputStyle}
                value={formData.dateOfBirth || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-4">
              <label style={labelStyle}>PLACE OF BIRTH</label>
              <input
                type="text"
                name="birthplace"
                style={inputStyle}
                placeholder="Jodhpur, Rajasthan"
                value={formData.birthplace || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-4">
              <label style={labelStyle}>TIME OF BIRTH</label>
              <input
                type="text"
                name="birthTime"
                style={inputStyle}
                placeholder="10:30 AM"
                value={formData.birthTime || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* ROW 4: GOTRA, HEIGHT, WEIGHT */}
          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <label style={labelStyle}>GOTRA</label>
              <input
                type="text"
                name="gotra"
                style={inputStyle}
                placeholder="Vashistha"
                value={formData.gotra || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-4">
              <label style={labelStyle}>HEIGHT</label>
              <select
                name="height"
                style={selectStyle}
                value={formData.height || "5 ft 10 in"}
                onChange={handleInputChange}
              >
                <option value="">Select Height</option>
                {heights.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label style={labelStyle}>WEIGHT</label>
              <select
                name="weight"
                style={selectStyle}
                value={
                  typeof formData.weight === "number"
                    ? `${formData.weight} kg`
                    : formData.weight || "70 kg"
                }
                onChange={handleInputChange}
              >
                <option value="">Select Weight</option>
                {weights.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ROW 5: ZODIAC (RASHI), MANGLIK */}
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label style={labelStyle}>ZODIAC (RASHI)</label>
              <select
                name="rashi"
                style={selectStyle}
                value={formData.rashi || formData.zodiac || ""}
                onChange={handleInputChange}
              >
                <option value="">Select Zodiac / Rashi</option>
                {rashis.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label style={labelStyle}>MANGLIK</label>
              <select
                name="manglik"
                style={selectStyle}
                value={formData.manglik || ""}
                onChange={handleInputChange}
              >
                <option value="">Select Manglik Status</option>
                {manglikOptions.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ROW 6: MARITAL STATUS */}
          <div className="row g-3 mb-4">
            <div className="col-12">
              <label style={labelStyle}>MARITAL STATUS</label>
              <select
                name="maritalStatus"
                style={selectStyle}
                value={formData.maritalStatus || ""}
                onChange={handleInputChange}
              >
                <option value="">Select Marital Status</option>
                {maritalStatuses.map((ms) => (
                  <option key={ms} value={ms}>
                    {ms}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div
              style={{
                color: "#dc2626",
                fontSize: "0.82rem",
                marginBottom: "12px",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              marginTop: "16px",
            }}
          >
            <button
              type="button"
              onClick={handleCancelClick}
              style={{
                padding: "8px 24px",
                background: "#ffffff",
                border: "1.5px solid #7B1A1A",
                color: "#7B1A1A",
                borderRadius: "6px",
                fontWeight: "600",
                fontSize: "0.88rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveClick}
              style={{
                padding: "8px 24px",
                background: "#7B1A1A",
                border: "none",
                color: "#ffffff",
                borderRadius: "6px",
                fontWeight: "600",
                fontSize: "0.88rem",
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(123, 26, 26, 0.25)",
                transition: "all 0.2s ease",
              }}
            >
              Save Changes
            </button>
          </div>

          </form>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  fontSize: "0.72rem",
  fontWeight: "700",
  color: "#4b5563",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  marginBottom: "6px",
};

const inputStyle = {
  width: "100%",
  padding: "9px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  fontSize: "0.88rem",
  color: "#111827",
  backgroundColor: "#ffffff",
  outline: "none",
  boxSizing: "border-box",
};

const selectStyle = {
  width: "100%",
  padding: "9px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  fontSize: "0.88rem",
  color: "#111827",
  backgroundColor: "#ffffff",
  outline: "none",
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  paddingRight: "32px",
  boxSizing: "border-box",
};

export default FormCard;
