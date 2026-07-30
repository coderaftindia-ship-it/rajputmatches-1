import React from "react";
import styles from "./LandingPage.module.css";
import privacylogo from "../../assets/images/privacylogo.png";
import { motion } from "framer-motion";

const LandingPage = () => {
  return (
    <div className={styles.background}>
      {/* <div className={styles.overlay}>
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={styles.contentContainer}
        >
          <div className={styles.badge}>
            <img
              src={privacylogo}
              alt="privacylogo"
              className={styles.privacylogo}
            />
            <div className={styles.heading}>
              Your Privacy,
              <br />
              Our Priority
            </div>
          </div>

          <div className={styles.goldDivider}></div>

          <p className={styles.paragraph}>
            Our platform is designed with privacy and tradition in mind. At
            Rajput Matches, we go beyond typical matchmaking providing a secure
            and curated space for you to find a partner who respects and values
            your heritage. Join a trusted network where each profile is
            verified, each connection meaningful, and each match has the
            potential to be lasting.
          </p>
          <button className={styles.ctaButton}>
            SECURE YOUR RAJPUT PARTNER
          </button>
        </motion.div>
      </div> */}
    </div>
  );
};

export default LandingPage;
