import React, { useEffect } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import style from "./RequestCard.module.css";
import { formatDate, calculateAge } from "../ProfileComp/ProfileInfoHeader";

const ProfileBoxCard = ({ profile, handleCheck, ProfileImagerender }) => {
  return (
    <div
      className="col-12 col-md-6 mb-3 p-1 p-sm-2"
      style={{ boxSizing: "border-box" }}
    >
      <div className="card shadow-sm border-0 rounded-3 overflow-hidden h-100" style={{ border: "1px solid rgba(212, 175, 55, 0.15)" }}>
        <div
          className="row g-0 h-100"
          style={{ boxSizing: "border-box" }}
        >
          <div
            className="col-5 d-flex align-items-center justify-content-center bg-light"
            style={{ minHeight: "180px", overflow: "hidden" }}
          >
            {profile && <ProfileImagerender profile={profile} />}
          </div>

          <div className="col-7">
            <div className="card-body p-3 d-flex flex-column justify-content-between h-100">
              <div>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "700",
                      fontFamily: "Lustria, serif",
                      color: "var(--royal-maroon, #991c1c)"
                    }}
                  >
                    ID: {profile?.martrId}
                  </span>
                  {handleCheck && (
                    <button
                      onClick={() => handleCheck(profile._id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#e53e3e",
                        cursor: "pointer",
                        padding: "2px 6px",
                        borderRadius: "50%",
                        transition: "background-color 0.2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fee2e2"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                      title="Remove"
                    >
                      <AiOutlineDelete size={18} />
                    </button>
                  )}
                </div>

                <div className="profile-details-mini-list">
                  <p className="card-text mb-1 d-flex justify-content-between align-items-center" style={{ fontSize: "0.85rem" }}>
                    <span className="text-secondary">Clan:</span>
                    <span className="fw-bold text-dark">{profile?.HoroscopicId?.clan || "N/A"}</span>
                  </p>

                  <p className="card-text mb-1 d-flex justify-content-between align-items-center" style={{ fontSize: "0.85rem" }}>
                    <span className="text-secondary">Age:</span>
                    <span className="fw-bold text-dark">{calculateAge(profile.dateOfBirth)} Years</span>
                  </p>

                  <p className="card-text mb-1 d-flex justify-content-between align-items-center" style={{ fontSize: "0.85rem" }}>
                    <span className="text-secondary">Location:</span>
                    <span
                      className="fw-bold text-dark text-end"
                      style={{
                        maxWidth: "110px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={`${profile.address?.city || ""}, ${profile.address?.state || ""}`}
                    >{`${profile.address?.city || "N/A"}`}</span>
                  </p>

                  <p className="card-text mb-1 d-flex justify-content-between align-items-center" style={{ fontSize: "0.85rem" }}>
                    <span className="text-secondary">Education:</span>
                    <span 
                      className="fw-bold text-dark text-end"
                      style={{
                        maxWidth: "110px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={profile.profdetailsId?.qualifications || "N/A"}
                    >
                      {profile.profdetailsId?.qualifications || "N/A"}
                    </span>
                  </p>

                  <p className="card-text mb-0 d-flex justify-content-between align-items-center" style={{ fontSize: "0.85rem" }}>
                    <span className="text-secondary">Occupation:</span>
                    <span 
                      className="fw-bold text-dark text-end"
                      style={{
                        maxWidth: "110px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={profile.familydetailsId?.occupation || "N/A"}
                    >
                      {profile.familydetailsId?.occupation || "N/A"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileBoxCard;

