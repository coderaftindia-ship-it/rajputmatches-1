import React, { useState } from "react";
import PropTypes from "prop-types";
import { useParams, useNavigate } from "react-router-dom";
import { chatApi } from "../../../api";

import MessageCard from "../Forms/MessageCard";
import { calculateAge } from "../ProfileComp/ProfileInfoHeader";
import { useAuth } from "../../Layout/AuthContext";
import styles from "./RequestCard.module.css";
import pro from "../../../assets/images/blurimage.png";
import ViewPage from "../Forms/ViewPage";

import { RiDeleteBin4Line } from "react-icons/ri";
import { IoEyeOutline } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa";
import { TiMessages } from "react-icons/ti";
import { BsBell } from "react-icons/bs";
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import { FaUserPlus, FaUserClock } from "react-icons/fa6";
import { IoImageSharp } from "react-icons/io5";
import { MdOutlineCancelPresentation, MdBlock } from "react-icons/md";

const RequestCard = ({
  profile,
  status,
  handlecheck,
  activeTab,
  ProfileImagerender,
  fetchData,
}) => {
  const navigate = useNavigate();
  const openMessageCard = async (message, profile) => {
    try {
      await chatApi.validateParticipant(profile);
      navigate("/message");
    } catch (error) {
      console.error("Error validating chat:", error);
      navigate("/message");
    }
  };

  const renderProfileDetails = () => {
    const details = [
      { label: "Clan", value: profile?.HoroscopicId?.clan },
      {
        label: "Age",
        value: profile?.dateOfBirth ? `${calculateAge(profile.dateOfBirth)} Years` : "N/A",
      },
      {
        label: "Location",
        value: profile?.address?.city 
          ? profile.address.city
          : (profile?.city || profile?.currentCity || "N/A"),
      },
      {
        label: "Education",
        value: profile?.profdetailsId?.qualifications,
      },
      { label: "Occupation", value: profile?.familydetailsId?.occupation },
    ];

    return details.map(({ label, value }, index) => (
      <div key={index} className="d-flex justify-content-between my-1" style={{ fontSize: "0.85rem" }}>
        <span className="text-secondary" style={{ minWidth: "80px" }}>
          {label}:
        </span>
        <span className="fw-bold text-dark text-end" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {value || "N/A"}
        </span>
      </div>
    ));
  };

  return (
    <div className="col-12 col-lg-6 mb-3 p-1 p-md-2" style={{ boxSizing: "border-box" }}>
      <div 
        className="card shadow-lg border-0 rounded-4 overflow-hidden d-flex flex-column h-100 bg-white" 
        style={{ border: "1px solid rgba(212, 175, 55, 0.3)" }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
      >
        <div className="row g-0 flex-grow-1 align-items-center">
          {/* Image Container */}
          <div className="col-5 col-sm-5 bg-light position-relative overflow-hidden d-flex align-items-center justify-content-center p-0" style={{ height: "100%", minHeight: "175px" }}>
            {profile && (
              <ProfileImagerender profile={profile} activeButton={activeTab} status={status} fetchData={fetchData} />
            )}
          </div>

          {/* Details Container */}
          <div className="col-7 col-sm-7 ps-2 ps-md-3">
            <div className="card-body p-2">
              <div className="d-flex align-items-center justify-content-between mb-2 pb-1" style={{ borderBottom: "1px dashed rgba(212, 175, 55, 0.4)" }}>
                <span className="fw-bold fs-5" style={{ color: "var(--royal-maroon-dark, #59123b)", fontFamily: "serif" }}>
                  ID: {profile?.martrId || profile?.matrimonialid || "N/A"}
                </span>
                <StatusTag text={status} />
              </div>
              {renderProfileDetails()}
            </div>
          </div>
        </div>

        <ActionButtons
          status={status}
          openMessageCard={openMessageCard}
          profile={profile}
          fetchData={fetchData}
          activeTab={activeTab}
          handlecheck={handlecheck}
        />
      </div>
    </div>
  );
};

RequestCard.propTypes = {
  profile: PropTypes.object.isRequired,
  handlecheck: PropTypes.func,
  fetchData: PropTypes.func.isRequired,
  ProfileImagerender: PropTypes.func.isRequired,
};

const ActionButtons = ({
  status,
  openMessageCard,
  profile,
  fetchData,
  activeTab,
  handlecheck,
}) => {
  const { updateData } = useAuth();
  const navigate = useNavigate();

  const handleAction = async (action, profileId) => {
    try {
      let route = `profile/${action}`;
      await updateData(route, profileId, true);
      if (fetchData) fetchData();
    } catch (error) {
      console.error(`Error performing action: ${action}`, error);
    }
  };

  const handleView = (profileId) => {
    console.log(profileId);
    navigate(`view/${profileId}`);
  };

  const getConnectionButton = () => {
    const connStatus = profile?.connectionStatus;
    if (connStatus === "pending") {
      return {
        icon: <FaUserClock />,
        label: "Pending",
        onClick: () => {},
      };
    }
    if (connStatus === "accepted") {
      return {
        icon: <TiMessages />,
        label: "Message",
        onClick: () => openMessageCard("message", profile._id),
      };
    }
    return {
      icon: <FaUserPlus />,
      label: "Send Request",
      onClick: () => handleAction("request", profile._id),
    };
  };

  var buttonConfig = [];

  if (activeTab == "requestReceived") {
    buttonConfig = {
      pending: [
        {
          icon: <RiDeleteBin4Line />,
          label: "Delete",
          onClick: () => handleAction("delete/delete", profile._id),
        },
        {
          icon: <FaRegEye />,
          label: "View",
          onClick: () => {
            handleView(profile._id);
            handleAction("view", profile._id);
          },
        },
        {
          icon: <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "inherit" }}>✓</span>,
          label: "Accept",
          onClick: () => {
            handleAction("accept", profile._id);
            if (handlecheck) handlecheck(profile._id);
          },
          style: { color: "#fff", backgroundColor: "#1a7a45" },
        },
        {
          icon: <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "inherit" }}>✕</span>,
          label: "Reject",
          onClick: () => {
            handleAction("reject", profile._id);
            if (handlecheck) handlecheck(profile._id);
          },
          style: { color: "#fff", backgroundColor: "#991c1c" },
        },
        {
          icon: <TiMessages />,
          label: "Message",
          onClick: () => {
            openMessageCard("message", profile._id);
          },
        },
        {
          icon: <MdBlock />,
          label: "Block",
          onClick: () => {
            handleAction("block-toggle", profile._id);
            if (handlecheck) handlecheck();
          },
        },
      ],
      rejected: [
        {
          icon: <FaRegEye />,
          label: "View",
          onClick: () => {
            handleView(profile._id);
            handleAction("view", profile._id);
          },
        },
        {
          icon: <MdBlock />,
          label: "Block",
          onClick: () => {
            handleAction("block-toggle", profile._id);
            if (handlecheck) handlecheck();
          },
        },
      ],
      accepted: [
        {
          icon: <FaRegEye />,
          label: "View",
          onClick: () => {
            handleView(profile._id);
            handleAction("view", profile._id);
          },
        },
        {
          icon: <TiMessages />,
          label: "Message",
          onClick: () => {
            openMessageCard("message", profile._id);
          },
        },
        {
          icon: <MdBlock />,
          label: "Block",
          onClick: () => {
            handleAction("block-toggle", profile._id);
            if (handlecheck) handlecheck();
          },
        },
      ],
      new: [
        {
          icon: <FaRegEye />,
          label: "View",
          onClick: () => {
            handleView(profile._id);
            handleAction("view", profile._id);
          },
        },
        {
          icon: profile.isShortlisted ? <FaHeart color="#7a1c1c" /> : <FaRegHeart />,
          label: profile.isShortlisted ? "Shortlisted" : "Shortlist",
          onClick: () => handleAction("shortlist", profile._id),
        },
        getConnectionButton(),
        {
          icon: <MdBlock />,
          label: "Block",
          onClick: () => {
            handleAction("block-toggle", profile._id);
            if (handlecheck) handlecheck();
          },
        },
      ],
    };
  } else {
    buttonConfig = {
      pending: [
        {
          icon: <RiDeleteBin4Line />,
          label: "Delete",
          onClick: () => handleAction("delete/delete", profile._id),
        },
        {
          icon: <MdBlock />,
          label: "Block",
          onClick: () => {
            handleAction("block-toggle", profile._id);
            if (handlecheck) handlecheck();
          },
        },
      ],
      rejected: [
        {
          icon: <FaRegEye />,
          label: "View",
          onClick: () => {
            handleView(profile._id);
            handleAction("view", profile._id);
          },
        },
        {
          icon: <MdBlock />,
          label: "Block",
          onClick: () => {
            handleAction("block-toggle", profile._id);
            if (handlecheck) handlecheck();
          },
        },
      ],
      accepted: [
        {
          icon: <FaRegEye />,
          label: "View",
          onClick: () => {
            handleView(profile._id);
            handleAction("view", profile._id);
          },
        },
        {
          icon: <TiMessages />,
          label: "Message",
          onClick: () => {
            openMessageCard("message", profile._id);
          },
        },
        {
          icon: <MdBlock />,
          label: "Block",
          onClick: () => {
            handleAction("block-toggle", profile._id);
            if (handlecheck) handlecheck();
          },
        },
      ],
      new: [
        {
          icon: <FaRegEye />,
          label: "View",
          onClick: () => {
            handleView(profile._id);
            handleAction("view", profile._id);
          },
        },
        {
          icon: profile.isShortlisted ? <FaHeart color="#7a1c1c" /> : <FaRegHeart />,
          label: profile.isShortlisted ? "Shortlisted" : "Shortlist",
          onClick: () => handleAction("shortlist", profile._id),
        },
        getConnectionButton(),
        {
          icon: <MdBlock />,
          label: "Block",
          onClick: () => {
            handleAction("block-toggle", profile._id);
            if (handlecheck) handlecheck();
          },
        },
      ],
    };
  }

  return (
    <div className="d-flex w-100 bg-white" style={{ borderTop: "2px solid rgba(212, 175, 55, 0.2)" }}>
      {buttonConfig[status]?.map(({ icon, label, onClick, style: btnStyle }, index) => (
        <div
          key={index}
          className="py-3 d-flex flex-column align-items-center justify-content-center flex-grow-1"
          style={{
            borderLeft: index > 0 ? "1px solid rgba(212, 175, 55, 0.15)" : "none",
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
            color: btnStyle?.color || "var(--royal-maroon)",
            backgroundColor: btnStyle?.backgroundColor || "transparent",
          }}
          onMouseEnter={(e) => {
            if (!btnStyle) {
              e.currentTarget.style.backgroundColor = "rgba(128, 0, 0, 0.05)";
              e.currentTarget.style.color = "var(--royal-maroon-dark)";
            }
          }}
          onMouseLeave={(e) => {
            if (!btnStyle) {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--royal-maroon)";
            }
          }}
          onClick={onClick}
        >
          <span className="mb-1" style={{ fontSize: "1.25rem" }}>
            {icon ? React.cloneElement(icon, { strokeWidth: 1.5 }) : null}
          </span>
          <span className="fw-bold" style={{ fontSize: "0.8rem", letterSpacing: "0.5px" }}>{label}</span>
        </div>
      ))}
    </div>
  );
};


ActionButtons.propTypes = {
  status: PropTypes.string.isRequired,
  openMessageCard: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  fetchData: PropTypes.func.isRequired,
  handlecheck: PropTypes.func,
};

const StatusTag = ({ text }) => {
  const colors = {
    pending: "#f8a35b",
    rejected: "#ff4d4d",
    accepted: "#4caf50",
    default: "#f8a35b",
  };

  return (
    <span
      style={{
        backgroundColor: colors[text] || colors.default,
        color: "white",
        borderRadius: "1rem",
        marginLeft: "0.3rem",
        padding: "0.1rem 0.5rem",
        fontSize: "0.8rem",
      }}
    >
      {text !== "new" ? text : ""}
    </span>
  );
};

StatusTag.propTypes = {
  text: PropTypes.string.isRequired,
};

export default RequestCard;
