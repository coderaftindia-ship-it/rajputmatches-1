import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import ReactGA from "react-ga4";

// Initialize Google Analytics
ReactGA.initialize("G-67MK5R8PVM");
ReactGA.send({
  hitType: "pageview",
  page: window.location.pathname + window.location.search,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
