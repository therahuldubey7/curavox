import React, { useState } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "./PDFViewer.css";

function PDFViewer() {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  // For MVP, we'll use a sample PDF
  const samplePDF = "/assets/g.pdf";

  return (
    <div className="pdf-viewer-container">
      <Worker workerUrl="/pdf.worker.min.js">
        <Viewer fileUrl={samplePDF} plugins={[defaultLayoutPluginInstance]} />
      </Worker>
    </div>
  );
}

export default PDFViewer;
