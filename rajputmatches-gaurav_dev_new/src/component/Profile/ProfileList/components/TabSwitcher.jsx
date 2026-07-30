import React from "react";
import PropTypes from "prop-types";

/**
 * Reusable Tab Switcher Component
 */
const TabSwitcher = ({ activeTab, tabs, onTabChange }) => {
  return (
    <div className="row m-0 mb-1 p-0 bg-white">
      <div className="col-8 col-sm-9 col-md-10 d-flex p-0">
        {tabs.map((tab) => (
          <div
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            style={{
              backgroundColor:
                activeTab === tab.value ? "#991c1c" : "transparent",
              color: activeTab === tab.value ? "white" : "black",
              cursor: "pointer",
            }}
            className="reqbtn"
            role="tab"
            aria-selected={activeTab === tab.value}
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onTabChange(tab.value);
              }
            }}
          >
            {tab.label}
          </div>
        ))}
      </div>
    </div>
  );
};

TabSwitcher.propTypes = {
  activeTab: PropTypes.string.isRequired,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default TabSwitcher;
