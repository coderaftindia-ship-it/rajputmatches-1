import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaSearch, FaFilter, FaRedo, FaTrash, FaEye, FaCommentAlt, FaExclamationTriangle, FaBug, FaLightbulb, FaEnvelope } from "react-icons/fa";

const Base_url = (process.env.REACT_APP_BASE_URL || "http://localhost:5000/admin").replace(/\/$/, "");

const FB_STATUS_COLORS = { pending: "#e67e22", in_review: "#3498db", resolved: "#27ae60", dismissed: "#7f8c8d" };
const FB_TYPE_COLORS = { feedback: "#EDB139", report: "#e74c3c", bug: "#8B1D5A", suggestion: "#27ae60" };

const UserReports = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [fbTotal, setFbTotal] = useState(0);
  const [fbPages, setFbPages] = useState(1);
  const [fbPage, setFbPage] = useState(1);
  const [fbLoading, setFbLoading] = useState(false);
  const [fbSearch, setFbSearch] = useState("");
  const [fbStatus, setFbStatus] = useState("");
  const [fbType, setFbType] = useState("");
  const [fbSelected, setFbSelected] = useState(null);
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
    } catch (err) {
      toast.error("Error loading user reports & feedback.");
    } finally {
      setFbLoading(false);
    }
  }, [fbSearch, fbStatus, fbType]);

  useEffect(() => {
    fetchFeedbacks(1);
  }, [fetchFeedbacks]);

  const updateFbStatus = async (id, status) => {
    setFbUpdating(true);
    try {
      const token = localStorage.getItem("adminAuthToken");
      await axios.patch(`${Base_url}/feedback/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Report status updated successfully!");
      fetchFeedbacks(fbPage);
      if (fbSelected?._id === id) setFbSelected(p => ({ ...p, status }));
    } catch {
      toast.error("Status update failed");
    } finally {
      setFbUpdating(false);
    }
  };

  const deleteFb = async (id) => {
    if (!window.confirm("Are you sure you want to delete this report/feedback entry?")) return;
    try {
      const token = localStorage.getItem("adminAuthToken");
      await axios.delete(`${Base_url}/feedback/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Report entry deleted successfully!");
      setFbSelected(null);
      fetchFeedbacks(fbPage);
    } catch {
      toast.error("Delete action failed");
    }
  };

  return (
    <div className="main-content">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');
        .ur-card {
          background: #FFFDF7;
          border: 1px solid rgba(237,177,57,0.25);
          border-radius: 18px;
          box-shadow: 0 8px 30px rgba(89,18,59,0.07);
          overflow: hidden;
          margin-bottom: 30px;
        }
        .ur-header {
          background: linear-gradient(135deg, #59123B 0%, #3f0c2a 100%);
          padding: 24px 28px;
          color: white;
          display: flex;
          align-items: center;
          gap: 16px;
          border-bottom: 3px solid #D4AF37;
        }
        .ur-icon-badge {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: rgba(212,175,55,0.2);
          border: 2px solid #D4AF37;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          color: #D4AF37;
        }
        .ur-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: #EDB139;
          margin: 0;
        }
        .ur-sub {
          font-size: 0.85rem;
          color: rgba(253,245,234,0.75);
          margin-top: 2px;
        }
        .ur-body {
          padding: 24px 28px;
        }
        .ur-filter-input {
          padding: 9px 14px;
          border: 1.5px solid rgba(89,18,59,0.15);
          border-radius: 10px;
          font-size: 0.85rem;
          outline: none;
          background: white;
          color: #3d1a2b;
        }
        .ur-filter-input:focus {
          border-color: #59123B;
        }
        .ur-btn-apply {
          padding: 9px 20px;
          background: linear-gradient(135deg, #59123B, #3f0c2a);
          color: #EDB139;
          border: 1px solid #EDB139;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .ur-btn-apply:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(89,18,59,0.2);
        }
        .ur-btn-reset {
          padding: 9px 16px;
          background: #faf7f8;
          color: #59123B;
          border: 1.5px solid #f0e5d3;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
        }
        .ur-table-th {
          padding: 12px 16px;
          text-align: left;
          font-weight: 700;
          color: #59123B;
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 2px solid #f0e5d3;
          white-space: nowrap;
        }
        .ur-table-td {
          padding: 14px 16px;
          font-size: 0.88rem;
          border-bottom: 1px solid #f0e5d3;
          vertical-align: middle;
        }
      `}</style>

      <div className="ur-card">
        {/* Header */}
        <div className="ur-header">
          <div className="ur-icon-badge">
            <FaCommentAlt />
          </div>
          <div>
            <h3 className="ur-title">User Feedback &amp; Reports Inbox</h3>
            <div className="ur-sub">View user feedbacks, complaints, and bug reports</div>
          </div>
        </div>

        {/* Body */}
        <div className="ur-body">
          {/* Filter Bar */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24, alignItems: "center" }}>
            <div style={{ flex: "1 1 260px", position: "relative" }}>
              <input
                type="text"
                placeholder="Search subject, message, name..."
                value={fbSearch}
                onChange={e => setFbSearch(e.target.value)}
                onKeyDown={e => e.key === "Enter" && fetchFeedbacks(1)}
                className="ur-filter-input"
                style={{ width: "100%" }}
              />
            </div>
            <select
              value={fbType}
              onChange={e => setFbType(e.target.value)}
              className="ur-filter-input"
              style={{ cursor: "pointer" }}
            >
              <option value="">All Types</option>
              <option value="feedback">Feedback</option>
              <option value="report">Report</option>
              <option value="bug">Bug</option>
              <option value="suggestion">Suggestion</option>
            </select>

            <select
              value={fbStatus}
              onChange={e => setFbStatus(e.target.value)}
              className="ur-filter-input"
              style={{ cursor: "pointer" }}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_review">In Review</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </select>

            <button onClick={() => fetchFeedbacks(1)} className="ur-btn-apply">
              Apply
            </button>
            <button
              onClick={() => { setFbSearch(""); setFbStatus(""); setFbType(""); setTimeout(() => fetchFeedbacks(1), 50); }}
              className="ur-btn-reset"
            >
              Reset
            </button>
            <span style={{ marginLeft: "auto", fontSize: "0.85rem", color: "#888", fontWeight: 600 }}>
              Total Reports: <b style={{ color: "#59123B" }}>{fbTotal}</b>
            </span>
          </div>

          {/* Table */}
          {fbLoading ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#888" }}>
              <div className="spinner-border text-royal mb-2" role="status" style={{ color: "#59123B" }} />
              <div>Loading Reports &amp; Feedbacks...</div>
            </div>
          ) : feedbacks.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", background: "#faf7f8", borderRadius: 14, border: "1.5px dashed #f0e5d3" }}>
              <div style={{ fontSize: 44, marginBottom: 10 }}>📭</div>
              <h5 style={{ color: "#59123B", fontWeight: 700 }}>No feedback or reports received yet</h5>
              <p className="text-muted small mb-0">When users send feedback or report profiles, they will show up here.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#faf7f8" }}>
                    {["TYPE", "CATEGORY", "SUBJECT", "SUBMITTED BY", "DATE", "STATUS", "ACTIONS"].map(h => (
                      <th key={h} className="ur-table-th">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {feedbacks.map((fb, i) => (
                    <tr
                      key={fb._id}
                      style={{ background: i % 2 === 0 ? "#fff" : "#fdfaf7" }}
                    >
                      <td className="ur-table-td">
                        <span style={{
                          background: `${FB_TYPE_COLORS[fb.type] || "#aaa"}18`,
                          color: FB_TYPE_COLORS[fb.type] || "#aaa",
                          border: `1px solid ${FB_TYPE_COLORS[fb.type] || "#aaa"}40`,
                          borderRadius: 8, padding: "4px 12px", fontWeight: 700, fontSize: "0.76rem", textTransform: "uppercase"
                        }}>
                          {fb.type}
                        </span>
                      </td>
                      <td className="ur-table-td" style={{ color: "#555", fontWeight: 600 }}>
                        {fb.category || "General"}
                      </td>
                      <td className="ur-table-td" style={{ fontWeight: 700, color: "#3d1a2b" }}>
                        {fb.subject || "N/A"}
                      </td>
                      <td className="ur-table-td">
                        <div style={{ fontWeight: 700, color: "#59123B" }}>{fb.submittedByName || "Anonymous"}</div>
                        {fb.submittedByEmail && <div style={{ fontSize: "0.75rem", color: "#888" }}>{fb.submittedByEmail}</div>}
                      </td>
                      <td className="ur-table-td" style={{ color: "#666", whiteSpace: "nowrap" }}>
                        {new Date(fb.createdAt).toLocaleDateString("en-IN")}
                      </td>
                      <td className="ur-table-td">
                        <span style={{
                          background: `${FB_STATUS_COLORS[fb.status] || "#aaa"}18`,
                          color: FB_STATUS_COLORS[fb.status] || "#aaa",
                          border: `1px solid ${FB_STATUS_COLORS[fb.status] || "#aaa"}40`,
                          borderRadius: 20, padding: "4px 14px", fontWeight: 700, fontSize: "0.76rem", textTransform: "capitalize", whiteSpace: "nowrap"
                        }}>
                          {fb.status?.replace("_", " ") || "Pending"}
                        </span>
                      </td>
                      <td className="ur-table-td">
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            onClick={() => setFbSelected(fb)}
                            style={{ padding: "6px 14px", background: "#59123B", color: "#EDB139", border: "1px solid #EDB139", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: "0.78rem" }}
                          >
                            <FaEye className="me-1" /> View
                          </button>
                          <button
                            onClick={() => deleteFb(fb._id)}
                            style={{ padding: "6px 12px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: "0.78rem" }}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {fbPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }}>
                  <button
                    disabled={fbPage === 1}
                    onClick={() => fetchFeedbacks(fbPage - 1)}
                    style={{ padding: "8px 16px", borderRadius: 10, border: "1.5px solid #f0e5d3", background: "#fff", cursor: fbPage === 1 ? "not-allowed" : "pointer", color: "#59123B", fontWeight: 700 }}
                  >
                    ‹ Prev
                  </button>
                  <span style={{ lineHeight: "36px", fontSize: "0.88rem", color: "#555", fontWeight: 600 }}>Page {fbPage} of {fbPages}</span>
                  <button
                    disabled={fbPage === fbPages}
                    onClick={() => fetchFeedbacks(fbPage + 1)}
                    style={{ padding: "8px 16px", borderRadius: 10, border: "1.5px solid #f0e5d3", background: "#fff", cursor: fbPage === fbPages ? "not-allowed" : "pointer", color: "#59123B", fontWeight: 700 }}
                  >
                    Next ›
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {fbSelected && (
        <>
          <div onClick={() => setFbSelected(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 2000 }} />
          <div style={{
            position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
            background: "#fff", borderRadius: 20, width: "min(580px, 95vw)",
            maxHeight: "88vh", overflowY: "auto", zIndex: 2100,
            boxShadow: "0 24px 60px rgba(89,18,59,0.25)", fontFamily: "Inter, sans-serif",
          }}>
            {/* Modal Header */}
            <div style={{ background: "linear-gradient(135deg, #59123B, #3f0c2a)", padding: "20px 24px", borderRadius: "18px 18px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ color: "#EDB139", fontWeight: 700, fontSize: "1.05rem" }}>Report &amp; Feedback Details</div>
                <div style={{ color: "rgba(253,245,234,0.65)", fontSize: "0.76rem", marginTop: 2 }}>
                  Ticket ID: #{fbSelected._id?.slice(-8).toUpperCase()}
                </div>
              </div>
              <button
                onClick={() => setFbSelected(null)}
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(237,177,57,0.4)", borderRadius: "50%", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#EDB139", fontSize: 16 }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "24px" }}>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
                <span style={{ background: `${FB_TYPE_COLORS[fbSelected.type]}20`, color: FB_TYPE_COLORS[fbSelected.type], borderRadius: 8, padding: "4px 14px", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" }}>
                  {fbSelected.type}
                </span>
                <span style={{ background: `${FB_STATUS_COLORS[fbSelected.status]}20`, color: FB_STATUS_COLORS[fbSelected.status], borderRadius: 8, padding: "4px 14px", fontWeight: 700, fontSize: "0.8rem", textTransform: "capitalize" }}>
                  {fbSelected.status?.replace("_", " ")}
                </span>
              </div>

              <div style={{ background: "#faf7f8", padding: "16px", borderRadius: 12, border: "1px solid #f0e5d3", marginBottom: 20 }}>
                <div style={{ fontSize: "0.75rem", color: "#888", fontWeight: 700, textTransform: "uppercase" }}>Subject</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#59123B", marginTop: 4 }}>{fbSelected.subject}</div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: "0.75rem", color: "#888", fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>Message Content</div>
                <div style={{ background: "#fff", border: "1.5px solid #f0e5d3", padding: "16px", borderRadius: 12, fontSize: "0.92rem", color: "#3d1a2b", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
                  {fbSelected.message || "No detailed text content provided."}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24, background: "#faf7f8", padding: 14, borderRadius: 12 }}>
                <div>
                  <div style={{ fontSize: "0.72rem", color: "#888", fontWeight: 700 }}>SUBMITTED BY</div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#3d1a2b" }}>{fbSelected.submittedByName || "Anonymous"}</div>
                  {fbSelected.submittedByEmail && <div style={{ fontSize: "0.75rem", color: "#666" }}>{fbSelected.submittedByEmail}</div>}
                </div>
                <div>
                  <div style={{ fontSize: "0.72rem", color: "#888", fontWeight: 700 }}>DATE &amp; TIME</div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#3d1a2b" }}>
                    {new Date(fbSelected.createdAt).toLocaleString("en-IN")}
                  </div>
                </div>
              </div>

              {/* Status Change Controls */}
              <div style={{ borderTop: "1.5px dashed #f0e5d3", paddingTop: 18 }}>
                <div style={{ fontSize: "0.78rem", color: "#888", fontWeight: 700, marginBottom: 8 }}>CHANGE REPORT STATUS:</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["pending", "in_review", "resolved", "dismissed"].map(st => (
                    <button
                      key={st}
                      disabled={fbUpdating || fbSelected.status === st}
                      onClick={() => updateFbStatus(fbSelected._id, st)}
                      style={{
                        padding: "8px 14px",
                        borderRadius: 8,
                        border: "none",
                        background: fbSelected.status === st ? FB_STATUS_COLORS[st] : "#f0e5d3",
                        color: fbSelected.status === st ? "#fff" : "#59123B",
                        fontWeight: 700,
                        fontSize: "0.78rem",
                        cursor: fbSelected.status === st ? "default" : "pointer",
                        textTransform: "capitalize"
                      }}
                    >
                      {st.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserReports;
