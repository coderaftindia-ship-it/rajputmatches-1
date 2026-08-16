import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { chatApi } from "../../../api";
import { useAuth } from "../../Layout/AuthContext";
import { calculateAge } from "../ProfileComp/ProfileInfoHeader";
import maleDefault from "../../../assets/images/male_default.png";
import femaleDefault from "../../../assets/images/female_default.png";

import { RiDeleteBin4Line } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa";
import { TiMessages } from "react-icons/ti";
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import { FaUserPlus, FaUserClock } from "react-icons/fa6";
import { MdBlock } from "react-icons/md";

const RequestTable = ({ profiles, status, activeTab, fetchData, handlecheck, isSearchPage }) => {
  const navigate = useNavigate();
  const { updateData } = useAuth();

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
    navigate(`view/${profileId}`);
  };

  const openMessageCard = async (message, profile) => {
    try {
      await chatApi.validateParticipant(profile);
      navigate("/message");
    } catch (error) {
      console.error("Error validating chat:", error);
      navigate("/message");
    }
  };

  const getProfileImage = (profile) => {
    const isHidden = profile?.isVisible === false && profile?.connectionStatus !== "accepted";
    if (isHidden) return profile?.gender === "Female" ? femaleDefault : maleDefault;
    const totalPhotos = profile?.filesId?.totalPhotos || 0;
    const isPrivate = profile?.filesId?.isPrivate && profile?.photoRequestStatus !== "accepted";
    if (totalPhotos > 0 && !isPrivate && profile?.filesId?.photos?.length > 0) {
      return profile.filesId.photos[0].url;
    }
    const url = profile?.imageUrl;
    const isDefault = !url || 
      url.includes("profile.png") || 
      url.includes("user-icon-flat-isolated") || 
      url.includes("istockphoto.com");
    if (!isDefault) return url;
    return profile?.gender === "Female" ? femaleDefault : maleDefault;
  };

  return (
    <div className="table-responsive rounded-4 shadow-sm" style={{ border: "1px solid rgba(212, 175, 55, 0.3)", backgroundColor: "#ffffff" }}>
      <table className="table table-hover align-middle mb-0">
        <thead style={{ backgroundColor: "var(--royal-cream-dark)", borderBottom: "2px solid var(--royal-gold)" }}>
          <tr>
            <th className="py-3 px-4 text-secondary text-uppercase" style={{ fontSize: "0.8rem", letterSpacing: "1px" }}>Profile</th>
            <th className="py-3 px-4 text-secondary text-uppercase" style={{ fontSize: "0.8rem", letterSpacing: "1px" }}>Basic Details</th>
            <th className="py-3 px-4 text-secondary text-uppercase" style={{ fontSize: "0.8rem", letterSpacing: "1px" }}>Location</th>
            <th className="py-3 px-4 text-secondary text-uppercase" style={{ fontSize: "0.8rem", letterSpacing: "1px" }}>Professional</th>
            <th className="py-3 px-4 text-center text-secondary text-uppercase" style={{ fontSize: "0.8rem", letterSpacing: "1px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((profile) => (
            <tr key={profile._id} style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
              {/* Profile Avatar & ID */}
              <td className="py-3 px-4">
                <div className="d-flex align-items-center gap-3">
                  <div style={{ width: "50px", height: "50px", borderRadius: "50%", overflow: "hidden", border: "2px solid var(--royal-gold)" }}>
                    {(() => {
                      const imgSrc = getProfileImage(profile);
                      const isDefaultImg = (() => {
                        if (profile?.isVisible === false && profile?.connectionStatus !== "accepted") return true;
                        if (profile?.filesId?.photos?.length > 0) return false;
                        if (profile?.filesId?.isPrivate && profile?.photoRequestStatus !== "accepted") return false;
                        const url = profile?.imageUrl;
                        return !url || url.includes("profile.png") || url.includes("user-icon-flat-isolated") || url.includes("istockphoto.com");
                      })();
                      return <img src={imgSrc} alt="Profile" className="w-100 h-100" style={{ objectFit: "cover", objectPosition: isDefaultImg ? "center" : "top" }} />;
                    })()}
                  </div>
                  <div>
                    <div className="fw-bold" style={{ color: "var(--royal-maroon-dark)" }}>{profile.martrId}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--royal-gold)", fontWeight: "600" }}>
                      {status !== "new" && <span style={{ textTransform: "capitalize" }}>{status}</span>}
                    </div>
                  </div>
                </div>
              </td>

              {/* Basic Details */}
              <td className="py-3 px-4">
                <div className="fw-bold text-dark">{calculateAge(profile?.dateOfBirth)} yrs</div>
                <div className="text-secondary small">{profile?.HoroscopicId?.clan || "Clan N/A"}</div>
              </td>

              {/* Location */}
              <td className="py-3 px-4">
                <div className="fw-bold text-dark">{profile?.address?.city || "City N/A"}</div>
                <div className="text-secondary small">{profile?.address?.state || "State N/A"}</div>
              </td>

              {/* Professional */}
              <td className="py-3 px-4">
                <div className="fw-bold text-dark text-truncate" style={{ maxWidth: "150px" }}>{(profile?.profdetailsId?.occupationsList?.length > 0 ? profile.profdetailsId.occupationsList[0].occupation : null) || profile?.profdetailsId?.professional || profile?.familydetailsId?.occupation || "Occ. N/A"}</div>
                <div className="text-secondary small text-truncate" style={{ maxWidth: "150px" }}>{(profile?.profdetailsId?.qualificationsList?.length > 0 ? profile.profdetailsId.qualificationsList[0].qualification : null) || profile?.profdetailsId?.qualifications || "Edu. N/A"}</div>
              </td>

              {/* Actions */}
              <td className="py-3 px-4 text-center">
                <TableActions 
                  profile={profile} 
                  status={status} 
                  activeTab={activeTab} 
                  handleAction={handleAction} 
                  handleView={handleView} 
                  openMessageCard={openMessageCard}
                  handlecheck={handlecheck}
                  isSearchPage={isSearchPage}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TableActions = ({ profile, status, activeTab, handleAction, handleView, openMessageCard, handlecheck, isSearchPage }) => {
  const getConnectionButton = () => {
    const connStatus = profile?.connectionStatus;
    if (connStatus === "pending") {
      return { icon: <FaUserClock />, label: "Pending", action: () => {} };
    }
    if (connStatus === "accepted") {
      return { icon: <TiMessages />, label: "Message", action: () => openMessageCard("message", profile._id) };
    }
    return { icon: <FaUserPlus />, label: "Connect", action: () => handleAction("request", profile._id) };
  };

  let actions = [];

  if (activeTab === "requestReceived" || activeTab === "requestSent") {
    // Basic logic mapping for different statuses
    if (status === "pending") {
      actions = [
        { icon: <FaRegEye />, label: "View", action: () => { handleView(profile._id); handleAction("view", profile._id); } },
        { icon: <TiMessages />, label: "Message", action: () => openMessageCard("message", profile._id) },
        { icon: <RiDeleteBin4Line />, label: "Delete", action: () => handleAction("delete/delete", profile._id) }
      ];
    } else if (status === "new" || status === "default" || !status) {
      actions = [
        { icon: <FaRegEye />, label: "View", action: () => { handleView(profile._id); handleAction("view", profile._id); } },
        { icon: profile.isShortlisted ? <FaHeart color="#7a1c1c" /> : <FaRegHeart />, label: "Shortlist", action: () => handleAction("shortlist", profile._id) },
        getConnectionButton(),
        { icon: <MdBlock />, label: "Block", action: () => { handleAction("block-toggle", profile._id); if (handlecheck) handlecheck(); } }
      ];
    } else {
      actions = [
        { icon: <FaRegEye />, label: "View", action: () => { handleView(profile._id); handleAction("view", profile._id); } },
        { icon: <TiMessages />, label: "Message", action: () => openMessageCard("message", profile._id) }
      ];
    }
  } else {
    // For general search page
    actions = [
      { icon: <FaRegEye />, label: "View", action: () => { handleView(profile._id); handleAction("view", profile._id); } },
      { icon: profile.isShortlisted ? <FaHeart color="#7a1c1c" /> : <FaRegHeart />, label: "Shortlist", action: () => handleAction("shortlist", profile._id) },
      getConnectionButton(),
      { icon: <MdBlock />, label: "Block", action: () => { handleAction("block-toggle", profile._id); if (handlecheck) handlecheck(); } }
    ];
  }

  return (
    <div className="d-flex justify-content-center gap-2">
      {actions.map((act, idx) => {
        const isConnect = act.label === "Connect" || act.label === "Pending" || act.label === "Message";
        const isDisabled = isSearchPage && !isConnect;
        return (
          <button
            key={idx}
            disabled={isDisabled}
            className="btn btn-sm btn-light rounded-circle shadow-sm d-flex align-items-center justify-content-center transition-all"
            style={{
              width: "36px",
              height: "36px",
              border: "1px solid rgba(212, 175, 55, 0.4)",
              color: "var(--royal-maroon)",
              ...(isDisabled ? { opacity: 0.45, cursor: "not-allowed", pointerEvents: "none" } : {})
            }}
            title={isDisabled ? `${act.label} disabled on Search` : act.label}
            onClick={act.action}
            onMouseEnter={(e) => { if (!isDisabled) { e.currentTarget.style.backgroundColor = "var(--royal-maroon)"; e.currentTarget.style.color = "white"; } }}
            onMouseLeave={(e) => { if (!isDisabled) { e.currentTarget.style.backgroundColor = "white"; e.currentTarget.style.color = "var(--royal-maroon)"; } }}
          >
            {React.cloneElement(act.icon, { size: 16 })}
          </button>
        );
      })}
    </div>
  );
};

RequestTable.propTypes = {
  profiles: PropTypes.array.isRequired,
  status: PropTypes.string,
  activeTab: PropTypes.string,
  fetchData: PropTypes.func,
  handlecheck: PropTypes.func,
};

export default RequestTable;
