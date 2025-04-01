import React from "react";
import LoadingSpinner from "../common/LoadingSpinner";
import "./MessageList.css";

function MessageList({ messages, isLoading }) {
  return (
    <div className="message-list">
      {messages.map((message) => (
        <div key={message.id} className={`message ${message.sender}`}>
          {message.text}
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
