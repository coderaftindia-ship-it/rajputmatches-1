import { Link } from "react-router-dom";
import React, { useRef, useState } from "react";
import { IoLockClosedOutline, IoPlaySharp, IoPauseSharp } from "react-icons/io5";
import { FaConnectdevelop } from "react-icons/fa";
import { SlBadge } from "react-icons/sl";
import { BsPersonLock } from "react-icons/bs";
import { motion } from "framer-motion";
import royalbg from "../../assets/images/royalplacebg.jpg";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
};

const JourneyPage = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="bg-white overflow-hidden pb-bottom-nav">
      

      {/* Hero Video / Image Section with Overlay CTA */}
      <div className="position-relative w-100" style={{ height: "70vh", minHeight: "500px" }}>
        <img
          src={royalbg}
          alt="Royal Background"
          className="w-100 h-100 object-fit-cover"
        />
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}></div>
        
        {/* <div className="position-absolute top-50 start-50 translate-middle w-100 px-3">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mx-auto text-center glass-panel p-4 p-md-5 rounded-4"
            style={{ maxWidth: "800px", border: "1px solid rgba(255,255,255,0.2)" }}
          >
            <h2 className="display-6 fw-bold mb-3" style={{ fontFamily: "var(--font-heading)", color: "var(--royal-maroon-dark)" }}>
              Start Your Journey to a Royal Match Today
            </h2>
            <p className="lead mb-4" style={{ color: "#444" }}>
              Join Rajput Alliances and embark on a journey to find your perfect partner within a community that respects your legacy and honors your privacy.
            </p>
            <Link to="/login">
              <button className="royal-button px-5 py-3 fs-5 shadow-lg">
                JOIN THE RAJPUT LEGACY
              </button>
            </Link>
          </motion.div>
        </div> */}
      </div>
    </section>
  );
};

export default JourneyPage;
