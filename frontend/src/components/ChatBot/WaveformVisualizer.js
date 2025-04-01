import React, { useState, useEffect, useRef } from 'react';
import './WaveformVisualizer.css';

function WaveformVisualizer({ isActive, audioSource, type }) {
  const [audioLevel, setAudioLevel] = useState(0);
  const analyzerRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    let audioContext;
    let analyzer;
    let source;
    let dataArray;

    const initializeAudioAnalyzer = async () => {
      if (isActive && audioSource) {
        try {
          audioContext = new (window.AudioContext || window.webkitAudioContext)();
          analyzer = audioContext.createAnalyser();
          analyzer.fftSize = 256;
          analyzer.smoothingTimeConstant = 0.7;

          if (type === 'stream' && audioSource instanceof MediaStream) {
            source = audioContext.createMediaStreamSource(audioSource);
          } else if (type === 'audio' && audioSource instanceof HTMLAudioElement) {
            source = audioContext.createMediaElementSource(audioSource);
            source.connect(audioContext.destination); // Connect to speakers for playback
          }

          source.connect(analyzer);
          dataArray = new Uint8Array(analyzer.frequencyBinCount);
          analyzerRef.current = analyzer;

          const updateLevel = () => {
            if (!isActive) return;

            analyzer.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((acc, value) => acc + value, 0) / dataArray.length;
            const normalizedLevel = Math.min(100, (average / 128) * 100);
            setAudioLevel(normalizedLevel);

            animationFrameRef.current = requestAnimationFrame(updateLevel);
          };

          updateLevel();
        } catch (error) {
          console.error('Error initializing audio analyzer:', error);
        }
      }
    };

    initializeAudioAnalyzer();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContext) {
        audioContext.close();
      }
      setAudioLevel(0);
    };
  }, [isActive, audioSource, type]);

  return (
    <div className="waveform-container">
      {Array(20).fill(0).map((_, index) => (
        <div
          key={index}
          className="waveform-bar"
          style={{
            height: isActive ? `${Math.max(3, audioLevel * (0.3 + Math.random() * 0.7))}%` : '3%',
          }}
        />
      ))}
    </div>
  );
}

export default WaveformVisualizer;
