import React, { useState, useEffect } from "react";
import style from "./Mydetails.module.css";
import { FaRegEdit } from "react-icons/fa";
import FamilyinfoForm from "../Forms/FamilyinfoForm";
import { useAuth } from "../../Layout/AuthContext";
import { useProfileDetails } from "../../../context/ProfileDetailsContext";

function FamilyInfo() {
  const { updateData } = useAuth();
  const { family, refreshSection } = useProfileDetails();
  const [details, setDetails] = useState({
    fatherName: "",
    occupation: "",
    fatherNativePlace: "",
    motherName: "",
    motherNativePlace: "",
    maternalGotra: "",
    siblings: "",
    familyLocation: "",
    additionalMaternal: "",
    familyInfo: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(details);

  const applyFamilyData = (userData) => {
    if (!userData) return;

    const nextDetails = {
      fatherName: userData.fatherName || "",
      occupation: userData.occupation || "",
      fatherNativePlace: userData.fatherNativePlace || "",
      motherName: userData.motherName || "",
      motherNativePlace: userData.motherNativePlace || "",
      maternalGotra: userData.maternalGotra || "",
      siblings: userData.siblings || "",
      familyLocation: userData.familyLocation || "",
      additionalMaternal: userData.additionalMaternal || "",
      familyInfo: userData.familyInfo || "",
    };

    setDetails(nextDetails);
    setFormData(nextDetails);
  };

  useEffect(() => {
    if (!isEditing) {
      applyFamilyData(family);
    }
  }, [family, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validation regex patterns
    const regexPatterns = {
      fatherName: /^[A-Za-z\s]+$/, // Only letters and spaces
      occupation: /^[A-Za-z\s]+$/, // Only letters and spaces
      fatherNativePlace: /^[A-Za-z\s]+$/, // Only letters and spaces
      motherName: /^[A-Za-z\s]+$/, // Only letters and spaces
      motherNativePlace: /^[A-Za-z\s]+$/, // Only letters and spaces
      maternalGotra: /^[A-Za-z\s]+$/, // Only letters and spaces
      siblings: /^[0-9]{1}$/, // Only single-digit numbers (0-9)
      familyLocation: /^[A-Za-z\s]+$/, // Only letters and spaces
      additionalMaternal: /^[0-2]{1}$/, // Only numbers 0, 1, or 2
      familyInfo: /^[A-Za-z0-9\s,.;!?]*$/,
    };

    // If the value is empty, just update the state without validation
    if (value === "") {
      setFormData({ ...formData, [name]: value });
      return;
    }

    // Validate the value based on field name
    if (regexPatterns[name] && !regexPatterns[name].test(value)) {
      console.log(`Invalid value for ${name}: ${value}`);
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setFormData(details);
  };

  const handleSaveClick = async () => {
    setDetails(formData);
    try {
      const route = "update-family-details";
      console.log("Saving Data:", formData);
      await updateData(route, formData, true);
      setIsEditing(false);
      await refreshSection("family");
    } catch (error) {
      console.error("Error updating data:", error.message);
    }
  };

  const handleCancelClick = () => {
    setFormData(details);
    setIsEditing(false);
  };

  return (
    <div className={style.appContainer}>
      <div className={style.detailsHeader}>
        <h4 className={style.headerTitle}>Family Details</h4>
        {!isEditing ? (
          <div onClick={handleEditClick} className={style.editBtn}>
           <FaRegEdit  size="18" />
          </div>
        ) : (
          <FamilyinfoForm
            handleCancelClick={handleCancelClick}
            handleInputChange={handleInputChange}
            formData={formData}
            handleSaveClick={handleSaveClick}
          />
        )}
      </div>

      <div className={style.details}>
        {Object.keys(details).map((key) => (
          <div className={style.detailItem} key={key}>
            <div className={style.label}>
              {key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </div>
            <div className={style.value}>
              {details[key] && typeof details[key] === "object"
                ? JSON.stringify(details[key], null, 2) // Format objects as strings
                : details[key] || "N/A"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FamilyInfo;
