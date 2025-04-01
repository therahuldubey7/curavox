import React, { useEffect, useRef, useState } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import "./ThreeDots.css";
import Loader from "./loader/Loader";

const WaveAnimation = ({isAnimating, isLoading}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = 200;

    let waveAmplitude = 30;
    let waveLength = 0.02;
    let speed = 0.02;
    let offset = 0;
    let audioContext, analyser, dataArray;

    const drawWave = (color, waveOffset) => {
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      
      for (let x = 0; x < canvas.width; x++) {
        let y =
          waveAmplitude * Math.sin(x * waveLength + offset + waveOffset) +
          canvas.height / 2;
        ctx.lineTo(x, y);
      }
      
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    const animate = () => {
      if (!isAnimating) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawWave("#74F9FF", 0);
      drawWave("#8EE7FF", 0.5);
      drawWave("#A0D5FF", 1);
      offset += speed;
      
      if (analyser) {
        analyser.getByteFrequencyData(dataArray);
        waveAmplitude = Math.max(...dataArray) / 5;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    const setupAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        source.connect(analyser);
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    };

    setupAudio();
    if (isAnimating) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animationRef.current);
    }

    return () => cancelAnimationFrame(animationRef.current);
  }, [isAnimating]);


//   right: 130px;
//     height: 80px;
//     bottom: 50px;
//     width: 200px;

  return (
    <Box sx={{ width: "100%", height: "65px", background: "#00334E", borderRadius: '50px' }}>
        {isLoading && 
            // <CircularProgress sx={{display: "flex", justifySelf: 'center', verticalAlign: 'baseline', color: 'white'}} />
            <Loader />
        }
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: isLoading ? "none" : "block" }} />
      {/* <Button onClick={() => setIsAnimating(!isAnimating)} sx={{ mt: 2, color: "white" }}>
        {isAnimating ? "Stop Animation" : "Start Animation"}
      </Button> */}
    </Box>
  );
};

export default WaveAnimation;
