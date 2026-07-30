import React from "react";
import styles from "./Mydetails.module.css";
import { FaEdit } from "react-icons/fa";

const BasicDetails = () => {
  return (
    <div className="container-fluid bg-white p-4">
      <h4>Basic Details</h4>
      <div className="row">
        {[
          { label: "Name", value: "Rajendra Singh Bhati" },
          { label: "Weight", value: "75 kg" },
          { label: "Sub Caste", value: "Singh" },
          { label: "Complexion", value: "Fair" },
          { label: "Height", value: "5ft 2in" },
          { label: "Body Type", value: "Average" },
        ].map((detail, index) => (
          <div className="col-sm-5 m-2">
            <div className={styles.textSm}>{detail.label}</div>
            <p className={styles.textXs}>{detail.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BasicDetails;
