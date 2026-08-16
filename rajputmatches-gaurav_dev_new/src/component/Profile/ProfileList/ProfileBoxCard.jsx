import React from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { MdBlock } from "react-icons/md";
import style from "./RequestCard.module.css";
import { formatDate, calculateAge } from "../ProfileComp/ProfileInfoHeader";
import { useAuth } from "../../Layout/AuthContext";

const ProfileBoxCard = ({ profile, handleCheck, ProfileImagerender, fetchData }) => {
  const { updateData } = useAuth();

  if (!profile || !profile._id) return null;

  const handleBlockToggle = async () => {
    try {
      if (handleCheck) handleCheck(profile._id);
      await updateData("profile/block-toggle", profile._id, true);
      if (fetchData) fetchData();
    } catch (e) {
      console.error("Block error:", e);
    }
  };
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
                      title={(profile.profdetailsId?.qualificationsList?.length > 0 ? profile.profdetailsId.qualificationsList[0].qualification : null) || profile.profdetailsId?.qualifications || "N/A"}
                    >
                      {(profile.profdetailsId?.qualificationsList?.length > 0 ? profile.profdetailsId.qualificationsList[0].qualification : null) || profile.profdetailsId?.qualifications || "N/A"}
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
                      title={(profile.profdetailsId?.occupationsList?.length > 0 ? profile.profdetailsId.occupationsList[0].occupation : null) || profile.profdetailsId?.professional || profile.familydetailsId?.occupation || "N/A"}
                    >
                      {(profile.profdetailsId?.occupationsList?.length > 0 ? profile.profdetailsId.occupationsList[0].occupation : null) || profile.profdetailsId?.professional || profile.familydetailsId?.occupation || "N/A"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Block Button */}
        <div
          style={{
            borderTop: "1px solid rgba(212,175,55,0.2)",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button
            onClick={handleBlockToggle}
            title="Block Profile"
            style={{
              width: "100%",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              fontSize: "0.78rem",
              fontWeight: 600,
              color: "var(--royal-maroon, #59123B)",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(89,18,59,0.06)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "none"}
          >
            <MdBlock size={15}/> Block
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileBoxCard;

