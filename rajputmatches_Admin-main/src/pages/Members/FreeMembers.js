import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaUser, FaEye, FaBan, FaTrash, FaCheck, FaSearch,
  FaFilter, FaRedo, FaMale, FaFemale, FaTimes, FaChevronLeft,
  FaChevronRight, FaSort, FaSortUp, FaSortDown, FaDownload,
  FaUserPlus, FaUsers, FaClock, FaCheckCircle, FaShieldAlt
} from "react-icons/fa";

const BASE_URL = (process.env.REACT_APP_BASE_URL || "http://localhost:5000/admin").replace(/\/$/, "");

/* ─────────────────────────── helpers ─────────────────────────── */
const getToken = () => localStorage.getItem("adminAuthToken");

const getAvatar = (member) => {
  if (!member?.avatar) return null;
  const av = member.avatar;
  const domain = BASE_URL.replace(/\/admin$/, "");
  if (typeof av === "string") return av.startsWith("http") ? av : `${domain}/${av}`;
  if (Array.isArray(av) && av.length > 0)
    return av[0].startsWith("http") ? av[0] : `${domain}/${av[0]}`;
  return null;
};

const initials = (m) =>
  `${m?.firstName?.[0] || ""}${m?.lastName?.[0] || ""}`.toUpperCase() || "?";

/* ─────────────────────────── stat card ─────────────────────────── */
const StatPill = ({ label, value, color, icon }) => (
  <div className="fm-stat-pill" style={{ borderLeft: `4px solid ${color}` }}>
    <div className="fm-stat-icon" style={{ background: color + "18", color }}>
      {icon}
    </div>
    <div>
      <div className="fm-stat-value">{value}</div>
      <div className="fm-stat-label">{label}</div>
    </div>
  </div>
);

/* ─────────────────────────── avatar ─────────────────────────── */
const Avatar = ({ member }) => {
  const src = getAvatar(member);
  const [imgErr, setImgErr] = useState(false);
  if (src && !imgErr) {
    return (
      <img
        src={src}
        alt="avatar"
        onError={() => setImgErr(true)}
        style={{
          width: 42, height: 42, borderRadius: "50%",
          objectFit: "cover", border: "2px solid #D4AF37",
          flexShrink: 0
        }}
      />
    );
  }
  const bg = member?.gender === "Female" ? "#D4AF37" : "#59123B";
  return (
    <div style={{
      width: 42, height: 42, borderRadius: "50%", background: bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 700, fontSize: 15, flexShrink: 0,
      border: "2px solid #D4AF37"
    }}>
      {initials(member)}
    </div>
  );
};

/* ─────────────────────────── main component ─────────────────────────── */
const FreeMembers = () => {
  /* data */
  const [members, setMembers]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [actionId, setActionId]   = useState(null); // which row is doing an action

  /* filters */
  const [search, setSearch]         = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [filterApproval, setFilterApproval] = useState("");
  const [filterStatus, setFilterStatus]   = useState("");
  const [sortField, setSortField]   = useState("createdAt");
  const [sortDir, setSortDir]       = useState("desc");
  const [showFilters, setShowFilters] = useState(false);

  /* pagination */
  const [page, setPage]   = useState(1);
  const [limit]           = useState(10);

  /* ── fetch ── */
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await axios.get(`${BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const raw = response?.data?.user || [];
      // Only free (non-subscribed) members
      const free = raw.filter((m) => !m.isSubscribed);
      setMembers(free);
    } catch (err) {
      console.error("Error fetching members:", err);
      toast.error("Members load nahi hue. Backend check karein.");
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* ── actions ── */
  const doAction = async (memberId, route, label) => {
    if (actionId) return;
    setActionId(memberId);
    try {
      const token = getToken();
      const res = await axios.put(
        `${BASE_URL}/${route}`,
        { data: memberId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data?.message || `${label} successful`);
      await fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || `${label} failed`);
    } finally {
      setActionId(null);
    }
  };

  const handleApprove = (id) => doAction(id, "Approve-member", "Approve");
  const handleVerify  = (id) => doAction(id, "Verify-member", "Verification Status");
  const handleBlock   = (id) => doAction(id, "block-member", "Block");
  const handleDelete  = async (id) => {
    if (!window.confirm("Kya aap is member ko delete karna chahte hain?")) return;
    doAction(id, "delete-member", "Delete");
  };

  /* ── sort helper ── */
  const toggleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
    setPage(1);
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <FaSort style={{ opacity: 0.3, marginLeft: 4 }} />;
    return sortDir === "asc"
      ? <FaSortUp style={{ color: "#D4AF37", marginLeft: 4 }} />
      : <FaSortDown style={{ color: "#D4AF37", marginLeft: 4 }} />;
  };

  /* ── filter + sort ── */
  const processed = members
    .filter((m) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        m?.firstName?.toLowerCase().includes(q) ||
        m?.lastName?.toLowerCase().includes(q) ||
        m?.email?.toLowerCase().includes(q) ||
        m?.mobile?.includes(q) ||
        m?.martrId?.toString().includes(q);

      const matchGender =
        !filterGender || m?.gender?.toLowerCase() === filterGender.toLowerCase();

      const matchApproval =
        !filterApproval ||
        (filterApproval === "approved" && m.isApproved) ||
        (filterApproval === "pending" && !m.isApproved);

      const matchStatus =
        !filterStatus ||
        (filterStatus === "active" && m.isEnable) ||
        (filterStatus === "inactive" && !m.isEnable);

      return matchSearch && matchGender && matchApproval && matchStatus;
    })
    .sort((a, b) => {
      let va, vb;
      if (sortField === "name") {
        va = `${a.firstName} ${a.lastName}`.toLowerCase();
        vb = `${b.firstName} ${b.lastName}`.toLowerCase();
      } else if (sortField === "martrId") {
        va = a.martrId || 0; vb = b.martrId || 0;
      } else if (sortField === "view") {
        va = a.view || 0; vb = b.view || 0;
      } else {
        va = a._id; vb = b._id;
      }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  /* ── pagination ── */
  const totalPages = Math.ceil(processed.length / limit) || 1;
  const paginated  = processed.slice((page - 1) * limit, page * limit);

  /* ── stats ── */
  const totalFree    = members.length;
  const approved     = members.filter((m) => m.isApproved).length;
  const pending      = members.filter((m) => !m.isApproved).length;
  const maleCount    = members.filter((m) => m?.gender?.toLowerCase() === "male").length;
  const femaleCount  = members.filter((m) => m?.gender?.toLowerCase() === "female").length;

  const resetFilters = () => {
    setSearch(""); setFilterGender(""); setFilterApproval("");
    setFilterStatus(""); setSortField("createdAt"); setSortDir("desc"); setPage(1);
  };

  const activeFilters = [filterGender, filterApproval, filterStatus, search].filter(Boolean).length;

  /* ═══════════════════════ render ═══════════════════════ */
  return (
    <>
      {/* ── inline styles ── */}
      <style>{`
        .fm-page { padding: 24px; }

        /* stat pills */
        .fm-stats-row { display:flex; flex-wrap:wrap; gap:14px; margin-bottom:24px; }
        .fm-stat-pill {
          display:flex; align-items:center; gap:12px;
          background:#fff; border-radius:12px; padding:14px 20px;
          box-shadow:0 2px 12px rgba(89,18,59,.07);
          flex:1; min-width:150px;
          transition: transform .2s, box-shadow .2s;
        }
        .fm-stat-pill:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(89,18,59,.12); }
        .fm-stat-icon { width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:16px; }
        .fm-stat-value { font-size:1.4rem; font-weight:700; color:#59123B; line-height:1; }
        .fm-stat-label { font-size:.75rem; color:#9A7888; margin-top:2px; }

        /* filter panel */
        .fm-filter-panel {
          background:#fff; border-radius:14px; padding:20px 24px;
          box-shadow:0 2px 12px rgba(89,18,59,.07);
          margin-bottom:20px;
          animation: slideDown .2s ease;
        }
        @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        .fm-filter-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(180px,1fr)); gap:14px; }
        .fm-filter-label { font-size:.75rem; font-weight:600; color:#59123B; margin-bottom:5px; text-transform:uppercase; letter-spacing:.5px; }
        .fm-input, .fm-select {
          width:100%; padding:9px 14px; border:1.5px solid #e5dce2; border-radius:9px;
          font-size:.875rem; color:#3d1a2b; background:#faf8f9;
          transition: border-color .2s, box-shadow .2s; outline:none;
        }
        .fm-input:focus, .fm-select:focus { border-color:#D4AF37; box-shadow:0 0 0 3px rgba(212,175,55,.15); background:#fff; }
        .fm-search-wrap { position:relative; }
        .fm-search-wrap .fm-input { padding-left:40px; }
        .fm-search-icon { position:absolute; left:13px; top:50%; transform:translateY(-50%); color:#9A7888; }

        /* table card */
        .fm-card { background:#fff; border-radius:16px; box-shadow:0 2px 16px rgba(89,18,59,.08); overflow:hidden; }
        .fm-card-header {
          padding:18px 24px; display:flex; align-items:center; justify-content:space-between;
          border-bottom:1px solid #f0e8ec; flex-wrap:wrap; gap:10px;
          background: linear-gradient(135deg, #59123B 0%, #8b1a5a 100%);
        }
        .fm-card-title { font-family:'Playfair Display',serif; color:#fff; font-size:1.15rem; display:flex; align-items:center; gap:8px; }
        .fm-badge-count { background:rgba(255,255,255,.2); color:#fff; padding:3px 10px; border-radius:20px; font-size:.78rem; font-weight:600; }

        /* table */
        .fm-table-wrap { overflow-x:auto; }
        .fm-table { width:100%; border-collapse:collapse; }
        .fm-table th {
          padding:12px 14px; font-size:.75rem; font-weight:700; text-transform:uppercase;
          letter-spacing:.5px; color:#59123B; background:#fdf4f8; border-bottom:2px solid #f0e8ec;
          white-space:nowrap; cursor:pointer; user-select:none;
        }
        .fm-table th:hover { background:#f7ecf2; }
        .fm-table td { padding:13px 14px; border-bottom:1px solid #f7f0f4; vertical-align:middle; color:#3d1a2b; font-size:.875rem; }
        .fm-table tr:hover td { background:#fdf9fb; }
        .fm-table tr:last-child td { border-bottom:none; }

        /* badges */
        .badge-approved  { background:#dcfce7; color:#15803d; padding:4px 10px; border-radius:20px; font-size:.72rem; font-weight:700; display:inline-flex; align-items:center; gap:4px; }
        .badge-pending   { background:#fef3c7; color:#92400e; padding:4px 10px; border-radius:20px; font-size:.72rem; font-weight:700; }
        .badge-active    { background:#dbeafe; color:#1d4ed8; padding:4px 10px; border-radius:20px; font-size:.72rem; font-weight:700; }
        .badge-inactive  { background:#fee2e2; color:#dc2626; padding:4px 10px; border-radius:20px; font-size:.72rem; font-weight:700; }
        .badge-id        { background:linear-gradient(135deg,#D4AF37,#EDB139); color:#fff; padding:4px 10px; border-radius:20px; font-size:.72rem; font-weight:700; }
        .badge-male      { background:#eff6ff; color:#2563eb; padding:3px 9px; border-radius:20px; font-size:.72rem; font-weight:600; display:inline-flex; align-items:center; gap:3px; }
        .badge-female    { background:#fdf2f8; color:#9d174d; padding:3px 9px; border-radius:20px; font-size:.72rem; font-weight:600; display:inline-flex; align-items:center; gap:3px; }
        /* ✅ Verified = bright green glow | ❌ Unverified = red */
        .badge-verified  {
          background: linear-gradient(135deg,#16a34a,#22c55e);
          color: #fff;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: .72rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          box-shadow: 0 2px 8px rgba(34,197,94,.35);
          letter-spacing: .3px;
        }
        .badge-unverified {
          background: linear-gradient(135deg,#dc2626,#ef4444);
          color: #fff;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: .72rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          box-shadow: 0 2px 8px rgba(239,68,68,.3);
          letter-spacing: .3px;
        }

        /* action buttons */
        .fm-btn { border:none; border-radius:8px; padding:6px 10px; font-size:.78rem; cursor:pointer; display:inline-flex; align-items:center; gap:4px; transition:all .15s; font-weight:600; }
        .fm-btn:disabled { opacity:.5; cursor:not-allowed; }
        .fm-btn-view     { background:#f0fdf4; color:#15803d; }
        .fm-btn-view:hover { background:#15803d; color:#fff; }
        .fm-btn-approve  { background:#fef9ec; color:#D4AF37; }
        .fm-btn-approve:hover { background:#D4AF37; color:#fff; }
        .fm-btn-block    { background:#fff7ed; color:#ea580c; }
        .fm-btn-block:hover { background:#ea580c; color:#fff; }
        .fm-btn-delete   { background:#fef2f2; color:#dc2626; }
        .fm-btn-delete:hover { background:#dc2626; color:#fff; }
        /* ✅ Verified button = green (click to verify) | 🔴 Unverify button = red (click to unverify) */
        .fm-btn-verify   { background:linear-gradient(135deg,#16a34a,#22c55e); color:#fff; border:none; box-shadow:0 2px 8px rgba(34,197,94,.3); }
        .fm-btn-verify:hover { background:linear-gradient(135deg,#15803d,#16a34a); box-shadow:0 4px 12px rgba(34,197,94,.4); transform:translateY(-1px); }
        .fm-btn-unverify { background:linear-gradient(135deg,#dc2626,#ef4444); color:#fff; border:none; box-shadow:0 2px 8px rgba(239,68,68,.25); }
        .fm-btn-unverify:hover { background:linear-gradient(135deg,#b91c1c,#dc2626); box-shadow:0 4px 12px rgba(239,68,68,.4); transform:translateY(-1px); }

        /* top controls */
        .fm-top-bar { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; margin-bottom:20px; }
        .fm-top-bar h2 { font-family:'Playfair Display',serif; color:#59123B; margin:0; font-size:1.6rem; }
        .fm-btn-primary { background:linear-gradient(135deg,#59123B,#8b1a5a); color:#fff; border:none; border-radius:10px; padding:10px 20px; font-weight:600; font-size:.875rem; cursor:pointer; display:flex; align-items:center; gap:6px; transition:all .2s; }
        .fm-btn-primary:hover { transform:translateY(-1px); box-shadow:0 4px 12px rgba(89,18,59,.35); }
        .fm-btn-outline { background:#fff; color:#59123B; border:2px solid #59123B; border-radius:10px; padding:8px 16px; font-weight:600; font-size:.875rem; cursor:pointer; display:flex; align-items:center; gap:6px; transition:all .2s; }
        .fm-btn-outline:hover { background:#59123B; color:#fff; }
        .fm-btn-filter { background:#fff; border:2px solid ${activeFilters > 0 ? '#D4AF37' : '#e5dce2'}; border-radius:10px; padding:8px 16px; font-weight:600; font-size:.875rem; cursor:pointer; display:flex; align-items:center; gap:6px; color:${activeFilters > 0 ? '#D4AF37' : '#59123B'}; transition:all .2s; position:relative; }
        .fm-btn-filter:hover { border-color:#D4AF37; color:#D4AF37; }
        .fm-filter-dot { position:absolute; top:-6px; right:-6px; width:18px; height:18px; background:#D4AF37; border-radius:50%; color:#fff; font-size:.62rem; font-weight:700; display:flex; align-items:center; justify-content:center; }

        /* pagination */
        .fm-pagination { display:flex; align-items:center; justify-content:space-between; padding:16px 24px; border-top:1px solid #f0e8ec; flex-wrap:wrap; gap:10px; }
        .fm-page-info { font-size:.82rem; color:#9A7888; }
        .fm-page-btns { display:flex; gap:6px; }
        .fm-page-btn { width:34px; height:34px; border-radius:8px; border:1.5px solid #e5dce2; background:#fff; color:#59123B; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:.82rem; font-weight:600; transition:all .15s; }
        .fm-page-btn:hover:not(:disabled) { border-color:#59123B; background:#59123B; color:#fff; }
        .fm-page-btn.active { background:linear-gradient(135deg,#59123B,#8b1a5a); color:#fff; border-color:#59123B; }
        .fm-page-btn:disabled { opacity:.4; cursor:not-allowed; }

        /* empty */
        .fm-empty { padding:60px 20px; text-align:center; color:#9A7888; }
        .fm-empty-icon { font-size:3rem; margin-bottom:12px; opacity:.35; }

        /* loading skeleton */
        .fm-skeleton { animation: shimmer 1.4s infinite; }
        @keyframes shimmer { 0%,100%{opacity:.7} 50%{opacity:.3} }
        .fm-skeleton-row td { padding:14px; }
        .fm-skel-bar { height:14px; border-radius:6px; background:#f0e8ec; }

        /* active filter chips */
        .fm-chips { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:14px; }
        .fm-chip { background:#fdf4f8; color:#59123B; border:1.5px solid #e5dce2; border-radius:20px; padding:4px 12px; font-size:.78rem; font-weight:600; display:inline-flex; align-items:center; gap:6px; }
        .fm-chip-remove { cursor:pointer; color:#9A7888; }
        .fm-chip-remove:hover { color:#dc2626; }
      `}</style>

      <div className="main-content">
        <div className="fm-page">
        {/* ── top bar ── */}
        <div className="fm-top-bar">
          <div>
            <h2><FaUsers style={{ marginRight: 10, color: "#D4AF37" }} />Free Members</h2>
            <p style={{ color: "#9A7888", margin: 0, fontSize: ".875rem" }}>
              Sabhi free members ko yahan manage karein
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="fm-btn-outline" onClick={fetchData} title="Refresh">
              <FaRedo /> Refresh
            </button>
            <Link to="/Members/Add-Members" style={{ textDecoration: "none" }}>
              <button className="fm-btn-primary">
                <FaUserPlus /> Add Member
              </button>
            </Link>
          </div>
        </div>

        {/* ── stat pills ── */}
        <div className="fm-stats-row">
          <StatPill label="Total Free" value={totalFree} color="#59123B" icon={<FaUsers />} />
          <StatPill label="Approved" value={approved} color="#15803d" icon={<FaCheckCircle />} />
          <StatPill label="Pending" value={pending} color="#d97706" icon={<FaClock />} />
          <StatPill label="Male" value={maleCount} color="#2563eb" icon={<FaMale />} />
          <StatPill label="Female" value={femaleCount} color="#9d174d" icon={<FaFemale />} />
        </div>

        {/* ── search + filter toggle bar ── */}
        <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
          {/* quick search */}
          <div className="fm-search-wrap" style={{ flex: 1, minWidth: 220 }}>
            <FaSearch className="fm-search-icon" />
            <input
              className="fm-input"
              placeholder="Naam, email, mobile ya ID se search karein…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          {/* filter toggle */}
          <button className="fm-btn-filter" onClick={() => setShowFilters((v) => !v)}>
            {showFilters ? <FaTimes /> : <FaFilter />}
            {showFilters ? "Hide Filters" : "Filters"}
            {activeFilters > 0 && <span className="fm-filter-dot">{activeFilters}</span>}
          </button>

          {activeFilters > 0 && (
            <button className="fm-btn-outline" style={{ padding: "8px 14px" }} onClick={resetFilters}>
              <FaTimes style={{ fontSize: 11 }} /> Reset
            </button>
          )}
        </div>

        {/* ── active chips ── */}
        {activeFilters > 0 && (
          <div className="fm-chips">
            {search && (
              <span className="fm-chip">
                Search: "{search}"
                <FaTimes className="fm-chip-remove" onClick={() => setSearch("")} />
              </span>
            )}
            {filterGender && (
              <span className="fm-chip">
                Gender: {filterGender}
                <FaTimes className="fm-chip-remove" onClick={() => setFilterGender("")} />
              </span>
            )}
            {filterApproval && (
              <span className="fm-chip">
                Approval: {filterApproval}
                <FaTimes className="fm-chip-remove" onClick={() => setFilterApproval("")} />
              </span>
            )}
            {filterStatus && (
              <span className="fm-chip">
                Status: {filterStatus}
                <FaTimes className="fm-chip-remove" onClick={() => setFilterStatus("")} />
              </span>
            )}
          </div>
        )}

        {/* ── filter panel ── */}
        {showFilters && (
          <div className="fm-filter-panel">
            <div className="fm-filter-grid">
              <div>
                <div className="fm-filter-label">Gender</div>
                <select className="fm-select" value={filterGender} onChange={(e) => { setFilterGender(e.target.value); setPage(1); }}>
                  <option value="">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <div className="fm-filter-label">Approval Status</div>
                <select className="fm-select" value={filterApproval} onChange={(e) => { setFilterApproval(e.target.value); setPage(1); }}>
                  <option value="">All</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div>
                <div className="fm-filter-label">Account Status</div>
                <select className="fm-select" value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}>
                  <option value="">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <div className="fm-filter-label">Sort By</div>
                <select className="fm-select" value={`${sortField}:${sortDir}`} onChange={(e) => { const [f, d] = e.target.value.split(":"); setSortField(f); setSortDir(d); setPage(1); }}>
                  <option value="createdAt:desc">Newest First</option>
                  <option value="createdAt:asc">Oldest First</option>
                  <option value="name:asc">Name A–Z</option>
                  <option value="name:desc">Name Z–A</option>
                  <option value="view:desc">Most Viewed</option>
                  <option value="martrId:asc">ID Ascending</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ── main table card ── */}
        <div className="fm-card">
          <div className="fm-card-header">
            <div className="fm-card-title">
              <FaUsers />
              Members List
              <span className="fm-badge-count">
                {processed.length} members
              </span>
            </div>
          </div>

          <div className="fm-table-wrap">
            <table className="fm-table">
              <thead>
                <tr>
                  <th style={{ width: 44 }}>#</th>
                  <th onClick={() => toggleSort("name")} style={{ minWidth: 200 }}>
                    Member <SortIcon field="name" />
                  </th>
                  <th onClick={() => toggleSort("martrId")}>
                    Matri ID <SortIcon field="martrId" />
                  </th>
                  <th style={{ minWidth: 190 }}>Email</th>
                  <th>Gender</th>
                  <th>Mobile</th>
                  <th>Approval</th>
                  <th>Status</th>
                  <th>Verified</th>
                  <th onClick={() => toggleSort("view")}>
                    Views <SortIcon field="view" />
                  </th>
                  <th style={{ minWidth: 200 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="fm-skeleton-row fm-skeleton">
                      <td><div className="fm-skel-bar" style={{ width: 22 }} /></td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#f0e8ec" }} />
                          <div>
                            <div className="fm-skel-bar" style={{ width: 110, marginBottom: 6 }} />
                            <div className="fm-skel-bar" style={{ width: 75 }} />
                          </div>
                        </div>
                      </td>
                      {Array.from({ length: 8 }).map((__, j) => (
                        <td key={j}><div className="fm-skel-bar" style={{ width: 60 }} /></td>
                      ))}
                    </tr>
                  ))
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan="10">
                      <div className="fm-empty">
                        <div className="fm-empty-icon"><FaUsers /></div>
                        <p style={{ fontWeight: 600, color: "#59123B", marginBottom: 4 }}>
                          Koi member nahi mila
                        </p>
                        <p style={{ fontSize: ".82rem" }}>Filters change karein ya search clear karein</p>
                        {activeFilters > 0 && (
                          <button className="fm-btn-outline" style={{ margin: "10px auto 0", fontSize: ".82rem" }} onClick={resetFilters}>
                            <FaTimes /> Filters Reset Karein
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((member, idx) => (
                    <tr key={member._id}>
                      <td style={{ color: "#9A7888", fontWeight: 600 }}>
                        {(page - 1) * limit + idx + 1}
                      </td>

                      {/* member info */}
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <Avatar member={member} />
                          <div>
                            <div style={{ fontWeight: 700, color: "#3d1a2b", lineHeight: 1.2 }}>
                              {member.firstName} {member.lastName}
                            </div>
                            <div style={{ fontSize: ".75rem", color: "#9A7888", marginTop: 2 }}>
                              {member.profilefor || "Self"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* matri id */}
                      <td>
                        <span className="badge-id">{member.martrId || "—"}</span>
                      </td>

                      {/* email */}
                      <td style={{ maxWidth: 190, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        <span title={member.email}>{member.email}</span>
                      </td>

                      {/* gender */}
                      <td>
                        {member.gender === "Male" || member.gender === "male" ? (
                          <span className="badge-male"><FaMale />Male</span>
                        ) : member.gender === "Female" || member.gender === "female" ? (
                          <span className="badge-female"><FaFemale />Female</span>
                        ) : (
                          <span style={{ color: "#9A7888" }}>—</span>
                        )}
                      </td>

                      {/* mobile */}
                      <td style={{ fontSize: ".8rem", color: "#7A5C66" }}>
                        {member.mobile || "—"}
                      </td>

                      {/* approval */}
                      <td>
                        {member.isApproved ? (
                          <span className="badge-approved"><FaCheck />Approved</span>
                        ) : (
                          <span className="badge-pending">Pending</span>
                        )}
                      </td>

                      {/* status */}
                      <td>
                        {member.isEnable ? (
                          <span className="badge-active">Active</span>
                        ) : (
                          <span className="badge-inactive">Inactive</span>
                        )}
                      </td>

                      {/* verified column badge */}
                      <td>
                        {member.isVerified ? (
                          <span className="badge-verified">✅ Verified</span>
                        ) : (
                          <span className="badge-unverified">❌ Unverified</span>
                        )}
                      </td>

                      {/* views */}
                      <td style={{ fontWeight: 700, color: "#59123B" }}>
                        {member.view || 0}
                      </td>

                      {/* actions */}
                      <td>
                        <div style={{ display: "flex", gap: 6, flexWrap: "nowrap" }}>
                          <Link to={`/Members/View-Members/${member._id}`} style={{ textDecoration: "none" }}>
                            <button className="fm-btn fm-btn-view" title="View Profile">
                              <FaEye /> View
                            </button>
                          </Link>

                          <button
                            className={`fm-btn ${member.isVerified ? "fm-btn-unverify" : "fm-btn-verify"}`}
                            onClick={() => handleVerify(member._id)}
                            disabled={actionId === member._id}
                            title={member.isVerified ? "Click to Unverify" : "Click to Verify Member"}
                          >
                            <FaShieldAlt />
                            {actionId === member._id ? "…" : (member.isVerified ? "Unverify" : "Verify")}
                          </button>

                          {!member.isApproved && (
                            <button
                              className="fm-btn fm-btn-approve"
                              onClick={() => handleApprove(member._id)}
                              disabled={actionId === member._id}
                              title="Approve"
                            >
                              <FaCheck />
                              {actionId === member._id ? "…" : "Approve"}
                            </button>
                          )}

                          <button
                            className="fm-btn fm-btn-block"
                            onClick={() => handleBlock(member._id)}
                            disabled={actionId === member._id}
                            title="Block Member"
                          >
                            <FaBan />
                          </button>

                          <button
                            className="fm-btn fm-btn-delete"
                            onClick={() => handleDelete(member._id)}
                            disabled={actionId === member._id}
                            title="Delete Member"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── pagination ── */}
          {!loading && processed.length > 0 && (
            <div className="fm-pagination">
              <div className="fm-page-info">
                Showing <strong>{Math.min((page - 1) * limit + 1, processed.length)}</strong>–
                <strong>{Math.min(page * limit, processed.length)}</strong> of{" "}
                <strong>{processed.length}</strong> members
              </div>
              <div className="fm-page-btns">
                <button
                  className="fm-page-btn"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <FaChevronLeft />
                </button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let pg;
                  if (totalPages <= 7) pg = i + 1;
                  else if (page <= 4) pg = i + 1;
                  else if (page >= totalPages - 3) pg = totalPages - 6 + i;
                  else pg = page - 3 + i;
                  return (
                    <button
                      key={pg}
                      className={`fm-page-btn${page === pg ? " active" : ""}`}
                      onClick={() => setPage(pg)}
                    >
                      {pg}
                    </button>
                  );
                })}
                <button
                  className="fm-page-btn"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default FreeMembers;
