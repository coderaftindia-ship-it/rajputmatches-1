import React from "react";
import style from "./Form.module.css";
import { MdOutlineCancelPresentation } from "react-icons/md";
import { FaPlus, FaTrash } from "react-icons/fa";

const SiblingSection = ({
  title,
  arrayName,
  items,
  handleSiblingChange,
  handleAddSiblingRow,
  handleRemoveSiblingRow,
  isSister,
}) => (
  <div
    style={{
      background: "#fdfafc",
      border: "1px solid rgba(89, 18, 59, 0.12)",
      borderRadius: "8px",
      padding: "8px 10px",
      marginBottom: "8px",
    }}
  >
    <div className="d-flex justify-content-between align-items-center mb-1.5">
      <span
        style={{
          fontSize: "0.72rem",
          fontWeight: "700",
          color: "#59123B",
          textTransform: "uppercase",
          letterSpacing: "0.02em",
        }}
      >
        {title}
      </span>
      <button
        type="button"
        onClick={() => handleAddSiblingRow(arrayName)}
        style={{
          background: "#ffffff",
          border: "1px solid #59123B",
          color: "#59123B",
          borderRadius: "4px",
          padding: "2px 6px",
          fontSize: "0.65rem",
          fontWeight: "700",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "3px",
        }}
      >
        <FaPlus size={7} /> Add {title}
      </button>
    </div>

    {items.map((item, idx) => (
      <div
        key={idx}
        style={{
          background: "#ffffff",
          border: "1px solid #edf2f7",
          borderRadius: "6px",
          padding: "6px 8px",
          marginBottom: "6px",
          position: "relative",
        }}
      >
        {items.length > 1 && (
          <button
            type="button"
            onClick={() => handleRemoveSiblingRow(arrayName, idx)}
            style={{
              position: "absolute",
              top: "4px",
              right: "4px",
              background: "none",
              border: "none",
              color: "#dc2626",
              cursor: "pointer",
              padding: "2px",
            }}
            title="Remove Sibling"
          >
            <FaTrash size={10} />
          </button>
        )}
        <div className="row g-1.5">
          <div className="col-6">
            <label style={{ fontSize: "0.58rem", fontWeight: "700", color: "#4a4a5e", display: "block", marginBottom: "1px" }}>
              NAME
            </label>
            <input
              type="text"
              placeholder="Name"
              value={item.name || ""}
              onChange={(e) => handleSiblingChange(arrayName, idx, "name", e.target.value)}
            />
          </div>
          <div className="col-6">
            <label style={{ fontSize: "0.58rem", fontWeight: "700", color: "#4a4a5e", display: "block", marginBottom: "1px" }}>
              MARRIED TO
            </label>
            <input
              type="text"
              placeholder="Spouse Name"
              value={item.marriedto || ""}
              onChange={(e) => handleSiblingChange(arrayName, idx, "marriedto", e.target.value)}
            />
          </div>
          <div className="col-6">
            <label style={{ fontSize: "0.58rem", fontWeight: "700", color: "#4a4a5e", display: "block", marginBottom: "1px" }}>
              {isSister ? "SON OF" : "DAUGHTER OF"}
            </label>
            <input
              type="text"
              placeholder="Parent Name"
              value={isSister ? item.sonof || "" : item.daughterof || ""}
              onChange={(e) =>
                handleSiblingChange(arrayName, idx, isSister ? "sonof" : "daughterof", e.target.value)
              }
            />
          </div>
          <div className="col-6">
            <label style={{ fontSize: "0.58rem", fontWeight: "700", color: "#4a4a5e", display: "block", marginBottom: "1px" }}>
              NATIVE PLACE
            </label>
            <input
              type="text"
              placeholder="Thikana"
              value={item.thikana || ""}
              onChange={(e) => handleSiblingChange(arrayName, idx, "thikana", e.target.value)}
            />
          </div>
        </div>
      </div>
    ))}
  </div>
);

function FamilyinfoForm({
  handleCancelClick,
  handleInputChange,
  handleSiblingChange,
  handleAddSiblingRow,
  handleRemoveSiblingRow,
  formData,
  handleSaveClick,
}) {
  const elderBrothers =
    formData.elderBrother && formData.elderBrother.length > 0
      ? formData.elderBrother
      : [{ name: "", marriedto: "", daughterof: "", thikana: "" }];

  const elderSisters =
    formData.elderSister && formData.elderSister.length > 0
      ? formData.elderSister
      : [{ name: "", marriedto: "", sonof: "", thikana: "" }];

  const youngerBrothers =
    formData.youngerBrother && formData.youngerBrother.length > 0
      ? formData.youngerBrother
      : [{ name: "", marriedto: "", daughterof: "", thikana: "" }];

  const youngerSisters =
    formData.youngerSister && formData.youngerSister.length > 0
      ? formData.youngerSister
      : [{ name: "", marriedto: "", sonof: "", thikana: "" }];

  return (
    <div className={style.modalContainer}>
      <div className={style.modalContent} style={{ maxWidth: "720px", borderRadius: "10px" }}>
        {/* Header */}
        <div className={style.modalHeader}>
          <h4 className={style.headerTitle}>Family Details</h4>
          <MdOutlineCancelPresentation
            onClick={handleCancelClick}
            className={style.closeIcon}
            size="20"
          />
        </div>

        {/* Modal Form Body */}
        <form style={{ padding: "10px 12px" }} onSubmit={(e) => e.preventDefault()}>
          {/* Top Parent & Basic Family Details Section */}
          <div className="row g-1.5 mb-2">
            {/* Row 1: Father Name & Father Occupation */}
            <div className="col-6">
              <label>FATHER'S NAME</label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName || ""}
                onChange={handleInputChange}
                placeholder="Father's Name"
              />
            </div>
            <div className="col-6">
              <label>FATHER'S OCCUPATION</label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation || ""}
                onChange={handleInputChange}
                placeholder="Occupation"
              />
            </div>

            {/* Row 2: Father Native Place & Mother Name */}
            <div className="col-6">
              <label>FATHER'S NATIVE PLACE</label>
              <input
                type="text"
                name="fatherNativePlace"
                value={formData.fatherNativePlace || ""}
                onChange={handleInputChange}
                placeholder="Native Place"
              />
            </div>
            <div className="col-6">
              <label>MOTHER'S NAME</label>
              <input
                type="text"
                name="motherName"
                value={formData.motherName || ""}
                onChange={handleInputChange}
                placeholder="Mother's Name"
              />
            </div>

            {/* Row 3: Mother Occupation & Mother Native Place */}
            <div className="col-6">
              <label>MOTHER'S OCCUPATION</label>
              <input
                type="text"
                name="motherOccupation"
                value={formData.motherOccupation || ""}
                onChange={handleInputChange}
                placeholder="Mother's Occupation"
              />
            </div>
            <div className="col-6">
              <label>MOTHER'S NATIVE PLACE</label>
              <input
                type="text"
                name="motherNativePlace"
                value={formData.motherNativePlace || ""}
                onChange={handleInputChange}
                placeholder="Mother's Native"
              />
            </div>

            {/* Row 4: Maternal Gotra & Family Location */}
            <div className="col-6">
              <label>MATERNAL GOTRA</label>
              <input
                type="text"
                name="maternalGotra"
                value={formData.maternalGotra || ""}
                onChange={handleInputChange}
                placeholder="Gotra"
              />
            </div>
            <div className="col-6">
              <label>FAMILY LOCATION</label>
              <input
                type="text"
                name="familyLocation"
                value={formData.familyLocation || ""}
                onChange={handleInputChange}
                placeholder="Location"
              />
            </div>

            {/* Row 5: Additional Maternal */}
            <div className="col-12">
              <label>ADDITIONAL MATERNAL</label>
              <input
                type="text"
                name="additionalMaternal"
                value={formData.additionalMaternal || ""}
                onChange={handleInputChange}
                placeholder="Additional Maternal Info"
              />
            </div>

            {/* Row 6: Family Info */}
            <div className="col-12">
              <label>FAMILY INFO / DESCRIPTION</label>
              <textarea
                name="familyInfo"
                rows="2"
                value={formData.familyInfo || ""}
                onChange={handleInputChange}
                placeholder="Brief Family Information..."
                style={{ minHeight: "40px" }}
              ></textarea>
            </div>
          </div>

          {/* SIBLINGS SECTIONS */}
          <div className="mb-2">
            <SiblingSection
              title="Elder Brother"
              arrayName="elderBrother"
              items={elderBrothers}
              handleSiblingChange={handleSiblingChange}
              handleAddSiblingRow={handleAddSiblingRow}
              handleRemoveSiblingRow={handleRemoveSiblingRow}
              isSister={false}
            />

            <SiblingSection
              title="Elder Sister"
              arrayName="elderSister"
              items={elderSisters}
              handleSiblingChange={handleSiblingChange}
              handleAddSiblingRow={handleAddSiblingRow}
              handleRemoveSiblingRow={handleRemoveSiblingRow}
              isSister={true}
            />

            <SiblingSection
              title="Younger Brother"
              arrayName="youngerBrother"
              items={youngerBrothers}
              handleSiblingChange={handleSiblingChange}
              handleAddSiblingRow={handleAddSiblingRow}
              handleRemoveSiblingRow={handleRemoveSiblingRow}
              isSister={false}
            />

            <SiblingSection
              title="Younger Sister"
              arrayName="youngerSister"
              items={youngerSisters}
              handleSiblingChange={handleSiblingChange}
              handleAddSiblingRow={handleAddSiblingRow}
              handleRemoveSiblingRow={handleRemoveSiblingRow}
              isSister={true}
            />
          </div>

          {/* Footer Actions */}
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

export default FamilyinfoForm;
