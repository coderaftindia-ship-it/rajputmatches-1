import React from "react";
import { motion } from "framer-motion";

/**
 * AnimatedHeading – A premium, reusable heading component.
 *
 * Props:
 *  text            – The full heading string.
 *  highlightWords  – Array of words to color gold (+ optional brush stroke).
 *  className       – Extra CSS classes for the wrapper element.
 *  style           – Inline style overrides for the wrapper element.
 *  variant         – "draw-line" | "brush" | "none"
 *                      draw-line: animated SVG underline beneath the heading.
 *                      brush:     semi-transparent gold bar sweeps behind highlighted words.
 *                      none:      just staggered word fade-in, no underline.
 *  as              – HTML tag ("h1", "h2", "h3", …).
 *  textAlign       – "center" | "start" | "end" (defaults to "center").
 */
const AnimatedHeading = ({
  text = "",
  highlightWords = [],
  className = "",
  style = {},
  variant = "draw-line",
  as: Tag = "h2",
  textAlign = "center",
}) => {
  const words = text.split(" ");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 0.61, 0.36, 1] },
    },
  };

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 1.1, ease: "easeInOut", delay: 0.5 },
    },
  };

  const cleanWord = (w) => w.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");

  return (
    <Tag
      className={`position-relative ${className}`}
      style={{
        fontFamily: "var(--font-heading)",
        color: "var(--royal-maroon)",
        textAlign,
        ...style,
      }}
    >
      {/* Staggered word animation wrapper */}
      <motion.span
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        style={{
          display: "inline-flex",
          flexWrap: "wrap",
          justifyContent: textAlign === "center" ? "center" : "flex-start",
          gap: "0 0.3em",
        }}
      >
        {words.map((word, i) => {
          const isHighlighted = highlightWords.some(
            (h) => cleanWord(word).toLowerCase() === h.toLowerCase()
          );

          return (
            <motion.span
              key={i}
              variants={wordVariants}
              style={{ display: "inline-block", position: "relative" }}
            >
              {isHighlighted ? (
                <span style={{ position: "relative", display: "inline-block" }}>
                  {/* Brush highlight behind text */}
                  {variant === "brush" && (
                    <motion.span
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.55,
                        delay: 0.2 + i * 0.05,
                        ease: "easeOut",
                      }}
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: "-4px",
                        right: "-4px",
                        height: "45%",
                        background:
                          "linear-gradient(90deg, rgba(212,175,55,0.18), rgba(212,175,55,0.08))",
                        zIndex: 0,
                        transformOrigin: "left center",
                        borderRadius: "3px",
                      }}
                    />
                  )}
                  <span
                    style={{
                      position: "relative",
                      zIndex: 1,
                      color: "var(--royal-gold)",
                      textShadow: "0 0 18px rgba(212,175,55,0.25)",
                    }}
                  >
                    {word}
                  </span>
                </span>
              ) : (
                word
              )}
            </motion.span>
          );
        })}
      </motion.span>

      {/* SVG draw-line underline */}
      {variant === "draw-line" && (
        <span
          className="position-absolute start-50 translate-middle-x"
          style={{
            bottom: "-14px",
            width: "140px",
            height: "12px",
            display: "block",
            overflow: "visible",
            pointerEvents: "none",
          }}
        >
          <svg
            width="140"
            height="10"
            viewBox="0 0 140 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              d="M0 5 Q70 0 140 5"
              stroke="var(--royal-gold)"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="transparent"
              variants={pathVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            />
            <motion.path
              d="M10 8 Q70 4 130 8"
              stroke="rgba(212,175,55,0.3)"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="transparent"
              variants={pathVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              style={{ transition: "opacity 0.3s" }}
            />
          </svg>
        </span>
      )}
    </Tag>
  );
};

export default AnimatedHeading;
