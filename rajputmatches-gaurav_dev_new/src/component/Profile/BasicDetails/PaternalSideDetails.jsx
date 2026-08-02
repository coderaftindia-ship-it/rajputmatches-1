import React, { useState } from "react";
import style from "./Mydetails.module.css";
import PaternalfamilyinfoForm from "../Forms/PaternalfamilyinfoForm";
import { FaRegEdit } from "react-icons/fa";
import { useAuth } from "../../Layout/AuthContext";
import { useProfileDetails } from "../../../context/ProfileDetailsContext";
import { useEffect } from "react";

function PaternalSideDetails() {
  const { updateData } = useAuth();
  const { extendedFamily, refreshSection } = useProfileDetails();
  const [isEditing, setIsEditing] = useState(false);
  const [view, setView] = useState(false);
  const [error, setError] = useState("");

  const keyNameMapping = {
    grandFatherName: "Grandfather Name",
    grandFathersonOf: "Son of",
    grandFatheroccupation: "Occupation",
    grandFatherthikana: "Native Place",
    grandMotherName: "GrandMother Name",
    grandMotherdaughterOf: "Daughter of",
    grandmotherthikana: "Native Place",
    maternalGrandFatherName: "Maternal Grandfather",
    maternalGrandFathersonOf: "Son of",
    maternalGrandFatheroccupation: "Occupation",
    maternalGrandFatherthikana: "Native Place",
    maternalGrandMotherName: "Maternal Grandmother",
    maternalGrandMotherdaughterOf: "Daughter of",
    maternalGrandMotherthikana: "Native Place",
  };

  const excludedKeys = ["badePapa", "kakosa", "mamosa", "masisa", "bhuasa"];

  const [details, setDetails] = useState({
    grandFatherName: "",
    grandFathersonOf: "",
    grandFatheroccupation: "",
    grandFatherthikana: "",
    grandMotherName: "",
    grandMotherdaughterOf: "",
    grandmotherthikana: "",
    badePapa: [{ name: "", marriedto: "", daughterof: "", thikana: "" }],
    kakosa: [{ name: "", marriedto: "", daughterof: "", thikana: "" }],
    bhuasa: [{ name: "", marriedto: "", sonof: "", thikana: "" }],
    maternalGrandFatherName: "",
    maternalGrandFatherthikana: "",
    maternalGrandFathersonOf: "",
    maternalGrandFatheroccupation: "",
    maternalGrandMotherName: "",
    maternalGrandMotherdaughterOf: "",
    maternalGrandMotherthikana: "",
    mamosa: [{ name: "", marriedto: "", daughterof: "", thikana: "" }],
    masisa: [{ name: "", marriedto: "", sonof: "", thikana: "" }],
  });
  const [formData, setFormData] = useState(details);

  const handletoggle = () => setView(!view);

  const applyExtendedFamilyData = (userData) => {
    if (!userData) return;

    const normalized = userData.user ?? userData;
    const { createdAt, updatedAt, _id, userId, ...filteredUserData } = normalized;

    const relativeArrays = ["badePapa", "kakosa", "bhuasa", "mamosa", "masisa"];
    relativeArrays.forEach((arrKey) => {
      if (!Array.isArray(filteredUserData[arrKey]) || filteredUserData[arrKey].length === 0) {
        filteredUserData[arrKey] = [
          {
            name: "",
            marriedto: "",
            ...(arrKey === "masisa" || arrKey === "bhuasa"
              ? { sonof: "" }
              : { daughterof: "" }),
            thikana: "",
          },
        ];
      }
    });

    const mergedDetails = { ...details, ...filteredUserData };
    setDetails(mergedDetails);
    setFormData(mergedDetails);
  };

  useEffect(() => {
    if (!isEditing) {
      applyExtendedFamilyData(extendedFamily);
    }
  }, [extendedFamily, isEditing]);

  const handleSaveClick = async () => {
    setError("");

    const cleanedPayload = { ...formData };
    const relativeArrays = ["badePapa", "kakosa", "bhuasa", "mamosa", "masisa"];

    relativeArrays.forEach((arrayName) => {
      if (Array.isArray(cleanedPayload[arrayName])) {
        cleanedPayload[arrayName] = cleanedPayload[arrayName].filter((item) => {
          if (!item || typeof item !== "object") return false;
          return Object.keys(item).some((key) => {
            if (key === "_id" || key === "id") return false;
            return typeof item[key] === "string" && item[key].trim().length > 0;
          });
        });
      }
    });

    try {
      const route = "updatepaternal-details";
      await updateData(route, cleanedPayload, true);
      setIsEditing(false);
      await refreshSection("extendedFamily");
    } catch (error) {
      console.error("Error updating data:", error.message);
      setError("Failed to save paternal details. Please try again.");
    }
  };

  const handleInputChange = (e, index, arrayName) => {
    const { name, value } = e.target;

    const nameRegex = /^[a-zA-Z\s]{0,25}$/;
    const placeRegex = /^[a-zA-Z\s,.'-]{0,25}$/;

    if (!nameRegex.test(value) && !placeRegex.test(value)) return;

    if (arrayName) {
      const updatedArray = [...(formData[arrayName] || [])];
      updatedArray[index] = { ...updatedArray[index], [name]: value };
      setFormData({ ...formData, [arrayName]: updatedArray });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddRow = (arrayName) => {
    const newRow = {
      name: "",
      marriedto: "",
      ...(arrayName === "masisa" || arrayName === "bhuasa"
        ? { sonof: "" }
        : { daughterof: "" }),
      thikana: "",
    };
    const currentList = Array.isArray(formData[arrayName]) ? formData[arrayName] : [];
    setFormData({ ...formData, [arrayName]: [...currentList, newRow] });
  };

  const handleRemoveRow = (index, arrayName) => {
    const currentList = Array.isArray(formData[arrayName]) ? formData[arrayName] : [];
    if (currentList.length <= 1) {
      const clearedRow = {
        name: "",
        marriedto: "",
        ...(arrayName === "masisa" || arrayName === "bhuasa"
          ? { sonof: "" }
          : { daughterof: "" }),
        thikana: "",
      };
      setFormData({ ...formData, [arrayName]: [clearedRow] });
      return;
    }
    const updatedArray = currentList.filter((_, i) => i !== index);
    setFormData({ ...formData, [arrayName]: updatedArray });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setFormData(details);
    setIsEditing(false);
  };

  return (
    <div className={style.appContainer}>
      <div className={style.detailsHeader}>
        <h4 className={style.headerTitle}>Paternal Details</h4>
        {!isEditing ? (
          <div onClick={handleEditClick} className={style.editBtn}>
            <FaRegEdit size="18" />
          </div>
        ) : (
          <div>
            <PaternalfamilyinfoForm
              handleCancelClick={handleCancelClick}
              handleAddRow={handleAddRow}
              handleRemoveRow={handleRemoveRow}
              handleInputChange={handleInputChange}
              formData={formData}
              handleSaveClick={handleSaveClick}
              error={error}
            />
          </div>
        )}
      </div>
      {/* <div className={style.details}>
        {Object.entries(details).length > 0 ? (
          <>
            {Object.keys(details)
              .filter(
                (key) =>
                  !Array.isArray(details[key]) && // Exclude array values
                  !["badePapa", "kakosa", "mamosa", "masisa"].includes(key) // Exclude specific keys
              )
              .map((key) => (
                <div className={style.detailItem} key={key}>
                  <div className={`${style.label}`}>
                    {key
                      .replace(/([A-Z])/g, " $1") // Add space before uppercase letters
                      .replace(/^./, (str) => str.toUpperCase())}
                  </div>
                  <div className={`${style.value}`}>
                    {details[key] && typeof details[key] === "object"
                      ? JSON.stringify(details[key], null, 2) // Format objects as strings
                      : details[key] || "N/A"}
                  </div>
                </div>
              ))}

            <div className="">
              {!view && (
                <div className="text-danger fw-bold" onClick={handletoggle}>
                  View more
                </div>
              )}
              {view && (
                <>
                  <BadePapaHukum details={details} />
                  <KakosaHukum details={details} />
                  <MamosaHukum details={details} />
                  <MasisaHukum details={details} />
                  <div className="text-danger fw-bold" onClick={handletoggle}>
                    View less
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div> */}

      {/* <div className={style.details}>
  {Object.entries(details).length > 0 ? (
    <>
      {Object.keys(details)
        .filter((key) => !Array.isArray(details[key]) && !excludedKeys.includes(key))
        .slice(0, 7)
        .map((key) => (
          <div className={style.detailItem} key={key}>
            <div className={`${style.label}`}>
              {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
            </div>
            <div className={`${style.value}`}>
              {details[key] && typeof details[key] === "object"
                ? JSON.stringify(details[key], null, 2)
                : details[key] || "N/A"}
            </div>
          </div>
        ))}

      <div>
        {!view ? (
          <div className="text-danger fw-bold" onClick={handletoggle}>
            View more
          </div>
        ) : (
          <>
            <BadePapaHukum details={details} />
            <KakosaHukum details={details} />

            {Object.keys(details)
              .filter((key) => !Array.isArray(details[key]) && !excludedKeys.includes(key))
              .slice(7, 14)
              .map((key) => (
                <div className={style.detailItem} key={key}>
                  <div className={`${style.label}`}>
                    {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                  </div>
                  <div className={`${style.value}`}>
                    {details[key] && typeof details[key] === "object"
                      ? JSON.stringify(details[key], null, 2)
                      : details[key] || "N/A"}
                  </div>
                </div>
              ))}

            <div className="tables-section">
              <MamosaHukum details={details} />
              <MasisaHukum details={details} />
            </div>

            <div className="text-danger fw-bold" onClick={handletoggle}>
              View less
            </div>
          </>
        )}
      </div>
    </>
  ) : (
    <p>Loading...</p>
  )}
</div> */}
      <div className={style.details}>
        {Object.entries(details).length > 0 ? (
          <>
            {/* Show first 7 keys */}
            {Object.keys(details)
              .filter(
                (key) =>
                  !Array.isArray(details[key]) && !excludedKeys.includes(key)
              )
              .slice(0, 7)
              .map((key) => (
                <div className={style.detailItem} key={key}>
                  <div className={`${style.label}`}>
                    {keyNameMapping[key] || key} {/* Use mapped key name */}
                  </div>
                  <div className={`${style.value}`}>
                    {details[key] && typeof details[key] === "object"
                      ? JSON.stringify(details[key], null, 2)
                      : details[key] || "N/A"}
                  </div>
                </div>
              ))}

            <div>
              {!view ? (
                <div
                  className="text-danger fw-bold text-decoration-underline mb-4 mt-4"
                  onClick={handletoggle}
                >
                  View more
                </div>
              ) : (
                <>
                  <BadePapaHukum details={details} />
                  <KakosaHukum details={details} />
                  <BhuasaHukum details={details} />

                  {/* Show the next 7 keys */}
                  {Object.keys(details)
                    .filter(
                      (key) =>
                        !Array.isArray(details[key]) &&
                        !excludedKeys.includes(key)
                    )
                    .slice(7, 14)
                    .map((key) => (
                      <div className={style.detailItem} key={key}>
                        <div className={`${style.label}`}>
                          {keyNameMapping[key] || key}{" "}
                          {/* Use mapped key name */}
                        </div>
                        <div className={`${style.value}`}>
                          {details[key] && typeof details[key] === "object"
                            ? JSON.stringify(details[key], null, 2)
                            : details[key] || "N/A"}
                        </div>
                      </div>
                    ))}

                  {/* Display tables */}
                  <div className="tables-section">
                    <MamosaHukum details={details} />
                    <MasisaHukum details={details} />
                  </div>

                  <div
                    className="text-danger fw-bold text-decoration-underline mb-4 mt-4"
                    onClick={handletoggle}
                  >
                    View less
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

function FamilySection({ title, list, type }) {
  const isEmpty = !list || list.length === 0 || list.every(
    item => !item?.name?.trim() && !item?.marriedto?.trim() && !item?.daughterof?.trim() && !item?.sonof?.trim() && !item?.thikana?.trim()
  );

  if (isEmpty) {
    return (
      <div className="mt-3 p-3 rounded bg-white text-center shadow-sm" style={{ border: "1px solid rgba(212, 175, 55, 0.15)" }}>
        <div className="fw-bold mb-1 text-secondary" style={{ fontSize: "0.9rem" }}>{title}</div>
        <span className="text-muted" style={{ fontSize: "0.85rem" }}>Not available</span>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="fw-bold mb-2 text-dark" style={{ fontSize: "1rem", color: "var(--royal-maroon, #991c1c)", borderBottom: "2px solid rgba(153, 37, 37, 0.1)", paddingBottom: "4px" }}>
        {title}
      </div>
      
      {/* Desktop view: Styled Table */}
      <div className="d-none d-md-block table-responsive w-100">
        <table className="table table-hover align-middle border bg-white" style={{ fontSize: "0.9rem" }}>
          <thead className="table-light">
            <tr>
              <th className="text-secondary fw-semibold" style={{ width: "25%" }}>Name</th>
              <th className="text-secondary fw-semibold" style={{ width: "25%" }}>Married to</th>
              <th className="text-secondary fw-semibold" style={{ width: "25%" }}>
                {type === "sonof" ? "Son of" : "D/O"}
              </th>
              <th className="text-secondary fw-semibold" style={{ width: "25%" }}>Thikana</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => (
              <tr key={index}>
                <td className="fw-bold text-dark">{item.name || "N/A"}</td>
                <td>{item.marriedto || "N/A"}</td>
                <td>{item.sonof || item.daughterof || "N/A"}</td>
                <td>{item.thikana || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view: Beautiful visual cards */}
      <div className="d-block d-md-none">
        <div className="d-flex flex-column gap-2">
          {list.map((item, index) => (
            <div key={index} className="p-3 bg-white border rounded-3 shadow-sm" style={{ borderLeft: "4px solid var(--royal-maroon, #991c1c)" }}>
              <div className="d-flex justify-content-between mb-2">
                <span className="fw-bold text-dark" style={{ fontSize: "0.95rem" }}>
                  {item.name || "Name: Not available"}
                </span>
                <span className="badge bg-light text-secondary border" style={{ fontSize: "0.75rem" }}>
                  Record {index + 1}
                </span>
              </div>
              <div className="row g-2" style={{ fontSize: "0.85rem" }}>
                <div className="col-6">
                  <span className="text-muted d-block" style={{ fontSize: "0.75rem", marginBottom: "2px" }}>Married to</span>
                  <span className="fw-semibold text-dark">{item.marriedto || "N/A"}</span>
                </div>
                <div className="col-6">
                  <span className="text-muted d-block" style={{ fontSize: "0.75rem", marginBottom: "2px" }}>
                    {type === "sonof" ? "Son of" : "D/O"}
                  </span>
                  <span className="fw-semibold text-dark">{item.sonof || item.daughterof || "N/A"}</span>
                </div>
                <div className="col-12 mt-2">
                  <span className="text-muted d-block" style={{ fontSize: "0.75rem", marginBottom: "2px" }}>Thikana</span>
                  <span className="fw-semibold text-dark">{item.thikana || "N/A"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BadePapaHukum({ details }) {
  return <FamilySection title="Badepapa Hukum" list={details.badePapa} type="daughterof" />;
}

function KakosaHukum({ details }) {
  return <FamilySection title="Kakosa Hukum" list={details.kakosa} type="daughterof" />;
}

function BhuasaHukum({ details }) {
  return <FamilySection title="Bhuasa Hukum" list={details.bhuasa} type="sonof" />;
}

function MamosaHukum({ details }) {
  return <FamilySection title="Mamosa Hukum" list={details.mamosa} type="daughterof" />;
}

function MasisaHukum({ details }) {
  return <FamilySection title="Masisa Hukum" list={details.masisa} type="sonof" />;
}

export default PaternalSideDetails;
