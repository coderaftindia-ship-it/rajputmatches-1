import React from "react";
import style from "./Form.module.css";
import { MdOutlineCancelPresentation } from "react-icons/md";
import { FaPlus, FaTrash } from "react-icons/fa";

function FamilyinfoForm({
  handleCancelClick,
  handleInputChange,
  handleSiblingChange,
  handleAddSiblingRow,
  handleRemoveSiblingRow,
  formData,
  handleSaveClick,
}) {
  // Helpers for safe array rendering
  const elderBrothers = formData.elderBrother && formData.elderBrother.length > 0
    ? formData.elderBrother
    : [{ name: "", marriedto: "", daughterof: "", thikana: "" }];

  const elderSisters = formData.elderSister && formData.elderSister.length > 0
    ? formData.elderSister
    : [{ name: "", marriedto: "", sonof: "", thikana: "" }];

  const youngerBrothers = formData.youngerBrother && formData.youngerBrother.length > 0
    ? formData.youngerBrother
    : [{ name: "", marriedto: "", daughterof: "", thikana: "" }];

  const youngerSisters = formData.youngerSister && formData.youngerSister.length > 0
    ? formData.youngerSister
    : [{ name: "", marriedto: "", sonof: "", thikana: "" }];

  return (
    <div className={style.modalContainer}>
      <div className={style.modalContent} style={{ maxWidth: "920px", width: "95vw" }}>
        {/* Header */}
        <div className={style.modalHeader}>
          <h4 className={style.headerTitle}>Family Details</h4>
          <div>
            <MdOutlineCancelPresentation
              onClick={handleCancelClick}
              className={style.closeIcon}
              size="22"
            />
          </div>
        </div>

        {/* Modal Form Body */}
        <form className="p-4" onSubmit={(e) => e.preventDefault()}>
          {/* Top Parent & Basic Family Details Section */}
          <div className="row g-3 mb-4">
            {/* Row 1: Father Name & Father Occupation */}
            <div className="col-md-6">
              <label htmlFor="fatherName" className="form-label fw-bold text-uppercase small text-secondary">
                FATHER'S NAME
              </label>
              <input
                type="text"
                className="form-control rounded-2"
                id="fatherName"
                name="fatherName"
                value={formData.fatherName || ""}
                onChange={handleInputChange}
                placeholder="Father's Name"
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="occupation" className="form-label fw-bold text-uppercase small text-secondary">
                OCCUPATION
              </label>
              <input
                type="text"
                className="form-control rounded-2"
                id="occupation"
                name="occupation"
                value={formData.occupation || ""}
                onChange={handleInputChange}
                placeholder="Occupation"
              />
            </div>

            {/* Row 2: Father Native Place & Mother Name */}
            <div className="col-md-6">
              <label htmlFor="fatherNativePlace" className="form-label fw-bold text-uppercase small text-secondary">
                FATHER'S NATIVE PLACE
              </label>
              <input
                type="text"
                className="form-control rounded-2"
                id="fatherNativePlace"
                name="fatherNativePlace"
                value={formData.fatherNativePlace || ""}
                onChange={handleInputChange}
                placeholder="Father's Native Place"
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="motherName" className="form-label fw-bold text-uppercase small text-secondary">
                MOTHER'S NAME
              </label>
              <input
                type="text"
                className="form-control rounded-2"
                id="motherName"
                name="motherName"
                value={formData.motherName || ""}
                onChange={handleInputChange}
                placeholder="Mother's Name"
              />
            </div>

            {/* Row 3 & 4: Family Info & Mother Native Place / Occupation */}
            <div className="col-md-6">
              <label htmlFor="familyInfo" className="form-label fw-bold text-uppercase small text-secondary">
                FAMILY INFO
              </label>
              <textarea
                className="form-control rounded-2"
                id="familyInfo"
                name="familyInfo"
                rows="4"
                value={formData.familyInfo || ""}
                onChange={handleInputChange}
                placeholder="Enter Family Information..."
                style={{ minHeight: "116px" }}
              ></textarea>
            </div>

            <div className="col-md-6 d-flex flex-column justify-content-between">
              <div className="mb-3">
                <label htmlFor="motherNativePlace" className="form-label fw-bold text-uppercase small text-secondary">
                  MOTHER'S NATIVE PLACE
                </label>
                <input
                  type="text"
                  className="form-control rounded-2"
                  id="motherNativePlace"
                  name="motherNativePlace"
                  value={formData.motherNativePlace || ""}
                  onChange={handleInputChange}
                  placeholder="Mother's Native Place"
                />
              </div>
              <div>
                <label htmlFor="motherOccupation" className="form-label fw-bold text-uppercase small text-secondary">
                  MOTHER'S OCCUPATION
                </label>
                <input
                  type="text"
                  className="form-control rounded-2"
                  id="motherOccupation"
                  name="motherOccupation"
                  value={formData.motherOccupation || ""}
                  onChange={handleInputChange}
                  placeholder="Mother's Occupation"
                />
              </div>
            </div>

            {/* Additional Details: Maternal Gotra & Location */}
            <div className="col-md-4">
              <label htmlFor="maternalGotra" className="form-label fw-bold text-uppercase small text-secondary">
                MATERNAL GOTRA
              </label>
              <input
                type="text"
                className="form-control rounded-2"
                id="maternalGotra"
                name="maternalGotra"
                value={formData.maternalGotra || ""}
                onChange={handleInputChange}
                placeholder="Gotra"
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="familyLocation" className="form-label fw-bold text-uppercase small text-secondary">
                FAMILY LOCATION
              </label>
              <input
                type="text"
                className="form-control rounded-2"
                id="familyLocation"
                name="familyLocation"
                value={formData.familyLocation || ""}
                onChange={handleInputChange}
                placeholder="Location"
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="additionalMaternal" className="form-label fw-bold text-uppercase small text-secondary">
                ADDITIONAL MATERNAL
              </label>
              <input
                type="text"
                className="form-control rounded-2"
                id="additionalMaternal"
                name="additionalMaternal"
                value={formData.additionalMaternal || ""}
                onChange={handleInputChange}
                placeholder="Info"
              />
            </div>
          </div>

          {/* ALL SIBLINGS SECTION */}
          <div className="mb-4">
            <h6
              className="fw-bold text-uppercase mb-3"
              style={{
                fontSize: "0.85rem",
                color: "#59123B",
                letterSpacing: "0.05em",
                borderBottom: "1.5px solid rgba(89, 18, 59, 0.15)",
                paddingBottom: "6px",
              }}
            >
              ALL SIBLINGS
            </h6>

            <div className="row g-3">
              {/* 1. ELDER BROTHER CARD */}
              <div className="col-md-6">
                <div
                  className="p-3 border rounded-3"
                  style={{ background: "#FDF6EC", borderColor: "rgba(212, 175, 55, 0.3)" }}
                >
                  <div className="fw-bold text-uppercase small mb-2 text-secondary" style={{ fontSize: "0.75rem" }}>
                    ELDER BROTHER
                  </div>
                  {elderBrothers.map((item, idx) => (
                    <div key={`eb-${idx}`} className="mb-3 border-bottom pb-2 position-relative">
                      {elderBrothers.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-sm btn-link text-danger position-absolute top-0 end-0 p-0 text-decoration-none"
                          onClick={() => handleRemoveSiblingRow("elderBrother", idx)}
                          title="Remove"
                        >
                          <FaTrash size={12} />
                        </button>
                      )}
                      <div className="row g-2 mb-2">
                        <div className="col-6">
                          <label className="form-label text-muted" style={{ fontSize: "0.7rem" }}>ELDER BROTHER NAME</label>
                          <input
                            type="text"
                            className="form-control form-control-sm rounded-2"
                            placeholder="Name"
                            value={item.name || ""}
                            onChange={(e) => handleSiblingChange("elderBrother", idx, "name", e.target.value)}
                          />
                        </div>
                        <div className="col-6">
                          <label className="form-label text-muted" style={{ fontSize: "0.7rem" }}>MARRIED TO</label>
                          <input
                            type="text"
                            className="form-control form-control-sm rounded-2"
                            placeholder="Spouse Name"
                            value={item.marriedto || ""}
                            onChange={(e) => handleSiblingChange("elderBrother", idx, "marriedto", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="row g-2">
                        <div className="col-6">
                          <label className="form-label text-muted" style={{ fontSize: "0.7rem" }}>DAUGHTER OF</label>
                          <input
                            type="text"
                            className="form-control form-control-sm rounded-2"
                            placeholder="Daughter Name"
                            value={item.daughterof || ""}
                            onChange={(e) => handleSiblingChange("elderBrother", idx, "daughterof", e.target.value)}
                          />
                        </div>
                        <div className="col-6">
                          <label className="form-label text-muted" style={{ fontSize: "0.7rem" }}>NATIVE PLACE</label>
                          <input
                            type="text"
                            className="form-control form-control-sm rounded-2"
                            placeholder="Native Place"
                            value={item.thikana || ""}
                            onChange={(e) => handleSiblingChange("elderBrother", idx, "thikana", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="text-end mt-2">
                    <button
                      type="button"
                      className="btn btn-sm text-uppercase fw-bold p-0"
                      style={{ color: "#8B1D5A", fontSize: "0.75rem" }}
                      onClick={() => handleAddSiblingRow("elderBrother")}
                    >
                      <FaPlus size={10} className="me-1" /> ADD
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. ELDER SISTER CARD */}
              <div className="col-md-6">
                <div
                  className="p-3 border rounded-3"
                  style={{ background: "#FDF6EC", borderColor: "rgba(212, 175, 55, 0.3)" }}
                >
                  <div className="fw-bold text-uppercase small mb-2 text-secondary" style={{ fontSize: "0.75rem" }}>
                    ELDER SISTER
                  </div>
                  {elderSisters.map((item, idx) => (
                    <div key={`es-${idx}`} className="mb-3 border-bottom pb-2 position-relative">
                      {elderSisters.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-sm btn-link text-danger position-absolute top-0 end-0 p-0 text-decoration-none"
                          onClick={() => handleRemoveSiblingRow("elderSister", idx)}
                          title="Remove"
                        >
                          <FaTrash size={12} />
                        </button>
                      )}
                      <div className="row g-2 mb-2">
                        <div className="col-6">
                          <label className="form-label text-muted" style={{ fontSize: "0.7rem" }}>ELDER SISTER NAME</label>
                          <input
                            type="text"
                            className="form-control form-control-sm rounded-2"
                            placeholder="Name"
                            value={item.name || ""}
                            onChange={(e) => handleSiblingChange("elderSister", idx, "name", e.target.value)}
                          />
                        </div>
                        <div className="col-6">
                          <label className="form-label text-muted" style={{ fontSize: "0.7rem" }}>MARRIED TO</label>
                          <input
                            type="text"
                            className="form-control form-control-sm rounded-2"
                            placeholder="Spouse Name"
                            value={item.marriedto || ""}
                            onChange={(e) => handleSiblingChange("elderSister", idx, "marriedto", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="row g-2">
                        <div className="col-6">
                          <label className="form-label text-muted" style={{ fontSize: "0.7rem" }}>SON OF</label>
                          <input
                            type="text"
                            className="form-control form-control-sm rounded-2"
                            placeholder="Son Name"
                            value={item.sonof || ""}
                            onChange={(e) => handleSiblingChange("elderSister", idx, "sonof", e.target.value)}
                          />
                        </div>
                        <div className="col-6">
                          <label className="form-label text-muted" style={{ fontSize: "0.7rem" }}>NATIVE PLACE</label>
                          <input
                            type="text"
                            className="form-control form-control-sm rounded-2"
                            placeholder="Native Place"
                            value={item.thikana || ""}
                            onChange={(e) => handleSiblingChange("elderSister", idx, "thikana", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="text-end mt-2">
                    <button
                      type="button"
                      className="btn btn-sm text-uppercase fw-bold p-0"
                      style={{ color: "#8B1D5A", fontSize: "0.75rem" }}
                      onClick={() => handleAddSiblingRow("elderSister")}
                    >
                      <FaPlus size={10} className="me-1" /> ADD
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. YOUNGER BROTHER CARD */}
              <div className="col-md-6">
                <div
                  className="p-3 border rounded-3"
                  style={{ background: "#FDF6EC", borderColor: "rgba(212, 175, 55, 0.3)" }}
                >
                  <div className="fw-bold text-uppercase small mb-2 text-secondary" style={{ fontSize: "0.75rem" }}>
                    YOUNGER BROTHER
                  </div>
                  {youngerBrothers.map((item, idx) => (
                    <div key={`yb-${idx}`} className="mb-3 border-bottom pb-2 position-relative">
                      {youngerBrothers.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-sm btn-link text-danger position-absolute top-0 end-0 p-0 text-decoration-none"
                          onClick={() => handleRemoveSiblingRow("youngerBrother", idx)}
                          title="Remove"
                        >
                          <FaTrash size={12} />
                        </button>
                      )}
                      <div className="row g-2 mb-2">
                        <div className="col-6">
                          <label className="form-label text-muted" style={{ fontSize: "0.7rem" }}>YOUNGER BROTHER NAME</label>
                          <input
                            type="text"
                            className="form-control form-control-sm rounded-2"
                            placeholder="Name"
                            value={item.name || ""}
                            onChange={(e) => handleSiblingChange("youngerBrother", idx, "name", e.target.value)}
                          />
                        </div>
                        <div className="col-6">
                          <label className="form-label text-muted" style={{ fontSize: "0.7rem" }}>MARRIED TO</label>
                          <input
                            type="text"
                            className="form-control form-control-sm rounded-2"
                            placeholder="Spouse Name"
                            value={item.marriedto || ""}
                            onChange={(e) => handleSiblingChange("youngerBrother", idx, "marriedto", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="row g-2">
                        <div className="col-6">
                          <label className="form-label text-muted" style={{ fontSize: "0.7rem" }}>DAUGHTER OF</label>
                          <input
                            type="text"
                            className="form-control form-control-sm rounded-2"
                            placeholder="Daughter Name"
                            value={item.daughterof || ""}
                            onChange={(e) => handleSiblingChange("youngerBrother", idx, "daughterof", e.target.value)}
                          />
                        </div>
                        <div className="col-6">
                          <label className="form-label text-muted" style={{ fontSize: "0.7rem" }}>NATIVE PLACE</label>
                          <input
                            type="text"
                            className="form-control form-control-sm rounded-2"
                            placeholder="Native Place"
                            value={item.thikana || ""}
                            onChange={(e) => handleSiblingChange("youngerBrother", idx, "thikana", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="text-end mt-2">
                    <button
                      type="button"
                      className="btn btn-sm text-uppercase fw-bold p-0"
                      style={{ color: "#8B1D5A", fontSize: "0.75rem" }}
                      onClick={() => handleAddSiblingRow("youngerBrother")}
                    >
                      <FaPlus size={10} className="me-1" /> ADD
                    </button>
                  </div>
                </div>
              </div>

              {/* 4. YOUNGER SISTER CARD */}
              <div className="col-md-6">
                <div
                  className="p-3 border rounded-3"
                  style={{ background: "#FDF6EC", borderColor: "rgba(212, 175, 55, 0.3)" }}
                >
                  <div className="fw-bold text-uppercase small mb-2 text-secondary" style={{ fontSize: "0.75rem" }}>
                    YOUNGER SISTER
                  </div>
                  {youngerSisters.map((item, idx) => (
                    <div key={`ys-${idx}`} className="mb-3 border-bottom pb-2 position-relative">
                      {youngerSisters.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-sm btn-link text-danger position-absolute top-0 end-0 p-0 text-decoration-none"
                          onClick={() => handleRemoveSiblingRow("youngerSister", idx)}
                          title="Remove"
                        >
                          <FaTrash size={12} />
                        </button>
                      )}
                      <div className="row g-2 mb-2">
                        <div className="col-6">
                          <label className="form-label text-muted" style={{ fontSize: "0.7rem" }}>YOUNGER SISTER NAME</label>
                          <input
                            type="text"
                            className="form-control form-control-sm rounded-2"
                            placeholder="Name"
                            value={item.name || ""}
                            onChange={(e) => handleSiblingChange("youngerSister", idx, "name", e.target.value)}
                          />
                        </div>
                        <div className="col-6">
                          <label className="form-label text-muted" style={{ fontSize: "0.7rem" }}>MARRIED TO</label>
                          <input
                            type="text"
                            className="form-control form-control-sm rounded-2"
                            placeholder="Spouse Name"
                            value={item.marriedto || ""}
                            onChange={(e) => handleSiblingChange("youngerSister", idx, "marriedto", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="row g-2">
                        <div className="col-6">
                          <label className="form-label text-muted" style={{ fontSize: "0.7rem" }}>SON OF</label>
                          <input
                            type="text"
                            className="form-control form-control-sm rounded-2"
                            placeholder="Son Name"
                            value={item.sonof || ""}
                            onChange={(e) => handleSiblingChange("youngerSister", idx, "sonof", e.target.value)}
                          />
                        </div>
                        <div className="col-6">
                          <label className="form-label text-muted" style={{ fontSize: "0.7rem" }}>NATIVE PLACE</label>
                          <input
                            type="text"
                            className="form-control form-control-sm rounded-2"
                            placeholder="Native Place"
                            value={item.thikana || ""}
                            onChange={(e) => handleSiblingChange("youngerSister", idx, "thikana", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="text-end mt-2">
                    <button
                      type="button"
                      className="btn btn-sm text-uppercase fw-bold p-0"
                      style={{ color: "#8B1D5A", fontSize: "0.75rem" }}
                      onClick={() => handleAddSiblingRow("youngerSister")}
                    >
                      <FaPlus size={10} className="me-1" /> ADD
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Footer Save Button */}
          <div className={style.modalFooter}>
            <button
              type="button"
              className={`btn ${style.saveButton}`}
              style={{
                background: "linear-gradient(135deg, #59123B, #8B1D5A)",
                color: "#fff",
                borderRadius: "8px",
                padding: "8px 32px",
                fontWeight: "600",
                letterSpacing: "0.05em",
              }}
              onClick={handleSaveClick}
            >
              SAVE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FamilyinfoForm;
