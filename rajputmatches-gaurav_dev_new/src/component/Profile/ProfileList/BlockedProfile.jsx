import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Layout/AuthContext";
import { FaUnlock, FaEye } from "react-icons/fa";
import { calculateAge, formatDate } from "../ProfileComp/ProfileInfoHeader";
import placeholderImage from "../../../assets/images/blurimage.png";
import maleDefault from "../../../assets/images/male_default.png";
import femaleDefault from "../../../assets/images/female_default.png";
import "./ShortListedProfile.css";

const BlockedProfile = () => {
  const { fetchUserData, updateData } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const route = "profile/show-blocked";
      const data = await fetchUserData(route);
      if (data && Array.isArray(data)) {
        setProfiles(data);
      } else {
        setProfiles([]);
      }
    } catch (err) {
      console.error("Error fetching blocked profiles:", err);
      setError("An error occurred while fetching blocked profiles.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async (id) => {
    try {
      const route = "profile/block-toggle";
      await updateData(route, id, true);
      // Remove from local state immediately for instant feedback
      setProfiles((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error unblocking profile:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getProfileImage = (prof) => {
    const defaultAvatar = prof?.gender === "Female" ? femaleDefault : maleDefault;
    if (!prof) return defaultAvatar;
    if (prof.filesId) {
      if (prof.filesId.isPrivate) {
        return defaultAvatar;
      }
      if (prof.filesId.photos && prof.filesId.photos.length > 0) {
        return prof.filesId.photos[0].url;
      }
    }
    const url = prof.imageUrl;
    const isDefault = !url || 
      url.includes("profile.png") || 
      url.includes("user-icon-flat-isolated") || 
      url.includes("istockphoto.com");
    if (!isDefault) return url;
    return defaultAvatar;
  };

  if (loading) {
    return (
      <div className="profileContainer">
        <div className="profileListHeader">
          <div className="pagetitle">Blocked Profiles</div>
        </div>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "200px" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || profiles.length === 0) {
    return (
      <div className="profileContainer">
        <div className="profileListHeader">
          <div className="pagetitle">Blocked Profiles</div>
        </div>
        <div className="pagetitle text-center" style={{ margin: "40px 0", color: "#8c7e7e" }}>
          No Blocked Profiles
        </div>
      </div>
    );
  }

  return (
    <div className="profileContainer">
      <div className="profileListHeader">
        <div className="pagetitle">Blocked Profiles</div>
      </div>

      {profiles.map((profile) => {
        const imageSrc = getProfileImage(profile);
        const isDefaultImg = (() => {
          if (profile.filesId?.photos?.length > 0) return false;
          if (profile.filesId?.isPrivate) return false;
          const url = profile.imageUrl;
          return !url || url.includes("profile.png") || url.includes("user-icon-flat-isolated") || url.includes("istockphoto.com");
        })();
        const age = profile.dateOfBirth ? calculateAge(profile.dateOfBirth) : "N/A";
        return (
          <div key={profile._id} className="profile-card-modern">
            {/* Top Header Section */}
            <div className="profile-card-header">
              <div className="profile-card-avatar-wrapper">
                <img
                  src={imageSrc}
                  alt="Profile"
                  className="profileImage"
                  style={isDefaultImg ? { objectFit: "cover", objectPosition: "center" } : { objectFit: "cover", objectPosition: "top" }}
                />
              </div>
              <div className="profile-card-title-section">
                <span className="profile-card-id-badge">
                  Matri ID: {profile.martrId}
                </span>
                <h3 className="profile-card-name">
                  {profile.firstName && profile.lastName 
                    ? `${profile.firstName} ${profile.lastName}`
                    : "Private Name"}
                </h3>
              </div>
            </div>

            {/* Details Grid Section */}
            <div className="profile-card-details-grid">
              <div className="profile-card-detail-item">
                <span className="profile-card-detail-label">Age</span>
                <span className="profile-card-detail-val">{age} Years</span>
              </div>
              <div className="profile-card-detail-item">
                <span className="profile-card-detail-label">Location</span>
                <span className="profile-card-detail-val">
                  {profile.address?.city && profile.address?.state
                    ? `${profile.address.city}, ${profile.address.state}`
                    : "N/A"}
                </span>
              </div>
              <div className="profile-card-detail-item">
                <span className="profile-card-detail-label">Clan</span>
                <span className="profile-card-detail-val">
                  {profile.HoroscopicId?.clan || "N/A"}
                </span>
              </div>
            </div>

            {/* Actions Section */}
            <div className="profile-card-actions-bar">
              <button 
                className="profile-card-btn btn-view-profile"
                onClick={() => navigate(`view/${profile._id}`)}
              >
                <FaEye size={14} style={{ marginRight: "4px" }} />
                <span>View Profile</span>
              </button>
              <button 
                className="profile-card-btn btn-delete-profile"
                onClick={() => handleUnblock(profile._id)}
              >
                <FaUnlock size={14} style={{ marginRight: "4px" }} />
                <span>Unblock</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BlockedProfile;

