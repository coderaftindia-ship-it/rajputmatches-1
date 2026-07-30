import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Trash2 } from "lucide-react";
import { formatDate, calculateAge } from "../ProfileComp/ProfileInfoHeader";
import "./ShortListedProfile.css";

function ProfileCard({
  element,
  handleDelete,
  ProfileImagerender,
  handleBookmark,
}) {
  const navigate = useNavigate();

  const handleView = (profileId) => {
    navigate(`view/${profileId}`);
  };

  return (
    <div key={element?._id} className="profile-card-modern">
      {/* Top Header Section */}
      <div className="profile-card-header">
        <div className="profile-card-avatar-wrapper">
          {element?.profile && <ProfileImagerender profile={element?.profile} />}
        </div>
        <div className="profile-card-title-section">
          <span className="profile-card-id-badge">
            Matri ID: {element?.profile?.martrId}
          </span>
          <h3 className="profile-card-name">
            {`${element?.profile?.firstName || ""} ${element?.profile?.middleName || ""} ${element?.profile?.lastName || ""}`.trim() || "Private Name"}
          </h3>
        </div>
      </div>

      {/* Details Grid Section */}
      <div className="profile-card-details-grid">
        <div className="profile-card-detail-item">
          <span className="profile-card-detail-label">Birthdate</span>
          <span className="profile-card-detail-val">
            {formatDate(element?.profile?.dateOfBirth)}
          </span>
        </div>
        <div className="profile-card-detail-item">
          <span className="profile-card-detail-label">Age</span>
          <span className="profile-card-detail-val">
            {calculateAge(element?.profile?.dateOfBirth)} Years
          </span>
        </div>
        <div className="profile-card-detail-item">
          <span className="profile-card-detail-label">Height</span>
          <span className="profile-card-detail-val">
            {element?.profile?.height 
              ? `${element?.profile.height.feet}'${element?.profile.height.inches}"` 
              : "N/A"}
          </span>
        </div>
        <div className="profile-card-detail-item">
          <span className="profile-card-detail-label">Shortlisted Date</span>
          <span className="profile-card-detail-val">
            {formatDate(element?.dateShortlisted)}
          </span>
        </div>
      </div>

      {/* Actions Section */}
      <div className="profile-card-actions-bar">
        <button 
          className="profile-card-btn btn-view-profile"
          onClick={() => handleView(element?.profile?._id)}
        >
          <Eye size={16} />
          <span>View Profile</span>
        </button>
        <button 
          className="profile-card-btn btn-delete-profile"
          onClick={() => handleDelete(element?.profile?._id)}
          title="Remove from shortlisted list"
        >
          <Trash2 size={16} />
          <span>Remove</span>
        </button>
      </div>
    </div>
  );
}

export default ProfileCard;

