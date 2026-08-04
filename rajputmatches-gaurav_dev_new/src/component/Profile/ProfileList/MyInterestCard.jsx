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
import { FaRegHeart } from "react-icons/fa6";
import { FaUserPlus } from "react-icons/fa6";
import { IoImageSharp } from "react-icons/io5";
import { MdOutlineCancelPresentation } from "react-icons/md";
import { GiCancel } from "react-icons/gi";
import { FaCheck } from "react-icons/fa6";

const MyInterestCard = ({
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
    <div
      className="col-12 col-lg-6 mb-3 p-1 p-md-2"
      style={{ boxSizing: "border-box" }}
    >
      <div className="card shadow-sm border-0 rounded-3 overflow-hidden d-flex flex-column h-100" style={{ minHeight: "285px", border: "1px solid rgba(212, 175, 55, 0.2)" }}>
        <div
          className="row g-0 p-2 bg-white flex-grow-1 align-items-center"
          style={{
            borderBottom: "1px solid rgba(0,0,0,0.08)",
            boxSizing: "border-box",
          }}
        >
          <div
            className="col-5 col-sm-5 d-flex align-items-center justify-content-center overflow-hidden p-0"
            style={{ height: "100%", minHeight: "175px" }}
          >
            {profile && (
              <ProfileImagerender
                profile={profile}
                status={status}
                activeButton={activeTab}
              />
            )}
          </div>

          <div className="col-7 col-sm-7 ps-2 ps-md-3">
            <div className="card-body p-1">
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
        />
      </div>
    </div>
  );
};

MyInterestCard.propTypes = {
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
}) => {
  const { updateData } = useAuth();
  const navigate = useNavigate();

  const handleAction = async (action, profileId) => {
    try {
      let route = `profile/${action}`;
      await updateData(route, profileId, true);
      fetchData();
    } catch (error) {
      console.error(`Error performing action: ${action}`, error);
    }
  };

  const handleView = (profileId) => {
    console.log(profileId);
    navigate(`view/${profileId}`);
  };

  var buttonConfig = [];
  if (activeTab == "requestReceived") {
    buttonConfig = {
      pending: [
        {
          icon: <RiDeleteBin4Line />,
          label: "Delete",
          onClick: () => handleAction("req/delete", profile._id),
        },
        {
          icon: <FaRegEye />,
          label: "View",
          onClick: () => {
            handleView(profile._id);
            handleAction("view", profile._id);
          },
        },
        // { icon: <BsBell />, label: "Reminder" },
        {
          icon: <GiCancel />,
          label: "Reject",
          onClick: () => {
            handleAction("reqsent/reject", profile._id);
          },
        },
        {
          icon: <FaCheck />,
          label: "Accept",
          onClick: () => {
            handleAction("reqsent/accept", profile._id);
          },
        },
      ],
      rejected: [
        //   {
        //     icon: <RiDeleteBin4Line />,
        //     label: "Delete",
        //     onClick: () => handleAction("delete", profile._id),
        //   },
        {
          icon: <FaRegEye />,
          label: "View",
          onClick: () => {
            handleView(profile._id);
            handleAction("view", profile._id);
          },
        },
      ],
      accepted: [
        //   { icon: <RiDeleteBin4Line />, label: "Delete" },
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
          icon: <FaRegHeart />,
          label: "Shortlist",
          onClick: () => handleAction("shortlist", profile._id),
        },
        {
          icon: <FaUserPlus />,
          label: "Send Request",
          onClick: () => handleAction("request", profile._id),
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
      ],
      rejected: [
        // {
        //   icon: <RiDeleteBin4Line />,
        //   label: "Delete",
        //   onClick: () => handleAction("delete", profile._id),
        // },
        {
          icon: <FaRegEye />,
          label: "View",
          onClick: () => {
            handleView(profile._id);
            handleAction("view", profile._id);
          },
        },
      ],
      accepted: [
        //   { icon: <RiDeleteBin4Line />, label: "Delete" },
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
          icon: <FaRegHeart />,
          label: "Shortlist",
          onClick: () => handleAction("shortlist", profile._id),
        },
        {
          icon: <FaUserPlus />,
          label: "Send Request",
          onClick: () => handleAction("request", profile._id),
        },
      ],
    };
  }

  return (
    <div className="d-flex w-100 bg-white" style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}>
      {buttonConfig[status]?.map(({ icon, label, onClick }, index) => (
        <div
          key={index}
          className={`${styles.actionBtn} ${index > 0 ? styles.borderLeft : ""}`}
          style={{
            borderLeft: index > 0 ? "1px solid rgba(0,0,0,0.08)" : "none",
            flex: 1,
            textAlign: "center"
          }}
          onClick={onClick}
        >
          <span className={styles.actionIcon}>
            {icon ? React.cloneElement(icon, { strokeWidth: 1.25 }) : null}
          </span>
          <span className={styles.actionText}> {label}</span>
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

export default MyInterestCard;
