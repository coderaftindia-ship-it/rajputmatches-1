import React from "react";
import styles from "./Testimonial.module.css";
import { LiaQuoteLeftSolid } from "react-icons/lia";
import storybg from "../../assets/images/privacybg.png";
import border from "../../assets/images/border.png";

const Testimonial = () => {
  return (
    <div className={styles.container}>
      <div className={styles.flexContainer}>
        <div className={styles.imageContainer}>
          <h2 className={`${styles.heading} text-start`}>Real Stories,</h2>
          <h2 className={styles.heading}>Real Connections</h2>
          <div className={styles.quoteStyle}>
            <img
              className={`img-fluid ${styles.image}`}
              src={storybg}
              alt="Profile"
            />
          </div>
          <div className={styles.navIcons}>
            <i className="fas fa-chevron-left"></i>
            <i className="fas fa-chevron-right"></i>
          </div>
        </div>

        <div className={styles.quoteStyle}>
          <div className={styles.quoteContainer}>
            <LiaQuoteLeftSolid className={styles.quoteIcon} />
            <p className={styles.quoteText}>
              Priya, a software engineer from Bengaluru, and Arjun, a business
              analyst from Mumbai, connected through our platform’s personalized
              matching system. Their shared values and dreams brought them
              closer, and after meaningful conversations, they decided to embark
              on a lifelong journey together.
              <br />
              <br />
              With the blessings of their families, they tied the knot in a
              beautiful ceremony. Priya and Arjun credit our platform for
              helping them find love and companionship. Your success story could
              be next!
            </p>
            <p className={styles.quoteAuthor}>Priya & Arjun</p>
          </div>
        </div>
      </div>
      <div className="m-auto" style={{ marginTop: "3rem", width: "80%" }}>
        <img className="w-100" src={border} alt="border" />
      </div>
    </div>
  );
};

export default Testimonial;
