import React, { useState, useEffect } from "react";
import { simulationService } from "../../services/api";
import "./ProgressWidget.css";

function ProgressWidget() {
  const [progress, setProgress] = useState({
    patients_treated: 0,
    scenarios_completed: 0,
    feedback: "Loading...",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await simulationService.getProgress();
        setProgress(data);
        setError(null);
      } catch (err) {
        setError("Failed to load progress data");
        console.error("Error fetching progress:", err);
      }
    };

    fetchProgress();
    // Set up polling every 30 seconds to keep progress updated
    const interval = setInterval(fetchProgress, 30000);

    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="progress-widget error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="progress-widget">
      <h3>Clinical Experience</h3>
      <div className="progress-stats">
        <div className="stat">
          <label>Patients Treated</label>
          <span>{progress.patients_treated}</span>
        </div>
        <div className="stat">
          <label>Scenarios Completed</label>
          <span>{progress.scenarios_completed}</span>
        </div>
      </div>
      <div className="feedback">
        <p>{progress.feedback}</p>
      </div>
    </div>
  );
}

export default ProgressWidget;
