import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "@vladmandic/face-api";
import { motion } from "framer-motion";

const FaceExpression = ({ onMoodDetected }) => {
  const videoRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [expression, setExpression] = useState("Initializing...");
  const [isDetecting, setIsDetecting] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);

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

  // 3. Detection Loop
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

            setExpression(
              `${currentMood.toUpperCase()} (${(best[1] * 100).toFixed(0)}%)`
            );

            // Stop Scanning
            setIsDetecting(false);
            // Activate Success Glow
            setIsGlowing(true);

            console.log("✅ Mood Detected:", currentMood);
            if (onMoodDetected) {
              onMoodDetected(currentMood);
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

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isDetecting, loaded, onMoodDetected]);

  // 4. Toggle Handler
  const toggleDetection = () => {
    setIsDetecting(!isDetecting);
    if (!isDetecting) {
      setExpression("Scanning...");
      setIsGlowing(false); // Reset glow on new scan
    }
  };

  return (
    <div className="container">
      <div className="relative z-10 mt-20 p-2 lg:px-20">
        <h2 className="text-2xl font-semibold">Live Mood Detection</h2>
        <div className="mt-2 flex gap-10 items-center flex-col md:flex-row">
          <div className="relative rounded-xl">
            {/* 3. VIDEO FRAME */}
            <div className="relative overflow-hidden rounded-xl bg-black z-10">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                width="360"
                height="240"
                className="relative z-10"
              />
              {/* 🔥 SCANNING LASER BEAM (Scanning Effect) 🔥 */}
              {isDetecting && (
                <motion.div
                  initial={{ top: "-10%" }}
                  animate={{ top: "110%" }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)] z-20"
                />
              )}
              {/* Mood Badge */}
              <div className="absolute bottom-4 left-4 z-20">
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
          </div>

          <div className="py-4 flex flex-col items-center md:items-start">
            <div className="heading text-center md:text-start">
              <h2 className="text-xl font-semibold">Live Mood Detection</h2>
              <p className="mt-2 md:w-1/2">
                Your current mood is being analyzed in real-time. Enjoy the
                music tailored to your feelings.
              </p>
            </div>
            {/* Button */}
            <button
              onClick={toggleDetection}
              className={`relative mt-6 px-8 py-3 rounded-full font-bold text-white transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 shadow-lg active:scale-95 ${
                isDetecting
                  ? "bg-red-500 shadow-red-500/50 hover:shadow-red-500/70"
                  : "bg-linear-to-r from-[#5F1FDB] via-[#7B3FE4] to-[#9760ED] shadow-[#5F1FDB]/50 hover:shadow-[#5F1FDB]/70"
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
