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

  const classOptions = [
    "Royalty",
    "Business",
    "Service",
    "Political",
    "Agriculture",
    "Others",
  ];

  return (
    <div className={style.modalContainer}>
      <div className={style.modalContent} style={{ maxWidth: "720px" }}>
        {/* Header */}
        <div className={style.modalHeader}>
          <span className={style.headerTitle}>
            Personal &amp; Lineage Details
          </span>
          <X
            size={18}
            className={style.closeIcon}
            onClick={handleCancelClick}
          />
        </div>

        {/* Form Content */}
        <form style={{ padding: "10px 14px" }} onSubmit={(e) => e.preventDefault()}>
          {/* ROW 1: NAME & MIDDLE NAME */}
          <div className="row g-1.5 mb-1.5">
            <div className="col-md-4 col-6">
              <label>NAME</label>
              <input
                type="text"
                name="firstName"
                placeholder="Parakaram"
                value={formData.firstName || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-4 col-6">
              <label>MIDDLE NAME</label>
              <input
                type="text"
                name="middleName"
                placeholder="Singh"
                value={formData.middleName || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-4 col-12 mt-md-0 mt-1">
              <label>CLAN / SUBCLAN</label>
              <input
                type="text"
                name="clan"
                placeholder="Select Clan"
                value={formData.clan || formData.subclan || formData.lastName || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* ROW 2: CURRENT CITY, STATE & NATIVE PLACE */}
          <div className="row g-1.5 mb-1.5">
            <div className="col-md-4 col-6">
              <label>CURRENT CITY</label>
              <input
                type="text"
                name="currentCity"
                placeholder="Current City"
                value={formData.currentCity || formData.city || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-4 col-6">
              <label>STATE</label>
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-4 col-12 mt-md-0 mt-1">
              <label>NATIVE PLACE (THIKANA)</label>
              <input
                type="text"
                name="nativePlace"
                placeholder="Native Place"
                value={formData.nativePlace || formData.thikana || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* ROW 3: DOB & PLACE OF BIRTH */}
          <div className="row g-1.5 mb-1.5">
            <div className="col-6">
              <label>DATE OF BIRTH</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-6">
              <label>PLACE OF BIRTH</label>
              <input
                type="text"
                name="birthplace"
                placeholder="Jodhpur"
                value={formData.birthplace || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* ROW 4: TIME OF BIRTH & GOTRA */}
          <div className="row g-1.5 mb-1.5">
            <div className="col-6">
              <label>TIME OF BIRTH</label>
              <input
                type="text"
                name="birthTime"
                placeholder="10:30 AM"
                value={formData.birthTime || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-6">
              <label>GOTRA</label>
              <input
                type="text"
                name="gotra"
                placeholder="Vashistha"
                value={formData.gotra || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* ROW 5: HEIGHT & WEIGHT */}
          <div className="row g-1.5 mb-1.5">
            <div className="col-6">
              <label>HEIGHT</label>
              <select
                name="height"
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
            <div className="col-6">
              <label>WEIGHT</label>
              <select
                name="weight"
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

          {/* ROW 6: ZODIAC & MANGLIK */}
          <div className="row g-1.5 mb-1.5">
            <div className="col-6">
              <label>ZODIAC (RASHI)</label>
              <select
                name="rashi"
                value={formData.rashi || formData.zodiac || ""}
                onChange={handleInputChange}
              >
                <option value="">Select Zodiac</option>
                {rashis.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-6">
              <label>MANGLIK</label>
              <select
                name="manglik"
                value={formData.manglik || ""}
                onChange={handleInputChange}
              >
                <option value="">Select Status</option>
                {manglikOptions.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ROW 7: MARITAL STATUS & CLASS */}
          <div className="row g-1.5 mb-1.5">
            <div className="col-6">
              <label>MARITAL STATUS</label>
              <select
                name="maritalStatus"
                value={formData.maritalStatus || ""}
                onChange={handleInputChange}
              >
                <option value="">Select Marital</option>
                {maritalStatuses.map((ms) => (
                  <option key={ms} value={ms}>
                    {ms}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-6">
              <label>CLASS / FAMILY CLASS</label>
              <select
                name="class"
                value={formData.class || ""}
                onChange={handleInputChange}
              >
                <option value="">Select Class</option>
                {classOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ROW 8: CONTACT DETAILS (MOBILE & EMAIL) */}
          <div className="row g-1.5 mb-2">
            <div className="col-6">
              <label>MOBILE NUMBER</label>
              <input
                type="text"
                name="mobile"
                placeholder="Mobile Number"
                value={formData.mobile || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-6">
              <label>EMAIL ADDRESS</label>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {error && (
            <div
              style={{
                color: "#dc2626",
                fontSize: "0.74rem",
                marginBottom: "6px",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className={style.modalFooter} style={{ padding: "6px 0 0 0", borderTop: "1px solid #f0f0f0" }}>
            <button
              type="button"
              className={style.cancelBtn}
              onClick={handleCancelClick}
            >
              Cancel
            </button>
            <button
              type="button"
              className={style.saveBtn}
              onClick={handleSaveClick}
            >
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default FormCard;
