import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Layout/AuthContext";
import { calculateAge } from "../ProfileComp/ProfileInfoHeader";
import femaleDefault from "../../../assets/images/female_default.png";
import maleDefault from "../../../assets/images/male_default.png";
import {
  FaPhone, FaEnvelope, FaCheck, FaTimes, FaUserCircle,
  FaMapMarkerAlt, FaHeart, FaUndoAlt, FaClock, FaCheckCircle,
  FaTimesCircle, FaChevronLeft, FaChevronRight, FaEye, FaSearch
} from "react-icons/fa";
import { MdContactPhone, MdBlock } from "react-icons/md";
import styles from "./ContactRequest.module.css";

const TABS = [
  { key: "received", label: "Received" },
  { key: "sent",     label: "Sent"     },
];

const STATUS_BADGE = {
  pending:  { label: "Pending",  icon: <FaClock />,       color: "#c97d10", bg: "rgba(201,125,16,0.1)",  border: "rgba(201,125,16,0.35)" },
  accepted: { label: "Accepted", icon: <FaCheckCircle />, color: "#1a7a45", bg: "rgba(26,122,69,0.1)",   border: "rgba(26,122,69,0.35)"  },
  rejected: { label: "Rejected", icon: <FaTimesCircle />, color: "#991c1c", bg: "rgba(153,28,28,0.1)",   border: "rgba(153,28,28,0.35)"  },
};

const PER_PAGE = 8;

export default function ContactRequest() {
  const { fetchUserData, updateData, userData: myProfile } = useAuth();
  const navigate = useNavigate();

  const [activeTab,   setActiveTab]   = useState("received");
  const [data,        setData]        = useState({ received: [], sent: [] });
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [page,        setPage]        = useState(1);
  const [statusFilt,  setStatusFilt]  = useState("all");
  const [actionLoad,  setActionLoad]  = useState(null);
  const [toast,       setToast]       = useState(null);
  const [search,      setSearch]      = useState("");

  /* ── fetch ── */
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchUserData("profile/contactrequests");
      setData({
        received: res?.contactReqReceived || [],
        sent:     res?.contactReqSent     || [],
      });
    } catch {
      setError("Could not load contact requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  /* ── toast helper ── */
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── actions ── */
  const handleAction = async (action, profileId) => {
    setActionLoad(profileId + action);
    try {
      const route = action.startsWith("contact") ? `profile/${action}` : `profile/contact/${action}`;
      await updateData(route, profileId, true);
      showToast(
        action.endsWith("accept")     ? "Request accepted! Contact details are now visible." :
        action.endsWith("reject")     ? "Request declined."                                  :
        action.endsWith("withdrawal") ? "Request withdrawn."                                 :
        "Done."
      );
      fetchData();
    } catch {
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setActionLoad(null);
    }
  };

  const handleBlock = async (profileId) => {
    try {
      // Instantly remove from local lists
      setData(prev => ({
        received: prev.received.filter(r => r.userId?._id !== profileId),
        sent: prev.sent.filter(r => r.userId?._id !== profileId)
      }));
      await updateData("profile/block-toggle", profileId, true);
      fetchData();
    } catch {
      showToast("Something went wrong. Please try again.", "error");
    }
  };

  /* ── derived list ── */
  const rawList = (activeTab === "received" ? data.received : data.sent)
    .filter(r => statusFilt === "all" || r.status === statusFilt)
    .filter(r => {
      if (!search.trim()) return true;
      const u = r.userId;
      const fullName = `${u?.firstName || ""} ${u?.lastName || ""}`.toLowerCase();
      return fullName.includes(search.toLowerCase()) || String(u?.martrId || "").includes(search);
    });

  const totalPages = Math.ceil(rawList.length / PER_PAGE);
  const paged      = rawList.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const switchTab = (key) => { setActiveTab(key); setPage(1); setStatusFilt("all"); setSearch(""); };

  /* ══════════════════════════════════════════════ */
  return (
    <div className={styles.wrap}>

      {/* ── Toast ── */}
      {toast && (
        <div className={`${styles.toast} ${styles[toast.type]}`}>
          {toast.type === "success" ? <FaCheckCircle /> : <FaTimesCircle />}
          {toast.msg}
        </div>
      )}

      {/* ── Header ── */}
      <div className={styles.header}>
        <div className={styles.headerIcon}><MdContactPhone /></div>
        <div>
          <h2 className={styles.headerTitle}>Contact Requests</h2>
          <p className={styles.headerSub}>
            Manage who can view your phone number &amp; email address
          </p>
        </div>
      </div>

      {/* ── Tabs + Filter + Search ── */}
      <div className={styles.toolbar}>
        <div className={styles.tabs}>
          {TABS.map(t => (
            <button
              key={t.key}
              className={`${styles.tab} ${activeTab === t.key ? styles.tabActive : ""}`}
              onClick={() => switchTab(t.key)}
            >
              {t.label}
              <span className={styles.tabCount}>
                {t.key === "received" ? data.received.length : data.sent.length}
              </span>
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          {/* Search */}
          <div style={{ position: "relative" }}>
            <FaSearch style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#b09060", fontSize: "0.75rem" }} />
            <input
              type="text"
              placeholder="Search by name or ID…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{
                border: "1.5px solid rgba(200,151,58,0.3)", borderRadius: "30px",
                padding: "8px 16px 8px 34px", fontSize: "0.82rem", fontWeight: 500,
                color: "#59123b", background: "#fff", outline: "none",
                fontFamily: "var(--font-body)", width: "200px",
              }}
            />
          </div>

          {/* Status filter */}
          <select
            className={styles.filter}
            value={statusFilt}
            onChange={e => { setStatusFilt(e.target.value); setPage(1); }}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className={styles.center}>
          <div className={styles.spinner} />
          <p>Loading requests…</p>
        </div>
      ) : error ? (
        <div className={styles.center}>
          <FaTimesCircle size={36} color="#991c1c" />
          <p className={styles.errMsg}>{error}</p>
          <button className={styles.retryBtn} onClick={fetchData}>Retry</button>
        </div>
      ) : paged.length === 0 ? (
        <div className={styles.empty}>
          <MdContactPhone size={52} style={{ color: "var(--gold, #c8973a)", opacity: 0.4 }} />
          <p>No {activeTab === "received" ? "incoming" : "outgoing"} contact requests
            {statusFilt !== "all" ? ` with status "${statusFilt}"` : ""}.
          </p>
        </div>
      ) : (
        /* ── TABLE ── */
        <div style={{ overflowX: "auto", borderRadius: "14px", border: "1.5px solid rgba(200,151,58,0.18)", boxShadow: "0 4px 20px rgba(89,18,59,0.07)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", fontFamily: "var(--font-body)" }}>
            <thead>
              <tr style={{ background: "linear-gradient(135deg, #59123b 0%, #3d0a27 100%)" }}>
                {["#", "Profile", "Name / ID", "Age & Location", "Status", "Contact", "Actions"].map((h, i) => (
                  <th key={i} style={{
                    padding: "13px 16px", textAlign: "left",
                    fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em",
                    textTransform: "uppercase", color: "#f0c96b",
                    borderBottom: "2px solid rgba(200,151,58,0.3)",
                    whiteSpace: "nowrap",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((req, idx) => {
                const user   = req.userId;
                const status = req.status || "pending";
                const badge  = STATUS_BADGE[status] || STATUS_BADGE.pending;
                const defaultAvatar = user?.gender === "Female" ? femaleDefault : maleDefault;
                const photo  = user?.filesId?.photos?.[0]?.url || defaultAvatar;
                const age    = user?.dateOfBirth ? calculateAge(user.dateOfBirth) : null;
                const isEven = idx % 2 === 0;

                return (
                  <tr
                    key={req._id}
                    style={{
                      background: isEven ? "#fff" : "rgba(89,18,59,0.02)",
                      transition: "background 0.18s",
                      borderBottom: "1px solid rgba(200,151,58,0.1)",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(200,151,58,0.06)"}
                    onMouseLeave={e => e.currentTarget.style.background = isEven ? "#fff" : "rgba(89,18,59,0.02)"}
                  >
                    {/* # */}
                    <td style={{ padding: "12px 16px", fontSize: "0.78rem", color: "#b09060", fontWeight: 600 }}>
                      {(page - 1) * PER_PAGE + idx + 1}
                    </td>

                    {/* Avatar */}
                    <td style={{ padding: "10px 16px" }}>
                      <div style={{
                        width: "48px", height: "48px", borderRadius: "50%",
                        border: "2.5px solid #c8973a", overflow: "hidden",
                        boxShadow: "0 2px 8px rgba(200,151,58,0.2)", flexShrink: 0,
                      }}>
                        <img
                          src={photo}
                          alt={user?.firstName || "Profile"}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={e => { e.target.src = defaultAvatar; }}
                        />
                      </div>
                    </td>

                    {/* Name / ID */}
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#3d0a27", lineHeight: 1.3 }}>
                        {user?.firstName || ""} {user?.lastName || ""}
                      </div>
                      {user?.martrId && (
                        <div style={{ fontSize: "0.72rem", color: "#b09060", marginTop: "2px" }}>
                          Matri ID: {user.martrId}
                        </div>
                      )}
                    </td>

                    {/* Age & Location */}
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                        {age && (
                          <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.8rem", color: "#59123b" }}>
                            <FaHeart size={9} color="#c8973a" /> {age} yrs
                          </span>
                        )}
                        {(user?.address?.city || user?.address?.state) && (
                          <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.8rem", color: "#7a6040" }}>
                            <FaMapMarkerAlt size={9} color="#c8973a" />
                            {[user.address?.city, user.address?.state].filter(Boolean).join(", ")}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status badge */}
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: "5px",
                        padding: "4px 12px", borderRadius: "20px",
                        fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        color: badge.color, background: badge.bg, border: `1.5px solid ${badge.border}`,
                      }}>
                        {badge.icon} {badge.label}
                      </span>
                    </td>

                    {/* Contact (only if accepted) */}
                    <td style={{ padding: "12px 16px" }}>
                      {status === "accepted" ? (() => {
                        // Sent tab: show MY contact details (I shared mine when accepted)
                        // Received tab: show the OTHER person's contact details
                        const contactPhone = activeTab === "sent"
                          ? (myProfile?.mobile || "—")
                          : (user?.mobile || null);
                        const contactEmail = activeTab === "sent"
                          ? (myProfile?.email || "—")
                          : (user?.email || null);
                        const contactLabel = activeTab === "sent" ? "My Contact" : null;
                        return (
                          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            {contactLabel && (
                              <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#1a7a45", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "2px" }}>
                                ✓ My Shared Details
                              </span>
                            )}
                            {contactPhone && contactPhone !== "—" && (
                              <a href={`tel:${contactPhone}`} style={{
                                display: "flex", alignItems: "center", gap: "6px",
                                fontSize: "0.78rem", color: "#59123b", fontWeight: 600,
                                textDecoration: "none",
                              }}>
                                <FaPhone size={10} color="#c8973a" /> {contactPhone}
                              </a>
                            )}
                            {contactEmail && contactEmail !== "—" && (
                              <a href={`mailto:${contactEmail}`} style={{
                                display: "flex", alignItems: "center", gap: "6px",
                                fontSize: "0.78rem", color: "#59123b", fontWeight: 600,
                                textDecoration: "none",
                              }}>
                                <FaEnvelope size={10} color="#c8973a" /> {contactEmail}
                              </a>
                            )}
                          </div>
                        );
                      })() : (
                        <span style={{ fontSize: "0.75rem", color: "#ccc" }}>—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "10px 16px" }}>
                      <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "nowrap" }}>
                        {/* View */}
                        <button
                          title="View Profile"
                          onClick={() => navigate(`/search/view/${user?._id}`)}
                          style={{
                            display: "flex", alignItems: "center", gap: "5px",
                            padding: "6px 12px", borderRadius: "20px",
                            border: "1.5px solid rgba(89,18,59,0.2)",
                            background: "rgba(89,18,59,0.05)", color: "#59123b",
                            fontSize: "0.75rem", fontWeight: 700, cursor: "pointer",
                            whiteSpace: "nowrap", transition: "all 0.2s",
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = "#59123b"; e.currentTarget.style.color = "#fff"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "rgba(89,18,59,0.05)"; e.currentTarget.style.color = "#59123b"; }}
                        >
                          <FaEye size={11} /> View
                        </button>

                        {/* Received + Pending → Accept / Reject */}
                        {activeTab === "received" && status === "pending" && (
                          <>
                            <button
                              disabled={actionLoad === user?._id + "accept"}
                              onClick={() => handleAction("accept", user?._id)}
                              style={{
                                display: "flex", alignItems: "center", gap: "5px",
                                padding: "6px 12px", borderRadius: "20px", border: "none",
                                background: "linear-gradient(135deg, #1a7a45, #23a45c)",
                                color: "#fff", fontSize: "0.75rem", fontWeight: 700,
                                cursor: "pointer", whiteSpace: "nowrap",
                                opacity: actionLoad === user?._id + "accept" ? 0.6 : 1,
                              }}
                            >
                              <FaCheck size={10} /> Accept
                            </button>
                            <button
                              disabled={actionLoad === user?._id + "reject"}
                              onClick={() => handleAction("reject", user?._id)}
                              style={{
                                display: "flex", alignItems: "center", gap: "5px",
                                padding: "6px 12px", borderRadius: "20px", border: "none",
                                background: "linear-gradient(135deg, #991c1c, #c52b2b)",
                                color: "#fff", fontSize: "0.75rem", fontWeight: 700,
                                cursor: "pointer", whiteSpace: "nowrap",
                                opacity: actionLoad === user?._id + "reject" ? 0.6 : 1,
                              }}
                            >
                              <FaTimes size={10} /> Reject
                            </button>
                          </>
                        )}

                        {/* Sent + Pending → Withdraw */}
                        {activeTab === "sent" && status === "pending" && (
                          <button
                            disabled={actionLoad === user?._id + "withdrawal"}
                            onClick={() => handleAction("withdrawal", user?._id)}
                            style={{
                              display: "flex", alignItems: "center", gap: "5px",
                              padding: "6px 12px", borderRadius: "20px",
                              border: "1.5px solid #c8973a",
                              background: "rgba(200,151,58,0.1)", color: "#c8973a",
                              fontSize: "0.75rem", fontWeight: 700,
                              cursor: "pointer", whiteSpace: "nowrap",
                              opacity: actionLoad === user?._id + "withdrawal" ? 0.6 : 1,
                            }}
                          >
                            <FaUndoAlt size={10} /> Withdraw
                          </button>
                        )}

                        {/* Sent + Rejected → Resend */}
                        {activeTab === "sent" && status === "rejected" && (
                          <button
                            onClick={() => handleAction("contactRequest", user?._id)}
                            style={{
                              display: "flex", alignItems: "center", gap: "5px",
                              padding: "6px 12px", borderRadius: "20px", border: "none",
                              background: "linear-gradient(135deg, #59123b, #3d0a27)",
                              color: "#f0c96b", fontSize: "0.75rem", fontWeight: 700,
                              cursor: "pointer", whiteSpace: "nowrap",
                            }}
                          >
                            <FaHeart size={10} /> Resend
                          </button>
                        )}

                        {/* Block Button */}
                        <button
                          title="Block User"
                          onClick={() => handleBlock(user?._id)}
                          style={{
                            display: "flex", alignItems: "center", gap: "5px",
                            padding: "6px 12px", borderRadius: "20px",
                            border: "1.5px solid rgba(220,53,69,0.3)",
                            background: "#fff5f5", color: "#dc3545",
                            fontSize: "0.75rem", fontWeight: 700, cursor: "pointer",
                            whiteSpace: "nowrap", transition: "all 0.2s",
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = "#dc3545"; e.currentTarget.style.color = "#fff"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "#fff5f5"; e.currentTarget.style.color = "#dc3545"; }}
                        >
                          <MdBlock size={11} /> Block
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            <FaChevronLeft />
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`${styles.pageBtn} ${page === i + 1 ? styles.pageBtnActive : ""}`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className={styles.pageBtn}
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            <FaChevronRight />
          </button>
        </div>
      )}

      {/* Results count */}
      {!loading && rawList.length > 0 && (
        <div style={{ textAlign: "center", marginTop: "14px", fontSize: "0.78rem", color: "#b09060" }}>
          Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, rawList.length)} of {rawList.length} requests
        </div>
      )}
    </div>
  );
}
