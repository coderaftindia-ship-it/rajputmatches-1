import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdBlock } from "react-icons/md";
import { FaTimes, FaShieldAlt } from "react-icons/fa";

export default function ConfirmBlockModal({ isOpen, onClose, onConfirm, profileName }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 5, 12, 0.72)",
            backdropFilter: "blur(6px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.2rem"
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "22px",
              border: "1.5px solid var(--royal-gold, #D4AF37)",
              boxShadow: "0 25px 60px rgba(89, 18, 59, 0.35)",
              maxWidth: "400px",
              width: "100%",
              overflow: "hidden",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Gold Gradient Bar */}
            <div
              style={{
                height: "4px",
                width: "100%",
                background: "linear-gradient(90deg, #D4AF37 0%, #F5C870 50%, #D4AF37 100%)"
              }}
            />

            {/* Modal Header Bar */}
            <div
              style={{
                background: "linear-gradient(135deg, var(--royal-maroon-dark, #3f0c2a) 0%, var(--royal-maroon, #59123B) 100%)",
                padding: "1rem 1.4rem",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <div style={{ display: "flex", alignItem: "center", gap: "10px" }}>
                <FaShieldAlt size={18} style={{ color: "#F5C870", marginTop: "2px" }} />
                <h5
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-heading, 'Playfair Display', serif)",
                    color: "#ffffff",
                    fontWeight: "600",
                    fontSize: "1.08rem",
                    letterSpacing: "0.5px"
                  }}
                >
                  Confirm Block
                </h5>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: "rgba(255, 255, 255, 0.12)",
                  border: "none",
                  borderRadius: "50%",
                  color: "#ffffff",
                  cursor: "pointer",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.2s ease"
                }}
                aria-label="Close"
              >
                <FaTimes size={14} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "1.6rem 1.4rem 1.5rem", textAlign: "center" }}>
              {/* Badge Icon */}
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(220, 38, 38, 0.08)",
                  border: "2px solid rgba(220, 38, 38, 0.3)",
                  color: "#dc2626",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.1rem auto",
                  boxShadow: "0 6px 20px rgba(220, 38, 38, 0.15)"
                }}
              >
                <MdBlock size={34} />
              </div>

              <h4
                style={{
                  fontFamily: "var(--font-heading, 'Playfair Display', serif)",
                  color: "var(--royal-maroon, #59123B)",
                  fontSize: "1.32rem",
                  fontWeight: "700",
                  marginBottom: "0.6rem"
                }}
              >
                Block Profile?
              </h4>

              <p
                style={{
                  color: "var(--royal-text-light, #5A3C47)",
                  fontSize: "0.93rem",
                  lineHeight: "1.55",
                  margin: 0,
                  padding: "0 4px"
                }}
              >
                {profileName ? (
                  <>Are you sure you want to block <strong>{profileName}</strong>?</>
                ) : (
                  <>Are you sure you want to block this profile?</>
                )}
                <br />
                <span
                  style={{
                    fontSize: "0.83rem",
                    opacity: 0.8,
                    display: "block",
                    marginTop: "8px",
                    lineHeight: "1.45"
                  }}
                >
                  They will no longer be able to view your profile, send requests, or message you.
                </span>
              </p>

              {/* Action Buttons: Cancel / Block */}
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "1.6rem",
                  justifyContent: "center"
                }}
              >
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    flex: "1 1 0%",
                    padding: "11px 16px",
                    borderRadius: "30px",
                    border: "1.5px solid rgba(89, 18, 59, 0.25)",
                    backgroundColor: "#FDF5E6",
                    color: "var(--royal-maroon, #59123B)",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    transition: "all 0.2s ease"
                  }}
                >
                  <FaTimes size={12} /> No, Cancel
                </button>

                <button
                  type="button"
                  onClick={onConfirm}
                  style={{
                    flex: "1 1 0%",
                    padding: "11px 16px",
                    borderRadius: "30px",
                    border: "none",
                    background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
                    color: "#ffffff",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    boxShadow: "0 6px 18px rgba(220, 38, 38, 0.35)",
                    transition: "all 0.2s ease"
                  }}
                >
                  <MdBlock size={16} /> Yes, Block
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
