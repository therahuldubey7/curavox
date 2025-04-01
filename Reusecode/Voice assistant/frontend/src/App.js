// src/App.js
import React, { useState, useRef } from 'react';
import NavBar from './components/NavBar';
import PDFPreview from './components/PDFViewer'; // renamed from PDFViewer if you prefer
import NexusAudioAssistant from './components/NexusAudioAssistant';
import { Box } from '@mui/material';
import Chatbot from './components/chatbot/chatbot';

function App() {
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [sleepMode, setSleepMode] = useState(true);
  const pdfPreviewRef = useRef(null);

  const loadBot = () => {};

  const handleToggle = (checkedValue) => {
    // setSleepMode(false);
    setAssistantOpen(checkedValue);
  };

  // This function returns the result of takeScreenshot (a Blob)
  const handleTakeScreenshot = async () => {
    if (pdfPreviewRef.current) {
      const screenshotBlob = await pdfPreviewRef.current.takeScreenshot();
      return screenshotBlob; // You can use this Blob in your assistant
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <NavBar checked={assistantOpen} onToggle={handleToggle} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          minHeight: '100vh',
          pt: 8,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <PDFPreview ref={pdfPreviewRef} />
        </Box>
        <NexusAudioAssistant sleepMode={sleepMode} onHover={handleToggle} open={assistantOpen} takeScreenshot={handleTakeScreenshot} />
      </Box>
      
    </Box>
  );
}

export default App;
