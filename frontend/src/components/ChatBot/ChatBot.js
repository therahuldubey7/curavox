import React, { useState, useCallback } from "react";
import RoleSelector from "./RoleSelector";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import ProgressWidget from "../ProgressWidget/ProgressWidget";
import "./ChatBot.css";

function ChatBot({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
      role: selectedRole,
      symptoms: selectedSymptoms,
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);

    try {
      // Mock response for now
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: `This is a simulated response to: "${text}"`,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
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

      <MessageList messages={messages} isLoading={isLoading} />

      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={isLoading || !selectedRole}
      />

      <ProgressWidget />
    </div>
  );
}

export default ChatBot;
