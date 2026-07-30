import React, { useState, useEffect } from "react";
import styles from "./Mydetails.module.css";
import EducationinfoForm from "../Forms/EducationinfoForm";
import { FaRegEdit } from "react-icons/fa";
import { useAuth } from "../../Layout/AuthContext";
import { useProfileDetails } from "../../../context/ProfileDetailsContext";

function Educationinfo() {
  const { updateData } = useAuth();
  const { professional, refreshSection } = useProfileDetails();
  const [details, setDetails] = useState({
    qualifications: "",
    institution: "",
    professional: "",
    annualIncome: "",
    hobbies: [],
    additionalInfo: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...details });

  const applyProfessionalData = (userData) => {
    if (!userData) return;

    const normalized = userData.user ?? userData;

    const updatedDetails = {
      qualifications: normalized.qualifications || "",
      institution: normalized.institution || "",
      professional: normalized.professional || "",
      annualIncome: normalized.annualIncome || "",
      hobbies: normalized.hobbies || [],
      additionalInfo: normalized.additionalInfo || "",
      class: normalized.class || "",
    };

    setDetails(updatedDetails);
    setFormData(updatedDetails);
  };

  useEffect(() => {
    if (!isEditing) {
      applyProfessionalData(professional);
    }
  }, [professional, isEditing]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const route = "save-professional-data";
      await updateData(route, formData, true);
      setIsEditing(false);
      await refreshSection("professional");
    } catch (error) {
      console.error("Error updating data:", error.message);
    }
  };

  const handleCancelClick = () => {
    setFormData(details);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let validValue = value;

    const textRegex = /^[a-zA-Z0-9\s,./"'()-]*$/;
    const incomeRegex = /^(Below \d+ LPA|\d+-\d+ LPA|Above \d+ LPA)?$/;
    const hobbiesRegex = /^[a-zA-Z\s,]{1,40}$/;
    const additionalInfoRegex = /^[a-zA-Z0-9.,'"() ]{0,100}$/;

    if (["qualifications", "institution", "class"].includes(name)) {
      // Allow letters, spaces, commas, single/double quotes, and slashes
      if (!/^[a-zA-Z\s,/'"]*$/.test(value)) return;
    } else if (name === "professional") {
      if (!textRegex.test(value)) return;
    } else if (name === "annualIncome") {
      if (!incomeRegex.test(value)) return;
    } else if (name === "hobbies") {
      if (!hobbiesRegex.test(value)) return;
      validValue = value.split(",").map((hobby) => hobby.trim());
    } else if (name === "additionalInfo") {
      if (!additionalInfoRegex.test(value)) return;
    }

    setFormData({ ...formData, [name]: validValue });
  };

  return (
    <div className={styles.appContainer}>
      <div className={styles.detailsHeader}>
        <h4 className={styles.headerTitle}>Academics Details</h4>
        {!isEditing ? (
          <div onClick={handleEditClick} className={styles.editBtn}>
            <FaRegEdit size="18" />
          </div>
        ) : (
          <EducationinfoForm
            handleCancelClick={handleCancelClick}
            handleInputChange={handleInputChange}
            formData={formData}
            handleSaveClick={handleSaveClick}
          />
        )}
      </div>

      <div className={styles.details}>
        {Object.keys(details).map((key) => (
          <div className={styles.detailItem} key={key}>
            <div className={styles.label}>
              {key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </div>
            <div className={styles.value}>
              {Array.isArray(details[key]) && details[key].length > 0
                ? details[key].map((item, index) => (
                    <span key={index}>
                      {item}
                      {index < details[key].length - 1 ? ", " : ""}
                    </span>
                  ))
                : details[key] || "N/A"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Educationinfo;
