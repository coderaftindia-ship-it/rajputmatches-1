import React from "react";
import style from "./Form.module.css";
import { MdOutlineCancelPresentation } from "react-icons/md";
import { FaPlus, FaTrash } from "react-icons/fa";

const RelativeSection = ({
  title,
  arrayName,
  items = [],
  handleInputChange,
  handleAddRow,
  handleRemoveRow,
  isFemale = false,
}) => (
  <div
    style={{
      background: "#fdfafc",
      border: "1px solid rgba(89, 18, 59, 0.12)",
      borderRadius: "10px",
      padding: "10px 12px",
      marginBottom: "12px",
    }}
  >
    <div className="d-flex justify-content-between align-items-center mb-2">
      <span
        style={{
          fontSize: "0.75rem",
          fontWeight: "700",
          color: "#59123B",
          textTransform: "uppercase",
          letterSpacing: "0.03em",
        }}
      >
        {title}
      </span>
      <button
        type="button"
        onClick={() => handleAddRow(arrayName)}
        style={{
          background: "#ffffff",
          border: "1px solid #59123B",
          color: "#59123B",
          borderRadius: "4px",
          padding: "2px 8px",
          fontSize: "0.68rem",
          fontWeight: "700",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <FaPlus size={8} /> Add {title}
      </button>
    </div>

    {items.length === 0 ? (
      <div className="text-muted" style={{ fontSize: "0.75rem", fontStyle: "italic", padding: "4px" }}>
        No entries added yet. Click "+ Add {title}" above.
      </div>
    ) : (
      items.map((item, index) => (
        <div
          key={index}
          style={{
            background: "#ffffff",
            border: "1px solid #edf2f7",
            borderRadius: "8px",
            padding: "8px 10px",
            marginBottom: "6px",
            position: "relative",
          }}
        >
          {items.length > 0 && (
            <button
              type="button"
              onClick={() => handleRemoveRow(index, arrayName)}
              style={{
                position: "absolute",
                top: "6px",
                right: "6px",
                background: "none",
                border: "none",
                color: "#dc2626",
                cursor: "pointer",
                padding: "2px",
              }}
              title="Remove Entry"
            >
              <FaTrash size={11} />
            </button>
          )}
          <div className="row g-2">
            <div className="col-md-3 col-6">
              <label style={{ fontSize: "0.6rem", fontWeight: "700", color: "#4a4a5e", display: "block", marginBottom: "2px" }}>
                NAME
              </label>
              <input
                type="text"
                placeholder="Name"
                value={item.name || ""}
                onChange={(e) => handleInputChange(e, index, arrayName)}
                name="name"
              />
            </div>
            <div className="col-md-3 col-6">
              <label style={{ fontSize: "0.6rem", fontWeight: "700", color: "#4a4a5e", display: "block", marginBottom: "2px" }}>
                MARRIED TO
              </label>
              <input
                type="text"
                placeholder="Spouse Name"
                value={item.marriedto || ""}
                onChange={(e) => handleInputChange(e, index, arrayName)}
                name="marriedto"
              />
            </div>
            <div className="col-md-3 col-6">
              <label style={{ fontSize: "0.6rem", fontWeight: "700", color: "#4a4a5e", display: "block", marginBottom: "2px" }}>
                {isFemale ? "SON OF" : "DAUGHTER OF"}
              </label>
              <input
                type="text"
                placeholder="Parent Name"
                value={isFemale ? item.sonof || "" : item.daughterof || ""}
                onChange={(e) => handleInputChange(e, index, arrayName)}
                name={isFemale ? "sonof" : "daughterof"}
              />
            </div>
            <div className="col-md-3 col-6">
              <label style={{ fontSize: "0.6rem", fontWeight: "700", color: "#4a4a5e", display: "block", marginBottom: "2px" }}>
                THIKANA / NATIVE
              </label>
              <input
                type="text"
                placeholder="Thikana"
                value={item.thikana || ""}
                onChange={(e) => handleInputChange(e, index, arrayName)}
                name="thikana"
              />
            </div>
          </div>
        </div>
      ))
    )}
  </div>
);

function PaternalfamilyinfoForm({
  handleCancelClick,
  handleAddRow,
  handleInputChange,
  formData,
  handleSaveClick,
  handleRemoveRow,
  error,
}) {
  return (
    <div className={style.modalContainer}>
      <div className={style.modalContent} style={{ maxWidth: "740px", borderRadius: "12px" }}>
        {/* Header */}
        <div className={style.modalHeader}>
          <h4 className={style.headerTitle}>Paternal &amp; Extended Family Details</h4>
          <MdOutlineCancelPresentation
            onClick={handleCancelClick}
            className={style.closeIcon}
            size="22"
          />
        </div>

        {/* Modal Form Body */}
        <form style={{ padding: "14px 18px" }} onSubmit={(e) => e.preventDefault()}>
          
          {/* SECTION 1: PATERNAL GRANDPARENTS */}
          <div style={{ background: "#fdfafc", border: "1px solid rgba(89, 18, 59, 0.12)", borderRadius: "10px", padding: "12px 14px", marginBottom: "12px" }}>
            <h6 style={{ fontSize: "0.75rem", fontWeight: "700", color: "#59123B", textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: "8px", borderBottom: "1px dashed rgba(89,18,59,0.15)", paddingBottom: "4px" }}>
              Paternal Grandparents (Dada-Dadi Sa)
            </h6>
            
            {/* Dada Sa */}
            <div className="row g-2 mb-2">
              <div className="col-md-3 col-6">
                <label>GRAND FATHER NAME</label>
                <input
                  type="text"
                  name="grandFatherName"
                  placeholder="Grand Father Name"
                  value={formData.grandFatherName || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-3 col-6">
                <label>SON OF</label>
                <input
                  type="text"
                  name="grandFathersonOf"
                  placeholder="Father Name"
                  value={formData.grandFathersonOf || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-3 col-6">
                <label>OCCUPATION</label>
                <input
                  type="text"
                  name="grandFatheroccupation"
                  placeholder="Occupation"
                  value={formData.grandFatheroccupation || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-3 col-6">
                <label>THIKANA</label>
                <input
                  type="text"
                  name="grandFatherthikana"
                  placeholder="Thikana"
                  value={formData.grandFatherthikana || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Dadi Sa */}
            <div className="row g-2">
              <div className="col-md-4 col-6">
                <label>GRAND MOTHER NAME</label>
                <input
                  type="text"
                  name="grandMotherName"
                  placeholder="Grand Mother Name"
                  value={formData.grandMotherName || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-4 col-6">
                <label>DAUGHTER OF</label>
                <input
                  type="text"
                  name="grandMotherdaughterOf"
                  placeholder="Father Name"
                  value={formData.grandMotherdaughterOf || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-4 col-12">
                <label>THIKANA</label>
                <input
                  type="text"
                  name="grandmotherthikana"
                  placeholder="Native Thikana"
                  value={formData.grandmotherthikana || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* DYNAMIC SECTIONS: BADEPAPA, KAKOSA, BHUASA */}
          <RelativeSection
            title="BadePapa"
            arrayName="badePapa"
            items={formData.badePapa || []}
            handleInputChange={handleInputChange}
            handleAddRow={handleAddRow}
            handleRemoveRow={handleRemoveRow}
            isFemale={false}
          />

          <RelativeSection
            title="Kakosa"
            arrayName="kakosa"
            items={formData.kakosa || []}
            handleInputChange={handleInputChange}
            handleAddRow={handleAddRow}
            handleRemoveRow={handleRemoveRow}
            isFemale={false}
          />

          <RelativeSection
            title="Bhuasa"
            arrayName="bhuasa"
            items={formData.bhuasa || []}
            handleInputChange={handleInputChange}
            handleAddRow={handleAddRow}
            handleRemoveRow={handleRemoveRow}
            isFemale={true}
          />

          {/* SECTION 2: MATERNAL GRANDPARENTS */}
          <div style={{ background: "#fdfafc", border: "1px solid rgba(89, 18, 59, 0.12)", borderRadius: "10px", padding: "12px 14px", marginBottom: "12px" }}>
            <h6 style={{ fontSize: "0.75rem", fontWeight: "700", color: "#59123B", textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: "8px", borderBottom: "1px dashed rgba(89,18,59,0.15)", paddingBottom: "4px" }}>
              Maternal Grandparents (Nana-Nani Sa)
            </h6>

            {/* Nana Sa */}
            <div className="row g-2 mb-2">
              <div className="col-md-3 col-6">
                <label>NANA SA NAME</label>
                <input
                  type="text"
                  name="maternalGrandFatherName"
                  placeholder="Nana Sa Name"
                  value={formData.maternalGrandFatherName || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-3 col-6">
                <label>SON OF</label>
                <input
                  type="text"
                  name="maternalGrandFathersonOf"
                  placeholder="Father Name"
                  value={formData.maternalGrandFathersonOf || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-3 col-6">
                <label>OCCUPATION</label>
                <input
                  type="text"
                  name="maternalGrandFatheroccupation"
                  placeholder="Occupation"
                  value={formData.maternalGrandFatheroccupation || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-3 col-6">
                <label>THIKANA</label>
                <input
                  type="text"
                  name="maternalGrandFatherthikana"
                  placeholder="Thikana"
                  value={formData.maternalGrandFatherthikana || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Nani Sa */}
            <div className="row g-2">
              <div className="col-md-4 col-6">
                <label>NANI SA NAME</label>
                <input
                  type="text"
                  name="maternalGrandMotherName"
                  placeholder="Nani Sa Name"
                  value={formData.maternalGrandMotherName || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-4 col-6">
                <label>DAUGHTER OF</label>
                <input
                  type="text"
                  name="maternalGrandMotherdaughterOf"
                  placeholder="Father Name"
                  value={formData.maternalGrandMotherdaughterOf || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-4 col-12">
                <label>THIKANA</label>
                <input
                  type="text"
                  name="maternalGrandMotherthikana"
                  placeholder="Native Thikana"
                  value={formData.maternalGrandMotherthikana || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* DYNAMIC SECTIONS: MAMESA, MASISA */}
          <RelativeSection
            title="Mamosa"
            arrayName="mamosa"
            items={formData.mamosa || []}
            handleInputChange={handleInputChange}
            handleAddRow={handleAddRow}
            handleRemoveRow={handleRemoveRow}
            isFemale={false}
          />

          <RelativeSection
            title="Masisa"
            arrayName="masisa"
            items={formData.masisa || []}
            handleInputChange={handleInputChange}
            handleAddRow={handleAddRow}
            handleRemoveRow={handleRemoveRow}
            isFemale={true}
          />

          {error && (
            <div style={{ color: "#dc2626", fontSize: "0.78rem", marginBottom: "8px" }}>
              ⚠️ {error}
            </div>
          )}

          {/* Footer Actions */}
          <div className={style.modalFooter} style={{ padding: "8px 0 0 0", borderTop: "1px solid #f0f0f0" }}>
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

export default PaternalfamilyinfoForm;
