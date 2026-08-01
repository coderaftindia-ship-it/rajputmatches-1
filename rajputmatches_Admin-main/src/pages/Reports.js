import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { Link } from "react-router-dom";
import {
  FaSearch, FaFilter, FaFileCsv, FaUndo, FaEye,
  FaChartBar, FaChartPie, FaUsers, FaMapMarkerAlt,
  FaHeart, FaVenusMars, FaCrown, FaCalendarAlt, FaUserShield,
} from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

/* ─── colour palettes ─────────────────────────────── */
const PIE_COLORS   = ["#8B1D5A", "#EDB139", "#28a745", "#3f0c2a", "#e07b00", "#6c757d", "#17a2b8", "#dc3545"];
const GENDER_MAP   = { Male: "#8B1D5A", Female: "#EDB139", Unknown: "#a0aec0", Other: "#28a745" };
const STATUS_MAP   = { Premium: "#EDB139", Free: "#8B1D5A", Blocked: "#dc3545" };

/* ─── tiny helpers ─────────────────────────────────── */
const fmtDate = (str) => {
  if (!str) return "";
  const [, m, d] = str.split("-");
  return `${d}/${m}`;
};

/* ─── Custom tooltip ────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "10px 16px", boxShadow: "0 4px 18px rgba(0,0,0,0.10)", fontFamily: "Inter, sans-serif", fontSize: 13 }}>
      {label && <p style={{ margin: "0 0 6px", fontWeight: 700, color: "#4a5568" }}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ margin: 0, color: p.color || "#59123B", fontWeight: 600 }}>
          {p.name}: <span style={{ color: "#2d3748" }}>{p.value}</span>
        </p>
      ))}
    </div>
  );
};

/* ─── Custom pie label ──────────────────────────────── */
const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  if (percent < 0.04) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

/* ════════════════════════════════════════════════════ */
const Reports = () => {
  const { fetchUserData } = useAuth();
  const Base_url = (process.env.REACT_APP_BASE_URL || "http://localhost:5000/admin").replace(/\/$/, "");

  /* ── Analytics state ─────────────────────────────── */
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  /* ── Summary KPIs (from dashboard/user-counts) ───── */
  const [kpis, setKpis] = useState(null);

  /* ── Filter states ───────────────────────────────── */
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("");
  const [isSubscribed, setIsSubscribed] = useState("");
  const [isbloacked, setIsbloacked] = useState("");
  const [isApproved, setIsApproved] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  /* ── Table state ─────────────────────────────────── */
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 10;

  /* ── Fetch analytics ─────────────────────────────── */
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setAnalyticsLoading(true);
        const [analyticsRes, kpiRes] = await Promise.all([
          fetchUserData("dashboard/analytics"),
          fetchUserData("dashboard/user-counts"),
        ]);
        setAnalytics(analyticsRes || null);
        setKpis(kpiRes?.data || null);
      } catch (err) {
        console.error("Analytics fetch error:", err);
      } finally {
        setAnalyticsLoading(false);
      }
    };
    loadAnalytics();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Fetch filtered table ────────────────────────── */
  const fetchFilteredReports = useCallback(async (pageNumber = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ search, gender, isSubscribed, isbloacked, isApproved, state, city, startDate, endDate, page: pageNumber, limit });
      const response = await fetchUserData(`reports/filter?${params.toString()}`);
      if (response?.success) {
        setUsers(response.users || []);
        setTotal(response.total || 0);
        setPages(response.pages || 1);
        setCurrentPage(response.currentPage || 1);
      } else { setUsers([]); setTotal(0); setPages(1); }
    } catch (err) {
      console.error("Report filter error:", err);
      toast.error("Failed to fetch reports");
      setUsers([]); setTotal(0);
    } finally { setLoading(false); }
  }, [search, gender, isSubscribed, isbloacked, isApproved, state, city, startDate, endDate, fetchUserData]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchFilteredReports(1); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleApplyFilters = (e) => { e.preventDefault(); fetchFilteredReports(1); };

  const handleResetFilters = () => {
    setSearch(""); setGender(""); setIsSubscribed(""); setIsbloacked("");
    setIsApproved(""); setState(""); setCity(""); setStartDate(""); setEndDate("");
    setTimeout(() => fetchFilteredReports(1), 50);
  };

  /* ── Export CSV ──────────────────────────────────── */
  const exportToCSV = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminAuthToken");
      const params = new URLSearchParams({ search, gender, isSubscribed, isbloacked, isApproved, state, city, startDate, endDate, page: 1, limit: 10000 });
      const response = await axios.get(`${Base_url}/reports/filter?${params.toString()}`, { headers: { Authorization: `Bearer ${token}` } });
      const matchedUsers = response?.data?.users || [];
      if (!matchedUsers.length) { toast.warning("No data to export"); return; }
      const headers = ["Matri ID","First Name","Last Name","Email","Mobile","Gender","Marital Status","Subscribed","Approved","Blocked","State","City","Profile For"];
      const rows = matchedUsers.map(u => [u.martrId||"",u.firstName||"",u.lastName||"",u.email||"",u.mobile||"",u.gender||"",u.maritalStatus||"",u.isSubscribed?"Yes":"No",u.isApproved?"Yes":"No",u.isbloacked?"Yes":"No",u.address?.state||"",u.address?.city||"",u.profilefor||""]);
      const csv = [headers.join(","), ...rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(","))].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `RajputMatches_Report_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      toast.success("CSV exported successfully!");
    } catch (err) {
      console.error("CSV export error:", err);
      toast.error("Failed to export CSV");
    } finally { setLoading(false); }
  };

  /* ── Derived chart data ──────────────────────────── */
  const trendData = (analytics?.registrationTrend || []).map(d => ({ date: fmtDate(d._id), count: d.count }));

  const genderData = (analytics?.genderRatio || []).map(d => ({ name: d._id || "Unknown", value: d.count }));

  const subscriptionData = (analytics?.subscriptionRatio || []).map(d => ({ name: d._id || "Unknown", value: d.count }));

  const profileForData = (analytics?.profileForRatio || [])
    .filter(d => d._id && d._id !== "Unknown")
    .map(d => ({ name: d._id, value: d.count }));

  const stateData = (analytics?.stateRatio || [])
    .filter(d => d._id && d._id !== "Unknown")
    .map(d => ({ state: d._id, members: d.count }));

  /* ── Feedback / Report Inbox ──────────────────────── */
  const [feedbackTab, setFeedbackTab] = useState(false); // toggle inbox section
  const [feedbacks, setFeedbacks] = useState([]);
  const [fbTotal, setFbTotal] = useState(0);
  const [fbPages, setFbPages] = useState(1);
  const [fbPage, setFbPage] = useState(1);
  const [fbLoading, setFbLoading] = useState(false);
  const [fbSearch, setFbSearch] = useState("");
  const [fbStatus, setFbStatus] = useState("");
  const [fbType, setFbType] = useState("");
  const [fbSelected, setFbSelected] = useState(null); // detail modal
  const [fbUpdating, setFbUpdating] = useState(false);

  const fetchFeedbacks = useCallback(async (pg = 1) => {
    setFbLoading(true);
    try {
      const token = localStorage.getItem("adminAuthToken");
      const params = new URLSearchParams({ page: pg, limit: 15 });
      if (fbSearch) params.append("search", fbSearch);
      if (fbStatus) params.append("status", fbStatus);
      if (fbType) params.append("type", fbType);
      const res = await axios.get(`${Base_url}/feedback?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data?.success) {
        setFeedbacks(res.data.data || []);
        setFbTotal(res.data.total || 0);
        setFbPages(res.data.pages || 1);
        setFbPage(res.data.currentPage || 1);
      }
    } catch (err) { toast.error("Feedback load karne mein error"); }
    finally { setFbLoading(false); }
  }, [fbSearch, fbStatus, fbType, Base_url]);

  useEffect(() => { if (feedbackTab) fetchFeedbacks(1); }, [feedbackTab, fetchFeedbacks]);

  const updateFbStatus = async (id, status) => {
    setFbUpdating(true);
    try {
      const token = localStorage.getItem("adminAuthToken");
      await axios.patch(`${Base_url}/feedback/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Status update ho gaya!");
      fetchFeedbacks(fbPage);
      if (fbSelected?._id === id) setFbSelected(p => ({ ...p, status }));
    } catch { toast.error("Update failed"); }
    finally { setFbUpdating(false); }
  };

  const deleteFb = async (id) => {
    if (!window.confirm("Kya aap is record ko delete karna chahte hain?")) return;
    try {
      const token = localStorage.getItem("adminAuthToken");
      await axios.delete(`${Base_url}/feedback/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Record delete ho gaya!");
      setFbSelected(null);
      fetchFeedbacks(fbPage);
    } catch { toast.error("Delete failed"); }
  };

  const FB_STATUS_COLORS = { pending: "#e67e22", in_review: "#3498db", resolved: "#27ae60", dismissed: "#7f8c8d" };
  const FB_TYPE_COLORS = { feedback: "#EDB139", report: "#e74c3c", bug: "#8B1D5A", suggestion: "#27ae60" };

  /* ═══════════════════════════════════════════════════ */
  return (
    <div className="main-content">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

        .rp-page {
          font-family: 'Inter', sans-serif;
          background: #f7f8fc;
          min-height: 100vh;
          padding: 28px 24px;
        }

        /* ── Hero ── */
        .rp-hero {
          background: linear-gradient(135deg, #59123B 0%, #8B1D5A 55%, #3f0c2a 100%);
          border-radius: 22px;
          padding: 32px 36px;
          margin-bottom: 28px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(89,18,59,0.25);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }
        .rp-hero::before {
          content: '';
          position: absolute;
          top: -50px; right: -50px;
          width: 200px; height: 200px;
          border-radius: 50%;
          background: rgba(237,177,57,0.10);
        }
        .rp-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 700;
          color: #EDB139;
          margin: 0 0 5px 0;
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .rp-hero-sub {
          color: rgba(255,255,255,0.7);
          font-size: 0.95rem;
          margin: 0;
          position: relative;
          z-index: 1;
        }
        .rp-export-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #EDB139;
          color: #59123B;
          border: none;
          padding: 12px 22px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.92rem;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(237,177,57,0.35);
          white-space: nowrap;
          position: relative;
          z-index: 1;
        }
        .rp-export-btn:hover:not(:disabled) {
          background: #f0c030;
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(237,177,57,0.45);
        }
        .rp-export-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* ── KPI row ── */
        .rp-kpi-row {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
          gap: 16px;
          margin-bottom: 28px;
        }
        .rp-kpi {
          background: #fff;
          border-radius: 18px;
          padding: 22px 20px;
          box-shadow: 0 2px 14px rgba(0,0,0,0.06);
          display: flex;
          align-items: center;
          gap: 14px;
          border-left: 5px solid transparent;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .rp-kpi:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.10); }
        .rp-kpi.total   { border-left-color: #8B1D5A; }
        .rp-kpi.free    { border-left-color: #3f0c2a; }
        .rp-kpi.premium { border-left-color: #EDB139; }
        .rp-kpi.blocked { border-left-color: #dc3545; }
        .rp-kpi-icon {
          width: 52px; height: 52px;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.35rem;
          flex-shrink: 0;
        }
        .rp-kpi.total   .rp-kpi-icon { background: #faf0f6; color: #8B1D5A; }
        .rp-kpi.free    .rp-kpi-icon { background: #f5edf8; color: #3f0c2a; }
        .rp-kpi.premium .rp-kpi-icon { background: #fefae8; color: #c99020; }
        .rp-kpi.blocked .rp-kpi-icon { background: #fff5f5; color: #dc3545; }
        .rp-kpi-num {
          font-size: 2rem;
          font-weight: 700;
          color: #2d3748;
          line-height: 1;
        }
        .rp-kpi-label {
          font-size: 0.78rem;
          color: #718096;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          margin-top: 3px;
        }

        /* ── Chart section title ── */
        .rp-section-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.35rem;
          font-weight: 700;
          color: #59123B;
          margin: 0 0 20px 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .rp-section-title svg { color: #EDB139; }

        /* ── Chart cards grid ── */
        .rp-charts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 22px;
          margin-bottom: 28px;
        }
        .rp-charts-grid.wide { grid-template-columns: 1fr; }
        @media (max-width: 900px) {
          .rp-charts-grid { grid-template-columns: 1fr; }
        }

        .rp-chart-card {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 4px 18px rgba(0,0,0,0.07);
          padding: 24px;
          border: 1.5px solid #f0f0f6;
        }
        .rp-chart-card-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #4a5568;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }
        .rp-chart-card-title svg { color: #8B1D5A; }

        /* ── Skeleton / loading ── */
        .rp-skeleton {
          background: linear-gradient(90deg, #f0f0f6 25%, #e8e8f0 50%, #f0f0f6 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 10px;
        }
        @keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }

        /* ── Filter card ── */
        .rp-filter-card {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 4px 18px rgba(0,0,0,0.07);
          margin-bottom: 22px;
          overflow: hidden;
          border: 1.5px solid #f0f0f6;
        }
        .rp-filter-header {
          background: linear-gradient(135deg, #f9f5f7, #fdf7fb);
          padding: 18px 24px;
          border-bottom: 1.5px solid #f0f0f6;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.95rem;
          font-weight: 700;
          color: #59123B;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }
        .rp-filter-body { padding: 24px; }
        .rp-filter-row { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 16px; }

        .rp-field-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: #718096;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          margin-bottom: 6px;
          display: block;
        }
        .rp-input, .rp-select {
          width: 100%;
          padding: 11px 14px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.9rem;
          font-family: 'Inter', sans-serif;
          color: #2d3748;
          background: #f9fafb;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .rp-input:focus, .rp-select:focus {
          border-color: #8B1D5A;
          box-shadow: 0 0 0 3px rgba(139,29,90,0.11);
          background: #fff;
        }
        .rp-filter-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 18px; }
        .rp-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 10px 20px;
          border-radius: 10px;
          font-size: 0.88rem;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }
        .rp-btn-primary {
          background: linear-gradient(135deg, #59123B, #8B1D5A);
          color: #fff;
          box-shadow: 0 4px 14px rgba(89,18,59,0.3);
        }
        .rp-btn-primary:hover:not(:disabled) { background: linear-gradient(135deg, #3f0c2a, #59123B); transform: translateY(-1px); }
        .rp-btn-outline {
          background: #fff;
          color: #8B1D5A;
          border: 1.5px solid #e8c9da;
        }
        .rp-btn-outline:hover:not(:disabled) { background: #faf0f6; }
        .rp-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* ── Table ── */
        .rp-table-card {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 4px 18px rgba(0,0,0,0.07);
          border: 1.5px solid #f0f0f6;
          overflow: hidden;
          margin-bottom: 28px;
        }
        .rp-table-header {
          background: linear-gradient(135deg, #f9f5f7, #fdf7fb);
          padding: 18px 24px;
          border-bottom: 1.5px solid #f0f0f6;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
        }
        .rp-table-header-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #59123B;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .rp-total-badge {
          background: #faf0f6;
          color: #8B1D5A;
          border: 1.5px solid #e8c9da;
          border-radius: 20px;
          padding: 4px 14px;
          font-size: 0.82rem;
          font-weight: 700;
        }
        table.rp-table { width: 100%; border-collapse: collapse; }
        table.rp-table thead tr { background: #f9f5f7; }
        table.rp-table th {
          padding: 12px 14px;
          font-size: 0.78rem;
          font-weight: 700;
          color: #718096;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          border-bottom: 1.5px solid #f0f0f6;
          white-space: nowrap;
          text-align: left;
        }
        table.rp-table td {
          padding: 13px 14px;
          font-size: 0.88rem;
          color: #4a5568;
          border-bottom: 1px solid #f7f8fc;
        }
        table.rp-table tbody tr { transition: background 0.15s; }
        table.rp-table tbody tr:hover { background: #fdf7fb; }
        table.rp-table tbody tr:last-child td { border-bottom: none; }

        .rp-badge {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 0.73rem;
          font-weight: 700;
          letter-spacing: 0.3px;
          white-space: nowrap;
        }
        .rp-badge-premium { background: #fefae8; color: #b07a00; border: 1px solid #f0d060; }
        .rp-badge-free    { background: #faf0f6; color: #8B1D5A; border: 1px solid #e8c9da; }
        .rp-badge-success { background: #f0fff4; color: #1d8f3d; border: 1px solid #c3e6cb; }
        .rp-badge-danger  { background: #fff5f5; color: #b02a37; border: 1px solid #f5c6cb; }
        .rp-badge-warning { background: #fff8ec; color: #856404; border: 1px solid #ffe082; }

        .rp-view-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px; height: 32px;
          border-radius: 50%;
          background: #faf0f6;
          color: #8B1D5A;
          border: 1.5px solid #e8c9da;
          transition: all 0.2s;
          text-decoration: none;
          font-size: 13px;
        }
        .rp-view-btn:hover { background: #8B1D5A; color: #fff; border-color: #8B1D5A; text-decoration: none; }

        /* ── Pagination ── */
        .rp-pagination { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; padding: 16px 24px; border-top: 1.5px solid #f0f0f6; }
        .rp-pag-info { font-size: 0.82rem; color: #718096; }
        .rp-pag-btns { display: flex; gap: 6px; }
        .rp-pag-btn {
          min-width: 34px; height: 34px;
          border-radius: 8px;
          border: 1.5px solid #e2e8f0;
          background: #fff;
          color: #4a5568;
          font-size: 0.85rem;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s;
          display: flex; align-items: center; justify-content: center;
          padding: 0 10px;
        }
        .rp-pag-btn:hover:not(:disabled):not(.active) { background: #faf0f6; border-color: #e8c9da; color: #8B1D5A; }
        .rp-pag-btn.active { background: #8B1D5A; color: #fff; border-color: #8B1D5A; }
        .rp-pag-btn:disabled { opacity: 0.45; cursor: not-allowed; }

        /* ── Spinner ── */
        .rp-spinner {
          width: 48px; height: 48px;
          border: 4px solid #faf0f6;
          border-top-color: #8B1D5A;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .rp-loading-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 60px 20px; }
        .rp-loading-wrap p { color: #8B1D5A; font-weight: 600; margin: 0; }
        .rp-empty { display: flex; flex-direction: column; align-items: center; padding: 60px 20px; gap: 10px; color: #a0aec0; }
        .rp-empty svg { font-size: 3rem; color: #e2d0d8; }
      `}</style>

      <div className="rp-page">

        {/* ── Hero ─────────────────────────────────────── */}
        <div className="rp-hero">
          <div>
            <h2 className="rp-hero-title">
              <FaChartBar /> Reports & Analytics
            </h2>
            <p className="rp-hero-sub">Live insights, charts, and filterable member reports</p>
          </div>
          <button className="rp-export-btn" onClick={exportToCSV} disabled={loading || users.length === 0}>
            <FaFileCsv /> Export to CSV
          </button>
        </div>

        {/* ── KPI Cards ─────────────────────────────────── */}
        <div className="rp-kpi-row">
          {[
            { cls: "total",   icon: <FaUsers />,       label: "Total Members",   val: kpis?.totalMembers },
            { cls: "free",    icon: <FaHeart />,        label: "Free Members",    val: kpis?.freeMembers },
            { cls: "premium", icon: <FaCrown />,        label: "Premium Members", val: kpis?.premiumMembers },
            { cls: "blocked", icon: <FaUserShield />,   label: "Blocked Members", val: kpis?.blockedMembers },
          ].map(({ cls, icon, label, val }) => (
            <div key={cls} className={`rp-kpi ${cls}`}>
              <div className="rp-kpi-icon">{icon}</div>
              <div>
                {analyticsLoading
                  ? <div className="rp-skeleton" style={{ width: 60, height: 30, marginBottom: 6 }} />
                  : <div className="rp-kpi-num">{val ?? "—"}</div>
                }
                <div className="rp-kpi-label">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Charts Section Title ── */}
        <p className="rp-section-title"><FaChartBar /> Analytics Overview</p>

        {/* ── Row 1: Registration Trend (full width) ─── */}
        <div className="rp-charts-grid wide">
          <div className="rp-chart-card">
            <div className="rp-chart-card-title"><FaCalendarAlt /> Registration Trend (Last 30 Days)</div>
            {analyticsLoading ? (
              <div className="rp-skeleton" style={{ height: 240 }} />
            ) : trendData.length === 0 ? (
              <div className="rp-empty" style={{ height: 240 }}>No registration data found.</div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={trendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#8B1D5A" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#8B1D5A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f6" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#718096" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#718096" }} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="count" name="Registrations" stroke="#8B1D5A" strokeWidth={2.5} fill="url(#regGrad)" dot={{ r: 3, fill: "#8B1D5A" }} activeDot={{ r: 5 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* ── Row 2: Gender & Subscription pies ─────── */}
        <div className="rp-charts-grid">
          <div className="rp-chart-card">
            <div className="rp-chart-card-title"><FaVenusMars /> Gender Distribution</div>
            {analyticsLoading ? (
              <div className="rp-skeleton" style={{ height: 240 }} />
            ) : genderData.length === 0 ? (
              <div className="rp-empty" style={{ height: 240 }}>No gender data.</div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={genderData} cx="50%" cy="50%" outerRadius={90} dataKey="value" nameKey="name" labelLine={false} label={renderPieLabel}>
                    {genderData.map((d, i) => <Cell key={i} fill={GENDER_MAP[d.name] || PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(val, name) => [val, name]} />
                  <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="rp-chart-card">
            <div className="rp-chart-card-title"><FaCrown /> Subscription Breakdown</div>
            {analyticsLoading ? (
              <div className="rp-skeleton" style={{ height: 240 }} />
            ) : subscriptionData.length === 0 ? (
              <div className="rp-empty" style={{ height: 240 }}>No subscription data.</div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={subscriptionData} cx="50%" cy="50%" outerRadius={90} dataKey="value" nameKey="name" labelLine={false} label={renderPieLabel}>
                    {subscriptionData.map((d, i) => <Cell key={i} fill={STATUS_MAP[d.name] || PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* ── Row 3: Profile For & Top States bars ─── */}
        <div className="rp-charts-grid">
          <div className="rp-chart-card">
            <div className="rp-chart-card-title"><FaHeart /> Profile Created For</div>
            {analyticsLoading ? (
              <div className="rp-skeleton" style={{ height: 240 }} />
            ) : profileForData.length === 0 ? (
              <div className="rp-empty" style={{ height: 240 }}>No profile-for data.</div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={profileForData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f6" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#718096" }} angle={-20} textAnchor="end" />
                  <YAxis tick={{ fontSize: 11, fill: "#718096" }} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Members" radius={[6, 6, 0, 0]}>
                    {profileForData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="rp-chart-card">
            <div className="rp-chart-card-title"><FaMapMarkerAlt /> Top 8 States</div>
            {analyticsLoading ? (
              <div className="rp-skeleton" style={{ height: 240 }} />
            ) : stateData.length === 0 ? (
              <div className="rp-empty" style={{ height: 240 }}>No state data.</div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stateData} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f6" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#718096" }} allowDecimals={false} />
                  <YAxis type="category" dataKey="state" tick={{ fontSize: 10, fill: "#4a5568" }} width={55} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="members" name="Members" fill="#EDB139" radius={[0, 6, 6, 0]}>
                    {stateData.map((_, i) => <Cell key={i} fill={i % 2 === 0 ? "#EDB139" : "#d4a030"} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* ── Filters ─────────────────────────────────── */}
        <p className="rp-section-title"><FaFilter /> Filter Members</p>

        <div className="rp-filter-card">
          <div className="rp-filter-header"><FaFilter /> Report Filter Criteria</div>
          <div className="rp-filter-body">
            <form onSubmit={handleApplyFilters}>
              <div className="rp-filter-row">
                <div>
                  <span className="rp-field-label">Search</span>
                  <input className="rp-input" type="text" placeholder="Name, Email, Mobile, Matri ID" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <div>
                  <span className="rp-field-label">Gender</span>
                  <select className="rp-select" value={gender} onChange={e => setGender(e.target.value)}>
                    <option value="">All Genders</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <span className="rp-field-label">Subscription</span>
                  <select className="rp-select" value={isSubscribed} onChange={e => setIsSubscribed(e.target.value)}>
                    <option value="">All Types</option>
                    <option value="false">Free</option>
                    <option value="true">Premium</option>
                  </select>
                </div>
                <div>
                  <span className="rp-field-label">Approval</span>
                  <select className="rp-select" value={isApproved} onChange={e => setIsApproved(e.target.value)}>
                    <option value="">All Status</option>
                    <option value="true">Approved</option>
                    <option value="false">Pending</option>
                  </select>
                </div>
                <div>
                  <span className="rp-field-label">Block Status</span>
                  <select className="rp-select" value={isbloacked} onChange={e => setIsbloacked(e.target.value)}>
                    <option value="">All</option>
                    <option value="false">Active Only</option>
                    <option value="true">Blocked Only</option>
                  </select>
                </div>
                <div>
                  <span className="rp-field-label">State</span>
                  <input className="rp-input" type="text" placeholder="e.g. Rajasthan" value={state} onChange={e => setState(e.target.value)} />
                </div>
                <div>
                  <span className="rp-field-label">City</span>
                  <input className="rp-input" type="text" placeholder="e.g. Jaipur" value={city} onChange={e => setCity(e.target.value)} />
                </div>
                <div>
                  <span className="rp-field-label">Reg Start Date</span>
                  <input className="rp-input" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                </div>
                <div>
                  <span className="rp-field-label">Reg End Date</span>
                  <input className="rp-input" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
              </div>
              <div className="rp-filter-actions">
                <button type="button" className="rp-btn rp-btn-outline" onClick={handleResetFilters} disabled={loading}>
                  <FaUndo /> Reset
                </button>
                <button type="submit" className="rp-btn rp-btn-primary" disabled={loading}>
                  <FaSearch /> Apply Filters
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ── Data Table ──────────────────────────────── */}
        <div className="rp-table-card">
          <div className="rp-table-header">
            <span className="rp-table-header-title"><FaChartPie /> Filtered Results</span>
            <span className="rp-total-badge">{total} record{total !== 1 ? "s" : ""}</span>
          </div>

          {loading ? (
            <div className="rp-loading-wrap">
              <div className="rp-spinner" />
              <p>Loading members…</p>
            </div>
          ) : users.length === 0 ? (
            <div className="rp-empty">
              <FaUsers />
              <p style={{ fontWeight: 600, color: "#4a5568", margin: 0 }}>No members match the filter criteria</p>
              <p style={{ fontSize: "0.85rem", margin: 0 }}>Try relaxing your filters or reset to see all records.</p>
            </div>
          ) : (
            <>
              <div style={{ overflowX: "auto" }}>
                <table className="rp-table">
                  <thead>
                    <tr>
                      <th>Matri ID</th>
                      <th>Name</th>
                      <th>Gender</th>
                      <th>Email / Mobile</th>
                      <th>Location</th>
                      <th>Subscription</th>
                      <th>Status</th>
                      <th style={{ textAlign: "center" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user._id}>
                        <td style={{ fontWeight: 700, color: "#59123B" }}>{user.martrId ? `RM-${user.martrId}` : "N/A"}</td>
                        <td>
                          <div style={{ fontWeight: 700, color: "#2d3748" }}>{user.firstName} {user.lastName}</div>
                          <small style={{ color: "#a0aec0", fontSize: "0.75rem" }}>{user.profilefor ? `For: ${user.profilefor}` : ""}</small>
                        </td>
                        <td>{user.gender || "N/A"}</td>
                        <td>
                          <div style={{ fontSize: "0.85rem" }}>{user.email}</div>
                          <small style={{ color: "#a0aec0" }}>{user.mobile}</small>
                        </td>
                        <td>
                          <div style={{ fontSize: "0.85rem" }}>{user.address?.city || "N/A"}</div>
                          <small style={{ color: "#a0aec0" }}>{user.address?.state || "N/A"}</small>
                        </td>
                        <td>
                          {user.isSubscribed
                            ? <span className="rp-badge rp-badge-premium">Premium</span>
                            : <span className="rp-badge rp-badge-free">Free</span>
                          }
                        </td>
                        <td>
                          {user.isbloacked
                            ? <span className="rp-badge rp-badge-danger">Blocked</span>
                            : !user.isApproved
                              ? <span className="rp-badge rp-badge-warning">Pending</span>
                              : <span className="rp-badge rp-badge-success">Approved</span>
                          }
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <Link to={`/Members/View-Members/${user._id}`} className="rp-view-btn" title="View Details">
                            <FaEye />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="rp-pagination">
                  <span className="rp-pag-info">Page {currentPage} of {pages} &nbsp;·&nbsp; {total} total records</span>
                  <div className="rp-pag-btns">
                    <button className="rp-pag-btn" onClick={() => fetchFilteredReports(currentPage - 1)} disabled={currentPage === 1}>‹ Prev</button>
                    {[...Array(Math.min(pages, 7)).keys()].map(i => {
                      const pg = i + 1;
                      return (
                        <button key={pg} className={`rp-pag-btn ${currentPage === pg ? "active" : ""}`} onClick={() => fetchFilteredReports(pg)}>{pg}</button>
                      );
                    })}
                    {pages > 7 && currentPage < pages && <span style={{ padding: "0 4px", color: "#a0aec0" }}>…</span>}
                    {pages > 7 && (
                      <button className={`rp-pag-btn ${currentPage === pages ? "active" : ""}`} onClick={() => fetchFilteredReports(pages)}>{pages}</button>
                    )}
                    <button className="rp-pag-btn" onClick={() => fetchFilteredReports(currentPage + 1)} disabled={currentPage === pages}>Next ›</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* ══════════════════════════════════════════════════
            FEEDBACK & REPORT INBOX SECTION
            ══════════════════════════════════════════════════ */}
        <div style={{ marginTop: 36, background: "#fff", borderRadius: 18, boxShadow: "0 4px 24px rgba(89,18,59,0.09)", overflow: "hidden" }}>
          {/* Toggle Header */}
          <div
            onClick={() => setFeedbackTab(p => !p)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "20px 28px", cursor: "pointer",
              background: feedbackTab ? "linear-gradient(135deg, #59123B, #3f0c2a)" : "#fff",
              transition: "all 0.3s ease",
              borderBottom: feedbackTab ? "none" : "1px solid #f0e5d3",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: feedbackTab ? "rgba(237,177,57,0.2)" : "linear-gradient(135deg, #59123B, #8B1D5A)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20,
              }}>
                📬
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "1.05rem", color: feedbackTab ? "#EDB139" : "#59123B" }}>
                  User Feedback &amp; Reports Inbox
                </div>
                <div style={{ fontSize: "0.78rem", color: feedbackTab ? "rgba(253,245,234,0.65)" : "#a0aec0", marginTop: 2 }}>
                  View user feedbacks, complaints, and bug reports
                </div>
              </div>
            </div>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: feedbackTab ? "rgba(237,177,57,0.15)" : "rgba(89,18,59,0.06)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, color: feedbackTab ? "#EDB139" : "#59123B",
              transition: "transform 0.3s ease",
              transform: feedbackTab ? "rotate(180deg)" : "rotate(0deg)",
            }}>▼</div>
          </div>

          {/* Inbox Content */}
          {feedbackTab && (
            <div style={{ padding: "24px 28px" }}>
              {/* Filters Bar */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20, alignItems: "center" }}>
                <input
                  type="text"
                  placeholder="🔍 Search subject, message, name..."
                  value={fbSearch}
                  onChange={e => setFbSearch(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && fetchFeedbacks(1)}
                  style={{ flex: "1 1 220px", padding: "9px 14px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: "0.83rem", outline: "none", fontFamily: "inherit" }}
                />
                <select value={fbType} onChange={e => setFbType(e.target.value)} style={{ padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: "0.83rem", outline: "none", cursor: "pointer" }}>
                  <option value="">All Types</option>
                  <option value="feedback">Feedback</option>
                  <option value="report">Report</option>
                  <option value="bug">Bug</option>
                  <option value="suggestion">Suggestion</option>
                </select>
                <select value={fbStatus} onChange={e => setFbStatus(e.target.value)} style={{ padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: "0.83rem", outline: "none", cursor: "pointer" }}>
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_review">In Review</option>
                  <option value="resolved">Resolved</option>
                  <option value="dismissed">Dismissed</option>
                </select>
                <button onClick={() => fetchFeedbacks(1)} style={{ padding: "9px 20px", background: "linear-gradient(135deg, #59123B, #3f0c2a)", color: "#EDB139", border: "1px solid #EDB139", borderRadius: 10, fontWeight: 600, fontSize: "0.83rem", cursor: "pointer" }}>
                  Apply
                </button>
                <button onClick={() => { setFbSearch(""); setFbStatus(""); setFbType(""); setTimeout(() => fetchFeedbacks(1), 50); }}
                  style={{ padding: "9px 16px", background: "#f7f8fc", color: "#59123B", border: "1.5px solid #e2e8f0", borderRadius: 10, fontWeight: 600, fontSize: "0.83rem", cursor: "pointer" }}>
                  Reset
                </button>
                <span style={{ marginLeft: "auto", fontSize: "0.8rem", color: "#a0aec0" }}>Total: <b style={{ color: "#59123B" }}>{fbTotal}</b></span>
              </div>

              {/* Table */}
              {fbLoading ? (
                <div style={{ textAlign: "center", padding: "48px 0", color: "#a0aec0" }}>
                  <div style={{ width: 36, height: 36, border: "3px solid #EDB139", borderTop: "3px solid transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
                  Loading...
                </div>
              ) : feedbacks.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 0" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
                  <div style={{ color: "#a0aec0", fontSize: "0.9rem" }}>No feedback/report received yet.</div>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.83rem" }}>
                    <thead>
                      <tr style={{ background: "#f7f8fc" }}>
                        {["Type", "Category", "Subject", "Submitted By", "Date", "Status", "Actions"].map(h => (
                          <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700, color: "#59123B", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.4px", borderBottom: "2px solid #f0e5d3", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {feedbacks.map((fb, i) => (
                        <tr key={fb._id} style={{ borderBottom: "1px solid #f0e5d3", background: i % 2 === 0 ? "#fff" : "#fdfaf6", transition: "background 0.2s" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#fff8f0"}
                          onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#fdfaf6"}
                        >
                          <td style={{ padding: "10px 14px" }}>
                            <span style={{ background: `${FB_TYPE_COLORS[fb.type] || "#aaa"}20`, color: FB_TYPE_COLORS[fb.type] || "#aaa", borderRadius: 6, padding: "3px 10px", fontWeight: 700, fontSize: "0.75rem", textTransform: "capitalize" }}>
                              {fb.type}
                            </span>
                          </td>
                          <td style={{ padding: "10px 14px", color: "#4a5568", maxWidth: 140 }}>
                            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>{fb.category}</span>
                          </td>
                          <td style={{ padding: "10px 14px", color: "#2d3748", fontWeight: 500, maxWidth: 180 }}>
                            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>{fb.subject}</span>
                          </td>
                          <td style={{ padding: "10px 14px", color: "#4a5568" }}>
                            <div style={{ fontWeight: 600 }}>{fb.submittedByName || "Anonymous"}</div>
                            {fb.submittedByEmail && <div style={{ fontSize: "0.72rem", color: "#a0aec0" }}>{fb.submittedByEmail}</div>}
                          </td>
                          <td style={{ padding: "10px 14px", color: "#a0aec0", whiteSpace: "nowrap" }}>
                            {new Date(fb.createdAt).toLocaleDateString("en-IN")}
                          </td>
                          <td style={{ padding: "10px 14px" }}>
                            <span style={{
                              background: `${FB_STATUS_COLORS[fb.status]}20`, color: FB_STATUS_COLORS[fb.status],
                              borderRadius: 6, padding: "3px 10px", fontWeight: 700, fontSize: "0.75rem",
                              textTransform: "capitalize", whiteSpace: "nowrap"
                            }}>
                              {fb.status?.replace("_", " ")}
                            </span>
                          </td>
                          <td style={{ padding: "10px 14px" }}>
                            <div style={{ display: "flex", gap: 6 }}>
                              <button onClick={() => setFbSelected(fb)}
                                style={{ padding: "5px 12px", background: "#59123B", color: "#EDB139", border: "none", borderRadius: 7, cursor: "pointer", fontWeight: 600, fontSize: "0.75rem" }}>
                                View
                              </button>
                              <button onClick={() => deleteFb(fb._id)}
                                style={{ padding: "5px 10px", background: "#fde8e8", color: "#e74c3c", border: "none", borderRadius: 7, cursor: "pointer", fontWeight: 600, fontSize: "0.75rem" }}>
                                Del
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination */}
                  {fbPages > 1 && (
                    <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
                      <button disabled={fbPage === 1} onClick={() => fetchFeedbacks(fbPage - 1)}
                        style={{ padding: "6px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", cursor: fbPage === 1 ? "not-allowed" : "pointer", color: "#59123B", fontWeight: 600 }}>
                        ‹ Prev
                      </button>
                      <span style={{ lineHeight: "32px", fontSize: "0.83rem", color: "#4a5568" }}>Page {fbPage} / {fbPages}</span>
                      <button disabled={fbPage === fbPages} onClick={() => fetchFeedbacks(fbPage + 1)}
                        style={{ padding: "6px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", cursor: fbPage === fbPages ? "not-allowed" : "pointer", color: "#59123B", fontWeight: 600 }}>
                        Next ›
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Feedback Detail Modal ── */}
      {fbSelected && (
        <>
          <div onClick={() => setFbSelected(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 2000 }} />
          <div style={{
            position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
            background: "#fff", borderRadius: 20, width: "min(560px, 95vw)",
            maxHeight: "88vh", overflowY: "auto", zIndex: 2100,
            boxShadow: "0 24px 60px rgba(89,18,59,0.25)", fontFamily: "Inter, sans-serif",
          }}>
            {/* Modal Header */}
            <div style={{ background: "linear-gradient(135deg, #59123B, #3f0c2a)", padding: "20px 24px", borderRadius: "18px 18px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ color: "#EDB139", fontWeight: 700, fontSize: "1rem" }}>Feedback / Report Detail</div>
                <div style={{ color: "rgba(253,245,234,0.6)", fontSize: "0.74rem", marginTop: 2 }}>
                  #{fbSelected._id?.slice(-8).toUpperCase()}
                </div>
              </div>
              <button onClick={() => setFbSelected(null)}
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(237,177,57,0.3)", borderRadius: "50%", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#EDB139", fontSize: 16 }}>
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "24px" }}>
              {/* Badges */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
                <span style={{ background: `${FB_TYPE_COLORS[fbSelected.type]}20`, color: FB_TYPE_COLORS[fbSelected.type], borderRadius: 8, padding: "4px 14px", fontWeight: 700, fontSize: "0.8rem", textTransform: "capitalize" }}>
                  {fbSelected.type}
                </span>
                <span style={{ background: `${FB_STATUS_COLORS[fbSelected.status]}20`, color: FB_STATUS_COLORS[fbSelected.status], borderRadius: 8, padding: "4px 14px", fontWeight: 700, fontSize: "0.8rem", textTransform: "capitalize" }}>
                  {fbSelected.status?.replace("_", " ")}
                </span>
                <span style={{ background: "#f7f8fc", color: "#4a5568", borderRadius: 8, padding: "4px 14px", fontWeight: 500, fontSize: "0.78rem" }}>
                  📁 {fbSelected.category}
                </span>
              </div>

              {/* Subject */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#59123B", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Subject</div>
                <div style={{ fontWeight: 600, color: "#2d3748", fontSize: "0.95rem" }}>{fbSelected.subject}</div>
              </div>

              {/* Message */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#59123B", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Message</div>
                <div style={{ background: "#f7f8fc", borderRadius: 10, padding: "14px 16px", color: "#4a5568", lineHeight: 1.65, fontSize: "0.87rem", border: "1px solid #f0e5d3" }}>
                  {fbSelected.message}
                </div>
              </div>

              {/* Submitted By */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
                <div style={{ background: "#f7f8fc", borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#59123B", textTransform: "uppercase", marginBottom: 4 }}>Submitted By</div>
                  <div style={{ fontWeight: 600, color: "#2d3748" }}>{fbSelected.submittedByName || "Anonymous"}</div>
                  {fbSelected.submittedByEmail && <div style={{ fontSize: "0.75rem", color: "#a0aec0" }}>{fbSelected.submittedByEmail}</div>}
                </div>
                <div style={{ background: "#f7f8fc", borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#59123B", textTransform: "uppercase", marginBottom: 4 }}>Date</div>
                  <div style={{ fontWeight: 500, color: "#2d3748", fontSize: "0.87rem" }}>
                    {new Date(fbSelected.createdAt).toLocaleString("en-IN")}
                  </div>
                </div>
              </div>

              {/* ── Image Attachment ── */}
              {fbSelected.image?.data ? (
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#59123B", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>
                    📸 Attached Screenshot
                  </div>
                  <div style={{ borderRadius: 12, overflow: "hidden", border: "1.5px solid #f0e5d3" }}>
                    <img
                      src={fbSelected.image.data}
                      alt="attachment"
                      style={{ width: "100%", maxHeight: 260, objectFit: "contain", background: "#f7f8fc", display: "block" }}
                    />
                    <div style={{ padding: "8px 12px", background: "#f7f8fc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#2d3748" }}>
                          {fbSelected.image.originalname || "image"}
                        </div>
                        {fbSelected.image.size && (
                          <div style={{ fontSize: "0.68rem", color: "#a0aec0" }}>
                            {(fbSelected.image.size / 1024).toFixed(0)} KB
                          </div>
                        )}
                      </div>
                      <a
                        href={fbSelected.image.data}
                        download={fbSelected.image.originalname || "attachment"}
                        style={{
                          padding: "5px 14px", background: "#59123B", color: "#EDB139",
                          borderRadius: 8, fontSize: "0.75rem", fontWeight: 700, textDecoration: "none",
                        }}
                      >
                        ⬇ Download
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#59123B", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>
                    📸 Attachment
                  </div>
                  <div style={{ color: "#a0aec0", fontSize: "0.82rem", fontStyle: "italic" }}>No image attached</div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ borderTop: "1.5px solid #f0e5d3", paddingTop: 16 }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#59123B", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>Status Update</div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {["pending", "in_review", "resolved", "dismissed"].map(st => (
                    <button
                      key={st}
                      onClick={() => updateFbStatus(fbSelected._id, st)}
                      disabled={fbSelected.status === st || fbUpdating}
                      style={{
                        padding: "8px 16px",
                        background: fbSelected.status === st ? FB_STATUS_COLORS[st] : `${FB_STATUS_COLORS[st]}18`,
                        color: fbSelected.status === st ? "#fff" : FB_STATUS_COLORS[st],
                        border: `2px solid ${FB_STATUS_COLORS[st]}`,
                        borderRadius: 10, fontWeight: 700, fontSize: "0.78rem", cursor: fbSelected.status === st ? "default" : "pointer",
                        textTransform: "capitalize", transition: "all 0.2s",
                        opacity: fbUpdating ? 0.6 : 1,
                      }}
                    >
                      {st.replace("_", " ")}
                    </button>
                  ))}
                  <button
                    onClick={() => deleteFb(fbSelected._id)}
                    style={{ padding: "8px 16px", marginLeft: "auto", background: "#fde8e8", color: "#e74c3c", border: "2px solid #e74c3c", borderRadius: 10, fontWeight: 700, fontSize: "0.78rem", cursor: "pointer" }}>
                    🗑 Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
