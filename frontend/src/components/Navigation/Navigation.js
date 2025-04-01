import React from "react";
import "./Navigation.css";

function Navigation({ activeView, onViewChange }) {
  return (
    <nav className="main-navigation">
      <div className="nav-links">
        <button
          className={`nav-link ${activeView === "pdf" ? "active" : ""}`}
          onClick={() => onViewChange("pdf")}
        >
          PDF View
        </button>
        <button
          className={`nav-link ${activeView === "cholera" ? "active" : ""}`}
          onClick={() => onViewChange("cholera")}
        >
          Cholera Information
        </button>
      </div>
    </nav>
  );
}

export default Navigation;
