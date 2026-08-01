import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { Link } from "react-router-dom";
import { FaPlus, FaEdit, FaToggleOn, FaToggleOff, FaHeart, FaSearch, FaBook, FaEye, FaEyeSlash } from "react-icons/fa";

const SuccessStories = () => {
  const Base_url = (process.env.REACT_APP_BASE_URL || "http://localhost:5000/admin").replace(/\/$/, "");
  // Derive backend origin (e.g. http://localhost:5000) from Base_url
  const backendOrigin = Base_url ? Base_url.replace(/\/admin.*$/, "") : "";

  const getImageSrc = (image) => {
    if (!image) return "";
    if (typeof image !== "string") return "";
    if (image.startsWith("data:") || image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }
    const cleanPath = image.replace(/\\/g, "/");
    const formattedPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
    return `${backendOrigin}${formattedPath}`;
  };

  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [togglingId, setTogglingId] = useState(null);
  const { fetchUserData, updateData, setStoryId } = useAuth();

  const fetchData = async () => {
    const route = "getallstory";
    try {
      const data = await fetchUserData(route);
      setStories(data?.stories || []);
    } catch (error) {
      console.error("Error fetching stories:", error);
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleStatus = async (storyId) => {
    setTogglingId(storyId);
    try {
      const route = `change-status`;
      await updateData(route, storyId);
      fetchData();
    } catch (error) {
      console.error("Error toggling status:", error);
    } finally {
      setTogglingId(null);
    }
  };

  const handleEdit = (storyId) => {
    setStoryId(storyId);
  };

  const filteredStories = stories.filter(
    (story) =>
      story?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story?.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const enabledCount = stories.filter((s) => s.status === true).length;
  const disabledCount = stories.filter((s) => s.status !== true).length;

  return (
    <div className="main-content">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

        .ss-page {
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          background: #f7f8fc;
          padding: 28px 24px;
        }
        .ss-hero {
          background: linear-gradient(135deg, #59123B 0%, #8B1D5A 50%, #3f0c2a 100%);
          border-radius: 20px;
          padding: 32px 36px;
          margin-bottom: 28px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(89,18,59,0.25);
        }
        .ss-hero::before {
          content: '';
          position: absolute;
          top: -40px; right: -40px;
          width: 200px; height: 200px;
          border-radius: 50%;
          background: rgba(237,177,57,0.12);
        }
        .ss-hero::after {
          content: '';
          position: absolute;
          bottom: -60px; left: -30px;
          width: 250px; height: 250px;
          border-radius: 50%;
          background: rgba(237,177,57,0.07);
        }
        .ss-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 700;
          color: #EDB139;
          margin: 0 0 6px 0;
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
          z-index: 1;
        }
        .ss-hero-sub {
          color: rgba(255,255,255,0.7);
          font-size: 0.95rem;
          margin: 0;
          position: relative;
          z-index: 1;
        }
        .ss-heart-icon {
          color: #EDB139;
          animation: heartPulse 1.8s ease-in-out infinite;
        }
        @keyframes heartPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.18); }
        }

        /* Stats row */
        .ss-stats-row {
          display: flex;
          gap: 16px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }
        .ss-stat-card {
          flex: 1;
          min-width: 150px;
          background: #fff;
          border-radius: 16px;
          padding: 20px 24px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          display: flex;
          align-items: center;
          gap: 16px;
          border-left: 5px solid transparent;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .ss-stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.10);
        }
        .ss-stat-card.total { border-left-color: #8B1D5A; }
        .ss-stat-card.enabled { border-left-color: #28a745; }
        .ss-stat-card.disabled { border-left-color: #dc3545; }
        .ss-stat-icon {
          width: 50px; height: 50px;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.3rem;
        }
        .ss-stat-card.total .ss-stat-icon { background: #faf0f6; color: #8B1D5A; }
        .ss-stat-card.enabled .ss-stat-icon { background: #f0fff4; color: #28a745; }
        .ss-stat-card.disabled .ss-stat-icon { background: #fff5f5; color: #dc3545; }
        .ss-stat-num {
          font-size: 1.9rem;
          font-weight: 700;
          color: #2d3748;
          line-height: 1;
        }
        .ss-stat-label {
          font-size: 0.82rem;
          color: #718096;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Toolbar */
        .ss-toolbar {
          background: #fff;
          border-radius: 16px;
          padding: 18px 22px;
          margin-bottom: 24px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          flex-wrap: wrap;
        }
        .ss-search-wrap {
          position: relative;
          flex: 1;
          min-width: 220px;
          max-width: 380px;
        }
        .ss-search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #a0aec0;
          font-size: 0.9rem;
          pointer-events: none;
        }
        .ss-search-input {
          width: 100%;
          padding: 11px 14px 11px 40px;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          font-size: 0.9rem;
          font-family: 'Inter', sans-serif;
          color: #2d3748;
          background: #f7f8fc;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
        }
        .ss-search-input:focus {
          border-color: #8B1D5A;
          box-shadow: 0 0 0 3px rgba(139,29,90,0.12);
          background: #fff;
        }
        .ss-add-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #59123B, #8B1D5A);
          color: #fff;
          border: none;
          padding: 11px 22px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.92rem;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          text-decoration: none;
          box-shadow: 0 4px 15px rgba(89,18,59,0.3);
          transition: all 0.2s;
          white-space: nowrap;
        }
        .ss-add-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(89,18,59,0.4);
          color: #EDB139;
          text-decoration: none;
        }
        .ss-count-badge {
          background: #f7f8fc;
          border: 1.5px solid #e2e8f0;
          border-radius: 20px;
          padding: 6px 14px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #4a5568;
          white-space: nowrap;
        }

        /* Cards grid */
        .ss-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }
        .ss-card {
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 18px rgba(0,0,0,0.07);
          border: 1.5px solid #f0f0f6;
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
        }
        .ss-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 18px 40px rgba(89,18,59,0.14);
          border-color: #EDB139;
        }
        .ss-card-img-wrap {
          position: relative;
          height: 200px;
          overflow: hidden;
        }
        .ss-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .ss-card:hover .ss-card-img {
          transform: scale(1.07);
        }
        .ss-card-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(63,12,42,0.7) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .ss-card:hover .ss-card-img-overlay { opacity: 1; }
        .ss-status-pill {
          position: absolute;
          top: 12px; right: 12px;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.3px;
          backdrop-filter: blur(6px);
        }
        .ss-status-pill.enabled {
          background: rgba(40,167,69,0.18);
          border: 1px solid rgba(40,167,69,0.5);
          color: #1d8f3d;
        }
        .ss-status-pill.disabled {
          background: rgba(220,53,69,0.18);
          border: 1px solid rgba(220,53,69,0.5);
          color: #b02a37;
        }
        .ss-card-body {
          padding: 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .ss-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.12rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 10px;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .ss-card-desc {
          font-size: 0.87rem;
          color: #718096;
          line-height: 1.65;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 18px;
        }
        .ss-card-actions {
          display: flex;
          gap: 10px;
          border-top: 1px solid #f0f0f6;
          padding-top: 16px;
          margin-top: auto;
        }
        .ss-btn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 9px 12px;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
          text-decoration: none;
        }
        .ss-btn-edit {
          background: #faf0f6;
          color: #8B1D5A;
          border: 1.5px solid #e8c9da;
        }
        .ss-btn-edit:hover {
          background: #8B1D5A;
          color: #fff;
          text-decoration: none;
          border-color: #8B1D5A;
        }
        .ss-btn-enable {
          background: #f0fff4;
          color: #28a745;
          border: 1.5px solid #c3e6cb;
        }
        .ss-btn-enable:hover {
          background: #28a745;
          color: #fff;
          border-color: #28a745;
        }
        .ss-btn-disable {
          background: #fff5f5;
          color: #dc3545;
          border: 1.5px solid #f5c6cb;
        }
        .ss-btn-disable:hover {
          background: #dc3545;
          color: #fff;
          border-color: #dc3545;
        }
        .ss-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Loading */
        .ss-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          gap: 18px;
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }
        .ss-spinner {
          width: 48px; height: 48px;
          border: 4px solid #faf0f6;
          border-top-color: #8B1D5A;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Empty state */
        .ss-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          gap: 16px;
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          text-align: center;
        }
        .ss-empty-icon {
          font-size: 4rem;
          color: #e2d0d8;
          animation: heartPulse 2s ease-in-out infinite;
        }
        .ss-empty-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: #4a5568;
          margin: 0;
        }
        .ss-empty-sub {
          font-size: 0.9rem;
          color: #a0aec0;
          margin: 0;
        }
      `}</style>

      <div className="ss-page">
        {/* Hero Header */}
        <div className="ss-hero">
          <h2 className="ss-hero-title">
            <FaHeart className="ss-heart-icon" />
            Success Stories
          </h2>
          <p className="ss-hero-sub">Manage and showcase beautiful love stories from your community</p>
        </div>

        {/* Stats */}
        <div className="ss-stats-row">
          <div className="ss-stat-card total">
            <div className="ss-stat-icon"><FaBook /></div>
            <div>
              <div className="ss-stat-num">{stories.length}</div>
              <div className="ss-stat-label">Total Stories</div>
            </div>
          </div>
          <div className="ss-stat-card enabled">
            <div className="ss-stat-icon"><FaEye /></div>
            <div>
              <div className="ss-stat-num">{enabledCount}</div>
              <div className="ss-stat-label">Published</div>
            </div>
          </div>
          <div className="ss-stat-card disabled">
            <div className="ss-stat-icon"><FaEyeSlash /></div>
            <div>
              <div className="ss-stat-num">{disabledCount}</div>
              <div className="ss-stat-label">Hidden</div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="ss-toolbar">
          <div className="ss-search-wrap">
            <FaSearch className="ss-search-icon" />
            <input
              type="text"
              className="ss-search-input"
              placeholder="Search by title or description…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span className="ss-count-badge">
              {filteredStories.length} result{filteredStories.length !== 1 ? "s" : ""}
            </span>
            <Link to="/Success/Add-Story" className="ss-add-btn">
              <FaPlus />
              Add Story
            </Link>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="ss-loading">
            <div className="ss-spinner" />
            <p style={{ color: "#8B1D5A", fontWeight: 600, margin: 0 }}>Loading stories…</p>
          </div>
        ) : filteredStories.length === 0 ? (
          <div className="ss-empty">
            <FaHeart className="ss-empty-icon" />
            <p className="ss-empty-title">
              {searchTerm ? "No stories match your search" : "No success stories yet"}
            </p>
            <p className="ss-empty-sub">
              {searchTerm
                ? "Try different keywords"
                : "Click 'Add Story' to share the first success story!"}
            </p>
            {!searchTerm && (
              <Link to="/Success/Add-Story" className="ss-add-btn" style={{ marginTop: 8 }}>
                <FaPlus /> Add Your First Story
              </Link>
            )}
          </div>
        ) : (
          <div className="ss-grid">
            {filteredStories.map((story) => (
              <div key={story._id} className="ss-card">
                <div className="ss-card-img-wrap">
                  <img
                    src={getImageSrc(story.image)}
                    className="ss-card-img"
                    alt={story.title}
                    onError={(e) => { e.target.style.background = '#f0e0ea'; e.target.style.display = 'block'; }}
                  />
                  <div className="ss-card-img-overlay" />
                  <span className={`ss-status-pill ${story.status === true ? "enabled" : "disabled"}`}>
                    {story.status === true ? (
                      <><FaToggleOn /> Published</>
                    ) : (
                      <><FaToggleOff /> Hidden</>
                    )}
                  </span>
                </div>
                <div className="ss-card-body">
                  <h5 className="ss-card-title">{story.title}</h5>
                  <p className="ss-card-desc">{story.description}</p>
                  <div className="ss-card-actions">
                    <Link
                      to="/Success/Edit-Story"
                      className="ss-btn ss-btn-edit"
                      onClick={() => handleEdit(story._id)}
                    >
                      <FaEdit /> Edit
                    </Link>
                    <button
                      className={`ss-btn ${story.status === true ? "ss-btn-disable" : "ss-btn-enable"}`}
                      onClick={() => toggleStatus(story._id)}
                      disabled={togglingId === story._id}
                    >
                      {togglingId === story._id ? (
                        <>…</>
                      ) : story.status === true ? (
                        <><FaToggleOff /> Disable</>
                      ) : (
                        <><FaToggleOn /> Enable</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessStories;
