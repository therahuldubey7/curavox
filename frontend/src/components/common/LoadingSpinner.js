import React from "react";
import "./LoadingSpinner.css";

function LoadingSpinner({ size = "medium", color = "#007bff" }) {
  return (
    <div
      className={`loading-spinner ${size}`}
      style={{ borderTopColor: color }}
    >
      <div className="spinner-inner" />
    </div>
  );
}

export default LoadingSpinner;
