import React, { useRef, useState, useEffect } from "react";
import home1Video from "../../assets/images/home1_video.mp4";

const VideoSection = () => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {});
  }, []);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        lineHeight: 0,
        overflow: "hidden",
        background: "#0a0006",
      }}
    >
      {/* Full-width video */}
      <video
        ref={videoRef}
        src={home1Video}
        autoPlay
        loop
        playsInline
        muted
        style={{
          width: "100%",
          height: "420px",
          display: "block",
          objectFit: "cover",
        }}
      />

      {/* Subtle gradient overlay at bottom so mute button is visible */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "90px",
          background:
            "linear-gradient(to top, rgba(10,0,6,0.60) 0%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Mute / Unmute button */}
      <button
        onClick={toggleMute}
        title={isMuted ? "Unmute" : "Mute"}
        aria-label={isMuted ? "Unmute video" : "Mute video"}
        style={{
          position: "absolute",
          bottom: "22px",
          right: "28px",
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          border: "2px solid rgba(237,177,57,0.85)",
          background: "rgba(63,12,42,0.78)",
          color: "#edb139",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          transition: "transform 0.2s ease, background 0.2s ease",
          zIndex: 10,
          boxShadow: "0 4px 18px rgba(0,0,0,0.45)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(237,177,57,0.92)";
          e.currentTarget.style.color = "#3f0c2a";
          e.currentTarget.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(63,12,42,0.78)";
          e.currentTarget.style.color = "#edb139";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        {isMuted ? (
          /* Muted icon — speaker with X */
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
          </svg>
        ) : (
          /* Unmuted icon — speaker with waves */
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          </svg>
        )}
      </button>
    </section>
  );
};

export default VideoSection;
