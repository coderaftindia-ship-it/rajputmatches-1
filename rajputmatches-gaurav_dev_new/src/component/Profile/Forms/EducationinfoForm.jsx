import React, { useState, useEffect } from "react";
import style from "./Form.module.css";
import { MdOutlineCancelPresentation } from "react-icons/md";
import { FaGraduationCap, FaBriefcase, FaPencilAlt, FaTrashAlt, FaCheck, FaTimes, FaPlus } from "react-icons/fa";

function EducationinfoForm({
  handleCancelClick,
  formData,
  handleSaveClick,
  setEducationFormData,
}) {
  // Lists state
  const [qualificationsList, setQualificationsList] = useState([]);
  const [occupationsList, setOccupationsList] = useState([]);

  // Qualification row edit state: null = closed, -1 = adding new, index >= 0 = editing existing
  const [editingQualIndex, setEditingQualIndex] = useState(null);
  const [qualForm, setQualForm] = useState({ qualification: "", institution: "" });

  // Occupation row edit state: null = closed, -1 = adding new, index >= 0 = editing existing
  const [editingOccIndex, setEditingOccIndex] = useState(null);
  const [occForm, setOccForm] = useState({ occupation: "", salary: "" });

  // Initialize lists from props — only use real saved data, no dummy defaults
  useEffect(() => {
    let quals = [];
    if (formData?.qualificationsList && Array.isArray(formData.qualificationsList) && formData.qualificationsList.length > 0) {
      quals = formData.qualificationsList;
    } else if (formData?.qualifications || formData?.institution) {
      quals = [{ qualification: formData.qualifications || "", institution: formData.institution || "" }];
    }
    setQualificationsList(quals);

    let occs = [];
    if (formData?.occupationsList && Array.isArray(formData.occupationsList) && formData.occupationsList.length > 0) {
      occs = formData.occupationsList;
    } else if (formData?.professional || formData?.annualIncome) {
      occs = [{ occupation: formData.professional || "", salary: formData.annualIncome || "" }];
    }
    setOccupationsList(occs);
  }, [formData]);

  // ── Qualification Actions ──
  const startAddQual = () => {
    setEditingQualIndex(-1);
    setQualForm({ qualification: "", institution: "" });
  };

  const startEditQual = (index) => {
    setEditingQualIndex(index);
    setQualForm({ ...qualificationsList[index] });
  };

  const deleteQual = (index) => {
    setQualificationsList((prev) => prev.filter((_, i) => i !== index));
    if (editingQualIndex === index) setEditingQualIndex(null);
  };

  const saveQualRow = () => {
    if (!qualForm.qualification.trim()) return;
    if (editingQualIndex === -1) {
      setQualificationsList((prev) => [...prev, { ...qualForm }]);
    } else if (editingQualIndex >= 0) {
      setQualificationsList((prev) => {
        const copy = [...prev];
        copy[editingQualIndex] = { ...qualForm };
        return copy;
      });
    }
    setEditingQualIndex(null);
  };

  // ── Occupation Actions ──
  const startAddOcc = () => {
    setEditingOccIndex(-1);
    setOccForm({ occupation: "", salary: "" });
  };

  const startEditOcc = (index) => {
    setEditingOccIndex(index);
    setOccForm({ ...occForm, ...occupationsList[index] });
  };

  const deleteOcc = (index) => {
    setOccupationsList((prev) => prev.filter((_, i) => i !== index));
    if (editingOccIndex === index) setEditingOccIndex(null);
  };

  const saveOccRow = () => {
    if (!occForm.occupation.trim()) return;
    if (editingOccIndex === -1) {
      setOccupationsList((prev) => [...prev, { ...occForm }]);
    } else if (editingOccIndex >= 0) {
      setOccupationsList((prev) => {
        const copy = [...prev];
        copy[editingOccIndex] = { ...occForm };
        return copy;
      });
    }
    setEditingOccIndex(null);
  };

  // ── Final Form Submit ──
  const onFinalSubmit = (e) => {
    if (e) e.preventDefault();
    const primaryQual = qualificationsList[0]?.qualification || "";
    const primaryInst = qualificationsList[0]?.institution || "";
    const primaryOcc = occupationsList[0]?.occupation || "";
    const primarySal = occupationsList[0]?.salary || "";

    if (setEducationFormData) {
      setEducationFormData((prev) => ({
        ...prev,
        qualifications: primaryQual,
        institution: primaryInst,
        professional: primaryOcc,
        annualIncome: primarySal,
        qualificationsList,
        occupationsList,
      }));
    }
    if (handleSaveClick) {
      handleSaveClick({
        qualifications: primaryQual,
        institution: primaryInst,
        professional: primaryOcc,
        annualIncome: primarySal,
        qualificationsList,
        occupationsList,
      });
    }
  };

  return (
    <div className={style.modalContainer}>
      <div className={style.modalContent} style={{ maxWidth: "850px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
        
        {/* Header */}
        <div className={style.modalHeader} style={{ background: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "12px 20px", justifyContent: "flex-end" }}>
          <div style={{ cursor: "pointer" }} onClick={handleCancelClick}>
            <MdOutlineCancelPresentation size="24" color="#7B1A1A" />
          </div>
        </div>

        <div style={{ padding: "24px", background: "#fafafa" }}>

          {/* CARD 1: QUALIFICATION */}
          <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "20px", marginBottom: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center gap-2">
                <FaGraduationCap size={22} style={{ color: "#7B1A1A" }} />
                <span style={{ fontSize: "1.05rem", fontWeight: "700", color: "#7B1A1A", letterSpacing: "0.02em" }}>
                  QUALIFICATION
                </span>
              </div>
              <button
                type="button"
                onClick={startAddQual}
                style={{
                  background: "#ffffff",
                  border: "1.5px solid #7B1A1A",
                  color: "#7B1A1A",
                  fontWeight: "600",
                  fontSize: "0.85rem",
                  padding: "6px 14px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <FaPlus size={10} /> Add Qualification
              </button>
            </div>

            {/* Table */}
            <div style={{ border: "1px solid #edf2f7", borderRadius: "8px", overflow: "hidden" }}>
              <div className="row m-0 py-2 px-3 bg-light" style={{ borderBottom: "1px solid #edf2f7", fontSize: "0.75rem", fontWeight: "700", color: "#64748b", letterSpacing: "0.05em" }}>
                <div className="col-5">QUALIFICATION</div>
                <div className="col-5">INSTITUTION</div>
                <div className="col-2 text-end">ACTIONS</div>
              </div>

              {qualificationsList.length === 0 && editingQualIndex !== -1 && (
                <div className="text-center py-3 text-secondary" style={{ fontSize: "0.85rem", fontStyle: "italic" }}>
                  No qualifications added yet. Click "+ Add Qualification" above.
                </div>
              )}

              {qualificationsList.map((item, index) => (
                <React.Fragment key={index}>
                  {editingQualIndex === index ? (
                    /* Inline Edit Form Row */
                    <div className="row m-0 py-2 px-3 align-items-center bg-white" style={{ borderBottom: "1px solid #edf2f7" }}>
                      <div className="col-5">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Qualification Degree"
                          value={qualForm.qualification}
                          onChange={(e) => setQualForm({ ...qualForm, qualification: e.target.value })}
                        />
                      </div>
                      <div className="col-5">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Institution Name"
                          value={qualForm.institution}
                          onChange={(e) => setQualForm({ ...qualForm, institution: e.target.value })}
                        />
                      </div>
                      <div className="col-2 text-end d-flex gap-2 justify-content-end">
                        <button type="button" className="btn btn-sm btn-success p-1 px-2" onClick={saveQualRow}><FaCheck size={12} /></button>
                        <button type="button" className="btn btn-sm btn-secondary p-1 px-2" onClick={() => setEditingQualIndex(null)}><FaTimes size={12} /></button>
                      </div>
                    </div>
                  ) : (
                    /* Display Row */
                    <div className="row m-0 py-3 px-3 align-items-center bg-white" style={{ borderBottom: index < qualificationsList.length - 1 ? "1px solid #edf2f7" : "none" }}>
                      <div className="col-5 fw-normal text-dark" style={{ fontSize: "0.9rem" }}>{item.qualification || "—"}</div>
                      <div className="col-5 text-secondary" style={{ fontSize: "0.9rem" }}>{item.institution || "—"}</div>
                      <div className="col-2 text-end d-flex gap-3 justify-content-end align-items-center">
                        <FaPencilAlt size={14} style={{ color: "#7B1A1A", cursor: "pointer" }} onClick={() => startEditQual(index)} title="Edit" />
                        <FaTrashAlt size={14} style={{ color: "#7B1A1A", cursor: "pointer" }} onClick={() => deleteQual(index)} title="Delete" />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}

              {/* Inline Add Row */}
              {editingQualIndex === -1 && (
                <div className="row m-0 py-2 px-3 align-items-center bg-white" style={{ borderTop: "1px solid #edf2f7" }}>
                  <div className="col-5">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="e.g. Bachelor of Technology (B.Tech)"
                      value={qualForm.qualification}
                      onChange={(e) => setQualForm({ ...qualForm, qualification: e.target.value })}
                    />
                  </div>
                  <div className="col-5">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="e.g. University of Rajasthan"
                      value={qualForm.institution}
                      onChange={(e) => setQualForm({ ...qualForm, institution: e.target.value })}
                    />
                  </div>
                  <div className="col-2 text-end d-flex gap-2 justify-content-end">
                    <button type="button" className="btn btn-sm btn-success p-1 px-2" onClick={saveQualRow}><FaCheck size={12} /></button>
                    <button type="button" className="btn btn-sm btn-secondary p-1 px-2" onClick={() => setEditingQualIndex(null)}><FaTimes size={12} /></button>
                  </div>
                </div>
              )}
            </div>
          </div>


          {/* CARD 2: OCCUPATION */}
          <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "20px", marginBottom: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center gap-2">
                <FaBriefcase size={20} style={{ color: "#7B1A1A" }} />
                <span style={{ fontSize: "1.05rem", fontWeight: "700", color: "#7B1A1A", letterSpacing: "0.02em" }}>
                  OCCUPATION
                </span>
              </div>
              <button
                type="button"
                onClick={startAddOcc}
                style={{
                  background: "#ffffff",
                  border: "1.5px solid #7B1A1A",
                  color: "#7B1A1A",
                  fontWeight: "600",
                  fontSize: "0.85rem",
                  padding: "6px 14px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <FaPlus size={10} /> Add Occupation
              </button>
            </div>

            {/* Table */}
            <div style={{ border: "1px solid #edf2f7", borderRadius: "8px", overflow: "hidden" }}>
              <div className="row m-0 py-2 px-3 bg-light" style={{ borderBottom: "1px solid #edf2f7", fontSize: "0.75rem", fontWeight: "700", color: "#64748b", letterSpacing: "0.05em" }}>
                <div className="col-5">OCCUPATION</div>
                <div className="col-5">SALARY (PER ANNUM)</div>
                <div className="col-2 text-end">ACTIONS</div>
              </div>

              {occupationsList.length === 0 && editingOccIndex !== -1 && (
                <div className="text-center py-3 text-secondary" style={{ fontSize: "0.85rem", fontStyle: "italic" }}>
                  No occupations added yet. Click "+ Add Occupation" above.
                </div>
              )}

              {occupationsList.map((item, index) => (
                <React.Fragment key={index}>
                  {editingOccIndex === index ? (
                    /* Inline Edit Form Row */
                    <div className="row m-0 py-2 px-3 align-items-center bg-white" style={{ borderBottom: "1px solid #edf2f7" }}>
                      <div className="col-5">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Occupation Role"
                          value={occForm.occupation}
                          onChange={(e) => setOccForm({ ...occForm, occupation: e.target.value })}
                        />
                      </div>
                      <div className="col-5">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Salary (e.g. ₹ 12,00,000)"
                          value={occForm.salary}
                          onChange={(e) => setOccForm({ ...occForm, salary: e.target.value })}
                        />
                      </div>
                      <div className="col-2 text-end d-flex gap-2 justify-content-end">
                        <button type="button" className="btn btn-sm btn-success p-1 px-2" onClick={saveOccRow}><FaCheck size={12} /></button>
                        <button type="button" className="btn btn-sm btn-secondary p-1 px-2" onClick={() => setEditingOccIndex(null)}><FaTimes size={12} /></button>
                      </div>
                    </div>
                  ) : (
                    /* Display Row */
                    <div className="row m-0 py-3 px-3 align-items-center bg-white" style={{ borderBottom: index < occupationsList.length - 1 ? "1px solid #edf2f7" : "none" }}>
                      <div className="col-5 fw-normal text-dark" style={{ fontSize: "0.9rem" }}>{item.occupation || "—"}</div>
                      <div className="col-5 text-secondary" style={{ fontSize: "0.9rem" }}>{item.salary || "—"}</div>
                      <div className="col-2 text-end d-flex gap-3 justify-content-end align-items-center">
                        <FaPencilAlt size={14} style={{ color: "#7B1A1A", cursor: "pointer" }} onClick={() => startEditOcc(index)} title="Edit" />
                        <FaTrashAlt size={14} style={{ color: "#7B1A1A", cursor: "pointer" }} onClick={() => deleteOcc(index)} title="Delete" />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}

              {/* Inline Add Row */}
              {editingOccIndex === -1 && (
                <div className="row m-0 py-2 px-3 align-items-center bg-white" style={{ borderTop: "1px solid #edf2f7" }}>
                  <div className="col-5">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="e.g. Software Engineer"
                      value={occForm.occupation}
                      onChange={(e) => setOccForm({ ...occForm, occupation: e.target.value })}
                    />
                  </div>
                  <div className="col-5">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="e.g. ₹ 12,00,000"
                      value={occForm.salary}
                      onChange={(e) => setOccForm({ ...occForm, salary: e.target.value })}
                    />
                  </div>
                  <div className="col-2 text-end d-flex gap-2 justify-content-end">
                    <button type="button" className="btn btn-sm btn-success p-1 px-2" onClick={saveOccRow}><FaCheck size={12} /></button>
                    <button type="button" className="btn btn-sm btn-secondary p-1 px-2" onClick={() => setEditingOccIndex(null)}><FaTimes size={12} /></button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* FOOTER BUTTONS */}
          <div className="d-flex justify-content-end align-items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancelClick}
              style={{
                background: "#ffffff",
                border: "1.5px solid #7B1A1A",
                color: "#7B1A1A",
                fontWeight: "600",
                fontSize: "0.9rem",
                padding: "8px 24px",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onFinalSubmit}
              style={{
                background: "#7B1A1A",
                border: "none",
                color: "#ffffff",
                fontWeight: "600",
                fontSize: "0.9rem",
                padding: "9px 28px",
                borderRadius: "6px",
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(123, 26, 26, 0.3)"
              }}
            >
              Save Changes
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

export default EducationinfoForm;
