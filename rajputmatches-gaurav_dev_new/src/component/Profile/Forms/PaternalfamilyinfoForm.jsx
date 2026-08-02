import React from "react";
import style from "./Form.module.css";
import { MdOutlineCancelPresentation } from "react-icons/md";

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
      <div className={style.modalContent}>
        <div className={style.modalHeader}>
          <h4 className={style.headerTitle}>Paternal Family Details</h4>

          <div>
            <MdOutlineCancelPresentation
              onClick={handleCancelClick}
              className={style.closeIcon}
              size="22"
            />
          </div>
        </div>

        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="row">
              <div className="col-sm-6">
                <label htmlFor="grandFatherName">Grand Father Name</label>
                <input
                  type="text"
                  id="grandFatherName"
                  name="grandFatherName"
                  className="form-control rounded-0"
                  placeholder="Enter Name"
                  aria-label="Grand Father Name"
                  value={formData.grandFatherName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="col-sm-6">
                <label htmlFor="grandFathersonOf">Son of</label>
                <input
                  type="text"
                  id="grandFathersonOf"
                  name="grandFathersonOf" // name added
                  className="form-control rounded-0"
                  placeholder="Enter Occupation"
                  aria-label="Son of"
                  value={formData.grandFathersonOf}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6">
                <label htmlFor="grandFatheroccupation">Occupation</label>
                <input
                  type="text"
                  id="grandFatheroccupation"
                  name="grandFatheroccupation" // name added
                  className="form-control rounded-0"
                  placeholder="Enter Occupation"
                  aria-label="grandFatheroccupation"
                  value={formData.grandFatheroccupation} // value bound to state
                  onChange={handleInputChange} // onChange event to update state
                />
              </div>
              <div className="col-sm-6">
                <label htmlFor="grandFatherthikana">Thikana</label>
                <input
                  type="text"
                  id="grandFatherthikana"
                  name="grandFatherthikana"
                  className="form-control rounded-0"
                  placeholder="Grand Father Thikana"
                  aria-label="grandFatherthikana"
                  value={formData.grandFatherthikana}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6">
                <label htmlFor="grandMotherName">Grand Mother Name</label>
                <input
                  type="text"
                  id="grandMotherName"
                  name="grandMotherName"
                  className="form-control rounded-0"
                  placeholder="Enter Name"
                  aria-label="Grand Mother Name"
                  value={formData.grandMotherName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-sm-6">
                <label htmlFor="grandMotherdaughterOf">Daughter of</label>
                <input
                  type="text"
                  id="grandMotherdaughterOf"
                  name="grandMotherdaughterOf"
                  className="form-control rounded-0"
                  placeholder="Enter Name"
                  aria-label="Daughter of"
                  value={formData.grandMotherdaughterOf}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6">
                <label htmlFor="grandmotherthikana">Thikana</label>
                <input
                  type="text"
                  id="grandmotherthikana"
                  name="grandmotherthikana"
                  className="form-control rounded-0"
                  placeholder=""
                  aria-label="Thikana"
                  value={formData.grandmotherthikana}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <label className="mt-3">All BadePapa</label>
            <div className="mt-2 p-3" style={{ backgroundColor: "wheat" }}>
              {!formData.badePapa || formData.badePapa.length === 0 ? (
                <div className="row">
                  <div className="col-12 text-end">
                    <span
                      className="custom-add text-danger"
                      onClick={() => handleAddRow("badePapa")}
                      style={{ cursor: "pointer", fontWeight: "600" }}
                    >
                      + ADD
                    </span>
                  </div>
                </div>
              ) : (
                formData.badePapa?.map((item, index) => (
                  <div key={index} className="row">
                    <div className="col-md-4">
                      <label htmlFor={`name-${index}`}>BadePapa</label>
                      <input
                        type="text"
                        id={`name-${index}`}
                        name="name"
                        className="form-control rounded-0"
                        placeholder=""
                        aria-label="name"
                        value={item.name || ""}
                        onChange={(e) => handleInputChange(e, index, "badePapa")}
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor={`marriedto-${index}`}>Married To</label>
                      <input
                        type="text"
                        id={`marriedto-${index}`}
                        name="marriedto"
                        className="form-control rounded-0"
                        placeholder=""
                        aria-label="marriedto"
                        value={item.marriedto || ""}
                        onChange={(e) => handleInputChange(e, index, "badePapa")}
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor={`daughterof-${index}`}>Daughter Of</label>
                      <input
                        type="text"
                        id={`daughterof-${index}`}
                        name="daughterof"
                        className="form-control rounded-0"
                        placeholder=""
                        aria-label="daughterof"
                        value={item.daughterof || ""}
                        onChange={(e) => handleInputChange(e, index, "badePapa")}
                      />
                    </div>
                    <div className="col-md-4 mb-2">
                      <label htmlFor={`thikana-${index}`}>Thikana</label>
                      <input
                        type="text"
                        id={`thikana-${index}`}
                        name="thikana"
                        className="form-control rounded-0"
                        placeholder=""
                        aria-label="thikana"
                        value={item.thikana || ""}
                        onChange={(e) => handleInputChange(e, index, "badePapa")}
                      />
                    </div>
                    <hr />

                    <div className="col-12 text-end">
                      {/* Show Add button only for the last row */}
                      {index === formData.badePapa.length - 1 && (
                        <span
                          className="custom-add text-danger"
                          onClick={() => handleAddRow("badePapa")}
                          style={{
                            cursor: "pointer",
                            marginRight: "10px",
                            fontWeight: "600",
                          }}
                        >
                          + ADD
                        </span>
                      )}

                      {/* Show Remove button for all rows except the first one */}
                      {index > 0 && (
                        <span
                          className="custom-remove text-danger"
                          onClick={() => handleRemoveRow(index, "badePapa")}
                          style={{ cursor: "pointer", fontWeight: "600" }}
                        >
                          - REMOVE
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <label>All Kakosa</label>
            <div className="mt-2 p-3" style={{ backgroundColor: "wheat" }}>
              {!formData.kakosa || formData.kakosa.length === 0 ? (
                <div className="row">
                  <div className="col-12 text-end">
                    <span
                      className="custom-add text-danger"
                      onClick={() => handleAddRow("kakosa")}
                      style={{ cursor: "pointer", fontWeight: "600" }}
                    >
                      + ADD
                    </span>
                  </div>
                </div>
              ) : (
                formData.kakosa?.map((item, index) => (
                  <div key={index} className="row">
                    <div className="col-md-4">
                      <label htmlFor={`kakosa-name-${index}`}>Kakosa</label>
                      <input
                        type="text"
                        id={`kakosa-name-${index}`}
                        name="name"
                        className="form-control rounded-0"
                        placeholder=""
                        aria-label="name"
                        value={item.name || ""}
                        onChange={(e) => handleInputChange(e, index, "kakosa")}
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor={`kakosa-marriedto-${index}`}>
                        Married To
                      </label>
                      <input
                        type="text"
                        id={`kakosa-marriedto-${index}`}
                        name="marriedto"
                        className="form-control rounded-0"
                        placeholder=""
                        aria-label="marriedto"
                        value={item.marriedto || ""}
                        onChange={(e) => handleInputChange(e, index, "kakosa")}
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor={`kakosa-daughterof-${index}`}>
                        Daughter Of
                      </label>
                      <input
                        type="text"
                        id={`kakosa-daughterof-${index}`}
                        name="daughterof"
                        className="form-control rounded-0"
                        placeholder=""
                        aria-label="daughterof"
                        value={item.daughterof || ""}
                        onChange={(e) => handleInputChange(e, index, "kakosa")}
                      />
                    </div>
                    <div className="col-md-4 mb-2">
                      <label htmlFor={`kakosa-thikana-${index}`}>Thikana</label>
                      <input
                        type="text"
                        id={`kakosa-thikana-${index}`}
                        name="thikana"
                        className="form-control rounded-0"
                        placeholder=""
                        aria-label="thikana"
                        value={item.thikana || ""}
                        onChange={(e) => handleInputChange(e, index, "kakosa")}
                      />
                    </div>
                    <hr />
                    <div className="col-12 text-end">
                      {/* Show Add button only for the last row */}
                      {index === formData.kakosa.length - 1 && (
                        <span
                          className="custom-add text-danger"
                          onClick={() => handleAddRow("kakosa")}
                          style={{
                            cursor: "pointer",
                            marginRight: "10px",
                            fontWeight: "600",
                          }}
                        >
                          + ADD
                        </span>
                      )}

                      {/* Show Remove button for all rows except the first one */}
                      {index > 0 && (
                        <span
                          className="custom-remove text-danger"
                          onClick={() => handleRemoveRow(index, "kakosa")}
                          style={{ cursor: "pointer", fontWeight: "600" }}
                        >
                          - REMOVE
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <label>All Bhuasa</label>
            <div className="mt-2 p-3" style={{ backgroundColor: "wheat" }}>
              {!formData.bhuasa || formData.bhuasa.length === 0 ? (
                <div className="row">
                  <div className="col-12 text-end">
                    <span
                      className="custom-add text-danger"
                      onClick={() => handleAddRow("bhuasa")}
                      style={{ cursor: "pointer", fontWeight: "600" }}
                    >
                      + ADD
                    </span>
                  </div>
                </div>
              ) : (
                formData.bhuasa?.map((item, index) => (
                  <div key={index} className="row">
                    <div className="col-md-4">
                      <label htmlFor={`bhuasa-name-${index}`}>Bhuasa</label>
                      <input
                        type="text"
                        id={`bhuasa-name-${index}`}
                        name="name"
                        className="form-control rounded-0"
                        placeholder=""
                        aria-label="name"
                        value={item.name || ""}
                        onChange={(e) => handleInputChange(e, index, "bhuasa")}
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor={`kakosa-marriedto-${index}`}>
                        Married To
                      </label>
                      <input
                        type="text"
                        id={`bhuasa-marriedto-${index}`}
                        name="marriedto"
                        className="form-control rounded-0"
                        placeholder=""
                        aria-label="marriedto"
                        value={item.marriedto || ""}
                        onChange={(e) => handleInputChange(e, index, "bhuasa")}
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor={`bhuasa-daughterof-${index}`}>son of</label>
                      <input
                        type="text"
                        id={`bhuasa-sonof-${index}`}
                        name="sonof"
                        className="form-control rounded-0"
                        placeholder=""
                        aria-label="sonof"
                        value={item.sonof || ""}
                        onChange={(e) => handleInputChange(e, index, "bhuasa")}
                      />
                    </div>
                    <div className="col-md-4 mb-2">
                      <label htmlFor={`bhuasa-thikana-${index}`}>Thikana</label>
                      <input
                        type="text"
                        id={`bhuasa-thikana-${index}`}
                        name="thikana"
                        className="form-control rounded-0"
                        placeholder=""
                        aria-label="thikana"
                        value={item.thikana || ""}
                        onChange={(e) => handleInputChange(e, index, "bhuasa")}
                      />
                    </div>
                    <hr />

                    <div className="col-12 text-end">
                      {/* Show Add button only for the last row */}
                      {index === formData.bhuasa.length - 1 && (
                        <span
                          className="custom-add text-danger"
                          onClick={() => handleAddRow("bhuasa")}
                          style={{
                            cursor: "pointer",
                            marginRight: "10px",
                            fontWeight: "600",
                          }}
                        >
                          + ADD
                        </span>
                      )}

                      {/* Show Remove button for all rows except the first one */}
                      {index > 0 && (
                        <span
                          className="custom-remove text-danger"
                          onClick={() => handleRemoveRow(index, "bhuasa")}
                          style={{ cursor: "pointer", fontWeight: "600" }}
                        >
                          - REMOVE
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="row mb-3">
              <div className="col-sm-6">
                <label htmlFor="maternalGrandFatherName" className="form-label">
                  Maternal Grand Father Name
                </label>
                <input
                  type="text"
                  className="form-control rounded-0"
                  id="maternalGrandFatherName"
                  name="maternalGrandFatherName"
                  placeholder="Name"
                  value={formData.maternalGrandFatherName || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-sm-6">
                <label
                  htmlFor="maternalGrandFathersonOf"
                  className="form-label"
                >
                  Son of
                </label>
                <input
                  type="text"
                  className="form-control rounded-0"
                  id="maternalGrandFathersonOf"
                  name="maternalGrandFathersonOf"
                  placeholder="Enter Name"
                  value={formData.maternalGrandFathersonOf || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-sm-6">
                <label
                  htmlFor="maternalGrandFatheroccupation"
                  className="form-label"
                >
                  Occupation
                </label>
                <input
                  type="text"
                  className="form-control rounded-0"
                  id="maternalGrandFatheroccupation"
                  name="maternalGrandFatheroccupation"
                  placeholder="maternalGrandFatheroccupation"
                  value={formData.maternalGrandFatheroccupation || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-sm-6">
                <label
                  htmlFor="maternalGrandFatherthikana"
                  className="form-label"
                >
                  Thikana
                </label>
                <input
                  type="text"
                  className="form-control rounded-0"
                  id="maternalGrandFatherthikana"
                  name="maternalGrandFatherthikana"
                  placeholder="Enter Thikana"
                  value={formData.maternalGrandFatherthikana || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-sm-6">
                <label htmlFor="maternalGrandMotherName" className="form-label">
                  Maternal Grand Mother Name
                </label>
                <input
                  type="text"
                  className="form-control rounded-0"
                  id="maternalGrandMotherName"
                  name="maternalGrandMotherName"
                  placeholder="Enter Name"
                  value={formData.maternalGrandMotherName || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-sm-6">
                <label
                  htmlFor="maternalGrandMotherdaughterOf"
                  className="form-label"
                >
                  Daughter of
                </label>
                <input
                  type="text"
                  className="form-control rounded-0"
                  id="maternalGrandMotherdaughterOf"
                  name="maternalGrandMotherdaughterOf"
                  placeholder="Enter Name"
                  value={formData.maternalGrandMotherdaughterOf || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-sm-6">
                <label
                  htmlFor="maternalGrandMotherthikana"
                  className="form-label"
                >
                  Thikana
                </label>
                <input
                  type="text"
                  className="form-control rounded-0"
                  id="maternalGrandMotherthikana"
                  name="maternalGrandMotherthikana"
                  placeholder="Maternal Grand Mother Thikana"
                  value={formData.maternalGrandMotherthikana || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <label>All Mamosa</label>
            <div className="mt-2 p-3" style={{ backgroundColor: "wheat" }}>
              {!formData.mamosa || formData.mamosa.length === 0 ? (
                <div className="row">
                  <div className="col-12 text-end">
                    <span
                      className="custom-add text-danger"
                      onClick={() => handleAddRow("mamosa")}
                      style={{ cursor: "pointer", fontWeight: "600" }}
                    >
                      + ADD
                    </span>
                  </div>
                </div>
              ) : (
                formData.mamosa?.map((item, index) => (
                  <div key={index} className="row">
                    <div className="col-md-4">
                      <label htmlFor={`mamosa-name-${index}`}>Mamosa</label>
                      <input
                        type="text"
                        id={`mamosa-name-${index}`}
                        name="name"
                        className="form-control rounded-0"
                        placeholder=""
                        aria-label="name"
                        value={item.name || ""}
                        onChange={(e) => handleInputChange(e, index, "mamosa")}
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor={`mamosa-marriedto-${index}`}>
                        Married To
                      </label>
                      <input
                        type="text"
                        id={`mamosa-marriedto-${index}`}
                        name="marriedto"
                        className="form-control rounded-0"
                        placeholder=""
                        aria-label="marriedto"
                        value={item.marriedto || ""}
                        onChange={(e) => handleInputChange(e, index, "mamosa")}
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor={`mamosa-daughterof-${index}`}>
                        Daughter Of
                      </label>
                      <input
                        type="text"
                        id={`mamosa-daughterof-${index}`}
                        name="daughterof"
                        className="form-control rounded-0"
                        placeholder="Mj. Thakur"
                        aria-label="daughterof"
                        value={item.daughterof || ""}
                        onChange={(e) => handleInputChange(e, index, "mamosa")}
                      />
                    </div>
                    <div className="col-md-4 mb-2">
                      <label htmlFor={`mamosa-thikana-${index}`}>Thikana</label>
                      <input
                        type="text"
                        id={`mamosa-thikana-${index}`}
                        name="thikana"
                        className="form-control rounded-0"
                        placeholder="City"
                        aria-label="thikana"
                        value={item.thikana || ""}
                        onChange={(e) => handleInputChange(e, index, "mamosa")}
                      />
                    </div>
                    <hr />
                    <div className="col-12 text-end">
                      {/* Show Add button only for the last row */}
                      {index === formData.mamosa.length - 1 && (
                        <span
                          className="custom-add text-danger"
                          onClick={() => handleAddRow("mamosa")}
                          style={{
                            cursor: "pointer",
                            marginRight: "10px",
                            fontWeight: "600",
                          }}
                        >
                          + ADD
                        </span>
                      )}

                      {/* Show Remove button for all rows except the first one */}
                      {index > 0 && (
                        <span
                          className="custom-remove text-danger"
                          onClick={() => handleRemoveRow(index, "mamosa")}
                          style={{ cursor: "pointer", fontWeight: "600" }}
                        >
                          - REMOVE
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <label>All Masisa</label>
            <div className="mt-2 p-3" style={{ backgroundColor: "wheat" }}>
              {!formData.masisa || formData.masisa.length === 0 ? (
                <div className="row">
                  <div className="col-12 text-end">
                    <span
                      className="custom-add text-danger"
                      onClick={() => handleAddRow("masisa")}
                      style={{ cursor: "pointer", fontWeight: "600" }}
                    >
                      + ADD
                    </span>
                  </div>
                </div>
              ) : (
                formData.masisa?.map((item, index) => (
                  <div key={index} className="row">
                    <div className="col-md-4">
                      <label htmlFor={`masisa-name-${index}`}>Masisa</label>
                      <input
                        type="text"
                        id={`masisa-name-${index}`}
                        name="name"
                        className="form-control rounded-0"
                        placeholder=""
                        aria-label="name"
                        value={item.name || ""}
                        onChange={(e) => handleInputChange(e, index, "masisa")}
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor={`masisa-marriedto-${index}`}>
                        Married To
                      </label>
                      <input
                        type="text"
                        id={`masisa-marriedto-${index}`}
                        name="marriedto"
                        className="form-control rounded-0"
                        placeholder=""
                        aria-label="marriedto"
                        value={item.marriedto || ""}
                        onChange={(e) => handleInputChange(e, index, "masisa")}
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor={`masisa-daughterof-${index}`}>Son Of</label>
                      <input
                        type="text"
                        id={`masisa-sonof-${index}`}
                        name="sonof"
                        className="form-control rounded-0"
                        placeholder=""
                        aria-label="sonof"
                        value={item.sonof || ""}
                        onChange={(e) => handleInputChange(e, index, "masisa")}
                      />
                    </div>
                    <div className="col-md-4 mb-2">
                      <label htmlFor={`masisa-thikana-${index}`}>Thikana</label>
                      <input
                        type="text"
                        id={`masisa-thikana-${index}`}
                        name="thikana"
                        className="form-control rounded-0"
                        placeholder=""
                        aria-label="thikana"
                        value={item.thikana || ""}
                        onChange={(e) => handleInputChange(e, index, "masisa")}
                      />
                    </div>
                    <hr />
                    <div className="col-12 text-end">
                      {/* Show Add button only for the last row */}
                      {index === formData.masisa.length - 1 && (
                        <span
                          className="custom-add text-danger"
                          onClick={() => handleAddRow("masisa")}
                          style={{
                            cursor: "pointer",
                            marginRight: "10px",
                            fontWeight: "600",
                          }}
                        >
                          + ADD
                        </span>
                      )}

                      {/* Show Remove button for all rows except the first one */}
                      {index > 0 && (
                        <span
                          className="custom-remove text-danger"
                          onClick={() => handleRemoveRow(index, "masisa")}
                          style={{ cursor: "pointer", fontWeight: "600" }}
                        >
                          - REMOVE
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {error && <p className="error-text">{error}</p>}

            <div className={style.modalFooter}>
              <button
                type="button"
                className={`btn btn-primary ${style.saveButton}`}
                onClick={handleSaveClick}
              >
                SAVE
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PaternalfamilyinfoForm;

// import React from "react";
// import { AiOutlineClose } from "react-icons/ai";
// import style from "./Form.module.css";

// function PaternalFamilyInfoForm({
//   handleCancelClick,
//   handleAddRow,
//   handleInputChange,
//   formData,
//   handleSaveClick,
// }) {
//   return (
//     <div className={style.modalContainer}>
//       <div className={style.modalContent}>
//         <div className={style.modalHeader}>
//           <h1>Paternal Family Details</h1>
//           <div>
//             <AiOutlineClose
//               onClick={handleCancelClick}
//               className={style.closeIcon}
//             />
//           </div>
//         </div>

//         <form className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             {/* BadePapa Section */}
//             <div className="sub-title mt-4">All BadePapa</div>
//             <div className="mt-2 p-3" style={{ backgroundColor: "wheat" }}>
//               <div className="row">
//                 <div className="col-md-4">
//                   <label htmlFor="name">BadePapa</label>
//                   <input
//                     type="text"
//                     id="name"
//                     name="badePapa.name"
//                     className="form-control"
//                     placeholder="Late Maharaj Maan Singh Ji Jhala"
//                     aria-label="name"
//                     value={formData.badePapa?.name || ""}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div className="col-md-4">
//                   <label htmlFor="marriedto">Married To</label>
//                   <input
//                     type="text"
//                     id="marriedto"
//                     name="badePapa.marriedto"
//                     className="form-control"
//                     placeholder="Hans Kunwar"
//                     aria-label="marriedto"
//                     value={formData.badePapa?.marriedto || ""}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div className="col-md-4">
//                   <label htmlFor="daughterof">Daughter Of</label>
//                   <input
//                     type="text"
//                     id="daughterof"
//                     name="badePapa.daughterof"
//                     className="form-control"
//                     placeholder="Mj. Thakur Chawand Singh"
//                     aria-label="daughterof"
//                     value={formData.badePapa?.daughterof || ""}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div className="col-md-4">
//                   <label htmlFor="Thikana">Thikana</label>
//                   <input
//                     type="text"
//                     id="Thikana"
//                     name="badePapa.Thikana"
//                     className="form-control"
//                     placeholder="Gyangarh, Mewar"
//                     aria-label="Thikana"
//                     value={formData.badePapa?.Thikana || ""}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//               </div>
//               <div className="row">
//                 <div className="col-12 text-end text-danger">
//                   <span
//                     className="custom-add"
//                     onClick={() => handleAddRow("badePapa")}
//                   >
//                     + ADD
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* BadeChacha Section */}
//             <div className="sub-title mt-4">All Kakosa</div>
//             <div className="mt-2 p-3" style={{ backgroundColor: "wheat" }}>
//               <div className="row">
//                 <div className="col-md-4">
//                   <label htmlFor="name">kakosa</label>
//                   <input
//                     type="text"
//                     id="name"
//                     name="badeChacha.name"
//                     className="form-control"
//                     placeholder="Late Maharaj Maan Singh Ji Jhala"
//                     aria-label="name"
//                     value={formData.badeChacha?.name || ""}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div className="col-md-4">
//                   <label htmlFor="marriedto">Married To</label>
//                   <input
//                     type="text"
//                     id="marriedto"
//                     name="badeChacha.marriedto"
//                     className="form-control"
//                     placeholder="Hans Kunwar"
//                     aria-label="marriedto"
//                     value={formData.badeChacha?.marriedto || ""}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div className="col-md-4">
//                   <label htmlFor="daughterof">Daughter Of</label>
//                   <input
//                     type="text"
//                     id="daughterof"
//                     name="badeChacha.daughterof"
//                     className="form-control"
//                     placeholder="Mj. Thakur Chawand Singh"
//                     aria-label="daughterof"
//                     value={formData.badeChacha?.daughterof || ""}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div className="col-md-4">
//                   <label htmlFor="Thikana">Thikana</label>
//                   <input
//                     type="text"
//                     id="Thikana"
//                     name="badeChacha.Thikana"
//                     className="form-control"
//                     placeholder="Gyangarh, Mewar"
//                     aria-label="Thikana"
//                     value={formData.badeChacha?.Thikana || ""}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//               </div>
//               <div className="row">
//                 <div className="col-12 text-end text-danger">
//                   <span
//                     className="custom-add"
//                     onClick={() => handleAddRow("badeChacha")}
//                   >
//                     + ADD
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className={style.modalFooter}>
//             <button
//               type="button"
//               className={`btn btn-primary ${style.saveButton}`}
//               onClick={handleSaveClick}
//             >
//               SAVE
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default PaternalFamilyInfoForm;
