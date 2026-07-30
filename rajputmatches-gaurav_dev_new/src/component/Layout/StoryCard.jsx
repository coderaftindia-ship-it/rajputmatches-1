import React from "react";
import style from "../Profile/ProfileComp/Profile.module.css";

function StoryCard({ text, imageSrc }) {
  return (
    <div className={` p-xl-0 p-2 ${style.storycard}`}>
      <img
        className="img-fluid"
        src={imageSrc || "default-image-path.jpg"}
        alt={text || "Story image"}
        style={{
          width: "100%",
          objectFit: "cover",
        }}
      />
      <p
        className="card-text mt-2"
        style={{
          fontSize: "clamp(1rem, 2vw, 22px)",
          fontWeight: 400,
          fontFamily: "Open Sans, sans-serif",
          lineHeight: 1.2,
        }}
      >
        {text || "No description available"}
      </p>
    </div>
  );
}

export default StoryCard;
