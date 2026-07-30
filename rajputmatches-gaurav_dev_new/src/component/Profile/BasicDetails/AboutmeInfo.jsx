import React, { useState } from "react";
import style from "../BasicDetails/Mydetails.module.css";
import FormCard from "../Forms/FormCard";
import { FaRegEdit } from "react-icons/fa";

function AboutmeInfo() {
  const [details, setDetails] = useState({
    profileCreatedBy: "Self",
    maritalStatus: "Chundawat",
    aboutMe:
      "Long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
    totalChildren: "N/A",
    statusChildren: "N/A",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(details);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setDetails(formData);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  return (
    <div className={style.appContainer}>
      <div className={style.detailsHeader}>
        <h4 className={style.headerTitle}>About Me</h4>
        {!isEditing && (
          <button onClick={handleEditClick} className={style.editBtn}>
           <FaRegEdit  size="18" /> Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <FormCard
          handleCancelClick={handleCancelClick}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSaveClick={handleSaveClick}
        />
      ) : (
        <div className={style.details}>
          {Object.keys(details).map((key) => (
            <div className={style.detailItem} key={key}>
              <span className={style.label}>
                {key
                  .replace(/([A-Z])/g, " $1") // Add space before uppercase letters
                  .replace(/^./, (str) => str.toUpperCase())}
                :
              </span>
              <span className={style.value}>{details[key]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AboutmeInfo;
