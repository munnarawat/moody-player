import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Minimize2,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  MoreHorizontal,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  togglePlay,
  nextSong,
  prevSong,
  toggleShuffle,
  toggleRepeat,
} from "../store/songSlice";

const FullScreenPlayer = ({
  onClose,
  progress,
  duration,
  currentTime,
  onSeek,
  onVolumeChange,
  volume,
}) => {
  const dispatch = useDispatch();
  const { currentSong, isPlaying, isShuffle, repeatMode } = useSelector(
    (state) => state.song
  );

  const formatTime = (time) => {
    if (!time) return "0:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={{ duration: 0.4, ease: "circOut" }}
      className="fixed inset-0 z-60 h-screen w-screen overflow-hidden text-white"
    >
      {/* 🌌 Futuristic Animated Background */}
      <div className="absolute bg-black inset-0">
        <img
          src={currentSong?.imageUrl}
          alt="bg"
          className="w-full h-full object-cover blur-xs opacity-70"
        />
        <motion.div
          className="absolute inset-0 bg-linear-to-br from-indigo-600/30 via-purple-600/20 to-cyan-400/30"
          animate={{ opacity: [0.6, 0.8, 0.6] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between px-2 py-5 sm:px-12 ">
        {/* Header */}
        <div className="flex justify-between items-center">
          <button
            onClick={onClose}
            className="p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition"
          >
            <Minimize2 size={22} />
          </button>
          <div className="text-center">
            <p className="text-xs tracking-widest text-white/60 uppercase">
              Now Playing
            </p>
            <p className="text-sm font-semibold">Moody Player</p>
          </div>
          <button className="p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition">
            <MoreHorizontal size={22} />
          </button>
        </div>

        {/* 💿 Hologram Disc */}
        <div className="flex-1 flex flex-col items-center justify-center gap-8">
          <div className="relative">
            {/* Glow Ring */}
            <motion.div
              className="absolute inset-0 rounded-full blur-xl"
              animate={{ opacity: isPlaying ? [0.6, 1, 0.6] : 0.4 }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                boxShadow: "0 0 80px rgba(99,102,241,0.8)",
              }}
            />
            <motion.div
              className="relative w-56 h-56 rounded-full border border-white/20 overflow-hidden"
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{
                duration: 20,
                repeat: isPlaying ? Infinity : 0,
                ease: "linear",
              }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentSong?.imageUrl}
                  src={currentSong?.imageUrl}
                  alt="album"
                  className="w-full h-full object-cover rounded-full"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                />
              </AnimatePresence>
              {/* Center Hole */}
              <div className="absolute inset-0 m-auto w-10 h-10 bg-black rounded-full border border-white/20" />
            </motion.div>
          </div>

          {/* Song Info */}
          <div className="text-center">
            <AnimatePresence mode="wait">
              <motion.h2
                key={currentSong?.title}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-indigo-300"
              >
                {currentSong?.title || "No Song"}
              </motion.h2>
            </AnimatePresence>
            <p className="text-lg text-white/60 mt-1">
              {currentSong?.artist || ""}
            </p>
          </div>
        </div>

        {/* 🎛️ Controls Glass Panel */}
        <motion.div
          className="w-full max-w-3xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl"
        >
          {/* Progress Bar */}
          <div className="mb-3">
            <div
              onClick={onSeek}
              className="relative h-2 rounded-full bg-white/10 cursor-pointer overflow-hidden"
            >
              <div
                className="absolute top-0 left-0 h-full bg-linear-to-r from-cyan-400 via-indigo-500 to-purple-500 shadow-[0_0_20px_rgba(99,102,241,0.8)]"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.9)]" />
              </div>
            </div>
            <div className="flex justify-between text-xs text-white/50 mt-1 font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          {/* Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => dispatch(toggleShuffle())}
              className={`transition ${
                isShuffle ? "text-cyan-400 drop-shadow-[0_0_10px_#22d3ee]" : "text-white/40"
              } hover:scale-110 outline-0`}
            >
              <Shuffle />
            </button>

            <div className="flex items-center gap-8">
              <button
                onClick={() => dispatch(prevSong())}
                className="hover:scale-110 hover:text-indigo-400 transition"
              >
                <SkipBack fill="currentColor" />
              </button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => dispatch(togglePlay())}
                className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.9)] hover:shadow-[0_0_50px_rgba(99,102,241,1)] transition"
              >
                {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
              </motion.button>

              <button
                onClick={() => dispatch(nextSong())}
                className="hover:scale-110 hover:text-indigo-400 transition"
              >
                <SkipForward fill="currentColor" />
              </button>
            </div>
            <button
              onClick={() => dispatch(toggleRepeat())}
              className={`transition ${
                repeatMode !== "off"
                  ? "text-purple-400 drop-shadow-[0_0_10px_#a855f7]"
                  : "text-white/40"
              } hover:scale-110`}
            >
              <Repeat />
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FullScreenPlayer;
