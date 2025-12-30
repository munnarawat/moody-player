import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "@vladmandic/face-api";
import axios from "axios";

const FaceExpression = ({ setSongs }) => {
  const videoRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [expression, setExpression] = useState("Initializing...");
  const [isDetecting, setIsDetecting] = useState(false);

  // 1. Load Models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = "/models";
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        setLoaded(true);
        console.log("✅ Models loaded successfully");
        setExpression("Ready to Detect");
      } catch (err) {
        console.error("❌ Model Load Error:", err);
        setExpression("Model Error!");
      }
    };
    loadModels();
  }, []);

  // 2. Start Video
  useEffect(() => {
    if (!loaded) return;
    let stream = null;
    const startVideo = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("❌ Camera Error:", err);
        setExpression("Camera Error!");
      }
    };
    startVideo();
    return () => {
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };
  }, [loaded]);

  useEffect(() => {
    let interval;

    if (isDetecting && loaded && videoRef.current) {
      const detectExpression = async () => {
        if (
          !videoRef.current ||
          videoRef.current.paused ||
          videoRef.current.ended
        )
          return;

        try {
          // Face Detect karo
          const detection = await faceapi
            .detectSingleFace(
              videoRef.current,
              new faceapi.TinyFaceDetectorOptions({
                inputSize: 320,
                scoreThreshold: 0.5,
              })
            )
            .withFaceExpressions();

          if (detection) {
            const exp = detection.expressions;
            const best = Object.entries(exp).sort((a, b) => b[1] - a[1])[0];
            const currentMood = best[0].toLowerCase();

            // 1. UI Update karo
            setExpression(
              `${currentMood.toUpperCase()} (${(best[1] * 100).toFixed(0)}%)`
            );
            setIsDetecting(false);

            console.log("✅ Mood Detected:", currentMood);
            try {
              const res = await axios.get(
                `http://localhost:3000/api/songs?mood=${currentMood}`
              );
              if (setSongs) {
                setSongs(res.data);
              }
            } catch (apiError) {
              console.error("❌ API Call Failed:", apiError);
            }
          } else {
            setExpression("Looking for face... 😐");
          }
        } catch (error) {
          console.log("Detection Loop Error:", error);
        }
      };
      interval = setInterval(() => {
        if (videoRef.current?.readyState === 4) {
          detectExpression();
        }
      }, 1000);
    }

    // Cleanup interval
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isDetecting, loaded, setSongs]);

  // 4. Toggle Handler
  const toggleDetection = () => {
    setIsDetecting(!isDetecting);
    if (!isDetecting) {
      setExpression("Scanning...");
    }
  };

  return (
    <div className="container ">
      <div className="relative z-10 mt-20 p-2 lg:px-20 ">
        <h2 className="text-2xl font-semibold">Live Mood Detection</h2>
        <div className="mt-2 flex gap-10 items-center flex-col md:flex-row">
          <div className="overflow-hidden relative">
            <video
              className="rounded-xl"
              ref={videoRef}
              autoPlay
              muted
              playsInline
              width="360"
              height="240"
            />
            <div className="absolute bottom-4 left-4">
              <div className="flex flex-col px-5 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg">
                <span className="text-xs text-gray-200 font-medium mb-0.5">
                  Mood:
                </span>
                <span className="text-lg font-bold text-white tracking-wide">
                  {expression}
                </span>
              </div>
            </div>
          </div>

          <div className="py-4 flex flex-col items-center md:items-start">
            <div className="heading text-center md:text-start">
              <h2 className="text-xl font-semibold">Live Mood Detection</h2>
              <p className=" mt-2 md:w-1/2">
                Your current mood is being analyzed in real-time. Enjoy the
                music tailored to your feelings.
              </p>
            </div>
            {/* Button */}
            <button
              onClick={toggleDetection}
              className={`relative mt-6 px-8 py-3 rounded-full font-bold text-white transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 shadow-lg active:scale-95 ${
                isDetecting
                  ? "bg-red-500 shadow-red-500/50 hover:shadow-red-500/70" // Stop Style
                  : "bg-gradient-to-r from-[#5F1FDB] via-[#7B3FE4] to-[#9760ED] shadow-[#5F1FDB]/50 hover:shadow-[#5F1FDB]/70" // Start Style
              }`}>
              {isDetecting ? "Stop Scanning" : "Scan Mood & Get Songs"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceExpression;
