import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Volume1,
  VolumeX,
  Repeat,
  Shuffle,
  Maximize2,
  Repeat1,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  togglePlay,
  nextSong,
  prevSong,
  toggleRepeat,
  toggleShuffle,
} from "../store/songSlice";
import LikedButton from "./LikedButton";
import FullScreenPlayer from "./FullScreenPlayer";

const MusicPlayer = () => {
  const dispatch = useDispatch();
  const { currentSong, isPlaying, isShuffle, repeatMode } = useSelector(
    (state) => state.song
  );
  const { user } = useSelector((state) => state.auth);
  const audioRef = useRef(null);

  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Check if liked
  const isSongLiked = useMemo(() => {
    if (!user?.likedSongs || !currentSong) return false;
    return user?.likedSongs.some((item) => {
      const id = typeof item === "string" ? item : item._id;
      return id === currentSong._id;
    });
  }, [user, currentSong]);

  // Volume Effect
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Init Audio
  if (!audioRef.current) {
    audioRef.current = new Audio();
  }

  // Handle Song Change
  useEffect(() => {
    if (currentSong) {
      audioRef.current.src = currentSong.audioUrl;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch((e) => console.log("Playback error:", e));
      }
    }
  }, [currentSong]);

  // Handle Play/Pause
  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play().catch((e) => console.log("Play interrupted", e));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Progress Logic
  useEffect(() => {
    const audio = audioRef.current;
    const updateProgress = () => {
      const current = audio.currentTime;
      const dur = audio.duration;
      setCurrentTime(current);
      setDuration(dur);
      if (dur > 0) setProgress((current / dur) * 100);
    };
    const handleEnded = () => {
      if (repeatMode === "one") {
        audio.currentTime = 0;
        audio.play();
      } else {
        dispatch(nextSong());
      }
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateProgress);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateProgress);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [dispatch, repeatMode]); // Added repeatMode to dependency

  const formatTime = (time) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleTogglePlay = () => dispatch(togglePlay());
  const handleNext = () => dispatch(nextSong());
  const handlePrev = () => dispatch(prevSong());

  // --- FIX START: Helper to stop propagation for buttons ---
  const handleAction = (e, action) => {
    e.stopPropagation();
    if (action) action();
  };
  // --- FIX END ---

  const handleSeek = (e) => {
    e.stopPropagation(); // Stop click from opening FullScreen
    const width = e.currentTarget.clientWidth;
    const clickX = e.nativeEvent.offsetX;
    const newTime = (clickX / width) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setProgress((clickX / width) * 100);
  };

  // Custom Volume Seek
  const handleVolumeSeek = (e) => {
    e.stopPropagation(); // Stop click from opening FullScreen
    const width = e.currentTarget.clientWidth;
    const clickX = e.nativeEvent.offsetX;
    const newVol = Math.max(0, Math.min(1, clickX / width));
    setVolume(newVol);
  };

  if (!currentSong) return null;

  return (
    <>
      <motion.div
        initial={{ y: 150, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed bottom-0 left-0 right-0 z-50 px-2 pb-2 sm:px-6 sm:pb-6 pointer-events-none"
      >
        {/* Main Floating Capsule */}
        <div
          onClick={() => setIsFullScreen(true)}
          className="pointer-events-auto w-full max-w-5xl mx-auto h-20 sm:h-24 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-4xl flex items-center justify-between px-4 sm:px-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden relative group cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Glow Effect behind */}
          <div className="absolute inset-0 bg-linear-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none" />

          {/* --- LEFT: Song Info & Art --- */}
          <div className="flex items-center gap-4 w-1/3 min-w-0">
            {/* Rotating Art */}
            <motion.div
              className="relative w-12 h-12 sm:w-16 sm:h-16 shrink-0"
              style={{ perspective: "1000px" }}
            >
              <motion.img
                src={currentSong.imageUrl}
                alt="Art"
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className={`w-full h-full object-cover rounded-full border-2 border-white/10 shadow-lg ${
                  isPlaying ? "shadow-indigo-500/30" : ""
                }`}
              />
              <div className="absolute inset-0 m-auto w-3 h-3 bg-black rounded-full border border-white/20" />
            </motion.div>

            <div className="hidden sm:flex flex-col overflow-hidden">
              <h4 className="text-white font-bold text-sm truncate hover:text-indigo-400 transition-colors cursor-default">
                {currentSong.title}
              </h4>
              <p className="text-white/40 text-xs truncate">
                {currentSong.artist}
              </p>
            </div>

            <div
              className="scale-90 sm:scale-100"
              onClick={(e) => e.stopPropagation()} // Stop Liked Button click
            >
              <LikedButton
                songId={currentSong._id}
                isAlreadyLiked={isSongLiked}
              />
            </div>
          </div>

          {/* --- CENTER: Controls & Progress --- */}
          <div className="flex flex-col items-center w-full max-w-md absolute left-1/2 -translate-x-1/2 bottom-2 sm:static sm:translate-x-0">
            {/* Controls */}
            <div className="flex items-center gap-4 sm:gap-6 mb-1 sm:mb-2">
              <button
                onClick={(e) => handleAction(e, () => dispatch(toggleShuffle()))}
                className={`hidden sm:block transition-colors ${
                  isShuffle ? "text-indigo-400" : "text-zinc-500 hover:text-white"
                }`}
                title="Shuffle"
              >
                <Shuffle size={16} />
                {isShuffle && (
                  <div className="h-1 w-1 bg-indigo-400 rounded-full mx-auto mt-0.5" />
                )}
              </button>

              <button
                onClick={(e) => handleAction(e, handlePrev)}
                className="text-zinc-300 hover:text-white hover:scale-110 transition-all"
              >
                <SkipBack size={22} className="fill-current" />
              </button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => handleAction(e, handleTogglePlay)}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] hover:scale-105 transition-all"
              >
                {isPlaying ? (
                  <Pause size={20} className="fill-black" />
                ) : (
                  <Play size={20} className="ml-1 fill-black" />
                )}
              </motion.button>

              <button
                onClick={(e) => handleAction(e, handleNext)}
                className="text-zinc-300 hover:text-white hover:scale-110 transition-all"
              >
                <SkipForward size={22} className="fill-current" />
              </button>

              <button
                onClick={(e) => handleAction(e, () => dispatch(toggleRepeat()))}
                className={`hidden sm:block transition-colors ${
                  repeatMode !== "off"
                    ? "text-indigo-400"
                    : "text-zinc-500 hover:text-white"
                }`}
                title="Repeat"
              >
                {repeatMode === "one" ? (
                  <Repeat1 size={16} />
                ) : (
                  <Repeat size={16} />
                )}
                {repeatMode !== "off" && (
                  <div className="h-1 w-1 bg-indigo-400 rounded-full mx-auto mt-0.5" />
                )}
              </button>
            </div>

            {/* Progress Bar */}
            <div
              className="w-35 sm:w-full flex items-center gap-2 text-[10px] sm:text-xs text-white/40 font-mono"
              onClick={(e) => e.stopPropagation()} // Stop propagation on progress container
            >
              <span className="hidden sm:inline w-8 text-right">
                {formatTime(currentTime)}
              </span>

              <div
                className="relative flex-1 h-1 sm:h-1.5 bg-white/10 rounded-full cursor-pointer group py-1"
                onClick={handleSeek}
              >
                <div className="absolute top-1/2 -translate-y-1/2 left-0 h-1 sm:h-1.5 w-full rounded-full bg-white/5" />
                <div
                  className="absolute top-1/2 -translate-y-1/2 left-0 h-1 sm:h-1.5 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full group-hover:from-indigo-400 group-hover:to-pink-400 transition-all"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] opacity-0 group-hover:opacity-100 transition-opacity scale-150" />
                </div>
              </div>

              <span className="hidden sm:inline w-8">
                {formatTime(duration || currentSong.duration)}
              </span>
            </div>
          </div>

          {/* --- RIGHT: Volume --- */}
          <div className="flex items-center justify-end gap-3 w-1/3 min-w-0">
            {/* Volume Container - Stop Propagation Here */}
            <div
              onClick={(e) => e.stopPropagation()} 
              className="hidden sm:flex items-center gap-2 group/vol"
            >
              <button
                onClick={() => setVolume(volume === 0 ? 1 : 0)}
                className="text-white/60 hover:text-white"
              >
                {volume === 0 ? (
                  <VolumeX size={18} />
                ) : volume < 0.5 ? (
                  <Volume1 size={18} />
                ) : (
                  <Volume2 size={18} />
                )}
              </button>
              {/* Custom Volume Slider */}
              <div
                className="w-16 h-1 bg-white/10 rounded-full cursor-pointer relative overflow-hidden"
                onClick={handleVolumeSeek}
              >
                <div
                  className="absolute top-0 left-0 h-full bg-white rounded-full group-hover/vol:bg-indigo-400 transition-colors"
                  style={{ width: `${volume * 100}%` }}
                />
              </div>
            </div>

            <button
              onClick={(e) => handleAction(e, () => setIsFullScreen(true))}
              className="text-white/60 hover:text-white transition-colors"
            >
              <Maximize2 size={18} />
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isFullScreen && (
          <FullScreenPlayer
            onClose={() => setIsFullScreen(false)}
            progress={progress}
            duration={duration}
            currentTime={currentTime}
            onSeek={handleSeek}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default MusicPlayer;