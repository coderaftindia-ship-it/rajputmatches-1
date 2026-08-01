import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaChevronLeft, FaChevronRight,
  FaGraduationCap, FaBriefcase, FaUserTie,
  FaMapMarkerAlt, FaCalendarAlt, FaShieldAlt,
  FaRegHeart, FaHeart, FaSlidersH
} from "react-icons/fa";
import { Country, State } from "country-state-city";
import { AiOutlineRight } from "react-icons/ai";
import { IoImageSharp, IoEyeOutline } from "react-icons/io5";
import { GiSwordClash } from "react-icons/gi";
import { BsGridFill, BsListUl } from "react-icons/bs";
import { FaUserPlus, FaUserClock } from "react-icons/fa6";
import { TiMessages } from "react-icons/ti";
import { MdBlock } from "react-icons/md";
import RequestTable from "../Profile/ProfileList/RequestTable";
import Profilenavbar from "../Profile/ProfileComp/Profilenavbar";
import Footer from "./Footer";
import { useAuth } from "./AuthContext";
import pro from "../../assets/images/blurimage.png";
import maleDefault from "../../assets/images/male_default.png";
import femaleDefault from "../../assets/images/female_default.png";
import { motion, AnimatePresence } from "framer-motion";
import { calculateAge } from "../Profile/ProfileComp/ProfileInfoHeader";
import styles from "./RecentAddedPage.module.css";
import { chatApi } from "../../api";

/* ─── Keep the existing photo-request image container (exported for router) ─── */
export function Interestimagecontainer({ profile, status, fetchData }) {
  const { updateData } = useAuth();
  const totalPhotos = profile?.filesId?.totalPhotos || 0;
  const isPrivate   = profile?.filesId?.isPrivate;
  const hasPhotos   = totalPhotos > 0;
  const navigate    = useNavigate();

  const handleViewimage = (id) => navigate(`view/images/${id}`);

  const HandlePhotoReq = async (id) => {
    try { await updateData("profile/photoRequest", id, true); if (fetchData) fetchData(); }
    catch (err) { console.error(err); }
  };

  if (!hasPhotos) {
    const url = profile?.imageUrl;
    const isDefault = !url || 
      url.includes("profile.png") || 
      url.includes("user-icon-flat-isolated") || 
      url.includes("istockphoto.com");
    const fallbackSrc = !isDefault ? url : (profile?.gender === "Female" ? femaleDefault : maleDefault);
    return (
      <div className="position-relative w-100" style={{ height: "16rem", borderBottom: "3px solid var(--royal-gold)" }}>
        <img src={fallbackSrc} className="w-100 h-100 object-fit-cover" alt="Profile Default" />
      </div>
    );
  }

  if (isPrivate && profile?.photoRequestStatus !== "accepted") {
    const isPending  = profile?.photoRequestStatus === "pending";
    const isRejected = profile?.photoRequestStatus === "rejected";
    return (
      <div className="position-relative w-100" style={{ height: "16rem", borderBottom: "3px solid var(--royal-gold)" }}>
        <img src={pro} className="w-100 h-100 object-fit-cover" alt="Private" />
        <div className="position-absolute bottom-0 end-0 m-2 cursor-pointer" onClick={() => handleViewimage(profile._id)}>
          <span className="badge bg-dark rounded-pill d-flex align-items-center p-2 shadow" style={{ border: "1px solid var(--royal-gold)" }}>
            <IoImageSharp size={16} className="me-1" color="var(--royal-gold)" />
            <span>{totalPhotos < 10 ? `0${totalPhotos}` : totalPhotos}</span>
          </span>
        </div>
        <div className="position-absolute top-50 start-50 translate-middle text-center w-100 px-3 z-10">
          {isPending  && <p className="mb-0 text-white fw-bold bg-dark bg-opacity-75 rounded px-2 py-1 mx-auto" style={{ width:"fit-content" }}>Request Pending</p>}
          {isRejected && <>
            <p className="mb-2 text-white fw-bold bg-danger bg-opacity-75 rounded px-2 py-1 mx-auto" style={{ width:"fit-content" }}>Request Rejected</p>
            <button className="royal-button-outline bg-white text-dark w-auto px-3 py-1" style={{ fontSize:"0.85rem" }} onClick={() => HandlePhotoReq(profile?._id)}>Resend Request</button>
          </>}
          {!isPending && !isRejected && <button className="royal-button px-3 py-2 shadow" style={{ fontSize:"0.9rem" }} onClick={() => HandlePhotoReq(profile?._id)}>Request Photo</button>}
        </div>
      </div>
    );
  }

  return (
    <div className="position-relative w-100 overflow-hidden" style={{ height: "16rem", borderBottom: "3px solid var(--royal-gold)" }}>
      {profile?.filesId?.photos?.map((photo, i) => (
        <React.Fragment key={photo._id || i}>
          <img src={photo.url} className={`w-100 h-100 object-fit-cover position-absolute top-0 start-0 ${i===0?"opacity-100 z-1":"opacity-0 z-0"}`} alt="Profile" />
          <div className="position-absolute bottom-0 end-0 m-2 cursor-pointer z-2" onClick={() => handleViewimage(profile._id)}>
            <span className="badge bg-dark rounded-pill d-flex align-items-center p-2 shadow" style={{ border:"1px solid var(--royal-gold)" }}>
              <IoImageSharp size={16} className="me-1" color="var(--royal-gold)" />
              <span>{totalPhotos < 10 ? `0${totalPhotos}` : totalPhotos}</span>
            </span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

/* ─── Premium Search Card (RecentAddedPage style) ─── */
const SearchProfileCard = ({ profile, fetchData, isViewDisabled }) => {
  const { updateData } = useAuth();
  const navigate = useNavigate();

  const getImg = () => {
    if (profile?.filesId?.isPrivate && profile?.photoRequestStatus !== "accepted") return pro;
    if (profile?.filesId?.photos?.length > 0) return profile.filesId.photos[0].url;
    const url = profile?.imageUrl;
    const isDefault = !url || 
      url.includes("profile.png") || 
      url.includes("user-icon-flat-isolated") || 
      url.includes("istockphoto.com");
    if (!isDefault) return url;
    return profile?.gender === "Female" ? femaleDefault : maleDefault;
  };

  const isDefaultImg = () => {
    if (profile?.filesId?.photos?.length > 0) return false;
    if (profile?.filesId?.isPrivate && photoReqStatus !== "accepted") return false;
    const img = getImg();
    if (!img) return true;
    const str = String(img).toLowerCase();
    return (
      str.includes("default") ||
      str.includes("profile") ||
      str.includes("user-icon") ||
      str.includes("istock")
    );
  };

  const imageSrc   = getImg();
  const useDefault = isDefaultImg();
  const isPrivate  = profile?.filesId?.isPrivate;
  const totalPhotos= profile?.filesId?.totalPhotos || 0;
  const age        = profile?.dateOfBirth ? calculateAge(profile.dateOfBirth) : null;

  let heightStr = "";
  if (profile?.height?.feet) heightStr = `${profile.height.feet}'${profile.height.inches||0}"`;

  const parts = [];
  if (age) parts.push(`${age} Yrs`);
  if (heightStr) parts.push(heightStr);
  const loc = profile?.address?.city || profile?.address?.state;
  if (loc?.trim()) parts.push(loc);
  const subtitle = parts.join("  |  ");

  const details = [
    { label:"Clan",            icon:<GiSwordClash />,      value: profile?.HoroscopicId?.clan },
    { label:"Age",             icon:<FaCalendarAlt />,     value: age ? `${age} yrs old` : null },
    { label:"Location",        icon:<FaMapMarkerAlt />,    value: profile?.address?.city && profile?.address?.state ? `${profile.address.city}, ${profile.address.state}` : (profile?.address?.city || profile?.address?.state || null) },
    { label:"High. Education", icon:<FaGraduationCap />,   value: profile?.profdetailsId?.qualifications },
    { label:"Occupation",      icon:<FaBriefcase />,       value: profile?.familydetailsId?.occupation || profile?.profdetailsId?.occupation },
    { label:"Class",           icon:<FaUserTie />,         value: profile?.profdetailsId?.class },
  ];

  // ── Local optimistic connection status ──
  const [connStatus, setConnStatus] = useState(profile?.connectionStatus || null);
  useEffect(() => { setConnStatus(profile?.connectionStatus || null); }, [profile?._id, profile?.connectionStatus]);

  // ── Local optimistic photo request status ──
  const [photoReqStatus, setPhotoReqStatus] = useState(profile?.photoRequestStatus || null);
  useEffect(() => { setPhotoReqStatus(profile?.photoRequestStatus || null); }, [profile?._id, profile?.photoRequestStatus]);

  // ── Local optimistic shortlist state ──
  const [isShortlisted, setIsShortlisted] = useState(!!profile?.isShortlisted);
  useEffect(() => { setIsShortlisted(!!profile?.isShortlisted); }, [profile?._id, profile?.isShortlisted]);

  const handleShortlist = async (id) => {
    setIsShortlisted(prev => !prev);   // instant toggle
    try {
      await updateData("profile/shortlist", id, true);
      if (fetchData) fetchData();
    } catch(e) {
      setIsShortlisted(prev => !prev); // rollback on error
      console.error(e);
    }
  };

  const handleSendRequest = async (id) => {
    setConnStatus("pending");
    try {
      await updateData("profile/request", id, true);
      if (fetchData) fetchData();
    } catch(e) {
      setConnStatus(profile?.connectionStatus || null);
      console.error(e);
    }
  };

  const handlePhotoReq = async (id) => {
    setPhotoReqStatus("pending");
    try {
      await updateData("profile/photoRequest", id, true);
      if (fetchData) fetchData();
    } catch(e) {
      setPhotoReqStatus(profile?.photoRequestStatus || null);
      console.error(e);
    }
  };

  const handleView = (id) => { navigate(`view/${id}`); };
  const handleViewimage = (id) => { navigate(`view/images/${id}`); };

  const ConnBtn = () => {
    if (connStatus === "pending")
      return (
        <button
          className={styles.squareButton}
          disabled
          title="Request already sent — waiting for response"
          style={{ color:"#f8a35b", borderColor:"rgba(248,163,91,0.4)", cursor:"not-allowed", opacity:0.55, pointerEvents:"none" }}
        >
          <FaUserClock size={16}/>
        </button>
      );
    if (connStatus === "accepted")
      return (
        <button
          className={styles.squareButton}
          title="Send Message"
          onClick={async()=>{ try{ await chatApi.validateParticipant(profile._id); }catch{} navigate("/message"); }}
        >
          <TiMessages size={16}/>
        </button>
      );
    if (connStatus === "rejected")
      return (
        <button
          className={styles.squareButton}
          title="Request Rejected — Send Again"
          onClick={() => handleSendRequest(profile._id)}
          style={{ color:"#dc3545", borderColor:"rgba(220,53,69,0.35)", background:"#fff5f5" }}
        >
          <FaUserPlus size={16}/>
        </button>
      );
    return (
      <button
        className={styles.squareButton}
        title="Send Request"
        onClick={() => handleSendRequest(profile._id)}
      >
        <FaUserPlus size={16}/>
      </button>
    );
  };

  const disabledBtnStyle = {
    opacity: 0.45,
    cursor: "not-allowed",
    pointerEvents: "none",
    filter: "grayscale(50%)",
  };

  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }} className={styles.cardContainer}>
      {/* Dark maroon header */}
      <div className={styles.cardHeaderBlock}>
        <span className={styles.genderTag}>{profile?.gender==="Female"?"Bride":"Groom"}</span>
        {profile?.isVerified && (
          <span className={styles.verifiedTag}><FaShieldAlt size={11}/> Verified</span>
        )}
      </div>
      {/* Avatar */}
      <div className={styles.avatarWrapper}>
        <img 
          src={imageSrc} 
          className={styles.avatarImage} 
          alt="Profile"
          style={useDefault ? { objectFit: "cover", objectPosition: "center" } : { objectFit: "cover", objectPosition: "top" }}
        />
        {isPrivate && photoReqStatus !== "accepted" && (
          <div className={styles.privateOverlay} style={{ flexDirection: "column", gap: "3px", padding: "4px" }}>
            <span style={{ fontSize: "0.55rem", lineHeight: "1" }}>Photo on Request</span>
            {photoReqStatus === "pending" ? (
              <button
                disabled
                style={{
                  fontSize: "0.55rem",
                  padding: "2px 6px",
                  borderRadius: "10px",
                  background: "rgba(0,0,0,0.7)",
                  color: "#ffc107",
                  border: "1px solid #ffc107",
                  cursor: "not-allowed"
                }}
              >
                Pending
              </button>
            ) : photoReqStatus === "rejected" ? (
              <button
                onClick={() => handlePhotoReq(profile._id)}
                style={{
                  fontSize: "0.55rem",
                  padding: "2px 6px",
                  borderRadius: "10px",
                  background: "var(--royal-maroon)",
                  color: "#fff",
                  border: "1px solid var(--royal-gold)",
                  cursor: "pointer"
                }}
              >
                Resend
              </button>
            ) : (
              <button
                onClick={() => handlePhotoReq(profile._id)}
                style={{
                  fontSize: "0.55rem",
                  padding: "2px 6px",
                  borderRadius: "10px",
                  background: "var(--royal-maroon)",
                  color: "#fff",
                  border: "1px solid var(--royal-gold)",
                  cursor: "pointer"
                }}
              >
                Request
              </button>
            )}
          </div>
        )}
      </div>
      {/* Body */}
      <div className={styles.cardBody}>
        <h3 className={styles.profileTitle}>{profile?.name || `Matri ID: ${profile?.martrId}`}</h3>
        <p className={styles.profileSubtitle}>{subtitle || "—"}</p>
        <div className={styles.detailsGrid}>
          {details.map((d,i)=>(
            <div key={i} className={styles.detailItem}>
              <span className={styles.detailLabel}><span className={styles.detailIcon}>{d.icon}</span>{d.label}</span>
              <span className={styles.detailValue} title={d.value||"Not Specified"}>{d.value||"Not Specified"}</span>
            </div>
          ))}
        </div>
        {profile?.additionalInfo && <p className={styles.quoteText}>"{profile.additionalInfo}"</p>}
        <div className={styles.actionsRow}>
          <button
            className={styles.viewButton}
            disabled={connStatus !== "accepted"}
            style={connStatus !== "accepted" ? { border: "none", ...disabledBtnStyle } : { border: "none", cursor: "pointer" }}
            onClick={() => handleView(profile._id)}
            title={connStatus === "accepted" ? "View Profile" : "View disabled until request is accepted"}
          >
            <IoEyeOutline className="me-2"/>View
          </button>
          <button
            className={styles.squareButton}
            disabled={connStatus !== "accepted"}
            onClick={() => connStatus === "accepted" && handleShortlist(profile._id)}
            title={connStatus === "accepted" ? (isShortlisted ? "Remove Shortlist" : "Shortlist Profile") : "Shortlist disabled until request is accepted"}
            style={connStatus !== "accepted" ? disabledBtnStyle : { cursor: "pointer", color: isShortlisted ? "#dc3545" : "inherit" }}
          >
            {isShortlisted ? <FaHeart size={16} color="#dc3545"/> : <FaRegHeart size={16}/>}
          </button>
          <span
            className={styles.squareButton}
            style={connStatus !== "accepted" ? disabledBtnStyle : { cursor: "pointer" }}
            onClick={() => connStatus === "accepted" && handleViewimage(profile._id)}
            title={connStatus === "accepted" ? "View Photos" : "Photos disabled until request is accepted"}
          >
            <IoImageSharp/>
            {totalPhotos>0 && <span className={styles.photoCount}>{totalPhotos}</span>}
          </span>
          <ConnBtn/>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Filter Label with heart icon ─── */
const FilterLabel = ({ children }) => (
  <label style={{ display:"flex", alignItems:"center", gap:"6px", fontSize:"0.88rem", fontWeight:600, color:"var(--royal-maroon)", marginBottom:"8px" }}>
    <FaRegHeart size={13} style={{ color:"var(--royal-maroon)", flexShrink:0 }}/>
    {children}
  </label>
);

/* ─── Filter select input ─── */
const FilterSelect = ({ name, value, onChange, children }) => (
  <select
    name={name} value={value} onChange={onChange}
    style={{
      width:"100%", padding:"9px 14px", borderRadius:"10px",
      border:"1.5px solid rgba(89,18,59,0.13)", background:"#fff",
      fontSize:"0.87rem", color:"var(--royal-maroon-dark)",
      outline:"none", appearance:"none", cursor:"pointer",
      backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2359123B' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")",
      backgroundRepeat:"no-repeat", backgroundPosition:"right 12px center",
      transition:"border-color .2s",
    }}
    onFocus={e => e.target.style.borderColor = "var(--royal-maroon)"}
    onBlur={e => e.target.style.borderColor = "rgba(89,18,59,0.13)"}
  >
    {children}
  </select>
);

/* ─── Age range number input ─── */
const AgeInput = ({ name, value, onChange, placeholder }) => (
  <input
    type="number" name={name} value={value} onChange={onChange} placeholder={placeholder} min={18} max={70}
    style={{
      width:"100%", padding:"9px 12px", borderRadius:"10px",
      border:"1.5px solid rgba(89,18,59,0.13)", background:"#fff",
      fontSize:"0.87rem", color:"var(--royal-maroon-dark)",
      outline:"none", textAlign:"center", transition:"border-color .2s",
    }}
    onFocus={e => e.target.style.borderColor = "var(--royal-maroon)"}
    onBlur={e => e.target.style.borderColor = "rgba(89,18,59,0.13)"}
  />
);

/* ═══════════════════════════ MAIN PAGE ═══════════════════════════ */
const SearchPage = () => {
  const { setFormData, formData, updateData, userData, fetchUserData } = useAuth();
  const [profiles,    setProfiles]    = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [viewMode,    setViewMode]    = useState("grid");
  const [mobileFilter,setMobileFilter]= useState(false);
  const activeTab = "requestSent";

  const [limits, setLimits] = useState(null);

  useEffect(() => {
    const fetchLimits = async () => {
      try {
        const res = await fetchUserData("limits");
        if (res) setLimits(res);
      } catch (e) {
        console.error("Error fetching limits:", e);
      }
    };
    fetchLimits();
  }, [fetchUserData]);

  const getIsViewDisabled = (profileId) => {
    if (userData?.role === "admin") return false;
    const isVisited = Array.isArray(userData?.visitedAt) && userData.visitedAt.includes(profileId);
    if (isVisited) return false;

    const currentViews = Array.isArray(userData?.visitedAt) ? userData.visitedAt.length : 0;
    const allowedViews = userData?.isSubscribed
      ? (limits?.premiumLimit?.count || 50)
      : (limits?.freeProfileViews || 2);

    return currentViews >= allowedViews;
  };

  const [countries, setCountries] = useState([]);
  const [states,    setStates]    = useState([]);
  const [clanOptions, setClanOptions] = useState({ clans: [], subclans: [], combined: [] });
  const [clanLoading, setClanLoading] = useState(false);

  const profilesPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil((profiles?.length||0) / profilesPerPage));
  const getPage    = () => profiles?.slice((currentPage-1)*profilesPerPage, currentPage*profilesPerPage) || [];

  // ── Ref to always have latest formData (prevents stale-closure in callbacks) ──
  const formDataRef = useRef(formData);
  useEffect(() => { formDataRef.current = formData; }, [formData]);

  useEffect(() => { setCountries(Country.getAllCountries()); }, []);
  useEffect(() => {
    const loadClans = async () => {
      setClanLoading(true);
      try {
        const res = await fetchUserData("profile/clans");
        if (res) setClanOptions(res);
      } catch(e) { console.error("Error loading clans:", e); }
      finally { setClanLoading(false); }
    };
    loadClans();
  }, [fetchUserData]);
  useEffect(() => {
    if (formData.country) {
      const c = countries.find(c => c.name === formData.country);
      if (c) setStates(State.getStatesOfCountry(c.isoCode));
    } else setStates([]);
  }, [formData.country, countries]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name==="country" ? { state:"", city:"" } : {}),
      ...(name==="state"   ? { city:"" }           : {}),
    }));
  };

  // ── Full search: resets to page 1 (used when user clicks "Search Profiles") ──
  const handleSearch = async (showToast=false) => {
    try {
      setLoading(true);
      const res = await updateData("getprofiles", formDataRef.current, showToast);
      const rawList = res?.data || [];
      const filteredList = rawList.filter(p => {
        const isSelf = p._id === userData?._id || p.userId === userData?._id;
        const isAdmin = p.role === "admin";
        return !isSelf && !isAdmin;
      });
      setProfiles(filteredList);
      setCurrentPage(1);
    } catch(e){ console.error(e); }
    finally { setLoading(false); }
  };

  // ── Refresh: keeps current page & filters — used after card actions ──
  const refreshData = useCallback(async () => {
    try {
      const res = await updateData("getprofiles", formDataRef.current, false);
      const rawList = res?.data || [];
      const filteredList = rawList.filter(p => {
        const isSelf = p._id === userData?._id || p.userId === userData?._id;
        const isAdmin = p.role === "admin";
        return !isSelf && !isAdmin;
      });
      setProfiles(filteredList);
      // currentPage intentionally NOT reset — stay on same page
    } catch(e){ console.error(e); }
  }, [updateData, userData]);

  const handleReset = () => {
    let defaultGender = "";
    if (userData?.gender === "Male") defaultGender = "Female";
    else if (userData?.gender === "Female") defaultGender = "Male";
    
    const resetData = { gender: defaultGender };
    setFormData(resetData);
    formDataRef.current = resetData;
    handleSearch(false);
  };

  useEffect(() => { 
    // On mount: load profiles with whatever filters are already in context (do NOT clear them)
    handleSearch(false); 
  }, []);

  useEffect(() => {
    if (userData?.gender === "Male" && formData.gender !== "Female") {
      setFormData(prev => ({ ...prev, gender: "Female" }));
    } else if (userData?.gender === "Female" && formData.gender !== "Male") {
      setFormData(prev => ({ ...prev, gender: "Male" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.gender]);

  /* ── Count active filters ── */
  const filterKeys = ["gender","minAge","maxAge","maritalStatus","clan","manglik","class","country","state","HeightFeetfrom","HeightFeetto"];
  const activeFilterCount = filterKeys.filter(k => formData[k] && formData[k] !== "").length;

  /* ── Sidebar filter panel ── */
  const FilterPanel = () => (
    <div style={{
      background:"#FFFDF7",
      borderRadius:"18px",
      border:"1px solid rgba(237,177,57,0.22)",
      boxShadow:"0 4px 24px rgba(89,18,59,0.06)",
      padding:"24px 20px",
      position:"sticky",
      top:"80px",
    }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"22px", paddingBottom:"14px", borderBottom:"1.5px dashed rgba(237,177,57,0.3)" }}>
        <FaSlidersH size={18} style={{ color:"var(--royal-gold)" }}/>
        <span style={{ fontFamily:"var(--font-heading)", fontSize:"1.15rem", fontWeight:700, color:"var(--royal-maroon)" }}>Filters</span>
        {activeFilterCount > 0 && (
          <span style={{
            marginLeft:"auto",
            background:"var(--royal-maroon)",
            color:"#fff",
            borderRadius:"20px",
            padding:"2px 10px",
            fontSize:"0.75rem",
            fontWeight:700,
            letterSpacing:"0.3px",
            boxShadow:"0 2px 8px rgba(89,18,59,0.25)",
            animation:"pulse-badge 0.3s ease",
          }}>
            {activeFilterCount} Applied
          </span>
        )}
      </div>

      {/* Looking For */}
      <div style={{ marginBottom:"18px" }}>
         <FilterLabel>Looking For</FilterLabel>
         <FilterSelect name="gender" value={formData.gender||""} onChange={handleChange}>
           <option value="" disabled={userData?.gender === "Male" || userData?.gender === "Female"}>Any</option>
           <option value="Male" disabled={userData?.gender === "Male"}>Groom</option>
           <option value="Female" disabled={userData?.gender === "Female"}>Bride</option>
         </FilterSelect>
      </div>



      {/* Age Range */}
      <div style={{ marginBottom:"18px" }}>
        <FilterLabel>Age Range: {formData.minAge||21} — {formData.maxAge||45}</FilterLabel>
        <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
          <AgeInput name="minAge" value={formData.minAge||""} onChange={handleChange} placeholder="21"/>
          <span style={{ color:"var(--royal-maroon)", fontWeight:600, flexShrink:0 }}>—</span>
          <AgeInput name="maxAge" value={formData.maxAge||""} onChange={handleChange} placeholder="45"/>
        </div>
      </div>

      {/* Marital Status */}
      <div style={{ marginBottom:"18px" }}>
        <FilterLabel>Marital Status</FilterLabel>
        <FilterSelect name="maritalStatus" value={formData.maritalStatus||""} onChange={handleChange}>
          <option value="">Any</option>
          <option value="Single">Never Married</option>
          <option value="Divorced">Divorced</option>
          <option value="Widowed">Widowed</option>
        </FilterSelect>
      </div>

      {/* Height Range */}
      <div style={{ marginBottom:"18px" }}>
        <FilterLabel>Height (feet)</FilterLabel>
        <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
          <AgeInput name="HeightFeetfrom" value={formData.HeightFeetfrom||""} onChange={handleChange} placeholder="4"/>
          <span style={{ color:"var(--royal-maroon)", fontWeight:600, flexShrink:0 }}>—</span>
          <AgeInput name="HeightFeetto" value={formData.HeightFeetto||""} onChange={handleChange} placeholder="6"/>
        </div>
      </div>

      {/* Clan / Subclan */}
      <div style={{ marginBottom:"18px" }}>
        <FilterLabel>Clan / Subclan</FilterLabel>
        <FilterSelect name="clan" value={formData.clan||""} onChange={handleChange} disabled={clanLoading}>
          <option value="">{clanLoading ? "Loading…" : "Any Clan / Subclan"}</option>
          {clanOptions.clans.length > 0 && (
            <optgroup label="── Clans ──">
              {clanOptions.clans.map(c => (
                <option key={`clan-${c}`} value={c}>{c}</option>
              ))}
            </optgroup>
          )}
          {clanOptions.subclans.length > 0 && (
            <optgroup label="── Subclans ──">
              {clanOptions.subclans.map(s => (
                <option key={`sub-${s}`} value={s}>{s}</option>
              ))}
            </optgroup>
          )}
        </FilterSelect>
      </div>

      {/* Manglik Status */}
      <div style={{ marginBottom:"18px" }}>
        <FilterLabel>Manglik Status</FilterLabel>
        <FilterSelect name="manglik" value={formData.manglik||""} onChange={handleChange}>
          <option value="">Any</option>
          <option value="Manglik">Manglik</option>
          <option value="Non Manglik">Non Manglik</option>
          <option value="Anshik Manglik">Anshik Manglik</option>
          <option value="Don't Know">Don't Know</option>
        </FilterSelect>
      </div>

      {/* Family Class */}
      <div style={{ marginBottom:"24px" }}>
        <FilterLabel>Family Class</FilterLabel>
        <FilterSelect name="class" value={formData.class||""} onChange={handleChange}>
          <option value="">Any</option>
          <option value="Business">Business</option>
          <option value="Royalty">Royalty</option>
          <option value="Political">Political</option>
          <option value="Service">Service</option>
          <option value="Others">Others</option>
        </FilterSelect>
      </div>

      {/* Country */}
      <div style={{ marginBottom:"18px" }}>
        <FilterLabel>Country</FilterLabel>
        <FilterSelect name="country" value={formData.country||""} onChange={handleChange}>
          <option value="">Select Country</option>
          {countries.map(c => <option key={c.isoCode} value={c.name}>{c.name}</option>)}
        </FilterSelect>
      </div>

      {/* State */}
      <div style={{ marginBottom:"24px" }}>
        <FilterLabel>State</FilterLabel>
        <FilterSelect name="state" value={formData.state||""} onChange={handleChange} disabled={!formData.country}>
          <option value="">Select State</option>
          {states.map(s => <option key={s.isoCode} value={s.name}>{s.name}</option>)}
        </FilterSelect>
      </div>

      {/* Buttons */}
      <button
        onClick={() => handleSearch(true)}
        style={{
          width:"100%", padding:"11px", borderRadius:"30px",
          background:"linear-gradient(135deg, var(--royal-maroon), var(--royal-maroon-dark))",
          color:"#fff", border:"none", fontWeight:700, fontSize:"0.9rem",
          cursor:"pointer", marginBottom:"10px", letterSpacing:"0.3px",
          transition:"all .2s",
        }}
        onMouseEnter={e=>e.currentTarget.style.opacity="0.88"}
        onMouseLeave={e=>e.currentTarget.style.opacity="1"}
      >
        Search Profiles
      </button>
      <button
        onClick={handleReset}
        style={{
          width:"100%", padding:"10px", borderRadius:"30px",
          background:"transparent", color:"var(--royal-maroon)",
          border:"1.5px solid rgba(89,18,59,0.25)", fontWeight:600,
          fontSize:"0.85rem", cursor:"pointer",
        }}
      >
        Reset Filters
      </button>
    </div>
  );

  return (
    <div style={{ background:"linear-gradient(180deg, #f8f0e8 0%, var(--royal-cream-dark) 100%)", minHeight:"100vh" }} className="pb-bottom-nav">
      <Profilenavbar/>

      {/* ── Royal Page Hero Banner ── */}
      <div style={{
        background:"linear-gradient(135deg, #3a0a25 0%, #59123B 50%, #6d1547 100%)",
        padding:"36px 0 28px",
        position:"relative",
        overflow:"hidden",
        marginBottom:"0",
      }}>
        {/* Decorative ornamental circles */}
        <div style={{ position:"absolute", top:"-60px", right:"-60px", width:"200px", height:"200px", borderRadius:"50%", border:"1px solid rgba(212,175,55,0.12)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", top:"-30px", right:"-30px", width:"130px", height:"130px", borderRadius:"50%", border:"1px solid rgba(212,175,55,0.18)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:"-50px", left:"-50px", width:"180px", height:"180px", borderRadius:"50%", border:"1px solid rgba(212,175,55,0.1)", pointerEvents:"none" }}/>
        {/* Gold bottom line */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"2px", background:"linear-gradient(90deg, transparent, rgba(212,175,55,0.7), var(--royal-gold), rgba(212,175,55,0.7), transparent)" }}/>

        <div className="container">
          {/* Breadcrumb */}
          <div className="d-flex align-items-center mb-3" style={{ fontSize:"0.88rem", color:"rgba(255,255,255,0.65)" }}>
            <Link to="/home" className="text-decoration-none fw-bold" style={{ color:"rgba(255,255,255,0.75)" }}>Home</Link>
            <AiOutlineRight size={12} className="mx-2"/>
            <span style={{ color:"var(--royal-gold)" }}>Partner Search</span>
          </div>
          <h1 style={{ fontFamily:"var(--font-heading)", color:"#ffffff", fontSize:"2rem", fontWeight:700, marginBottom:"6px", letterSpacing:"0.3px" }}>
            Find Your <span style={{ color:"var(--royal-gold)" }}>Perfect Match</span>
          </h1>
          <p style={{ color:"rgba(255,255,255,0.7)", fontSize:"0.95rem", marginBottom:0 }}>
            {profiles.length > 0 ? `${profiles.length} profiles match your preferences` : "Search through thousands of verified Rajput profiles"}
          </p>
        </div>
      </div>

      <div className="container py-4">
        {/* Mobile filter toggle */}
        <div className="d-md-none mb-3">
          <button
            onClick={() => setMobileFilter(v=>!v)}
            style={{
              display:"flex", alignItems:"center", gap:"8px",
              padding:"10px 20px", borderRadius:"30px",
              background:"linear-gradient(135deg, var(--royal-maroon), var(--royal-maroon-dark))",
              color:"#fff", border:"none", fontWeight:600, fontSize:"0.9rem", cursor:"pointer",
              boxShadow:"0 4px 14px rgba(89,18,59,0.25)",
            }}
          >
            <FaSlidersH size={16}/>
            {mobileFilter ? "Hide Filters" : "Show Filters"}
            {activeFilterCount > 0 && (
              <span style={{
                background:"var(--royal-gold)", color:"var(--royal-maroon-dark)",
                borderRadius:"20px", padding:"1px 8px",
                fontSize:"0.72rem", fontWeight:800,
              }}>{activeFilterCount}</span>
            )}
          </button>
          <AnimatePresence>
            {mobileFilter && (
              <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} exit={{ opacity:0, height:0 }} style={{ overflow:"hidden", marginTop:"12px" }}>
                <FilterPanel/>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Main layout: Sidebar + Results */}
        <div style={{ display:"flex", gap:"28px", alignItems:"flex-start" }}>

          {/* LEFT: Filter Sidebar (desktop) */}
          <div className="d-none d-md-block" style={{ width:"270px", flexShrink:0 }}>
            <FilterPanel/>
          </div>

          {/* RIGHT: Results */}
          <div style={{ flex:1, minWidth:0 }}>
            {/* Top bar: count + view toggle */}
            <div className="d-flex justify-content-between align-items-center mb-4"
              style={{ background:"#ffffff", borderRadius:"14px", padding:"14px 20px", boxShadow:"0 2px 12px rgba(89,18,59,0.06)", border:"1px solid rgba(212,175,55,0.15)" }}>
              <h5 className="fw-bold mb-0" style={{ fontFamily:"var(--font-heading)", color:"var(--royal-maroon-dark)", fontSize:"1.05rem" }}>
                Search Results
                <span style={{ fontSize:"0.82rem", fontWeight:400, color:"var(--royal-text-light)", marginLeft:"8px" }}>({profiles.length} Found)</span>
              </h5>
              <div className="d-flex gap-2">
                <button
                  title="Grid View"
                  onClick={() => setViewMode("grid")}
                  style={{
                    width:"38px", height:"38px", borderRadius:"10px",
                    border: viewMode==="grid" ? "2px solid var(--royal-maroon)" : "1.5px solid rgba(212,175,55,0.3)",
                    color: viewMode==="grid" ? "var(--royal-maroon)" : "var(--royal-text-light)",
                    background: viewMode==="grid" ? "#fff5f0" : "#fff",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    cursor:"pointer", transition:"all .2s",
                  }}
                ><BsGridFill size={16}/></button>
                <button
                  title="Table View"
                  onClick={() => setViewMode("table")}
                  style={{
                    width:"38px", height:"38px", borderRadius:"10px",
                    border: viewMode==="table" ? "2px solid var(--royal-maroon)" : "1.5px solid rgba(212,175,55,0.3)",
                    color: viewMode==="table" ? "var(--royal-maroon)" : "var(--royal-text-light)",
                    background: viewMode==="table" ? "#fff5f0" : "#fff",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    cursor:"pointer", transition:"all .2s",
                  }}
                ><BsListUl size={18}/></button>
              </div>
            </div>

            {/* Results */}
            {loading ? (
              <div style={{ textAlign:"center", padding:"60px 20px" }}>
                <div style={{
                  width:"48px", height:"48px", border:"3px solid rgba(89,18,59,0.08)",
                  borderTopColor:"var(--royal-maroon)", borderRightColor:"var(--royal-gold)",
                  borderRadius:"50%", animation:"spin 1s ease-in-out infinite",
                  margin:"0 auto 16px",
                }}/>
                <p style={{ color:"var(--royal-text-light)", fontSize:"0.95rem" }}>Finding your matches...</p>
              </div>
            ) : profiles.length === 0 ? (
              <div style={{
                textAlign:"center", padding:"60px 40px",
                background:"#ffffff", borderRadius:"20px",
                boxShadow:"0 4px 20px rgba(89,18,59,0.06)",
                border:"1px solid rgba(212,175,55,0.2)",
              }}>
                <p style={{ fontSize:"1.1rem", color:"var(--royal-text-light)", marginBottom:"16px" }}>No profiles found matching your preferences.</p>
                <button onClick={handleReset} style={{
                  padding:"10px 28px", borderRadius:"30px",
                  background:"linear-gradient(135deg, var(--royal-maroon), #3a0a25)",
                  color:"#fff", border:"none", fontWeight:600, cursor:"pointer",
                  boxShadow:"0 4px 14px rgba(89,18,59,0.25)",
                }}>Clear Filters</button>
              </div>
            ) : viewMode === "table" ? (
              <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}>
                <RequestTable profiles={getPage()} activeTab={activeTab} status="new" fetchData={refreshData} handlecheck={()=>refreshData()} isSearchPage={true}/>
              </motion.div>
            ) : (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:"1.4rem" }}>
                {getPage().map(profile => (
                  <SearchProfileCard key={profile._id} profile={profile} fetchData={refreshData}/>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && !loading && (
              <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:"8px", marginTop:"40px" }}>
                <button onClick={()=>setCurrentPage(p=>Math.max(1,p-1))} disabled={currentPage===1}
                  style={{
                    width:"40px", height:"40px", borderRadius:"50%",
                    border:"1.5px solid rgba(212,175,55,0.4)", color:"var(--royal-maroon)",
                    background:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
                    opacity: currentPage===1 ? 0.4 : 1, transition:"all .2s",
                    boxShadow:"0 2px 8px rgba(0,0,0,0.06)",
                  }}>
                  <FaChevronLeft size={13}/>
                </button>
                {Array.from({ length:totalPages }).map((_,i)=>(
                  <button key={i} onClick={()=>setCurrentPage(i+1)}
                    style={{
                      width:"40px", height:"40px", borderRadius:"50%",
                      background: currentPage===i+1 ? "linear-gradient(135deg, var(--royal-maroon), #3a0a25)" : "#fff",
                      color: currentPage===i+1 ? "#fff" : "var(--royal-maroon)",
                      border: currentPage===i+1 ? "none" : "1.5px solid rgba(212,175,55,0.4)",
                      fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
                      boxShadow: currentPage===i+1 ? "0 4px 12px rgba(89,18,59,0.3)" : "0 2px 6px rgba(0,0,0,0.04)",
                      transition:"all .2s",
                    }}>
                    {i+1}
                  </button>
                ))}
                <button onClick={()=>setCurrentPage(p=>Math.min(totalPages,p+1))} disabled={currentPage===totalPages}
                  style={{
                    width:"40px", height:"40px", borderRadius:"50%",
                    border:"1.5px solid rgba(212,175,55,0.4)", color:"var(--royal-maroon)",
                    background:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
                    opacity: currentPage===totalPages ? 0.4 : 1, transition:"all .2s",
                    boxShadow:"0 2px 8px rgba(0,0,0,0.06)",
                  }}>
                  <FaChevronRight size={13}/>
                </button>
              </div>
            )}
          </div>{/* /RIGHT */}
        </div>{/* /main layout */}
      </div>

      <Footer/>
    </div>
  );
};

export default SearchPage;
