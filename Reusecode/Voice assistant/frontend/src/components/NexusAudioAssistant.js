// src/components/NexusAudioAssistant.js
import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  IconButton,
  List,
  ListItem,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import WaveAnimation from './WaveAnimation';
import { Pause, PlayArrow, SpeakerOutlined, VolumeUp } from '@mui/icons-material';
import Chatbot from './chatbot/chatbot';

export default function NexusAudioAssistant({ open, takeScreenshot, sleepMode, onHover }) {
  // Chat messages: each message is an object { sender, type, content }
  const [messages, setMessages] = useState([]);
  // For text input (if needed)
  const [userInput, setUserInput] = useState('');
  // For optional screenshot preview (if desired)
  const [imageData, setImageData] = useState(null);
  // For audio recording
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [recording, setRecording] = useState(false);
  // Ref to store the screenshot Blob for sending with audio
  const screenshotBlobRef = useRef(null);

  const [isAnimating, setIsAnimating] = useState(false);

  const apiAudioRef = useRef(null);
  const [apiAudioUrl, setApiAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const BACKEND_HOST = "http://localhost:8000";
  // const BACKEND_HOST = "https://voice.dev.il.pearsondev.tech";

   // Toggle Play/Pause when clicking the respective button
   const togglePlayPause = () => {
    if (apiAudioRef.current) {
      if (isPlaying) {
        apiAudioRef.current.pause();
      } else {
        apiAudioRef.current.play();
      }
    }
  };

    // Auto-play audio when audioUrl changes
    useEffect(() => {
      if (apiAudioUrl && apiAudioRef.current) {
        apiAudioRef.current.play();
        setIsAnimating(true);
        setIsPlaying(true);
      }

    }, [apiAudioUrl]);

    // Event listeners to track play/pause state
  useEffect(() => {
    const audioElement = apiAudioRef.current;
    if (audioElement) {
      const handlePlay = () => {
        setIsPlaying(true);
        setIsAnimating(true);
      }
      const handlePause = () => {
        setIsPlaying(false);
        setIsAnimating(false);
      }

      audioElement.addEventListener("play", handlePlay);
      audioElement.addEventListener("pause", handlePause);

      return () => {
        audioElement.removeEventListener("play", handlePlay);
        audioElement.removeEventListener("pause", handlePause);
      };
    }
  }, [apiAudioUrl]);

  // if (!open) {
  //   return null;
  // }

  // Handle sending text messages (if needed)
  const handleSendText = () => {
    const text = userInput.trim();
    if (!text) return;
    setMessages((msgs) => [
      ...msgs,
      { sender: 'User', type: 'text', content: text },
    ]);
    setUserInput('');
  };

  // Start recording: first capture the screenshot, then start audio recording.
  const startRecording = async () => {
    console.log('[NexusAudioAssistant] Starting recording process...');
    setIsAnimating(true);
    try {
      const screenshotBlob = await takeScreenshot();
      if (screenshotBlob) {
        screenshotBlobRef.current = screenshotBlob;
        const screenshotUrl = URL.createObjectURL(screenshotBlob);
        setImageData(screenshotUrl);
      } else {
        console.log('[NexusAudioAssistant] No screenshot blob returned.');
      }
    } catch (error) {
      console.error('[NexusAudioAssistant] Error taking screenshot:', error);
    }

    // Now start audio recording
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.addEventListener('dataavailable', (event) => {
        console.log('[NexusAudioAssistant] Audio data available:', event.data);
        audioChunksRef.current.push(event.data);
      });

      mediaRecorderRef.current.addEventListener('stop', onRecordingStop);
      mediaRecorderRef.current.start();
      setRecording(true);
      console.log('[NexusAudioAssistant] Recording started.');
    } catch (err) {
      console.error('[NexusAudioAssistant] Microphone access error:', err);
    }
  };

  // Stop audio recording.
  const stopRecording = () => {
    setIsAnimating(false);
    setIsLoading(true);
    if (!mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
    setRecording(false);
    console.log('[NexusAudioAssistant] Recording stopped.');
  };

// When recording stops, create an audio Blob from the recorded data for the user’s message.
const onRecordingStop = () => {
  const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
  const localAudioUrl = URL.createObjectURL(audioBlob);
  console.log('[NexusAudioAssistant] Audio recording stopped.');
  console.log('[NexusAudioAssistant] Local audio URL:', localAudioUrl);

  // Add the user's audio message to the chat.
  setMessages((msgs) => [
    ...msgs,
    { sender: 'User', type: 'audio', content: localAudioUrl },
  ]);

  // Prepare FormData with audio and (if available) screenshot.
  const formData = new FormData();
  formData.append('audio_file', audioBlob, 'recording.mp3');
  if (screenshotBlobRef.current) {
    formData.append('image_data', screenshotBlobRef.current, 'screenshot.png');
  }
  let startTime = Date.now();

  // Fetch the streaming response from the backend.
  fetch(`${BACKEND_HOST}/generate_voice_assistant_response`, {
    method: 'POST',
    body: formData,
  })
    .then((resp) => {
      if (!resp.ok) {
        return resp.text().then((errorDetail) => {
          setIsLoading(false);
          console.error('[NexusAudioAssistant] Error details:', errorDetail);
          throw new Error('Upload failed');
        });
      }
      console.log("Time taken for API Call", Date.now() - startTime);
      setIsLoading(false);
      // Process the streaming response using the ReadableStream.
      const reader = resp.body.getReader();
      // Create a MediaSource for streaming audio.
      const mediaSource = new MediaSource();
      const audioUrl = URL.createObjectURL(mediaSource);
      setApiAudioUrl(audioUrl);

      mediaSource.addEventListener('sourceopen', () => {
        // Ensure the MIME type is supported. Here we use 'audio/mpeg' for MP3.
        const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');

        const pump = () => {
          reader.read().then(({ done, value }) => {
            if (done) {
              // When done, signal that no more data will come.
              mediaSource.endOfStream();
              return;
            }
            // Append the new chunk into the SourceBuffer.
            sourceBuffer.appendBuffer(value);
            // Once the current update is finished, read the next chunk.
            sourceBuffer.addEventListener('updateend', pump, { once: true });
          });
        };

        pump();
      });
    })
    .catch((err) => {
      console.error('[NexusAudioAssistant] Error sending audio:', err);
    });
};


  return (
    <>
    {open && 
    <Box
      // elevation={3}
      sx={{
        position: 'fixed',
        // top: 64, // below AppBar
        bottom: 50,
        right: 130,
        width: 200,
        height: '80px',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1200,
        backgroundColor: 'transparent'
      }}
    >
      {/* <Box sx={{ p: 2, borderBottom: '1px solid #ccc' }}>
        <Typography variant="h6">Nexus Audio Assistant</Typography>
        <Typography variant="body2" color="text.secondary">
          Send audio or text queries
        </Typography>
      </Box> */}

      {/* Chat message list
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        <List>
          {messages.map((msg, index) => (
            <ListItem key={index}>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 'bold',
                    color: msg.sender === 'User' ? 'blue' : 'green',
                  }}
                >
                  {msg.sender}:
                </Typography>
                {msg.type === 'text' && (
                  <Typography variant="body2">{msg.content}</Typography>
                )}
                {msg.type === 'audio' && (
                  <audio
                    controls
                    src={msg.content}
                    style={{ marginTop: 8 }}
                    onLoadedData={() =>
                      console.log('[NexusAudioAssistant] Audio element loaded:', msg.content)
                    }
                  />
                )}
              </Box>
            </ListItem>
          ))}
        </List>
      </Box> */}

      {/* Optional: Preview of the screenshot image.
          To disable screenshot preview, simply comment out this block. */}
      {/* {imageData && (
        <Box sx={{ p: 2 }}>
          <Typography variant="body2">Screenshot Preview:</Typography>
          <img
            src={imageData}
            alt="Screenshot Preview"
            style={{ maxWidth: '100%', border: '1px solid #ccc' }}
          />
        </Box>
      )} */}

      {/* Input & Controls */}
      <Box sx={{ p: 1 }}>
        {/* <Box sx={{ display: 'flex', mb: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Type your message..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendText();
            }}
          />
          <Button variant="contained" sx={{ ml: 1 }} onClick={handleSendText}>
            Send
          </Button>
        </Box> */}
        <Box sx={{ display: 'flex', gap: 1, justifySelf: 'center'}}>
          {/* <IconButton color="primary" onMouseDown={startRecording} onMouseUp={stopRecording} onTouchStart={startRecording} onTouchEnd={stopRecording} >
            <MicIcon />
          </IconButton> */}
          <IconButton color="error" disabled={!isPlaying}>
            {<VolumeUp />}
          </IconButton>
          <IconButton color="error" disabled={!apiAudioUrl} onClick={togglePlayPause}>
            {isPlaying ? <Pause /> : <PlayArrow />}
          </IconButton>
        </Box>

        <WaveAnimation isAnimating={isAnimating} isLoading={isLoading}/>
        {apiAudioUrl && (
        <Box mt={2} display={"none"}>
          <audio ref={apiAudioRef} controls src={apiAudioUrl}></audio>
        </Box>
      )}
      </Box>
    </Box>}
    <Chatbot sleepMode={sleepMode} onHover={onHover} onMouseUp={stopRecording} onMouseDown={startRecording} />
    </>
  );
}
