import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { chatApi } from "../../../api";
import { useAuth } from "../../Layout/AuthContext";
import { calculateAge } from "../ProfileComp/ProfileInfoHeader";
import maleDefault from "../../../assets/images/male_default.png";
import femaleDefault from "../../../assets/images/female_default.png";
import ConfirmBlockModal from "../../Layout/ConfirmBlockModal";

import { IoEyeOutline, IoImageSharp } from "react-icons/io5";
import { TiMessages } from "react-icons/ti";
import { FaRegHeart, FaHeart, FaUserPlus, FaUserClock } from "react-icons/fa6";
import { MdBlock } from "react-icons/md";

const RequestTableRow = ({ profile, status, fetchData, handlecheck }) => {
  const navigate = useNavigate();
  const { updateData, userData } = useAuth();

  // ── Effective Connection Status (Same logic as SearchProfileCard) ──
  const getEffectiveConnectionStatus = (p) => {
    const s = String(p?.connectionStatus || p?.contactRequestStatus || "").trim().toLowerCase();
    if (["accepted", "pending", "rejected"].includes(s)) return s;

    const currentUserId = String(userData?._id || "").trim();
    const targetProfileId = String(p?._id || "").trim();

    if (Array.isArray(userData?.reqSent)) {
      const match = userData.reqSent.find((item) => {
        const pId = String(item?.userId?._id || item?.userId || item?._id || item?.profile?._id || item?.profile || "").trim();
        return pId === targetProfileId;
      });
      if (match?.status) return String(match.status).trim().toLowerCase();
    }

    const getParticipantId = (item) => {
      return String(item?.userId?._id || item?.userId || item?._id || item?.profile?._id || item?.profile || item?.to?._id || item?.to || "").trim();
    };
    const acceptedArray = (arr) =>
      Array.isArray(arr) &&
      arr.some((item) => {
        const st = String(item?.status || "").trim().toLowerCase();
        if (st !== "accepted") return false;
        if (!currentUserId) return true;
        return getParticipantId(item) === currentUserId;
      });

    if (acceptedArray(p?.reqSent)) return "accepted";
    if (acceptedArray(p?.reqReceived)) return "accepted";
    if (acceptedArray(p?.contactReqSent)) return "accepted";
    if (acceptedArray(p?.contactReqReceived)) return "accepted";

    return null;
  };

  const [connStatus, setConnStatus] = useState(getEffectiveConnectionStatus(profile));
  useEffect(() => {
    setConnStatus(getEffectiveConnectionStatus(profile));
  }, [
    profile?._id,
    profile?.connectionStatus,
    profile?.contactRequestStatus,
    profile?.reqSent,
    profile?.reqReceived,
    profile?.contactReqSent,
    profile?.contactReqReceived,
    userData?.reqSent,
  ]);

  // ── Photo request status ──
  const [photoReqStatus, setPhotoReqStatus] = useState(profile?.photoRequestStatus || null);
  useEffect(() => {
    setPhotoReqStatus(profile?.photoRequestStatus || null);
  }, [profile?._id, profile?.photoRequestStatus]);

  // ── Shortlist state ──
  const [isShortlisted, setIsShortlisted] = useState(!!profile?.isShortlisted);
  useEffect(() => {
    setIsShortlisted(!!profile?.isShortlisted);
  }, [profile?._id, profile?.isShortlisted]);

  // ── Block state ──
  const [isBlocked, setIsBlocked] = useState(!!profile?.isBlocked);
  useEffect(() => {
    setIsBlocked(!!profile?.isBlocked);
  }, [profile?._id, profile?.isBlocked]);

  const [blockModalOpen, setBlockModalOpen] = useState(false);

  const isHiddenRestricted = profile?.isVisible === false && connStatus !== "accepted";

  const getProfileImage = (p) => {
    if (isHiddenRestricted) return p?.gender === "Female" ? femaleDefault : maleDefault;
    const totalPhotos = p?.filesId?.totalPhotos || 0;
    const isPrivate = p?.filesId?.isPrivate && photoReqStatus !== "accepted";
    if (totalPhotos > 0 && !isPrivate && p?.filesId?.photos?.length > 0) {
      return p.filesId.photos[0].url;
    }
    const url = p?.imageUrl;
    const isDefault =
      !url ||
      url.includes("profile.png") ||
      url.includes("user-icon-flat-isolated") ||
      url.includes("istockphoto.com") ||
      url.includes("blurimage");
    if (!isDefault && (!p?.filesId?.isPrivate || photoReqStatus === "accepted")) return url;
    return p?.gender === "Female" ? femaleDefault : maleDefault;
  };

  const isDefaultImg = () => {
    if (isHiddenRestricted) return true;
    if (profile?.filesId?.photos?.length > 0 && (!profile?.filesId?.isPrivate || photoReqStatus === "accepted")) return false;
    if (profile?.filesId?.isPrivate && photoReqStatus !== "accepted") return false;
    const img = getProfileImage(profile);
    if (!img) return true;
    const str = String(img).toLowerCase();
    return (
      str.includes("default") ||
      str.includes("profile") ||
      str.includes("user-icon") ||
      str.includes("istock")
    );
  };

  const handleView = (id) => {
    navigate(`view/${id}`);
  };

  const handleViewimage = (id) => {
    navigate(`view/images/${id}`);
  };

  const handleShortlist = async (id) => {
    setIsShortlisted((prev) => !prev);
    try {
      await updateData("profile/shortlist", id, true);
      if (fetchData) fetchData();
    } catch (e) {
      setIsShortlisted((prev) => !prev);
      console.error(e);
    }
  };

  const handleBlockToggle = async (id) => {
    setIsBlocked((prev) => !prev);
    if (handlecheck) handlecheck();
    try {
      await updateData("profile/block-toggle", id, true);
      if (fetchData) fetchData();
    } catch (e) {
      setIsBlocked((prev) => !prev);
      console.error(e);
    }
  };

  const handleBlockClick = () => {
    if (isBlocked) {
      handleBlockToggle(profile._id);
    } else {
      setBlockModalOpen(true);
    }
  };

  const handleSendRequest = async (id) => {
    setConnStatus("pending");
    try {
      await updateData("profile/request", id, true);
      if (fetchData) fetchData();
    } catch (e) {
      setConnStatus(profile?.connectionStatus || null);
      console.error(e);
    }
  };

  const openMessageCard = async (profileId) => {
    try {
      await chatApi.validateParticipant(profileId);
      navigate("/message");
    } catch (error) {
      navigate("/message");
    }
  };

  const totalPhotos = profile?.filesId?.totalPhotos || 0;
  const age = profile?.dateOfBirth ? calculateAge(profile.dateOfBirth) : null;
  const profileName = profile?.name || [profile?.firstName, profile?.middleName, profile?.lastName].filter(Boolean).join(" ").trim();
  const canShowName = connStatus === "accepted";
  const displayTitle = canShowName ? (profileName || profile?.martrId) : profile?.martrId;

  const disabledBtnStyle = {
    opacity: 0.45,
    cursor: "not-allowed",
    pointerEvents: "none",
    filter: "grayscale(50%)",
  };

  const ConnBtn = () => {
    if (connStatus === "pending")
      return (
        <button
          className="btn btn-sm rounded-circle shadow-sm d-flex align-items-center justify-content-center"
          disabled
          title="Request already sent — waiting for response"
          style={{ width: "36px", height: "36px", border: "1px solid rgba(248,163,91,0.4)", color: "#f8a35b", background: "#fff", cursor: "not-allowed", opacity: 0.6 }}
        >
          <FaUserClock size={16} />
        </button>
      );
    if (connStatus === "accepted")
      return (
        <button
          className="btn btn-sm btn-light rounded-circle shadow-sm d-flex align-items-center justify-content-center transition-all"
          title="Send Message"
          style={{ width: "36px", height: "36px", border: "1px solid rgba(212, 175, 55, 0.4)", color: "var(--royal-maroon)" }}
          onClick={() => openMessageCard(profile._id)}
        >
          <TiMessages size={16} />
        </button>
      );
    if (connStatus === "rejected")
      return (
        <button
          className="btn btn-sm rounded-circle shadow-sm d-flex align-items-center justify-content-center"
          title="Request Rejected — Send Again"
          onClick={() => handleSendRequest(profile._id)}
          style={{ width: "36px", height: "36px", border: "1px solid rgba(220,53,69,0.35)", color: "#dc3545", background: "#fff5f5" }}
        >
          <FaUserPlus size={16} />
        </button>
      );
    return (
      <button
        className="btn btn-sm btn-light rounded-circle shadow-sm d-flex align-items-center justify-content-center transition-all"
        title="Send Request"
        onClick={() => handleSendRequest(profile._id)}
        style={{ width: "36px", height: "36px", border: "1px solid rgba(212, 175, 55, 0.4)", color: "var(--royal-maroon)" }}
      >
        <FaUserPlus size={16} />
      </button>
    );
  };

  const imageSrc = getProfileImage(profile);
  const useDefault = isDefaultImg();

  return (
    <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
      {/* Profile Avatar & ID / Name */}
      <td className="py-3 px-4">
        <div className="d-flex align-items-center gap-3">
          <div style={{ width: "50px", height: "50px", borderRadius: "50%", overflow: "hidden", border: "2px solid var(--royal-gold)", flexShrink: 0 }}>
            <img
              src={imageSrc}
              alt="Profile"
              className="w-100 h-100"
              style={{ objectFit: "cover", objectPosition: useDefault ? "center" : "top" }}
            />
          </div>
          <div>
            <div className="fw-bold" style={{ color: "var(--royal-maroon-dark)" }}>{displayTitle}</div>
            <div style={{ fontSize: "0.78rem", color: "var(--royal-gold)", fontWeight: "600" }}>
              Matri ID: {profile?.martrId}
            </div>
          </div>
        </div>
      </td>

      {/* Basic Details */}
      <td className="py-3 px-4">
        <div className="fw-bold text-dark">{age ? `${age} yrs` : "Age N/A"}</div>
        <div className="text-secondary small">{profile?.HoroscopicId?.clan || profile?.clan || "Clan N/A"}</div>
      </td>

      {/* Location */}
      <td className="py-3 px-4">
        <div className="fw-bold text-dark">{profile?.address?.city || "City N/A"}</div>
        <div className="text-secondary small">{profile?.address?.state || "State N/A"}</div>
      </td>

      {/* Professional */}
      <td className="py-3 px-4">
        <div className="fw-bold text-dark text-truncate" style={{ maxWidth: "150px" }}>
          {(profile?.profdetailsId?.occupationsList?.length > 0 ? profile.profdetailsId.occupationsList[0].occupation : null) || profile?.profdetailsId?.professional || profile?.familydetailsId?.occupation || "Occ. N/A"}
        </div>
        <div className="text-secondary small text-truncate" style={{ maxWidth: "150px" }}>
          {(profile?.profdetailsId?.qualificationsList?.length > 0 ? profile.profdetailsId.qualificationsList[0].qualification : null) || profile?.profdetailsId?.qualifications || "Edu. N/A"}
        </div>
      </td>

      {/* Actions */}
      <td className="py-3 px-4 text-center">
        <div className="d-flex justify-content-center gap-2 align-items-center">
          {/* View Button */}
          <button
            disabled={isHiddenRestricted}
            className="btn btn-sm btn-light rounded-circle shadow-sm d-flex align-items-center justify-content-center transition-all"
            style={{
              width: "36px",
              height: "36px",
              border: "1px solid rgba(212, 175, 55, 0.4)",
              color: "var(--royal-maroon)",
              ...(isHiddenRestricted ? disabledBtnStyle : {})
            }}
            title={!isHiddenRestricted ? "View Profile" : "View disabled until connection request is accepted"}
            onClick={() => !isHiddenRestricted && handleView(profile._id)}
          >
            <IoEyeOutline size={16} />
          </button>

          {/* Shortlist Button */}
          <button
            disabled={isHiddenRestricted}
            className="btn btn-sm btn-light rounded-circle shadow-sm d-flex align-items-center justify-content-center transition-all"
            style={{
              width: "36px",
              height: "36px",
              border: "1px solid rgba(212, 175, 55, 0.4)",
              color: isShortlisted ? "#dc3545" : "var(--royal-maroon)",
              ...(isHiddenRestricted ? disabledBtnStyle : {})
            }}
            title={!isHiddenRestricted ? (isShortlisted ? "Remove Shortlist" : "Shortlist Profile") : "Shortlist disabled until connection request is accepted"}
            onClick={() => !isHiddenRestricted && handleShortlist(profile._id)}
          >
            {isShortlisted ? <FaHeart size={16} color="#dc3545" /> : <FaRegHeart size={16} />}
          </button>

          {/* Photo Button */}
          <button
            disabled={isHiddenRestricted}
            className="btn btn-sm btn-light rounded-circle shadow-sm d-flex align-items-center justify-content-center transition-all position-relative"
            style={{
              width: "36px",
              height: "36px",
              border: "1px solid rgba(212, 175, 55, 0.4)",
              color: "var(--royal-maroon)",
              ...(isHiddenRestricted ? disabledBtnStyle : {})
            }}
            title={!isHiddenRestricted ? "View Photos" : "Photos disabled until connection request is accepted"}
            onClick={() => !isHiddenRestricted && handleViewimage(profile._id)}
          >
            <IoImageSharp size={16} />
            {totalPhotos > 0 && (
              <span
                className="position-absolute badge rounded-pill bg-danger"
                style={{
                  top: "-4px",
                  right: "-4px",
                  fontSize: "0.55rem",
                  padding: "2px 4px",
                  lineHeight: "1"
                }}
              >
                {totalPhotos}
              </span>
            )}
          </button>

          {/* Connection / Message Button */}
          <ConnBtn />

          {/* Block Button */}
          <button
            className="btn btn-sm rounded-circle shadow-sm d-flex align-items-center justify-content-center transition-all"
            style={
              isBlocked
                ? { width: "36px", height: "36px", color: "#dc3545", border: "1px solid rgba(220,53,69,0.4)", background: "#fff5f5" }
                : { width: "36px", height: "36px", border: "1px solid rgba(212, 175, 55, 0.4)", color: "var(--royal-maroon)", background: "#ffffff" }
            }
            title={isBlocked ? "Unblock Profile" : "Block Profile"}
            onClick={handleBlockClick}
          >
            <MdBlock size={16} />
          </button>

          <ConfirmBlockModal
            isOpen={blockModalOpen}
            onClose={() => setBlockModalOpen(false)}
            onConfirm={() => {
              setBlockModalOpen(false);
              handleBlockToggle(profile._id);
            }}
            profileName={profileName}
          />
        </div>
      </td>
    </tr>
  );
};

const RequestTable = ({ profiles, status, activeTab, fetchData, handlecheck }) => {
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
            <RequestTableRow
              key={profile._id}
              profile={profile}
              status={status}
              activeTab={activeTab}
              fetchData={fetchData}
              handlecheck={handlecheck}
            />
          ))}
        </tbody>
      </table>
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
