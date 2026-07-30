import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../Layout/AuthContext";

import {
  FaChevronLeft, FaChevronRight, FaTimes,
  FaExpand, FaCompress, FaImages,
  FaShieldAlt
} from "react-icons/fa";

const ViewImages = () => {
  const { fetchUserData, updateData } = useAuth();
  const { profileId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading]           = useState(true);
  const [profile, setProfile]           = useState(null);
  const [images, setImages]             = useState([]);
  const [userName, setUserName]         = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreen, setFullscreen]     = useState(false);
  const [thumbStart, setThumbStart]     = useState(0);
  const [reqLoading, setReqLoading]     = useState(false);

  const THUMB_VISIBLE = 5;

  /* ── Fetch data ── */
  const load = async () => {
    try {
      const res = await fetchUserData(`profile/view/images/${profileId}`);
      if (res) {
        setProfile(res);
        setImages(res?.filesId?.photos || []);
        setUserName(`${res.firstName || ""} ${res.lastName || ""}`.trim() || "Profile");
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    load();
  }, [profileId]);

  const handlePhotoReq = async () => {
    setReqLoading(true);
    try {
      await updateData("profile/photoRequest", profileId, true);
      // Optimistically show Pending immediately
      setProfile((prev) => ({ ...prev, photoRequestStatus: "pending" }));
      load();
    } catch (e) {
      console.error(e);
    } finally {
      setReqLoading(false);
    }
  };

  /* ── Keyboard navigation ── */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape")     navigate(-1);
      if (e.key === "f" || e.key === "F") setFullscreen(f => !f);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images.length]);

  const prev = useCallback(() => {
    setCurrentIndex(i => {
      const ni = i === 0 ? images.length - 1 : i - 1;
      syncThumbs(ni);
      return ni;
    });
  }, [images.length]);

  const next = useCallback(() => {
    setCurrentIndex(i => {
      const ni = i === images.length - 1 ? 0 : i + 1;
      syncThumbs(ni);
      return ni;
    });
  }, [images.length]);

  const goTo = (i) => {
    setCurrentIndex(i);
    syncThumbs(i);
  };

  const syncThumbs = (i) => {
    if (i < thumbStart) setThumbStart(i);
    else if (i >= thumbStart + THUMB_VISIBLE) setThumbStart(i - THUMB_VISIBLE + 1);
  };

  const handleClose = () => navigate(-1);

  /* ── Loading skeleton ── */
  if (loading) return (
    <div style={{
      position:"fixed", inset:0, zIndex:9999,
      background:"linear-gradient(135deg, #1a0a12 0%, #2d0e20 60%, #1a0814 100%)",
      display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:"16px",
    }}>
      <div style={{ width:"48px", height:"48px", borderRadius:"50%", border:"3px solid rgba(237,177,57,0.15)", borderTopColor:"var(--royal-gold)", animation:"spin 1s linear infinite" }}/>
      <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"0.9rem", letterSpacing:"1px" }}>Loading gallery…</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const isPrivatePhoto = profile?.filesId?.isPrivate && profile?.photoRequestStatus !== "accepted";
  const noPhotos       = images.length === 0 || isPrivatePhoto;
  const current        = images[currentIndex];

  return (
    <>
      <style>{`
        @keyframes fadeInScale {
          from { opacity:0; transform:scale(0.96); }
          to   { opacity:1; transform:scale(1); }
        }
        @keyframes slideUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .gallery-thumb {
          transition: all 0.25s ease;
          opacity: 0.55;
          border: 2px solid transparent;
          transform: scale(0.9);
          cursor: pointer;
        }
        .gallery-thumb:hover { opacity: 0.85; transform: scale(0.95); }
        .gallery-thumb.active {
          opacity: 1;
          transform: scale(1.05);
          border-color: var(--royal-gold);
          box-shadow: 0 0 0 3px rgba(237,177,57,0.25);
        }
        .nav-btn {
          background: rgba(255,255,255,0.1);
          border: 1.5px solid rgba(255,255,255,0.15);
          backdrop-filter: blur(10px);
          border-radius: 50%;
          width: 52px; height: 52px;
          display: flex; align-items: center; justify-content: center;
          color: white; cursor: pointer;
          transition: all 0.22s ease;
        }
        .nav-btn:hover {
          background: rgba(237,177,57,0.25);
          border-color: var(--royal-gold);
          transform: scale(1.1);
        }
        .nav-btn:disabled { opacity:0.25; cursor:default; transform:none; }
        .icon-btn {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          padding: 8px 14px;
          color: rgba(255,255,255,0.8);
          cursor: pointer;
          display: flex; align-items: center; gap:6px;
          font-size: 0.82rem; font-weight:600; letter-spacing:.4px;
          transition: all .2s ease;
        }
        .icon-btn:hover { background: rgba(237,177,57,0.18); border-color: rgba(237,177,57,0.4); color:#fff; }
        .close-btn {
          background: rgba(220,53,69,0.15);
          border: 1.5px solid rgba(220,53,69,0.3);
          border-radius: 50%;
          width: 42px; height: 42px;
          display:flex; align-items:center; justify-content:center;
          color: #ff6b6b; cursor: pointer;
          transition: all .22s ease;
        }
        .close-btn:hover { background: rgba(220,53,69,0.35); border-color: #dc3545; color: #fff; transform: scale(1.1); }
      `}</style>

      <div style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "linear-gradient(135deg, #120718 0%, #2a0d1c 50%, #120718 100%)",
        display: "flex", flexDirection: "column",
        animation: "fadeInScale 0.3s ease",
      }}>

        {/* ── TOP BAR ── */}
        <div style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"14px 24px",
          background:"rgba(0,0,0,0.35)",
          borderBottom:"1px solid rgba(237,177,57,0.12)",
          backdropFilter:"blur(20px)",
          flexShrink:0,
        }}>
          {/* Left: user info */}
          <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
            <div style={{
              width:"36px", height:"36px", borderRadius:"50%",
              background:"linear-gradient(135deg, var(--royal-maroon), var(--royal-gold))",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"0.9rem", fontWeight:700, color:"#fff",
            }}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ margin:0, fontFamily:"var(--font-heading)", fontSize:"1rem", fontWeight:600, color:"#fff", letterSpacing:".3px" }}>
                {userName}
              </p>
              <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                {profile?.isVerified && (
                  <>
                    <FaShieldAlt size={10} style={{ color:"var(--royal-gold)" }}/>
                    <span style={{ fontSize:"0.72rem", color:"rgba(237,177,57,0.8)", fontWeight:600 }}>Verified Profile</span>
                  </>
                )}
                {!noPhotos && (
                  <span style={{ fontSize:"0.72rem", color:"rgba(255,255,255,0.35)", marginLeft:"4px" }}>
                    · {images.length} photo{images.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Center: photo counter */}
          {!noPhotos && (
            <div style={{
              background:"rgba(237,177,57,0.12)", border:"1px solid rgba(237,177,57,0.25)",
              borderRadius:"20px", padding:"5px 16px",
              fontSize:"0.82rem", fontWeight:700, color:"var(--royal-gold)", letterSpacing:".5px",
            }}>
              <FaImages size={12} style={{ marginRight:"6px", verticalAlign:"middle" }}/>
              {currentIndex + 1} / {images.length}
            </div>
          )}

          {/* Right: actions + close */}
          <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
            {!noPhotos && (
              <>
                <button className="icon-btn" onClick={() => setFullscreen(f => !f)} title={fullscreen?"Exit Fullscreen":"Fullscreen"}>
                  {fullscreen ? <FaCompress size={13}/> : <FaExpand size={13}/>}
                  <span className="d-none d-md-inline">{fullscreen ? "Exit" : "Fullscreen"}</span>
                </button>
              </>
            )}
            <button className="close-btn" onClick={handleClose} title="Close (Esc)">
              <FaTimes size={16}/>
            </button>
          </div>
        </div>

        {/* ── MAIN IMAGE AREA ── */}
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden", padding: fullscreen ? "0" : "20px 70px" }}>

          {/* Left nav */}
          {!noPhotos && images.length > 1 && (
            <button className="nav-btn" onClick={prev} style={{ position:"absolute", left: fullscreen?"12px":"12px", zIndex:10 }}>
              <FaChevronLeft size={18}/>
            </button>
          )}

          {/* Image */}
          {noPhotos ? (
            <div style={{ textAlign:"center" }}>
              <div style={{
                width:"100px", height:"100px", borderRadius:"50%",
                background:"rgba(237,177,57,0.1)", border:"2px dashed rgba(237,177,57,0.3)",
                display:"flex", alignItems:"center", justifyContent:"center",
                margin:"0 auto 20px",
              }}>
                <FaImages size={36} style={{ color:"rgba(237,177,57,0.4)" }}/>
              </div>
              <p style={{ color:"rgba(255,255,255,0.7)", fontSize:"1.1rem", fontFamily:"var(--font-heading)", fontWeight:600 }}>
                {isPrivatePhoto ? "Photo on Request" : "No photos available"}
              </p>
              <p style={{ color:"rgba(255,255,255,0.4)", fontSize:"0.85rem", maxWidth:"320px", margin:"0 auto 16px" }}>
                {isPrivatePhoto
                  ? "This profile's photos are set to On Request. Request access from the user to view their photos."
                  : "This profile has no uploaded photos yet."}
              </p>
              {isPrivatePhoto && (
                <div style={{ marginBottom: "16px" }}>
                  {profile?.photoRequestStatus === "pending" ? (
                    <button
                      disabled
                      style={{
                        padding: "8px 20px", borderRadius: "20px",
                        background: "rgba(255,193,7,0.2)", color: "#ffc107",
                        border: "1px solid #ffc107", fontSize: "0.88rem", cursor: "not-allowed"
                      }}
                    >
                      Request Pending
                    </button>
                  ) : profile?.photoRequestStatus === "rejected" ? (
                    <button
                      onClick={handlePhotoReq}
                      style={{
                        padding: "8px 20px", borderRadius: "20px",
                        background: "var(--royal-maroon, #7B1A1A)", color: "#fff",
                        border: "1px solid var(--royal-gold, #d4af37)", fontSize: "0.88rem", cursor: "pointer"
                      }}
                    >
                      Resend Photo Request
                    </button>
                  ) : (
                    <button
                      onClick={handlePhotoReq}
                      disabled={reqLoading}
                      style={{
                        padding: "8px 20px", borderRadius: "20px",
                        background: reqLoading ? "rgba(123,26,26,0.6)" : "var(--royal-maroon, #7B1A1A)",
                        color: "#fff",
                        border: "1px solid var(--royal-gold, #d4af37)",
                        fontSize: "0.88rem",
                        cursor: reqLoading ? "not-allowed" : "pointer",
                        boxShadow: reqLoading ? "none" : "0 2px 10px rgba(0,0,0,0.4)",
                        display: "inline-flex", alignItems: "center", gap: "8px",
                        opacity: reqLoading ? 0.7 : 1,
                      }}
                    >
                      {reqLoading ? (
                        <>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" style={{ animation: "spin 0.8s linear infinite", flexShrink: 0 }}>
                            <path d="M12 2a10 10 0 0 1 10 10" />
                          </svg>
                          Sending…
                        </>
                      ) : "Request Photo"}
                    </button>
                  )}
                </div>
              )}
              <button
                onClick={handleClose}
                style={{
                  marginTop:"8px", padding:"10px 28px", borderRadius:"30px",
                  background:"linear-gradient(135deg, var(--royal-maroon), var(--royal-maroon-dark))",
                  color:"#fff", border:"none", cursor:"pointer", fontWeight:600,
                }}
              >Go Back</button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity:0, x: 40 }}
                animate={{ opacity:1, x: 0 }}
                exit={{ opacity:0, x:-40 }}
                transition={{ duration:0.28, ease:"easeInOut" }}
                style={{
                  width:"100%", height:"100%",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  position:"relative",
                }}
              >
                <img
                  src={current?.url}
                  alt={`Photo ${currentIndex + 1}`}
                  style={{
                    maxWidth:"100%",
                    maxHeight: fullscreen ? "100vh" : "calc(100vh - 200px)",
                    objectFit:"contain",
                    borderRadius: fullscreen ? "0" : "16px",
                    boxShadow: fullscreen ? "none" : "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(237,177,57,0.08)",
                    transition:"border-radius .3s, box-shadow .3s",
                    userSelect:"none",
                  }}
                  draggable={false}
                />
                {/* Subtle gradient overlay at bottom for index label */}
                {!fullscreen && (
                  <div style={{
                    position:"absolute", bottom:0, left:0, right:0,
                    height:"60px",
                    background:"linear-gradient(transparent, rgba(0,0,0,0.4))",
                    borderRadius:"0 0 16px 16px",
                    pointerEvents:"none",
                  }}/>
                )}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Right nav */}
          {!noPhotos && images.length > 1 && (
            <button className="nav-btn" onClick={next} style={{ position:"absolute", right: fullscreen?"12px":"12px", zIndex:10 }}>
              <FaChevronRight size={18}/>
            </button>
          )}
        </div>

        {/* ── THUMBNAIL STRIP ── */}
        {!noPhotos && images.length > 1 && !fullscreen && (
          <div style={{
            flexShrink:0,
            background:"rgba(0,0,0,0.4)",
            borderTop:"1px solid rgba(237,177,57,0.1)",
            backdropFilter:"blur(20px)",
            padding:"12px 16px",
            animation:"slideUp .3s ease",
          }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"10px", overflowX:"auto" }}>
              {images.slice(thumbStart, thumbStart + THUMB_VISIBLE + 2).map((img, relIdx) => {
                const absIdx = thumbStart + relIdx;
                if (absIdx >= images.length) return null;
                return (
                  <div
                    key={absIdx}
                    className={`gallery-thumb${currentIndex === absIdx ? " active" : ""}`}
                    onClick={() => goTo(absIdx)}
                    style={{ flexShrink:0 }}
                  >
                    <img
                      src={img.url}
                      alt={`Thumb ${absIdx + 1}`}
                      style={{
                        width:"64px", height:"64px",
                        objectFit:"cover", borderRadius:"10px",
                        display:"block",
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Dot indicators */}
            <div style={{ display:"flex", justifyContent:"center", gap:"6px", marginTop:"10px" }}>
              {images.map((_, i) => (
                <div
                  key={i}
                  onClick={() => goTo(i)}
                  style={{
                    width: currentIndex === i ? "20px" : "7px",
                    height:"7px",
                    borderRadius:"4px",
                    background: currentIndex === i ? "var(--royal-gold)" : "rgba(255,255,255,0.2)",
                    cursor:"pointer",
                    transition:"all .3s ease",
                    flexShrink:0,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── KEYBOARD HINT ── */}
        {!fullscreen && !noPhotos && (
          <div style={{
            position:"absolute", bottom: images.length > 1 ? "125px" : "12px",
            left:"50%", transform:"translateX(-50%)",
            background:"rgba(0,0,0,0.45)", backdropFilter:"blur(8px)",
            borderRadius:"20px", padding:"4px 14px",
            fontSize:"0.7rem", color:"rgba(255,255,255,0.3)",
            letterSpacing:".4px", whiteSpace:"nowrap", pointerEvents:"none",
          }}>
            ← → arrow keys · F fullscreen · Esc close
          </div>
        )}
      </div>
    </>
  );
};

export default ViewImages;
