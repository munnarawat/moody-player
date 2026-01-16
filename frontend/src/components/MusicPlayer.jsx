import React, { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Heart,
  Repeat,
  Shuffle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { togglePlay, nextSong, prevSong,setRecommendation} from "../store/songSlice";

const MusicPlayer = () => {
  const dispatch = useDispatch();
  const { currentSong, isPlaying } = useSelector((state) => state.song);
  const audioRef = useRef(null);

  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Initialize Audio Object once
  if (!audioRef.current) {
    audioRef.current = new Audio();
  }

  // 1. 🎵 Handle Song Changes
  useEffect(() => {
    if (currentSong) {
      audioRef.current.src = currentSong.audioUrl;
      audioRef.current.load();
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => console.log("Playback error:", error));
        }
      }
    }
  }, [currentSong]);

  // 2. ⏯️ Handle Play/Pause Toggle
  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play().catch((e) => console.log("Play interrupted", e));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // 3. 🕒 Progress Bar & Time Update Logic (NEW)
  useEffect(() => {
    const audio = audioRef.current;

    const updateProgress = () => {
      const current = audio.currentTime;
      const dur = audio.duration;
      setCurrentTime(current);
      setDuration(dur);

      // Calculate percentage
      if (dur > 0) {
        setProgress((current / dur) * 100);
      }
    };

    const handleEnded = () => {
      dispatch(nextSong());
    };

    // Event Listeners add karo
    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateProgress);
    audio.addEventListener("ended", handleEnded);
    // Cleanup function
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateProgress);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [dispatch]);

  const formatTime = (time) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // ✅ Toggle Function
  const handleTogglePlay = () => dispatch(togglePlay());
  const handleNext = () => dispatch(nextSong());
  const handlePrev = () => dispatch(prevSong());

  // ✅ Seek Function 
  const handleSeek = (e) => {
    const width = e.currentTarget.clientWidth;
    const clickX = e.nativeEvent.offsetX;
    const newTime = (clickX / width) * audioRef.current.duration;

    audioRef.current.currentTime = newTime;
    setProgress((clickX / width) * 100);
  };

  if (!currentSong) return null;
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed -bottom-3.5  left-0 right-0 z-50 px-4 py-4 sm:px-6">
      <div className="w-full h-20 bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-between px-4 sm:px-8 shadow-2xl shadow-black/50">
        {/* LEFT: Song Info */}
        <div className="flex items-center gap-4 w-1/4">
          <motion.div
            className="image-container w-16 h-16 rounded-xl overflow-hidden shadow-lg shadow-purple-500/20 shrink-0">
            <img
              src={currentSong.imageUrl || "https://plus.unsplash.com/premium_photo-1676068243778-2652632e1f4c?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
              alt="Art"
              className={`w-full h-full object-cover transition-transform duration-500 ${isPlaying ? "animate-pulse":""}`}
            />
          </motion.div>

          <div className="hidden sm:block">
            <h4 className="text-white font-bold text-sm truncate max-w-37.5">
              {currentSong.title}
            </h4>
            <p className="text-white/40 text-xs truncate max-w-37.5">
              {currentSong.artist}
            </p>
          </div>

          <button onClick={() => setIsLiked(!isLiked)} className="ml-2">
            <Heart
              size={18}
              className={`transition-colors ${
                isLiked
                  ? "text-green-500 fill-green-500"
                  : "text-white/40 hover:text-white"
              }`}
            />
          </button>
        </div>

        {/* CENTER: Controls & Progress */}
        <div className="flex flex-col items-center w-2/4">
          {/* Control Buttons */}
          <div className="flex items-center gap-6 mb-1">
            <Shuffle
              size={16}
              className="text-xl text-zinc-500 hover:text-white transition-colors cursor-pointer"
            />
            <SkipBack
              size={20}
              onClick={handlePrev}
              className="text-3xl text-zinc-300 hover:text-white hover:scale-105 transition-all cursor-pointer"
            />

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleTogglePlay}
              className="play-pause w-10 h-10 rounded-full bg-white text-black flex items-center justify-center cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] hover:scale-105 transition-all">
              {isPlaying ? (
                <Pause size={20} className="text-black fill-black" />
              ) : (
                <Play size={20} className="text-black ml-1 fill-black" />
              )}
            </motion.button>

            <SkipForward
              size={20}
              onClick={handleNext}
              className="text-3xl text-zinc-300 hover:text-white hover:scale-105 transition-all cursor-pointer"
            />
            <Repeat
              size={16}
              className="text-xl text-zinc-500 hover:text-white transition-colors cursor-pointer"
            />
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md flex items-center gap-2 text-xs text-white/40 font-mono">
            {/* Dynamic Current Time */}
            <span className="w-10 text-right">{formatTime(currentTime)}</span>

            {/* Clickable Progress Bar */}
            <div
              className="relative flex-1 h-1 bg-white/10 rounded-full cursor-pointer group"
              onClick={handleSeek} // Click to seek
            >
              <div
                className="absolute top-0 left-0 h-full bg-linear-to-r from-indigo-500 to-purple-500 rounded-full group-hover:from-indigo-400 group-hover:to-purple-400"
                style={{ width: `${progress}%` }}
              />
              {/* Knob */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `${progress}%` }}
              />
            </div>

            {/* Dynamic Duration */}
            <span className="w-10">
              {formatTime(duration || currentSong.duration)}
            </span>
          </div>
        </div>

        {/* RIGHT: Volume */}
        <div className="flex items-center justify-end gap-2 w-1/4">
          <Volume2 size={18} className="text-white/60" />
          <div className="w-20 h-1 bg-white/10 rounded-full relative cursor-pointer group">
            <div className="absolute h-full w-1/2 bg-white/60 rounded-full group-hover:bg-green-400 transition-colors" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MusicPlayer;
