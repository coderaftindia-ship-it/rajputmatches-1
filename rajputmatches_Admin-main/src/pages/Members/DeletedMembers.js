import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaUser, FaEye, FaTrash, FaCheck, FaSearch, FaFilter,
  FaRedo, FaMale, FaFemale, FaTimes, FaChevronLeft,
  FaChevronRight, FaSort, FaSortUp, FaSortDown, FaHistory,
  FaTrashRestoreAlt, FaCrown, FaCheckCircle, FaUserCheck, FaUserMinus
} from "react-icons/fa";

const BASE_URL = (process.env.REACT_APP_BASE_URL || "http://localhost:5000/admin").replace(/\/$/, "");

/* ─────────────────────────── HELPERS ─────────────────────────── */
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

/* ─────────────────────────── STAT PILL ─────────────────────────── */
const StatPill = ({ label, value, color, icon }) => (
  <div className="dm-stat-pill" style={{ borderLeft: `4px solid ${color}` }}>
    <div className="dm-stat-icon" style={{ background: color + "18", color }}>
      {icon}
    </div>
    <div>
      <div className="dm-stat-value">{value}</div>
      <div className="dm-stat-label">{label}</div>
    </div>
  </div>
);

/* ─────────────────────────── AVATAR ─────────────────────────── */
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
          objectFit: "cover", border: "2px solid #EDB139",
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
      border: "2px solid #EDB139"
    }}>
      {initials(member)}
    </div>
  );
};

/* ─────────────────────────── MAIN COMPONENT ─────────────────────────── */
const DeletedMembers = () => {
  /* Data states */
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  /* Filter states */
  const [search, setSearch] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [filterSubscription, setFilterSubscription] = useState("");
  const [filterApproval, setFilterApproval] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);

  /* Pagination */
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  /* Fetch deleted/disabled profiles */
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await axios.get(`${BASE_URL}/deleted-profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMembers(response?.data?.user || []);
    } catch (err) {
      console.error("Error fetching deleted profiles:", err);
      toast.error("Deleted members list load nahi ho saki. Offline/Auth error check karein.");
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* Restore action (Calls delete-member endpoint to toggle isEnable back to true) */
  const handleRestore = async (memberId) => {
    if (actionId) return;
    setActionId(memberId);
    try {
      const token = getToken();
      const response = await axios.put(
        `${BASE_URL}/delete-member`,
        { data: memberId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response?.data?.message || "Member account restored successfully");
      await fetchData();
    } catch (error) {
      console.error("Error restoring member:", error);
      toast.error(error.response?.data?.message || "Restoring action failed");
    } finally {
      setActionId(null);
    }
  };

  /* Sort toggle */
  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setPage(1);
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <FaSort style={{ opacity: 0.3, marginLeft: 4 }} />;
    return sortDir === "asc"
      ? <FaSortUp style={{ color: "#D4AF37", marginLeft: 4 }} />
      : <FaSortDown style={{ color: "#D4AF37", marginLeft: 4 }} />;
  };

  /* Process filter & sorting */
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

      const matchSubscription =
        !filterSubscription ||
        (filterSubscription === "premium" && m.isSubscribed) ||
        (filterSubscription === "free" && !m.isSubscribed);

      const matchApproval =
        !filterApproval ||
        (filterApproval === "approved" && m.isApproved) ||
        (filterApproval === "pending" && !m.isApproved);

      return matchSearch && matchGender && matchSubscription && matchApproval;
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

  /* Pagination math */
  const totalPages = Math.ceil(processed.length / limit) || 1;
  const paginated = processed.slice((page - 1) * limit, page * limit);

  /* Quick counts */
  const totalDeleted = members.length;
  const premiumDeleted = members.filter((m) => m.isSubscribed).length;
  const freeDeleted = members.filter((m) => !m.isSubscribed).length;
  const maleDeleted = members.filter((m) => m?.gender?.toLowerCase() === "male").length;
  const femaleDeleted = members.filter((m) => m?.gender?.toLowerCase() === "female").length;

  const resetFilters = () => {
    setSearch(""); setFilterGender(""); setFilterSubscription("");
    setFilterApproval(""); setSortField("createdAt"); setSortDir("desc"); setPage(1);
  };

  const activeFilters = [filterGender, filterSubscription, filterApproval, search].filter(Boolean).length;

  return (
    <>
      <style>{`
        .dm-page { padding: 0 0 24px 0; }

        /* Stats system */
        .dm-stats-row { display:flex; flex-wrap:wrap; gap:14px; margin-bottom:24px; }
        .dm-stat-pill {
          display:flex; align-items:center; gap:12px;
          background:#fff; border-radius:12px; padding:14px 20px;
          box-shadow:0 2px 12px rgba(89,18,59,.07);
          flex:1; min-width:160px;
          transition: transform .2s, box-shadow .2s;
        }
        .dm-stat-pill:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(89,18,59,.12); }
        .dm-stat-icon { width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:16px; }
        .dm-stat-value { font-size:1.4rem; font-weight:700; color:#59123B; line-height:1; }
        .dm-stat-label { font-size:.75rem; color:#9A7888; margin-top:2px; }

        /* Filters system */
        .dm-filter-panel {
          background:#fff; border-radius:14px; padding:20px 24px;
          box-shadow:0 2px 12px rgba(89,18,59,.07);
          margin-bottom:20px;
          animation: slideDown .2s ease;
        }
        @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        .dm-filter-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(180px,1fr)); gap:14px; }
        .dm-filter-label { font-size:.75rem; font-weight:600; color:#59123B; margin-bottom:5px; text-transform:uppercase; letter-spacing:.5px; }
        .dm-input, .dm-select {
          width:100%; padding:9px 14px; border:1.5px solid #e5dce2; border-radius:9px;
          font-size:.875rem; color:#3d1a2b; background:#faf8f9;
          transition: border-color .2s, box-shadow .2s; outline:none;
        }
        .dm-input:focus, .dm-select:focus { border-color:#D4AF37; box-shadow:0 0 0 3px rgba(212,175,55,.15); background:#fff; }
        .dm-search-wrap { position:relative; }
        .dm-search-wrap .dm-input { padding-left:40px; }
        .dm-search-icon { position:absolute; left:13px; top:50%; transform:translateY(-50%); color:#9A7888; }

        /* Table Card Aesthetics */
        .dm-card { background:#fff; border-radius:16px; box-shadow:0 2px 16px rgba(89,18,59,.08); overflow:hidden; }
        .dm-card-header {
          padding:18px 24px; display:flex; align-items:center; justify-content:space-between;
          border-bottom:1px solid #f0e8ec; flex-wrap:wrap; gap:10px;
          background: linear-gradient(135deg, #59123B 0%, #8b1a5a 100%);
        }
        .dm-card-title { font-family:'Playfair Display',serif; color:#fff; font-size:1.15rem; display:flex; align-items:center; gap:8px; }
        .dm-badge-count { background:rgba(255,255,255,.2); color:#fff; padding:3px 10px; border-radius:20px; font-size:.78rem; font-weight:600; }

        .dm-table-wrap { overflow-x:auto; }
        .dm-table { width:100%; border-collapse:collapse; }
        .dm-table th {
          padding:12px 14px; font-size:.75rem; font-weight:700; text-transform:uppercase;
          letter-spacing:.5px; color:#59123B; background:#fdf4f8; border-bottom:2px solid #f0e8ec;
          white-space:nowrap; cursor:pointer; user-select:none;
        }
        .dm-table th:hover { background:#f7ecf2; }
        .dm-table td { padding:13px 14px; border-bottom:1px solid #f7f0f4; vertical-align:middle; color:#3d1a2b; font-size:.875rem; }
        .dm-table tr:hover td { background:#fdf9fb; }

        /* Status badges */
        .badge-inactive  { background:#fee2e2; color:#dc2626; padding:4px 10px; border-radius:20px; font-size:.72rem; font-weight:700; display:inline-flex; align-items:center; gap:4px; }
        .badge-approved  { background:#dcfce7; color:#15803d; padding:4px 10px; border-radius:20px; font-size:.72rem; font-weight:700; display:inline-flex; align-items:center; gap:4px; }
        .badge-pending   { background:#fef3c7; color:#92400e; padding:4px 10px; border-radius:20px; font-size:.72rem; font-weight:700; }
        .badge-premium   { background:#fef9ec; color:#b45309; border:1px solid #fcd34d; padding:4px 10px; border-radius:20px; font-size:.72rem; font-weight:700; display:inline-flex; align-items:center; gap:3px; }
        .badge-free      { background:#f3f4f6; color:#4b5563; padding:4px 10px; border-radius:20px; font-size:.72rem; font-weight:700; }
        .badge-id        { background:linear-gradient(135deg,#D4AF37,#EDB139); color:#fff; padding:4px 10px; border-radius:20px; font-size:.72rem; font-weight:700; }
        .badge-male      { background:#eff6ff; color:#2563eb; padding:3px 9px; border-radius:20px; font-size:.72rem; font-weight:600; display:inline-flex; align-items:center; gap:3px; }
        .badge-female    { background:#fdf2f8; color:#9d174d; padding:3px 9px; border-radius:20px; font-size:.72rem; font-weight:600; display:inline-flex; align-items:center; gap:3px; }

        /* Action Buttons */
        .dm-btn { border:none; border-radius:8px; padding:6px 10px; font-size:.78rem; cursor:pointer; display:inline-flex; align-items:center; gap:4px; transition:all .15s; font-weight:600; }
        .dm-btn:disabled { opacity:.5; cursor:not-allowed; }
        .dm-btn-view    { background:#f0fdf4; color:#15803d; }
        .dm-btn-view:hover { background:#15803d; color:#fff; }
        .dm-btn-restore { background:#eff6ff; color:#1d4ed8; }
        .dm-btn-restore:hover { background:#1d4ed8; color:#fff; }

        /* Controls */
        .dm-top-bar { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; margin-bottom:20px; }
        .dm-top-bar h2 { font-family:'Playfair Display',serif; color:#59123B; margin:0; font-size:1.6rem; }
        .dm-btn-outline { background:#fff; color:#59123B; border:2px solid #59123B; border-radius:10px; padding:8px 16px; font-weight:600; font-size:.875rem; cursor:pointer; display:flex; align-items:center; gap:6px; transition:all .2s; }
        .dm-btn-outline:hover { background:#59123B; color:#fff; }
        .dm-btn-filter { background:#fff; border:2px solid ${activeFilters > 0 ? '#D4AF37' : '#e5dce2'}; border-radius:10px; padding:8px 16px; font-weight:600; font-size:.875rem; cursor:pointer; display:flex; align-items:center; gap:6px; color:${activeFilters > 0 ? '#D4AF37' : '#59123B'}; transition:all .2s; position:relative; }
        .dm-btn-filter:hover { border-color:#D4AF37; color:#D4AF37; }
        .dm-filter-dot { position:absolute; top:-6px; right:-6px; width:18px; height:18px; background:#D4AF37; border-radius:50%; color:#fff; font-size:.62rem; font-weight:700; display:flex; align-items:center; justify-content:center; }

        /* Pagination style */
        .dm-pagination { display:flex; align-items:center; justify-content:space-between; padding:16px 24px; border-top:1px solid #f0e8ec; flex-wrap:wrap; gap:10px; }
        .dm-page-info { font-size:.82rem; color:#9A7888; }
        .dm-page-btns { display:flex; gap:6px; }
        .dm-page-btn { width:34px; height:34px; border-radius:8px; border:1.5px solid #e5dce2; background:#fff; color:#59123B; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:.82rem; font-weight:600; transition:all .15s; }
        .dm-page-btn:hover:not(:disabled) { border-color:#59123B; background:#59123B; color:#fff; }
        .dm-page-btn.active { background:linear-gradient(135deg,#59123B,#8b1a5a); color:#fff; border-color:#59123B; }
        .dm-page-btn:disabled { opacity:.4; cursor:not-allowed; }

        /* Skeleton animation */
        .dm-skeleton { animation: shimmer 1.4s infinite; }
        @keyframes shimmer { 0%,100%{opacity:.7} 50%{opacity:.3} }
        .dm-skeleton-row td { padding:14px; }
        .dm-skel-bar { height:14px; border-radius:6px; background:#f0e8ec; }

        /* Empty state styling */
        .dm-empty { padding:60px 20px; text-align:center; color:#9A7888; }
        .dm-empty-icon { font-size:3rem; margin-bottom:12px; opacity:.35; }
        .dm-chips { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:14px; }
        .dm-chip { background:#fdf4f8; color:#59123B; border:1.5px solid #e5dce2; border-radius:20px; padding:4px 12px; font-size:.78rem; font-weight:600; display:inline-flex; align-items:center; gap:6px; }
        .dm-chip-remove { cursor:pointer; color:#9A7888; }
        .dm-chip-remove:hover { color:#dc2626; }
      `}</style>

      <div className="main-content">
        <div className="dm-page">
          
          {/* Header row */}
          <div className="dm-top-bar">
            <div>
              <h2><FaUserMinus style={{ marginRight: 10, color: "#59123B" }} />Deleted & Disabled Members</h2>
              <p style={{ color: "#9A7888", margin: 0, fontSize: ".875rem" }}>
                Disabled profile accounts and restore panel
              </p>
            </div>
            <div>
              <button className="dm-btn-outline" onClick={fetchData} title="Refresh lists">
                <FaRedo /> Refresh
              </button>
            </div>
          </div>

          {/* Stats indicators */}
          <div className="dm-stats-row">
            <StatPill label="Total Deleted" value={totalDeleted} color="#59123B" icon={<FaUserMinus />} />
            <StatPill label="Premium Deleted" value={premiumDeleted} color="#D4AF37" icon={<FaCrown />} />
            <StatPill label="Free Deleted" value={freeDeleted} color="#725D66" icon={<FaUser />} />
            <StatPill label="Males" value={maleDeleted} color="#2563eb" icon={<FaMale />} />
            <StatPill label="Females" value={femaleDeleted} color="#9d174d" icon={<FaFemale />} />
          </div>

          {/* Filter Toolbar */}
          <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
            <div className="dm-search-wrap" style={{ flex: 1, minWidth: 220 }}>
              <FaSearch className="dm-search-icon" />
              <input
                className="dm-input"
                placeholder="Search by name, email, phone or Matri ID..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>

            <button className="dm-btn-filter" onClick={() => setShowFilters((v) => !v)}>
              {showFilters ? <FaTimes /> : <FaFilter />}
              {showFilters ? "Hide Filters" : "Filters"}
              {activeFilters > 0 && <span className="dm-filter-dot">{activeFilters}</span>}
            </button>

            {activeFilters > 0 && (
              <button className="dm-btn-outline" style={{ padding: "8px 14px" }} onClick={resetFilters}>
                <FaTimes style={{ fontSize: 11 }} /> Reset
              </button>
            )}
          </div>

          {/* Active filter chips */}
          {activeFilters > 0 && (
            <div className="dm-chips">
              {search && (
                <span className="dm-chip">
                  Search: "{search}"
                  <FaTimes className="dm-chip-remove" onClick={() => setSearch("")} />
                </span>
              )}
              {filterGender && (
                <span className="dm-chip">
                  Gender: {filterGender}
                  <FaTimes className="bm-chip-remove" onClick={() => setFilterGender("")} />
                </span>
              )}
              {filterSubscription && (
                <span className="dm-chip">
                  Subscription: {filterSubscription}
                  <FaTimes className="bm-chip-remove" onClick={() => setFilterSubscription("")} />
                </span>
              )}
              {filterApproval && (
                <span className="dm-chip">
                  Approval: {filterApproval}
                  <FaTimes className="bm-chip-remove" onClick={() => setFilterApproval("")} />
                </span>
              )}
            </div>
          )}

          {/* Collapsible filters grid */}
          {showFilters && (
            <div className="dm-filter-panel">
              <div className="dm-filter-grid">
                <div>
                  <div className="dm-filter-label">Gender</div>
                  <select className="bm-select" value={filterGender} onChange={(e) => { setFilterGender(e.target.value); setPage(1); }}>
                    <option value="">All Genders</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <div className="dm-filter-label">Subscription</div>
                  <select className="bm-select" value={filterSubscription} onChange={(e) => { setFilterSubscription(e.target.value); setPage(1); }}>
                    <option value="">All Types</option>
                    <option value="premium">Premium</option>
                    <option value="free">Free</option>
                  </select>
                </div>
                <div>
                  <div className="dm-filter-label">Approval Status</div>
                  <select className="bm-select" value={filterApproval} onChange={(e) => { setFilterApproval(e.target.value); setPage(1); }}>
                    <option value="">All Statuses</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div>
                  <div className="dm-filter-label">Sort Column</div>
                  <select className="bm-select" value={`${sortField}:${sortDir}`} onChange={(e) => { const [f, d] = e.target.value.split(":"); setSortField(f); setSortDir(d); setPage(1); }}>
                    <option value="createdAt:desc">Deleted Date (Newest)</option>
                    <option value="createdAt:asc">Deleted Date (Oldest)</option>
                    <option value="name:asc">Name A-Z</option>
                    <option value="name:desc">Name Z-A</option>
                    <option value="martrId:asc">ID Ascending</option>
                    <option value="view:desc">Most Viewed</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Main Table Card */}
          <div className="dm-card">
            <div className="dm-card-header">
              <div className="dm-card-title">
                <FaUserMinus style={{ color: "#D4AF37" }} />
                Deleted/Disabled Accounts list
                <span className="dm-badge-count">{processed.length} members</span>
              </div>
            </div>

            <div className="dm-table-wrap">
              <table className="dm-table">
                <thead>
                  <tr>
                    <th style={{ width: 44 }}>#</th>
                    <th onClick={() => toggleSort("name")} style={{ minWidth: 200 }}>
                      Deleted Member <SortIcon field="name" />
                    </th>
                    <th onClick={() => toggleSort("martrId")}>
                      Matri ID <SortIcon field="martrId" />
                    </th>
                    <th style={{ minWidth: 190 }}>Email Address</th>
                    <th>Gender</th>
                    <th>Approval</th>
                    <th>Subscription</th>
                    <th>Account Status</th>
                    <th onClick={() => toggleSort("view")}>
                      Views <SortIcon field="view" />
                    </th>
                    <th style={{ minWidth: 180 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className="dm-skeleton-row dm-skeleton">
                        <td><div className="dm-skel-bar" style={{ width: 22 }} /></td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#f0e8ec" }} />
                            <div>
                              <div className="dm-skel-bar" style={{ width: 110, marginBottom: 6 }} />
                              <div className="dm-skel-bar" style={{ width: 75 }} />
                            </div>
                          </div>
                        </td>
                        {Array.from({ length: 8 }).map((__, j) => (
                          <td key={j}><div className="dm-skel-bar" style={{ width: 60 }} /></td>
                        ))}
                      </tr>
                    ))
                  ) : paginated.length === 0 ? (
                    <tr>
                      <td colSpan="10">
                        <div className="dm-empty">
                          <div className="dm-empty-icon"><FaUserMinus /></div>
                          <p style={{ fontWeight: 600, color: "#59123B", marginBottom: 4 }}>
                            No deleted members found
                          </p>
                          <p style={{ fontSize: ".82rem" }}>Modify search criteria or reset filters</p>
                          {activeFilters > 0 && (
                            <button className="bm-btn-outline" style={{ margin: "10px auto 0", fontSize: ".82rem" }} onClick={resetFilters}>
                              <FaTimes /> Reset Filters
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

                        {/* Member card info */}
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

                        {/* Matri ID */}
                        <td>
                          <span className="badge-id">{member.martrId || "—"}</span>
                        </td>

                        {/* Email */}
                        <td style={{ maxWidth: 190, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          <span title={member.email}>{member.email}</span>
                        </td>

                        {/* Gender */}
                        <td>
                          {member.gender === "Male" || member.gender === "male" ? (
                            <span className="badge-male"><FaMale />Male</span>
                          ) : member.gender === "Female" || member.gender === "female" ? (
                            <span className="badge-female"><FaFemale />Female</span>
                          ) : (
                            <span style={{ color: "#9A7888" }}>—</span>
                          )}
                        </td>

                        {/* Approval status */}
                        <td>
                          {member.isApproved ? (
                            <span className="badge-approved"><FaCheckCircle /> Approved</span>
                          ) : (
                            <span className="badge-pending">Pending</span>
                          )}
                        </td>

                        {/* Subscription status */}
                        <td>
                          {member.isSubscribed ? (
                            <span className="badge-premium"><FaCrown /> Premium</span>
                          ) : (
                            <span className="badge-free">Free</span>
                          )}
                        </td>

                        {/* Account status */}
                        <td>
                          <span className="badge-inactive">Inactive / Deleted</span>
                        </td>

                        {/* Views */}
                        <td style={{ fontWeight: 700, color: "#59123B" }}>
                          {member.view || 0}
                        </td>

                        {/* Options */}
                        <td>
                          <div style={{ display: "flex", gap: 6, flexWrap: "nowrap" }}>
                            <Link to={`/Members/View-Members/${member._id}`} style={{ textDecoration: "none" }}>
                              <button className="dm-btn dm-btn-view" title="View Profile Details">
                                <FaEye /> View
                              </button>
                            </Link>

                            <button
                              className="dm-btn dm-btn-restore"
                              onClick={() => handleRestore(member._id)}
                              disabled={actionId === member._id}
                              title="Restore Member Account"
                            >
                              <FaTrashRestoreAlt />
                              {actionId === member._id ? "…" : "Restore"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {!loading && processed.length > 0 && (
              <div className="dm-pagination">
                <div className="dm-page-info">
                  Showing <strong>{Math.min((page - 1) * limit + 1, processed.length)}</strong>–
                  <strong>{Math.min(page * limit, processed.length)}</strong> of{" "}
                  <strong>{processed.length}</strong> members
                </div>
                <div className="dm-page-btns">
                  <button
                    className="dm-page-btn"
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
                        className={`dm-page-btn${page === pg ? " active" : ""}`}
                        onClick={() => setPage(pg)}
                      >
                        {pg}
                      </button>
                    );
                  })}
                  <button
                    className="dm-page-btn"
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

export default DeletedMembers;
