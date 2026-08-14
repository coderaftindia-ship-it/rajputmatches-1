// ⚡ Preload: fire critical public APIs BEFORE React mounts
import "./api/preload";

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import ReactGA from "react-ga4";

// Defer Google Analytics initialization until after initial page load (interactive) to reduce TBT
const initGA = () => {
  try {
    ReactGA.initialize("G-67MK5R8PVM");
    ReactGA.send({
      hitType: "pageview",
      page: window.location.pathname + window.location.search,
    });
  } catch (e) {
    console.warn("Google Analytics initialization bypassed:", e);
  }
};

if (typeof window !== "undefined") {
  if (window.requestIdleCallback) {
    window.requestIdleCallback(() => setTimeout(initGA, 1000), { timeout: 3500 });
  } else {
    setTimeout(initGA, 3500);
  }
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "40px 20px", textAlign: "center", fontFamily: "sans-serif" }}>
          <h2>Something went wrong.</h2>
          <p>Please refresh the page or try again later.</p>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: "10px 20px", background: "#59123B", color: "#EDB139", border: "none", borderRadius: "8px", cursor: "pointer" }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
