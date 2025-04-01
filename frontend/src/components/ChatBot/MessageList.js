import React from "react";
import AudioPlayer from "./AudioPlayer";
import LoadingSpinner from "../common/LoadingSpinner";
import "./MessageList.css";

function MessageList({ messages, isLoading, onPlayStart }) {
  return (
    <div className="message-list">
      {messages.map((message) => (
        <div key={message.id} className={`message-container ${message.sender}`}>
          <>
            <div className="message-header">
              {message.sender === "user" ? "You" : "Bot"}
            </div>
            <div className={`message ${message.sender}`}>
              {message.type === "audio" ? (
                <AudioPlayer
                  audioUrl={message.audioUrl}
                  onPlayStart={onPlayStart}
                />
              ) : (
                message.text
              )}
            </div>
          </>
          <div className="message-timestamp">
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="message-loading">
          <LoadingSpinner size="small" />
        </div>
      )}
    </div>
  );
}

export default MessageList;
