import React, { useState, useRef, useEffect } from "react";
import "./AudioPlayer.css";

function AudioPlayer({ audioUrl, onPlayStart }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const audio = audioRef.current;
    audio.src = audioUrl;

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", () => setIsPlaying(false));
    audio.addEventListener("play", () => setIsPlaying(true));

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
      audio.src = "";
    };
  }, [audioUrl]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      onPlayStart?.();
      audioRef.current.play();
    }
  };

  return (
    <div className="audio-player-wrapper">
      <div className="audio-player">
        <button
          className="play-button"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="7" y="6" width="3" height="12" fill="white" />
              <rect x="14" y="6" width="3" height="12" fill="white" />
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 6L18 12L8 18V6Z" fill="white" />
            </svg>
          )}
        </button>

        <div className="wave-container">
          <div className={`wave-animation ${isPlaying ? "animate" : ""}`}>
            {[...Array(7)].map((_, i) => (
              <span key={i}></span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AudioPlayer;
