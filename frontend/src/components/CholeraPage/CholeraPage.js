import React from "react";
import "./CholeraPage.css";

function CholeraPage() {
  return (
    <div className="cholera-page-container">
      <header className="cholera-header">
        <h1>Cholera</h1>
        <div className="header-meta">
          <span className="last-updated">Last updated: March 2024</span>
        </div>
      </header>

      <main className="cholera-main">
        <section className="intro">
          <h2>Overview</h2>
          <p>
            Cholera is an acute diarrheal infection caused by ingestion of food
            or water contaminated with the bacterium Vibrio cholerae.
          </p>
          {/* Add more content sections as per PAHO website */}
        </section>

        <section className="disease-details">
          <h2>Key Facts</h2>
          <ul>
            <li>
              Cholera is an acute diarrheal disease that can kill within hours
              if left untreated.
            </li>
            <li>
              Researchers estimate that each year there are 1.3 to 4.0 million
              cases of cholera, and 21,000 to 143,000 deaths worldwide due to
              cholera.
            </li>
            <li>
              Provision of safe water and sanitation is critical to prevent and
              control cholera and other waterborne diseases.
            </li>
          </ul>
          {/* Add more sections with detailed content */}
        </section>
      </main>
    </div>
  );
}

export default CholeraPage;
