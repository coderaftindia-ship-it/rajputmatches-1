import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoImageSharp, IoEyeOutline } from "react-icons/io5";
import {
  FaChevronLeft, FaChevronRight, FaGraduationCap, FaBriefcase,
  FaShieldAlt, FaRegHeart, FaMapMarkerAlt, FaCalendarAlt, FaUserTie,
} from "react-icons/fa";
import { MdBlock } from "react-icons/md";
import { GiSwordClash } from "react-icons/gi";
import RecentAddedPageCss from "./RecentAddedPage.module.css";
import { publicApi } from "../../api";
import { calculateAge } from "../Profile/ProfileComp/ProfileInfoHeader";
import { useAuth } from "./AuthContext";
import maleDefault from "../../assets/images/male_default.png";
import femaleDefault from "../../assets/images/female_default.png";
import blurImage from "../../assets/images/blurimage.png";

function RecentAddedPage() {
  const { isAuthenticated, updateData } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const isHomePage = location.pathname === "/" || location.pathname === "/home";

  const [profiles,     setProfiles]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused,     setIsPaused]     = useState(false);
  const [windowWidth,  setWindowWidth]  = useState(window.innerWidth);

  // Mobile swipe scroll ref
  const scrollRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  let visibleCards = 3;
  if (windowWidth < 768)       visibleCards = 1;
  else if (windowWidth < 1200) visibleCards = 2;

  // Fetch profiles
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const res = await publicApi.getRecentProfiles();
        let fetchedList = [];
        if (Array.isArray(res?.data?.data))       fetchedList = res.data.data;
        else if (Array.isArray(res?.data))        fetchedList = res.data;
        else if (Array.isArray(res))              fetchedList = res;

        // Display ONLY admin approved profiles & max top 9 recent profiles
        const approvedOnly = fetchedList.filter(p => p.isApproved !== false);
        setProfiles(approvedOnly.slice(0, 9));
      } catch (err) {
        console.error("Failed to fetch recent profiles:", err);
        setError("Failed to load profiles");
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  const useSlider = profiles.length > visibleCards;
  const maxIndex  = Math.max(0, profiles.length - visibleCards);

  const handleNext = useCallback(() => setCurrentIndex(prev => prev >= maxIndex ? 0 : prev + 1), [maxIndex]);
  const handlePrev = useCallback(() => setCurrentIndex(prev => prev <= 0 ? maxIndex : prev - 1), [maxIndex]);

  // Auto-slide (desktop only)
  useEffect(() => {
    if (!useSlider || isPaused || isMobile) return;
    const interval = setInterval(handleNext, 3500);
    return () => clearInterval(interval);
  }, [useSlider, isPaused, maxIndex, isMobile, handleNext]);

  useEffect(() => {
    if (currentIndex > maxIndex) setCurrentIndex(maxIndex);
  }, [maxIndex]);

  // Sync dot indicator with mobile scroll position
  useEffect(() => {
    if (!isMobile || !scrollRef.current) return;
    const el = scrollRef.current;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / el.offsetWidth);
      setCurrentIndex(idx);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [isMobile, profiles.length]);

  // Scroll to card when dot clicked (mobile)
  const scrollToCard = (idx) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: idx * scrollRef.current.offsetWidth, behavior: "smooth" });
    }
    setCurrentIndex(idx);
  };

  // Action handlers
  const handleShortlist = async (profileId) => {
    if (!isAuthenticated) { navigate("/login"); return; }
    try { await updateData("profile/shortlist", profileId, true); }
    catch (e) { console.error(e); }
  };

  const handleBlock = async (profileId) => {
    if (!isAuthenticated) { navigate("/login"); return; }
    try {
      await updateData("profile/block-toggle", profileId, true);
      setProfiles(prev => prev.filter(p => p._id !== profileId));
    } catch (e) { console.error(e); }
  };

  const handleSendInterest = async (profileId) => {
    if (!isAuthenticated) { navigate("/login"); return; }
    try { await updateData("profile/request", profileId, true); }
    catch (e) { console.error(e); }
  };

  const getProfileImage = (prof) => {
    if (prof?.filesId?.photos?.length > 0 && (!prof?.filesId?.isPrivate || prof?.photoRequestStatus === "accepted")) {
      return prof.filesId.photos[0].url;
    }
    const url = prof?.imageUrl;
    const isDefault = !url || 
      url.includes("profile.png") || 
      url.includes("user-icon-flat-isolated") || 
      url.includes("istockphoto.com") ||
      url.includes("blurimage");
    if (!isDefault && (!prof?.filesId?.isPrivate || prof?.photoRequestStatus === "accepted")) return url;
    return prof?.gender === "Female" ? femaleDefault : maleDefault;
  };

  const isDefaultAvatar = (prof) => {
    if (prof?.filesId?.photos?.length > 0 && (!prof?.filesId?.isPrivate || prof?.photoRequestStatus === "accepted")) return false;
    return true;
  };

  const disabledOverlay = {
    opacity: 0.42,
    cursor: "not-allowed",
    pointerEvents: "none",
    filter: "grayscale(50%)",
  };

  const ProfileCard = ({ profile, widthStyle }) => {
    const imageSrc    = getProfileImage(profile);
    const useDefault  = isDefaultAvatar(profile);
    const age         = profile.dateOfBirth ? calculateAge(profile.dateOfBirth) : "N/A";
    const totalPhotos = profile.filesId?.totalPhotos || 0;
    const isPrivate   = profile.filesId?.isPrivate;

    const details = [
      { label: "Clan",            icon: <GiSwordClash />,    value: profile?.HoroscopicId?.clan },
      { label: "Age",             icon: <FaCalendarAlt />,   value: profile?.dateOfBirth ? `${calculateAge(profile.dateOfBirth)} yrs old` : null },
      { label: "Location",        icon: <FaMapMarkerAlt />,  value: profile?.address?.city && profile?.address?.state ? `${profile.address.city}, ${profile.address.state}` : (profile?.address?.city || profile?.address?.state || null) },
      { label: "High. Education", icon: <FaGraduationCap />, value: profile?.profdetailsId?.qualifications },
      { label: "Occupation",      icon: <FaBriefcase />,     value: profile?.familydetailsId?.occupation || profile?.profdetailsId?.occupation },
      { label: "Class",           icon: <FaUserTie />,       value: profile?.profdetailsId?.class },
    ];

    const parts = [];
    if (age && age !== "N/A") parts.push(`${age} Yrs`);
    if (profile.height?.feet)  parts.push(`${profile.height.feet}'${profile.height.inches || 0}"`);
    const loc = profile.address?.city || profile.address?.state;
    if (loc && loc.trim()) parts.push(loc);
    const subtitle = parts.join("  |  ");

    return (
      <div style={widthStyle || {}}>
        <div className={RecentAddedPageCss.cardContainer}>
          <div className={RecentAddedPageCss.cardHeaderBlock}>
            <span className={RecentAddedPageCss.genderTag}>{profile.gender === "Female" ? "Bride" : "Groom"}</span>
            <span className={RecentAddedPageCss.verifiedTag}><FaShieldAlt size={12} /> Verified</span>
          </div>

          <div className={RecentAddedPageCss.avatarWrapper}>
            <img 
              src={imageSrc} 
              className={RecentAddedPageCss.avatarImage} 
              alt="Profile"
              style={useDefault ? { objectFit: "cover", objectPosition: "center" } : { objectFit: "cover", objectPosition: "top" }}
            />
          </div>

          <div className={RecentAddedPageCss.cardBody}>
            <h3 className={RecentAddedPageCss.profileTitle}>Matri ID: {profile.martrId}</h3>
            <p className={RecentAddedPageCss.profileSubtitle}>{subtitle}</p>

            <div className={RecentAddedPageCss.detailsGrid}>
              {details.map((d, i) => (
                <div key={i} className={RecentAddedPageCss.detailItem}>
                  <span className={RecentAddedPageCss.detailLabel}>
                    <span className={RecentAddedPageCss.detailIcon}>{d.icon}</span>{d.label}
                  </span>
                  <span className={RecentAddedPageCss.detailValue} title={d.value || "Not Specified"}>
                    {d.value || "Not Specified"}
                  </span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className={RecentAddedPageCss.actionsRow}>
              {isHomePage ? (
                <span
                  className={RecentAddedPageCss.viewButton}
                  style={{ display: "inline-flex", alignItems: "center", cursor: "pointer" }}
                  title={isAuthenticated ? "View Profile" : "Login to view profile"}
                  onClick={() => { if (!isAuthenticated) { navigate("/login"); } else { navigate("/search"); } }}
                >
                  <IoEyeOutline className="me-2" /> View
                </span>
              ) : (
                <Link to={`/profile/view/${profile._id}`} className={RecentAddedPageCss.viewButton} title="View Profile">
                  <IoEyeOutline className="me-2" /> View
                </Link>
              )}

              <button
                onClick={() => handleShortlist(profile._id)}
                className={RecentAddedPageCss.squareButton}
                title={isHomePage ? "Login to shortlist" : "Shortlist"}
                disabled={isHomePage}
                style={isHomePage ? disabledOverlay : {}}
              >
                <FaRegHeart />
              </button>

              {isHomePage ? (
                <span
                  className={RecentAddedPageCss.squareButton}
                  style={{ ...disabledOverlay, display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                  title="Login to view photos"
                >
                  <IoImageSharp />
                  {totalPhotos > 0 && <span className={RecentAddedPageCss.photoCount}>{totalPhotos}</span>}
                </span>
              ) : (
                <Link to={`/profile/view/images/${profile._id}`} className={RecentAddedPageCss.squareButton} title="Photos">
                  <IoImageSharp />
                  {totalPhotos > 0 && <span className={RecentAddedPageCss.photoCount}>{totalPhotos}</span>}
                </Link>
              )}

              <button
                onClick={() => handleBlock(profile._id)}
                className={`${RecentAddedPageCss.squareButton} ${RecentAddedPageCss.blockBtn}`}
                title={isHomePage ? "Login to ignore" : "Ignore"}
                disabled={isHomePage}
                style={isHomePage ? disabledOverlay : {}}
              >
                <MdBlock />
              </button>
            </div>

            <button
              onClick={() => handleSendInterest(profile._id)}
              className={RecentAddedPageCss.sendInterestBtn}
              disabled={isHomePage}
              style={isHomePage ? disabledOverlay : {}}
              title={isHomePage ? "Login to send interest" : "Send Interest"}
            >
              <FaRegHeart className="me-2" /> Send Interest
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="py-5" style={{ backgroundColor: "var(--royal-cream-dark)" }}>
        <div className="container text-center py-5">
          <h2 className="display-6 fw-bold mb-4" style={{ fontFamily: "var(--font-heading)", color: "var(--royal-maroon)" }}>
            Recently Added Profiles
          </h2>
          <div className="spinner-border" role="status" style={{ color: "var(--royal-maroon)" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || profiles.length === 0) {
    return (
      <div className="py-5" style={{ backgroundColor: "var(--royal-cream-dark)" }}>
        <div className="container text-center py-5">
          <h2 className="display-6 fw-bold mb-4" style={{ fontFamily: "var(--font-heading)", color: "var(--royal-maroon)" }}>
            Recently Added Profiles
          </h2>
          <p className="text-secondary">No recent profiles found. Check back later!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-5" style={{ backgroundColor: "var(--royal-cream-dark)", position: "relative" }}>
      <div className="py-4" style={{ overflow: "hidden" }}>

        {/* Section heading */}
        <div className="text-center mb-4 mb-md-5 px-3">
          <h2 className="display-5 fw-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--royal-maroon)" }}>
            Recently Added Profiles
          </h2>
          <div className="mx-auto mt-3" style={{ width: "80px", height: "3px", backgroundColor: "var(--royal-gold)" }} />

          {isHomePage && !isAuthenticated && (
            <p className="mt-3 mb-0" style={{ color: "var(--royal-maroon)", fontSize: "0.88rem", opacity: 0.78, fontStyle: "italic" }}>
              🔒 Please{" "}
              <Link to="/login" style={{ color: "var(--royal-gold)", fontWeight: 600 }}>login</Link>
              {" "}to view profiles and interact
            </p>
          )}
        </div>

        {/* ══════════ MOBILE: CSS Scroll Snap ══════════ */}
        {isMobile ? (
          <>
            <div
              ref={scrollRef}
              className={RecentAddedPageCss.mobileSwipeTrack}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {profiles.map(profile => (
                <div
                  key={profile._id}
                  className={RecentAddedPageCss.mobileSwipeCard}
                >
                  <ProfileCard profile={profile} />
                </div>
              ))}
            </div>

            {/* Mobile dot indicators (swipe hint) */}
            {profiles.length > 1 && (
              <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
                {profiles.map((_, idx) => (
                  <div
                    key={idx}
                    onClick={() => scrollToCard(idx)}
                    style={{
                      width: currentIndex === idx ? 22 : 10,
                      height: 10,
                      borderRadius: 6,
                      cursor: "pointer",
                      backgroundColor: currentIndex === idx ? "var(--royal-maroon)" : "rgba(89,18,59,0.25)",
                      transition: "all 0.3s ease",
                    }}
                  />
                ))}
              </div>
            )}

            {/* Swipe hint text */}
            <p className="text-center mt-2" style={{ fontSize: "0.72rem", color: "var(--royal-text-light)", opacity: 0.7 }}>
              ← Swipe to browse →
            </p>
          </>
        ) : (
          /* ══════════ DESKTOP: Motion Slider ══════════ */
          <div
            className="container"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="position-relative overflow-hidden px-2 px-md-4">
              {useSlider ? (
                <div
                  className="d-flex flex-nowrap"
                  style={{
                    width: `${(profiles.length / visibleCards) * 100}%`,
                    transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
                    transition: "transform 0.5s ease-in-out",
                    willChange: "transform"
                  }}
                >
                  {profiles.map(profile => (
                    <ProfileCard
                      key={profile._id}
                      profile={profile}
                      widthStyle={{ width: `${100 / profiles.length}%`, padding: "0 12px", flexShrink: 0 }}
                    />
                  ))}
                </div>
              ) : (
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  {profiles.map(profile => (
                    <div
                      key={profile._id}
                      style={{ width: `calc(${100 / visibleCards}% - 16px)`, minWidth: 240 }}
                    >
                      <ProfileCard profile={profile} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop: Prev / Dots / Next */}
            {useSlider && maxIndex > 0 && (
              <div className="d-flex justify-content-center align-items-center gap-4 mt-5">
                <button
                  onClick={handlePrev}
                  className="btn btn-outline-dark rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                  style={{ width: 45, height: 45, borderColor: "var(--royal-gold)", color: "var(--royal-maroon)" }}
                >
                  <FaChevronLeft size={18} />
                </button>

                <div className="d-flex gap-2">
                  {Array.from({ length: Math.ceil(profiles.length / visibleCards) }).map((_, pageIdx) => {
                    const targetIdx = Math.min(pageIdx * visibleCards, maxIndex);
                    const isActive = currentIndex >= pageIdx * visibleCards && currentIndex < (pageIdx + 1) * visibleCards;
                    return (
                      <div
                        key={pageIdx}
                        onClick={() => setCurrentIndex(targetIdx)}
                        style={{
                          width: isActive ? 22 : 10,
                          height: 10,
                          borderRadius: 6,
                          cursor: "pointer",
                          backgroundColor: isActive ? "var(--royal-maroon)" : "rgba(89,18,59,0.25)",
                          transition: "all 0.3s ease",
                        }}
                      />
                    );
                  })}
                </div>

                <button
                  onClick={handleNext}
                  className="btn btn-outline-dark rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                  style={{ width: 45, height: 45, borderColor: "var(--royal-gold)", color: "var(--royal-maroon)" }}
                >
                  <FaChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default RecentAddedPage;
