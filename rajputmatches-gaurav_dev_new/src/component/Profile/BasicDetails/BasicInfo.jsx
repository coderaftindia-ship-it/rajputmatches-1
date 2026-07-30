import React, { useState, useEffect } from "react";
import styles from "./Mydetails.module.css";
import FormCard from "../Forms/FormCard";
import { FaRegEdit } from "react-icons/fa";
import { useAuth } from "../../Layout/AuthContext";
import { useProfileDetails } from "../../../context/ProfileDetailsContext";

function BasicInfo() {
  const { updateData } = useAuth();
  const { user, refreshSection } = useProfileDetails();
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Initial state for details and formData
  const [details, setDetails] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    mobile: "",
    email: "",
    height: "",
    weight: "",
    maritalStatus: "",
    additionalInfo: "",
    countryCode: "",
  });

  const [formData, setFormData] = useState({ ...details });

  const applyUserData = (userData) => {
    if (!userData) return;

    const formattedHeight = userData.height
      ? `${userData.height.feet}'${userData.height.inches}"`
      : "N/A";

    const formattedDateOfBirth = userData.dateOfBirth
      ? userData.dateOfBirth.split("T")[0]
      : "N/A";

    setDetails({
      firstName: userData.firstName || "N/A",
      middleName: userData.middleName || "N/A",
      lastName: userData.lastName || "N/A",
      dateOfBirth: formattedDateOfBirth,
      mobile: userData.mobile || "N/A",
      email: userData.email || "N/A",
      height: formattedHeight,
      weight: userData.weight || "N/A",
      maritalStatus: userData.maritalStatus || "N/A",
      additionalInfo: userData.additionalInfo || "N/A",
    });

    setFormData({
      firstName: userData.firstName || "",
      middleName: userData.middleName || "",
      lastName: userData.lastName || "",
      dateOfBirth: formattedDateOfBirth,
      mobile: userData.mobile || "",
      email: userData.email || "",
      heightFeet: userData.height?.feet || "",
      heightInch: userData.height?.inches || "",
      height: {
        feet: userData.height?.feet || "",
        inches: userData.height?.inches || "",
      },
      weight: userData.weight || "",
      maritalStatus: userData.maritalStatus || "",
      additionalInfo: userData.additionalInfo || "",
      countryCode: userData.countryCode || "",
    });
  };

  const verifyInput = (name, value) => {
    const nameRegex = /^[a-zA-Z]{1,20}$/;
    const mobileRegex = /^\d{6,14}$/;
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook|hotmail|aol|icloud)\.(com|co|in)$/;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const weightRegex = /^(?:1[0-4][0-9]|150|[1-9]?[0-9])$/;
    const countryCodeRegex = /^\+?[1-9]\d{0,3}$/;

    let errorMsg = "";

    switch (name) {
      case "firstName":
      case "middleName":
      case "lastName":
      case "maritalStatus":
        if (!nameRegex.test(value)) {
          errorMsg = "Only alphabetic characters allowed (1-20).";
        }
        break;

      case "mobile":
        if (!mobileRegex.test(value)) {
          errorMsg = "Invalid mobile number (6-14 digits).";
        }
        break;

      case "email":
        if (!emailRegex.test(value)) {
          errorMsg = "Invalid email format.";
        }
        break;
      case "dateOfBirth":
        if (!dateRegex.test(value)) {
          errorMsg = "Invalid date format (YYYY-MM-DD).";
        } else {
          const selectedDate = new Date(value);
          const today = new Date();
          const minDate = new Date(
            today.getFullYear() - 18,
            today.getMonth(),
            today.getDate()
          );

          if (selectedDate > today) {
            errorMsg = "Date of birth cannot be in the future.";
          } else if (selectedDate > minDate) {
            errorMsg = "You must be at least 18 years old.";
          }
        }
        break;

      case "weight":
        if (!weightRegex.test(value)) {
          errorMsg = "Weight must be between 1 and 150 kg.";
        }
        break;

      case "countryCode":
        if (!countryCodeRegex.test(value)) {
          errorMsg = "Invalid country code format.";
        }
        break;

      default:
        errorMsg = "";
    }

    setError(errorMsg);

    return !errorMsg;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (value.length > 25) {
      setError("Input cannot exceed 25 characters.");
      return;
    } else {
      setError("");
    }

    if (name === "heightFeet" || name === "heightInch") {
      setFormData((prev) => ({
        ...prev,
        height: {
          ...prev.height,
          [name === "heightFeet" ? "feet" : "inches"]:
            parseInt(value, 10) || "",
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveClick = async () => {
    const isValid = Object.keys(formData).every((key) =>
      verifyInput(key, formData[key])
    );
    if (!isValid) return;
    try {
      const route = "update-profile";
      await updateData(route, formData, true);
      setIsEditing(false);
      await refreshSection("user");
    } catch (error) {
      console.error("Error updating data:", error.message);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setFormData(details);
  };

  // Cancel edit mode
  const handleCancelClick = () => {
    setFormData(details);
    setIsEditing(false);
  };

  // Fetch data on component mount or when edit mode changes
  useEffect(() => {
    if (!isEditing) {
      applyUserData(user);
    }
  }, [isEditing, user]);

  return (
    <div className={styles.appContainer}>
      <div className={styles.detailsHeader}>
        <h4 className={styles.headerTitle}>Basic Details</h4>
        {!isEditing ? (
          <div onClick={handleEditClick} className={styles.editBtn}>
            <FaRegEdit size="18" />
          </div>
        ) : (
          <FormCard
            handleCancelClick={handleCancelClick}
            details={details}
            handleInputChange={handleInputChange}
            formData={formData}
            handleSaveClick={handleSaveClick}
            error={error}
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
              {key.toLowerCase() === "weight" ? " (kg)" : ""}
            </div>

            <div className={styles.value}>
              {details[key] && typeof details[key] === "object"
                ? JSON.stringify(details[key], null, 2)
                : details[key] || "N/A"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BasicInfo;
