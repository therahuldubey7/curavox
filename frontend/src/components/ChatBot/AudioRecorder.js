import React, { useState, useRef, useEffect } from "react";
import WaveformVisualizer from "./WaveformVisualizer";
import "./AudioRecorder.css";

function AudioRecorder({ onRecordingComplete, disabled, onRecordingStart }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [error, setError] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [audioStream, setAudioStream] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const durationTimerRef = useRef(null);
  const minRecordingDuration = 3; // Minimum 3 seconds
  const durationRef = useRef(0); // Add this to track duration across renders

  useEffect(() => {
    checkAudioPermissions();
    return () => cleanup();
  }, []);

  const checkAudioPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setPermissionGranted(true);
      setError(null);
    } catch (err) {
      handleError(
        "Microphone permission denied. Please enable it in your browser settings."
      );
    }
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setIsRecording(false);
    setPermissionGranted(false);
    cleanup();
  };

  const cleanup = () => {
    if (durationTimerRef.current) {
      clearInterval(durationTimerRef.current);
    }
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
    setAudioStream(null);
    setRecordingDuration(0);
    durationRef.current = 0; // Reset the duration ref
  };

  const startRecording = async () => {
    if (!permissionGranted) {
      await checkAudioPermissions();
      if (!permissionGranted) return;
    }

    setError(null); // Clear any previous errors
    durationRef.current = 0; // Reset duration at start

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        if (durationRef.current < minRecordingDuration) {
          handleError(
            "Recording too short. Please record for at least 3 seconds."
          );
          return;
        }

        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        await onRecordingComplete(audioBlob);
        cleanup();
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      onRecordingStart();

      // Start duration timer
      durationRef.current = 0;
      durationTimerRef.current = setInterval(() => {
        durationRef.current += 0.1;
        setRecordingDuration(durationRef.current);
      }, 100);
    } catch (error) {
      handleError(
        "Error accessing microphone. Please check your device settings."
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
      }
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="audio-recorder">
      {error && <div className="error-message">{error}</div>}

      <button
        className={`record-button ${isRecording ? "recording" : ""}`}
        onClick={toggleRecording}
        disabled={disabled || !permissionGranted}
      >
        {isRecording ? (
          <span>Stop Recording {recordingDuration.toFixed(1)}s</span>
        ) : (
          <span>Start Recording</span>
        )}
      </button>

      <WaveformVisualizer
        isActive={isRecording}
        audioSource={audioStream}
        type="stream"
      />
    </div>
  );
}

export default AudioRecorder;
