import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import PropTypes from "prop-types";

/**
 * Reusable Pagination Component
 */
const Pagination = ({ currentPage, totalPages, onPageChange, onNext, onPrev }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="d-flex align-items-center justify-content-center mt-3 mb-3">
      <div className="d-flex align-items-center gap-2">
        <button
          onClick={onPrev}
          disabled={currentPage === 1}
          style={{
            all: "unset",
            cursor: currentPage === 1 ? "default" : "pointer",
            opacity: currentPage === 1 ? 0.5 : 1,
          }}
          aria-label="Previous page"
        >
          <FaChevronLeft />
        </button>

        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            className={`btn fw-bold d-flex align-items-center justify-content-center ${
              currentPage === index + 1 ? "text-white" : "bg-white text-black"
            }`}
            style={{
              backgroundColor: "rgba(153, 37, 37, 1)",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              padding: 0,
            }}
            onClick={() => onPageChange(index + 1)}
            aria-label={`Go to page ${index + 1}`}
            aria-current={currentPage === index + 1 ? "page" : undefined}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={onNext}
          disabled={currentPage === totalPages}
          style={{
            all: "unset",
            cursor: currentPage === totalPages ? "default" : "pointer",
            opacity: currentPage === totalPages ? 0.5 : 1,
          }}
          aria-label="Next page"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
};

export default Pagination;
