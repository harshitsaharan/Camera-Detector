import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const audioRef = useRef(null);

  const [sleepDetected, setSleepDetected] = useState(false);
  const [audioSrc, setAudioSrc] = useState(null);

  // Camera access
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch(() => alert("Camera permission denied"));
  }, []);

  // Sleep detection using brightness
  useEffect(() => {
    const interval = setInterval(() => {
      if (!videoRef.current || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = 200;
      canvas.height = 150;
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const frame = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let brightness = 0;

      for (let i = 0; i < frame.length; i += 4) {
        brightness += (frame[i] + frame[i + 1] + frame[i + 2]) / 3;
      }

      brightness /= frame.length / 4;

      if (brightness < 60) {
        setSleepDetected(true);
        audioRef.current?.play();
      } else {
        setSleepDetected(false);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [audioSrc]);

  // Upload alarm sound
  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioSrc(URL.createObjectURL(file));
    }
  };

  return (
    <div className="app">
      <h1>Camera Detection Alarm System</h1>

      <video ref={videoRef} autoPlay muted />
      <canvas ref={canvasRef} className="hidden"></canvas>

      <input type="file" accept="audio/*" onChange={handleAudioUpload} />

      {audioSrc && <audio ref={audioRef} src={audioSrc} />}

      <div className={sleepDetected ? "status danger" : "status safe"}>
        {sleepDetected ? "CAMERA DETECTED!  UTH JA BKL!" : "You Are Awake"}
      </div>
    </div>
  );
}

export default App;
