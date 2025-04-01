import React, { useState, useCallback, useRef } from "react";
import RoleSelector from "./RoleSelector";
import MessageList from "./MessageList";
import AudioRecorder from "./AudioRecorder";
import ProgressWidget from "../ProgressWidget/ProgressWidget";
import "./ChatBot.css";
import { MOCK_RESPONSE_AUDIO } from "./MOCK_AUDIO";

function ChatBot({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const currentAudioRef = useRef(null);
  const [yourAudioBlob, setYourAudioBlob] = useState(null);

  const handleRecordingStart = () => {
    setError(null);
    // Stop any playing audio
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }
  };

  const handleRecordingComplete = async (audioBlob) => {
    setIsLoading(true);
    setError(null);

    try {
      // Create user message with audio URL
      const userAudioUrl = URL.createObjectURL(audioBlob);
      const userMessage = {
        id: Date.now().toString(),
        type: "audio",
        audioUrl: userAudioUrl,
        sender: "user",
        timestamp: new Date(),
        role: selectedRole,
        symptoms: selectedSymptoms,
      };

      setMessages((prev) => [...prev, userMessage]);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Use static audio file for bot response
      const botMessage = {
        id: (Date.now() + 1).toString(),
        type: "audio",
        audioUrl: MOCK_RESPONSE_AUDIO, // Using static audio file
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setError(error.message || "An error occurred. Please try again.");
      console.error("Error processing audio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSymptomSelect = useCallback((symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  }, []);

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h2>Smart Simulation</h2>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
      </div>

      <RoleSelector
        selectedRole={selectedRole}
        selectedSymptoms={selectedSymptoms}
        onRoleSelect={setSelectedRole}
        onSymptomSelect={handleSymptomSelect}
      />

      {error && <div className="error-banner">{error}</div>}

      <MessageList
        messages={messages}
        isLoading={isLoading}
        onPlayStart={() => {
          if (currentAudioRef.current) {
            currentAudioRef.current.pause();
            currentAudioRef.current.currentTime = 0;
          }
        }}
      />

      <div className="chat-input">
        <AudioRecorder
          onRecordingComplete={handleRecordingComplete}
          onRecordingStart={handleRecordingStart}
          disabled={isLoading || !selectedRole}
        />
      </div>

      <ProgressWidget />
    </div>
  );
}

export default ChatBot;
