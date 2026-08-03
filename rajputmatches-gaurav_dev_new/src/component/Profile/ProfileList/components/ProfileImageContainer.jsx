import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { IoImageSharp } from "react-icons/io5";
import femaleDefault from "../../../../assets/images/female_default.png";
import maleDefault from "../../../../assets/images/male_default.png";
import styles from "../RequestCard.module.css";

/**
 * Reusable Profile Image Container with action buttons
 */
const ProfileImageContainer = ({
  profile,
  activeButton,
  onAction,
  showActions = true,
}) => {
  const navigate = useNavigate();
  const totalPhotos = profile?.filesId?.totalPhotos || 0;
  const photos = profile?.filesId?.photos || [];

  const handleViewImage = (profileId) => {
    navigate(`view/images/${profileId}`);
  };

  const defaultAvatar = profile?.gender === "Female" ? femaleDefault : maleDefault;

  const renderEmptyState = (actionButtons = null) => (
    <div
      className="image-container"
      style={{ position: "relative", width: "100%", height: "14rem" }}
    >
      <img
        src={defaultAvatar}
        className="img-fluid m-auto"
        alt="Default Avatar"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />

      <span
        style={{
          position: "absolute",
          bottom: "0%",
          right: "0%",
          color: "white",
          backgroundColor: "black",
          padding: "3px 5px",
          zIndex: "20",
          fontFamily: "Open Sans, sans-serif",
          cursor: "pointer",
        }}
        onClick={() => handleViewImage(profile._id)}
      >
        <IoImageSharp size={15} color="white" />
        <span style={{ color: "white", fontSize: "14px" }} className="p-1">
          0{totalPhotos}
        </span>
      </span>

      {showActions && actionButtons && (
        <div
          className={styles.vipSection}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            padding: "1rem",
          }}
        >
          {actionButtons}
        </div>
      )}
    </div>
  );

  if (photos.length === 0) {
    return renderEmptyState(
      onAction ? (
        <button
          className={styles.ctaButton}
          onClick={() => onAction(profile._id)}
        >
          Request Photos
        </button>
      ) : null
    );
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "14rem",
        overflow: "hidden",
      }}
    >
      {photos.map((photo, index) => (
        <React.Fragment key={photo._id || index}>
          <img
            src={photo.url}
            className={`img-fluid m-auto ${
              index === 0 ? "visible-image" : "hidden-image"
            }`}
            alt="Profile"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top",
              zIndex: index === 0 ? 1 : 0,
              opacity: index === 0 ? 1 : 0,
              transition: "opacity 0.5s ease",
            }}
          />
          {index === 0 && (
            <span
              style={{
                position: "absolute",
                bottom: "0%",
                right: "0%",
                color: "white",
                backgroundColor: "black",
                padding: "3px 5px",
                zIndex: "20",
                fontFamily: "Open Sans, sans-serif",
                cursor: "pointer",
              }}
              onClick={() => handleViewImage(profile._id)}
            >
              <IoImageSharp size={15} color="white" />
              <span style={{ color: "white", fontSize: "14px" }} className="p-1">
                0{totalPhotos}
              </span>
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

ProfileImageContainer.propTypes = {
  profile: PropTypes.object.isRequired,
  activeButton: PropTypes.string,
  onAction: PropTypes.func,
  showActions: PropTypes.bool,
};

export default ProfileImageContainer;
