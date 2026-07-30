import React, { useState } from "react";
import style from "../BasicDetails/Mydetails.module.css";
import FormCard from "../Forms/FormCard";
import { FaRegEdit } from "react-icons/fa";

function PrefrenceDetails() {
  const [details, setDetails] = useState({
    preferredAgeRange: "Self",
    preferredHeight: "Chundawat",
    preferredCaste: "",
    preferredEducation: "N/A",
    preferredProfession: "",
    preferredLocation: "",
    lookingFor: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(details);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setFormData(details);
  };

  // const handleCloseModal = () => {};

  const handleSaveClick = () => {
    setDetails(formData);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setFormData(details);
    setIsEditing(false);
  };

  return (
    <div className="app-container">
      <div className="details-header">
        <h4 className="header-title">Partner Preferences</h4>
        {!isEditing ? (
          <div onClick={handleEditClick} className="edit-btn">
           <FaRegEdit  size="18" />
          </div>
        ) : (
          <div>
            <FormCard
              handleCancelClick={handleCancelClick}
              details={details}
              handleInputChange={handleInputChange}
              formData={formData}
              handleSaveClick={handleSaveClick}
            />
          </div>
        )}
      </div>
      <div className="details">
        {Object.entries(details).length > 0 ? (
          <>
            {Object.keys(details).map((key) => (
              <div className="detailItem" key={key}>
                <div className="label">
                  {key
                    .replace(/([A-Z])/g, " $1") // Add space before uppercase letters
                    .replace(/^./, (str) => str.toUpperCase())}
                  :
                </div>
                <div className="value">{details[key]}</div>
              </div>
            ))}
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default PrefrenceDetails;
