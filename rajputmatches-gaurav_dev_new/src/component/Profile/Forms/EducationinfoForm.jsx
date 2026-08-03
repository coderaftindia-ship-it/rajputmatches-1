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
  const [qualificationsList, setQualificationsList] = useState([]);
  const [occupationsList, setOccupationsList] = useState([]);

  const [editingQualIndex, setEditingQualIndex] = useState(null);
  const [qualForm, setQualForm] = useState({ qualification: "", institution: "" });

  const [editingOccIndex, setEditingOccIndex] = useState(null);
  const [occForm, setOccForm] = useState({ occupation: "", company: "" });

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
      occs = [{ occupation: formData.professional || "", company: formData.company || formData.annualIncome || "" }];
    }
    setOccupationsList(occs);
  }, [formData]);

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

  const startAddOcc = () => {
    setEditingOccIndex(-1);
    setOccForm({ occupation: "", company: "" });
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
    const itemToSave = {
      occupation: occForm.occupation,
      company: occForm.company,
      salary: occForm.company || occForm.salary || "",
    };
    if (editingOccIndex === -1) {
      setOccupationsList((prev) => [...prev, itemToSave]);
    } else if (editingOccIndex >= 0) {
      setOccupationsList((prev) => {
        const copy = [...prev];
        copy[editingOccIndex] = itemToSave;
        return copy;
      });
    }
    setEditingOccIndex(null);
  };

  const onFinalSubmit = (e) => {
    if (e) e.preventDefault();

    let finalQuals = [...qualificationsList];
    if (editingQualIndex === -1 && qualForm.qualification.trim()) {
      finalQuals.push({ ...qualForm });
    } else if (editingQualIndex >= 0 && qualForm.qualification.trim()) {
      finalQuals[editingQualIndex] = { ...qualForm };
    }

    let finalOccs = [...occupationsList];
    if (editingOccIndex === -1 && occForm.occupation.trim()) {
      finalOccs.push({
        occupation: occForm.occupation,
        company: occForm.company,
        salary: occForm.company,
      });
    } else if (editingOccIndex >= 0 && occForm.occupation.trim()) {
      finalOccs[editingOccIndex] = {
        occupation: occForm.occupation,
        company: occForm.company,
        salary: occForm.company,
      };
    }

    const primaryQual = finalQuals[0]?.qualification || "";
    const primaryInst = finalQuals[0]?.institution || "";
    const primaryOcc = finalOccs[0]?.occupation || "";
    const primaryCompany = finalOccs[0]?.company || finalOccs[0]?.salary || "";

    const formattedOccs = finalOccs.map((o) => ({
      occupation: o.occupation,
      company: o.company || o.salary || "",
      salary: o.company || o.salary || "",
    }));

    const payload = {
      qualifications: primaryQual,
      institution: primaryInst,
      professional: primaryOcc,
      company: primaryCompany,
      annualIncome: primaryCompany,
      qualificationsList: finalQuals,
      occupationsList: formattedOccs,
    };

    if (setEducationFormData) {
      setEducationFormData((prev) => ({
        ...prev,
        ...payload,
      }));
    }
    if (handleSaveClick) {
      handleSaveClick(payload);
    }
  };

  return (
    <div className={style.modalContainer}>
      <div className={style.modalContent} style={{ maxWidth: "720px", borderRadius: "10px" }}>
        
        {/* Header */}
        <div className={style.modalHeader}>
          <span className={style.headerTitle}>
            Academics &amp; Profession
          </span>
          <MdOutlineCancelPresentation
            onClick={handleCancelClick}
            className={style.closeIcon}
            size="20"
          />
        </div>

        <form style={{ padding: "10px 12px" }} onSubmit={onFinalSubmit}>

          {/* CARD 1: QUALIFICATION */}
          <div style={{ background: "#fdfafc", border: "1px solid rgba(89,18,59,0.12)", borderRadius: "8px", padding: "10px 10px", marginBottom: "10px" }}>
            <div className="d-flex align-items-center justify-content-between mb-1.5">
              <div className="d-flex align-items-center gap-1.5">
                <FaGraduationCap size={15} style={{ color: "#59123B" }} />
                <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "#59123B", letterSpacing: "0.02em" }}>
                  QUALIFICATION
                </span>
              </div>
              <button
                type="button"
                onClick={startAddQual}
                style={{
                  background: "#ffffff",
                  border: "1px solid #59123B",
                  color: "#59123B",
                  fontWeight: "700",
                  fontSize: "0.68rem",
                  padding: "3px 8px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                  whiteSpace: "nowrap",
                }}
              >
                <FaPlus size={8} /> Add Qualification
              </button>
            </div>

            {/* Table */}
            <div style={{ border: "1px solid #edf2f7", borderRadius: "6px", overflow: "hidden", background: "#ffffff" }}>
              <div className="row m-0 py-1 px-2 bg-light" style={{ borderBottom: "1px solid #edf2f7", fontSize: "0.62rem", fontWeight: "700", color: "#64748b" }}>
                <div className="col-5">QUALIFICATION</div>
                <div className="col-5">INSTITUTION</div>
                <div className="col-2 text-end">ACTION</div>
              </div>

              {qualificationsList.length === 0 && editingQualIndex !== -1 && (
                <div className="text-center py-2 text-secondary" style={{ fontSize: "0.75rem", fontStyle: "italic" }}>
                  No qualifications added yet.
                </div>
              )}

              {qualificationsList.map((item, index) => (
                <React.Fragment key={index}>
                  {editingQualIndex === index ? (
                    <div className="row m-0 py-1 px-2 align-items-center bg-white" style={{ borderBottom: "1px solid #edf2f7" }}>
                      <div className="col-5">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Degree"
                          value={qualForm.qualification}
                          onChange={(e) => setQualForm({ ...qualForm, qualification: e.target.value })}
                        />
                      </div>
                      <div className="col-5">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="College / Univ"
                          value={qualForm.institution}
                          onChange={(e) => setQualForm({ ...qualForm, institution: e.target.value })}
                        />
                      </div>
                      <div className="col-2 text-end d-flex gap-1 justify-content-end">
                        <button type="button" className="btn btn-sm btn-success p-1" onClick={saveQualRow}><FaCheck size={10} /></button>
                        <button type="button" className="btn btn-sm btn-secondary p-1" onClick={() => setEditingQualIndex(null)}><FaTimes size={10} /></button>
                      </div>
                    </div>
                  ) : (
                    <div className="row m-0 py-1.5 px-2 align-items-center bg-white" style={{ borderBottom: index < qualificationsList.length - 1 ? "1px solid #edf2f7" : "none" }}>
                      <div className="col-5 fw-bold text-dark" style={{ fontSize: "0.78rem" }}>{item.qualification || "—"}</div>
                      <div className="col-5 text-secondary" style={{ fontSize: "0.76rem" }}>{item.institution || "—"}</div>
                      <div className="col-2 text-end d-flex gap-2 justify-content-end align-items-center">
                        <FaPencilAlt size={11} style={{ color: "#59123B", cursor: "pointer" }} onClick={() => startEditQual(index)} title="Edit" />
                        <FaTrashAlt size={11} style={{ color: "#dc2626", cursor: "pointer" }} onClick={() => deleteQual(index)} title="Delete" />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}

              {editingQualIndex === -1 && (
                <div className="row m-0 py-1 px-2 align-items-center bg-white" style={{ borderTop: "1px solid #edf2f7" }}>
                  <div className="col-5">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Degree (e.g. B.Tech)"
                      value={qualForm.qualification}
                      onChange={(e) => setQualForm({ ...qualForm, qualification: e.target.value })}
                    />
                  </div>
                  <div className="col-5">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="University Name"
                      value={qualForm.institution}
                      onChange={(e) => setQualForm({ ...qualForm, institution: e.target.value })}
                    />
                  </div>
                  <div className="col-2 text-end d-flex gap-1 justify-content-end">
                    <button type="button" className="btn btn-sm btn-success p-1" onClick={saveQualRow}><FaCheck size={10} /></button>
                    <button type="button" className="btn btn-sm btn-secondary p-1" onClick={() => setEditingQualIndex(null)}><FaTimes size={10} /></button>
                  </div>
                </div>
              )}
            </div>
          </div>


          {/* CARD 2: OCCUPATION */}
          <div style={{ background: "#fdfafc", border: "1px solid rgba(89,18,59,0.12)", borderRadius: "8px", padding: "10px 10px", marginBottom: "10px" }}>
            <div className="d-flex align-items-center justify-content-between mb-1.5">
              <div className="d-flex align-items-center gap-1.5">
                <FaBriefcase size={14} style={{ color: "#59123B" }} />
                <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "#59123B", letterSpacing: "0.02em" }}>
                  OCCUPATION
                </span>
              </div>
              <button
                type="button"
                onClick={startAddOcc}
                style={{
                  background: "#ffffff",
                  border: "1px solid #59123B",
                  color: "#59123B",
                  fontWeight: "700",
                  fontSize: "0.68rem",
                  padding: "3px 8px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                  whiteSpace: "nowrap",
                }}
              >
                <FaPlus size={8} /> Add Occupation
              </button>
            </div>

            {/* Table */}
            <div style={{ border: "1px solid #edf2f7", borderRadius: "6px", overflow: "hidden", background: "#ffffff" }}>
              <div className="row m-0 py-1 px-2 bg-light" style={{ borderBottom: "1px solid #edf2f7", fontSize: "0.62rem", fontWeight: "700", color: "#64748b" }}>
                <div className="col-5">OCCUPATION</div>
                <div className="col-5">COMPANY / EMPLOYER</div>
                <div className="col-2 text-end">ACTION</div>
              </div>

              {occupationsList.length === 0 && editingOccIndex !== -1 && (
                <div className="text-center py-2 text-secondary" style={{ fontSize: "0.75rem", fontStyle: "italic" }}>
                  No occupations added yet.
                </div>
              )}

              {occupationsList.map((item, index) => (
                <React.Fragment key={index}>
                  {editingOccIndex === index ? (
                    <div className="row m-0 py-1 px-2 align-items-center bg-white" style={{ borderBottom: "1px solid #edf2f7" }}>
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
                          placeholder="Company"
                          value={occForm.company}
                          onChange={(e) => setOccForm({ ...occForm, company: e.target.value })}
                        />
                      </div>
                      <div className="col-2 text-end d-flex gap-1 justify-content-end">
                        <button type="button" className="btn btn-sm btn-success p-1" onClick={saveOccRow}><FaCheck size={10} /></button>
                        <button type="button" className="btn btn-sm btn-secondary p-1" onClick={() => setEditingOccIndex(null)}><FaTimes size={10} /></button>
                      </div>
                    </div>
                  ) : (
                    <div className="row m-0 py-1.5 px-2 align-items-center bg-white" style={{ borderBottom: index < occupationsList.length - 1 ? "1px solid #edf2f7" : "none" }}>
                      <div className="col-5 fw-bold text-dark" style={{ fontSize: "0.78rem" }}>{item.occupation || "—"}</div>
                      <div className="col-5 text-secondary" style={{ fontSize: "0.76rem" }}>{item.company || "—"}</div>
                      <div className="col-2 text-end d-flex gap-2 justify-content-end align-items-center">
                        <FaPencilAlt size={11} style={{ color: "#59123B", cursor: "pointer" }} onClick={() => startEditOcc(index)} title="Edit" />
                        <FaTrashAlt size={11} style={{ color: "#dc2626", cursor: "pointer" }} onClick={() => deleteOcc(index)} title="Delete" />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}

              {editingOccIndex === -1 && (
                <div className="row m-0 py-1 px-2 align-items-center bg-white" style={{ borderTop: "1px solid #edf2f7" }}>
                  <div className="col-5">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Role (e.g. Engineer)"
                      value={occForm.occupation}
                      onChange={(e) => setOccForm({ ...occForm, occupation: e.target.value })}
                    />
                  </div>
                  <div className="col-5">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Company Name"
                      value={occForm.company}
                      onChange={(e) => setOccForm({ ...occForm, company: e.target.value })}
                    />
                  </div>
                  <div className="col-2 text-end d-flex gap-1 justify-content-end">
                    <button type="button" className="btn btn-sm btn-success p-1" onClick={saveOccRow}><FaCheck size={10} /></button>
                    <button type="button" className="btn btn-sm btn-secondary p-1" onClick={() => setEditingOccIndex(null)}><FaTimes size={10} /></button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* FOOTER BUTTONS */}
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
              onClick={onFinalSubmit}
            >
              Save Changes
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default EducationinfoForm;
