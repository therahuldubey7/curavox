import React, { useState } from 'react';
import Navigation from './components/Navigation/Navigation';
import PDFViewer from './components/PDFViewer/PDFViewer';
import CholeraPage from './components/CholeraPage/CholeraPage';
import ChatBot from './components/ChatBot/ChatBot';
import './styles/App.css';

function App() {
  const [activeView, setActiveView] = useState('pdf');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const renderLeftColumn = () => {
    switch (activeView) {
      case 'pdf':
        return <PDFViewer />;
      case 'cholera':
        return <CholeraPage />;
      default:
        return <PDFViewer />;
    }
  };

  return (
    <div className="app-container">
      <div className="content-column">
        <Navigation activeView={activeView} onViewChange={setActiveView} />
        <div className="content-view">
          {renderLeftColumn()}
        </div>
      </div>
      <div className="chat-column">
        {!isChatOpen ? (
          <button 
            className="smart-simulation-button"
            onClick={() => setIsChatOpen(true)}
          >
            Smart Simulation
          </button>
        ) : (
          <ChatBot onClose={() => setIsChatOpen(false)} />
        )}
      </div>
    </div>
  );
}

export default App;
