import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { fetchByRoute } from "../../api/routeAdapter";
import Profilenavbar from "../Profile/ProfileComp/Profilenavbar";
import Footer from "./Footer";
import styles from "./Dashboard.module.css";
import femaleDefault from "../../assets/images/female_default.png";
import maleDefault from "../../assets/images/male_default.png";
import {
  Heart, Eye, UserCheck, Camera, Phone, MessageSquare,
  Star, TrendingUp, Users, Bell, ChevronRight, Zap,
  Shield, Crown, Search, HeartHandshake, Clock, CheckCircle2,
  XCircle, Sparkles, Gift, ArrowRight, BarChart3
} from "lucide-react";

/* ── helpers ── */
function calculateAge(dob) {
  if (!dob) return null;
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  if (
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
  ) age--;
  return age;
}

const PRO = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

/* ── Stat Card ── */
function StatCard({ icon, label, value, color, trend, onClick }) {
  return (
    <div className={styles.statCard} onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
      <div className={styles.statIcon} style={{ background: color }}>
        {icon}
      </div>
      <div className={styles.statInfo}>
        <span className={styles.statValue}>{value ?? "—"}</span>
        <span className={styles.statLabel}>{label}</span>
      </div>
      {trend !== undefined && (
        <div className={styles.statTrend}>
          <TrendingUp size={12} />
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
}

/* ── Profile Mini Card ── */
function ProfileMiniCard({ profile, onView, onInterest, isAccepted }) {
  const defaultPhoto = profile?.gender === "Female" ? femaleDefault : maleDefault;
  const photo = profile?.filesId?.photos?.[0]?.url || defaultPhoto;
  const age = calculateAge(profile?.dateOfBirth);
  const city = profile?.address?.city || profile?.address?.state || "";
  const name = [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") || "Unknown";

  return (
    <div className={styles.miniCard}>
      <div className={styles.miniCardImg}>
        <img src={photo} alt={isAccepted ? name : "Profile"} onError={e => { e.target.src = defaultPhoto; }} />
        <div className={styles.miniCardBadge}><Sparkles size={10} /></div>
      </div>
      <div className={styles.miniCardInfo}>
        <p
          className={styles.miniCardName}
          style={!isAccepted ? { filter: "blur(6px)", userSelect: "none", pointerEvents: "none" } : {}}
          title={!isAccepted ? "Accept request to view name" : name}
        >
          {name}
        </p>
        <p className={styles.miniCardMeta}>
          {age ? `${age} yrs` : ""}
          {age && city ? " · " : ""}
          {city}
        </p>
      </div>
      <div className={styles.miniCardActions}>
        <button className={styles.miniBtn} onClick={() => onView(profile._id)} title="View Profile">
          <Eye size={14} />
        </button>
        <button className={`${styles.miniBtn} ${styles.miniBtnHeart}`} onClick={() => onInterest && onInterest(profile._id)} title="Show Interest">
          <Heart size={14} />
        </button>
      </div>
    </div>
  );
}

/* ── Activity Item ── */
// `name` / `before` / `after` / `isAccepted` support blurring just the person's name.
// Falls back to plain `text` for items without a specific person (e.g. pending count).
function ActivityItem({ icon, text, before, name, after, time, color, isAccepted }) {
  return (
    <div className={styles.activityItem}>
      <div className={styles.activityDot} style={{ background: color }}>{icon}</div>
      <div className={styles.activityContent}>
        <p>
          {name !== undefined ? (
            <>
              {before}
              <span
                style={
                  !isAccepted
                    ? { filter: "blur(5px)", userSelect: "none", display: "inline-block", pointerEvents: "none" }
                    : {}
                }
              >
                {name}
              </span>
              {after}
            </>
          ) : text}
        </p>
        <span>{time}</span>
      </div>
    </div>
  );
}

/* ── Quick Action Card ── */
function QuickAction({ icon, label, desc, onClick, accent }) {
  return (
    <button className={styles.quickAction} onClick={onClick} style={{ "--accent": accent }}>
      <div className={styles.quickIcon}>{icon}</div>
      <div className={styles.quickText}>
        <strong>{label}</strong>
        <span>{desc}</span>
      </div>
      <ArrowRight size={16} className={styles.quickArrow} />
    </button>
  );
}

/* ════════════════════════════════
   Main Dashboard Component
════════════════════════════════ */
const Dashboard = () => {
  const navigate = useNavigate();
  const { fetchUserData, userData: authUser, fetchprofile, profile } = useAuth();

  const [userData, setUserData] = useState(null);
  const [requests, setRequests]   = useState(null);
  const [contactReqs, setContactReqs] = useState({ sent: [], received: [] });
  const [viewedList, setViewedList] = useState([]);
  const [visitedList, setVisitedList] = useState([]);
  const [shortlisted, setShortlisted] = useState([]);
  const [photoReqs, setPhotoReqs]   = useState({ sent: [], received: [] });
  const [mediaFiles, setMediaFiles] = useState(null);
  const [loading, setLoading]       = useState(true);

  const goProfile = (section) => navigate("/profile", { state: { section } });

  useEffect(() => {
    fetchprofile();
    loadAll();
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [user, reqs, viewed, visited, sl, photoR, mediaRes, contactR] = await Promise.allSettled([
        fetchByRoute("user"),
        fetchByRoute("profile/myrequests"),
        fetchByRoute("profile/viewed"),
        fetchByRoute("profile/visited"),
        fetchByRoute("profile/show-shortlisted"),
        fetchByRoute("profile/photorequests"),
        fetchByRoute("files"),
        fetchByRoute("profile/contactrequests"),
      ]);
      if (user.status === "fulfilled")     setUserData(user.value);
      if (reqs.status === "fulfilled" && reqs.value) {
        setRequests(reqs.value);
      }
      if (viewed.status === "fulfilled")   setViewedList(Array.isArray(viewed.value) ? viewed.value : (viewed.value?.visitedAt || viewed.value?.viewedProfiles || viewed.value?.viewed || []));
      if (visited.status === "fulfilled")  setVisitedList(Array.isArray(visited.value) ? visited.value : (visited.value?.viewedBy || visited.value?.visitedProfiles || visited.value?.visitors || visited.value?.visited || []));
      if (sl.status === "fulfilled")       setShortlisted(Array.isArray(sl.value) ? sl.value : (sl.value?.shortlisted || sl.value?.profiles || []));
      if (photoR.status === "fulfilled" && photoR.value) {
        setPhotoReqs({
          sent:     photoR.value?.photoReqSent     || [],
          received: photoR.value?.photoReqReceived || [],
        });
      }
      if (contactR.status === "fulfilled" && contactR.value) {
        setContactReqs({
          sent:     contactR.value?.contactReqSent     || [],
          received: contactR.value?.contactReqReceived || [],
        });
      }
      if (mediaRes.status === "fulfilled" && mediaRes.value) {
        setMediaFiles(mediaRes.value);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  /* derived */
  const fullName   = [userData?.firstName, userData?.middleName, userData?.lastName].filter(Boolean).join(" ");
  const age        = calculateAge(userData?.dateOfBirth);
  const avatarUrl  =
    authUser?.avatar ||
    (profile && !profile.includes("user-icon-flat-isolated") ? profile : null) ||
    mediaFiles?.photos?.find((img) => img.isAvatar)?.url ||
    mediaFiles?.photos?.[0]?.url ||
    userData?.avatar;
  const initials   = `${(userData?.firstName || "").charAt(0)}${(userData?.lastName || "").charAt(0)}`.toUpperCase();

  const interestSent       = requests?.reqSent             || [];
  const interestReceived   = requests?.reqReceived         || [];
  const contactReqReceived = contactReqs?.received         || [];
  const contactReqSent     = contactReqs?.sent             || [];
  const contactPending     = contactReqReceived.filter(r => r.status === "pending").length;
  const photoReqPending    = photoReqs.received.filter(r => r.status === "pending").length;

  /* ── Build set of profile IDs with an accepted request ── */
  const getProfileId = (r) => (r?.userId || r?.profile || r)?._id;
  const acceptedSet = new Set([
    ...contactReqSent.filter(r => r.status === "accepted").map(getProfileId).filter(Boolean),
    ...contactReqReceived.filter(r => r.status === "accepted").map(getProfileId).filter(Boolean),
    ...interestSent.filter(r => r.status === "accepted").map(getProfileId).filter(Boolean),
    ...interestReceived.filter(r => r.status === "accepted").map(getProfileId).filter(Boolean),
  ]);

  /* recent activity (combine lists into timeline) */
  const recentVisitors = visitedList.slice(0, 3);
  const recentViewed   = viewedList.slice(0,  3);

  /* profile completion score */
  const hasPhoto = !!(
    avatarUrl ||
    userData?.avatar ||
    (mediaFiles?.photos && mediaFiles.photos.length > 0) ||
    (userData?.photos && userData.photos.length > 0) ||
    (userData?.filesId?.photos && userData.filesId.photos.length > 0) ||
    (userData?.filesId?.totalPhotos && userData.filesId.totalPhotos > 0)
  );

  const hasCity = !!(
    userData?.city ||
    userData?.address?.city ||
    userData?.location?.city ||
    userData?.state
  );

  const completionItems = [
    { done: !!(userData?.firstName),                             label: "Name" },
    { done: !!(userData?.dateOfBirth),                            label: "Date of Birth" },
    { done: !!(userData?.mobile),                                 label: "Mobile" },
    { done: !!(userData?.email),                                  label: "Email" },
    { done: hasPhoto,                                             label: "Profile Photo" },
    { done: hasCity,                                              label: "City" },
  ];
  const completionPct = Math.round((completionItems.filter(i => i.done).length / completionItems.length) * 100);

  return (
    <div className={styles.page}>
      <Profilenavbar />

      <main className={styles.main}>

        {/* ── Hero Welcome Strip ── */}
        <section className={styles.hero}>
          <div className={styles.heroLeft}>
            <div className={styles.heroAvatar}>
              {avatarUrl
                ? <img src={avatarUrl} alt="avatar" />
                : <span>{initials || "U"}</span>}
              <div className={styles.heroAvatarRing} />
            </div>
            <div className={styles.heroText}>
              <p className={styles.heroGreet}>
                <Sparkles size={16} /> Khamaghani,
              </p>
              <h1 className={styles.heroName}>{fullName || "Welcome Back"}</h1>
              <div className={styles.heroBadges}>
                {userData?.martrId && (
                  <span className={styles.badge}><Crown size={11} /> ID: {userData.martrId}</span>
                )}
                {age && <span className={styles.badge}>{age} yrs</span>}
                <span className={`${styles.badge} ${styles.badgeGreen}`}>
                  <Shield size={11} /> Verified
                </span>
              </div>
            </div>
          </div>

          <div className={styles.heroRight}>
            {/* Profile completion ring */}
            <div className={styles.completionRing}>
              <svg viewBox="0 0 80 80" className={styles.ringsvg}>
                <circle cx="40" cy="40" r="34" className={styles.ringTrack} />
                <circle
                  cx="40" cy="40" r="34"
                  className={styles.ringFill}
                  strokeDasharray={`${(completionPct / 100) * 213.6} 213.6`}
                  strokeDashoffset="0"
                />
              </svg>
              <div className={styles.ringCenter}>
                <span className={styles.ringPct}>{completionPct}%</span>
                <span className={styles.ringLabel}>Complete</span>
              </div>
            </div>
            <button className={styles.completeBtn} onClick={() => goProfile("myDetails")}>
              Complete Profile <ChevronRight size={14} />
            </button>
          </div>
        </section>

        {/* ── Stat Cards ── */}
        {loading ? (
          <div className={styles.loadingGrid}>
            {[...Array(6)].map((_, i) => <div key={i} className={styles.skeleton} />)}
          </div>
        ) : (
          <section className={styles.statsGrid}>
            <StatCard
              icon={<Heart size={20} />}
              label="Shortlisted"
              value={shortlisted.length}
              color="linear-gradient(135deg,#f43f5e,#e11d48)"
              onClick={() => goProfile("shortlisted")}
            />
            <StatCard
              icon={<Eye size={20} />}
              label="Viewed Profiles"
              value={viewedList.length}
              color="linear-gradient(135deg,#8b5cf6,#6d28d9)"
              onClick={() => goProfile("viewed")}
            />
            <StatCard
              icon={<UserCheck size={20} />}
              label="Profile Visitors"
              value={visitedList.length}
              color="linear-gradient(135deg,#0ea5e9,#0284c7)"
              onClick={() => goProfile("visited")}
            />
            <StatCard
              icon={<Phone size={20} />}
              label="Contact Requests"
              value={contactReqReceived.length}
              color="linear-gradient(135deg,#f59e0b,#d97706)"
              trend={contactPending > 0 ? `${contactPending} pending` : undefined}
              onClick={() => goProfile("contactRequest")}
            />
            <StatCard
              icon={<Camera size={20} />}
              label="Photo Requests"
              value={photoReqs.received.length}
              color="linear-gradient(135deg,#10b981,#059669)"
              trend={photoReqPending > 0 ? `${photoReqPending} pending` : undefined}
              onClick={() => goProfile("request")}
            />
            <StatCard
              icon={<HeartHandshake size={20} />}
              label="Request Manager"
              value={interestReceived.length}
              color="linear-gradient(135deg,#ec4899,#db2777)"
              onClick={() => goProfile("interest")}
            />
          </section>
        )}

        {/* ── Main Body Grid ── */}
        <div className={styles.bodyGrid}>

          {/* LEFT COL */}
          <div className={styles.leftCol}>

            {/* Recent Visitors */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>
                  <UserCheck size={18} />
                  <span>Recent Visitors</span>
                </div>
                <button className={styles.seeAll} onClick={() => goProfile("visited")}>
                  See all <ChevronRight size={13} />
                </button>
              </div>
              <div className={styles.cardBody}>
                {recentVisitors.length === 0 ? (
                  <div className={styles.empty}>
                    <Users size={32} />
                    <p>No visitors yet</p>
                  </div>
                ) : (
                  recentVisitors.map((v, i) => {
                    const p = v?.userId || v?.profile || v;
                    return (
                      <ProfileMiniCard
                        key={p?._id || i}
                        profile={p}
                        onView={(id) => navigate(`/search/view/${id}`)}
                        isAccepted={acceptedSet.has(p?._id)}
                      />
                    );
                  })
                )}
              </div>
            </div>

            {/* Pending Contact Requests */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>
                  <Bell size={18} />
                  <span>Pending Requests</span>
                  {contactPending > 0 && (
                    <span className={styles.chip}>{contactPending}</span>
                  )}
                </div>
                <button className={styles.seeAll} onClick={() => goProfile("interest")}>
                  Manage <ChevronRight size={13} />
                </button>
              </div>
              <div className={styles.cardBody}>
                {contactPending === 0 ? (
                  <div className={styles.empty}>
                    <CheckCircle2 size={32} />
                    <p>All requests handled</p>
                  </div>
                ) : (
                  contactReqReceived
                    .filter(r => r.status === "pending")
                    .slice(0, 4)
                    .map((r, i) => {
                      const p = r?.userId || r?.profile || r;
                      return (
                        <ProfileMiniCard
                          key={p?._id || i}
                          profile={p}
                          onView={(id) => navigate(`/search/view/${id}`)}
                          isAccepted={acceptedSet.has(p?._id)}
                        />
                      );
                    })
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COL */}
          <div className={styles.rightCol}>

            {/* Quick Actions */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>
                  <Zap size={18} />
                  <span>Quick Actions</span>
                </div>
              </div>
              <div className={styles.cardBody} style={{ gap: 8, display: "flex", flexDirection: "column" }}>
                <QuickAction
                  icon={<Search size={18} />}
                  label="Find Matches"
                  desc="Browse profiles near you"
                  accent="#59123B"
                  onClick={() => navigate("/search")}
                />
                <QuickAction
                  icon={<Heart size={18} />}
                  label="My Shortlist"
                  desc="View saved profiles"
                  accent="#f43f5e"
                  onClick={() => goProfile("shortlisted")}
                />
                <QuickAction
                  icon={<Phone size={18} />}
                  label="Contact Requests"
                  desc={`${contactPending} pending action${contactPending !== 1 ? "s" : ""}`}
                  accent="#f59e0b"
                  onClick={() => goProfile("interest")}
                />
                <QuickAction
                  icon={<Camera size={18} />}
                  label="Photo Requests"
                  desc={`${photoReqPending} pending approval${photoReqPending !== 1 ? "s" : ""}`}
                  accent="#10b981"
                  onClick={() => goProfile("request")}
                />
                <QuickAction
                  icon={<MessageSquare size={18} />}
                  label="Messages"
                  desc="Chat with matches"
                  accent="#8b5cf6"
                  onClick={() => navigate("/message")}
                />
              </div>
            </div>

            {/* Profile Completion Checklist */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>
                  <BarChart3 size={18} />
                  <span>Profile Strength</span>
                </div>
                <span className={styles.pctBadge}>{completionPct}%</span>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${completionPct}%` }}
                  />
                </div>
                <div className={styles.checkList}>
                  {completionItems.map((item, i) => (
                    <div key={i} className={`${styles.checkItem} ${item.done ? styles.checkDone : ""}`}>
                      {item.done
                        ? <CheckCircle2 size={15} className={styles.checkIconDone} />
                        : <XCircle size={15} className={styles.checkIconPending} />}
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
                {completionPct < 100 && (
                  <button className={styles.editProfileBtn} onClick={() => goProfile("myDetails")}>
                    <Gift size={14} /> Complete to get more matches
                  </button>
                )}
              </div>
            </div>

            {/* Activity Timeline */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>
                  <Clock size={18} />
                  <span>Recent Activity</span>
                </div>
              </div>
              <div className={styles.cardBody}>
                {recentViewed.length === 0 && recentVisitors.length === 0 ? (
                  <div className={styles.empty}>
                    <Clock size={32} />
                    <p>No activity yet</p>
                  </div>
                ) : (
                  <div className={styles.timeline}>
                    {recentViewed.slice(0, 2).map((v, i) => {
                      const p = v?.userId || v?.profile || v;
                      const name = [p?.firstName, p?.lastName].filter(Boolean).join(" ") || "Someone";
                      const accepted = acceptedSet.has(p?._id);
                      return (
                        <ActivityItem
                          key={"v" + i}
                          icon={<Eye size={10} />}
                          before="You viewed "
                          name={name}
                          after="'s profile"
                          isAccepted={accepted}
                          time="Recently"
                          color="linear-gradient(135deg,#8b5cf6,#6d28d9)"
                        />
                      );
                    })}
                    {recentVisitors.slice(0, 2).map((v, i) => {
                      const p = v?.userId || v?.profile || v;
                      const name = [p?.firstName, p?.lastName].filter(Boolean).join(" ") || "Someone";
                      const accepted = acceptedSet.has(p?._id);
                      return (
                        <ActivityItem
                          key={"vis" + i}
                          icon={<UserCheck size={10} />}
                          before=""
                          name={name}
                          after=" visited your profile"
                          isAccepted={accepted}
                          time="Recently"
                          color="linear-gradient(135deg,#0ea5e9,#0284c7)"
                        />
                      );
                    })}
                    {contactPending > 0 && (
                      <ActivityItem
                        icon={<Phone size={10} />}
                        text={`${contactPending} new contact request${contactPending > 1 ? "s" : ""} waiting`}
                        time="Now"
                        color="linear-gradient(135deg,#f59e0b,#d97706)"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Recently Shortlisted ── */}
        {shortlisted.length > 0 && (
          <section className={styles.card} style={{ marginBottom: 0 }}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>
                <Star size={18} />
                <span>Shortlisted Profiles</span>
              </div>
              <button className={styles.seeAll} onClick={() => goProfile("shortlisted")}>
                See all <ChevronRight size={13} />
              </button>
            </div>
            <div className={styles.shortlistGrid}>
              {shortlisted.slice(0, 6).map((item, i) => {
                const p = item?.profile || item?.userId || item;
                return (
                  <ProfileMiniCard
                    key={p?._id || i}
                    profile={p}
                    onView={(id) => navigate(`/search/view/${id}`)}
                    isAccepted={acceptedSet.has(p?._id)}
                  />
                );
              })}
            </div>
          </section>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
