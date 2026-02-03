import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Minimize2, Play, Pause, SkipBack, SkipForward, 
  Repeat, Shuffle, Heart, MoreHorizontal 
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { togglePlay, nextSong, prevSong, toggleShuffle, toggleRepeat } from "../store/songSlice";

const FullScreenPlayer = ({ onClose, progress, duration, currentTime, onSeek }) => {
  const dispatch = useDispatch();
  const { currentSong, isPlaying, isShuffle, repeatMode } = useSelector((state) => state.song);

  // Format time helper
  const formatTime = (time) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={{ duration: 0.4, ease: "circOut" }}
      className="fixed h-screen inset-0 z-60 flex flex-col bg-black text-white overflow-hidden"
    >
      {/* --- 1. Dynamic Background (Blur) --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-10" /> {/* Dark Overlay */}
        <img
          src={currentSong?.imageUrl}
          alt="Blur Background"
          className="w-full h-full object-cover blur-[80px] opacity-60 scale-110"
        />
      </div>

      {/* --- 2. Content Container --- */}
      <div className="relative  z-20 h-screen flex flex-col  px-6 py-8 sm:px-12 sm:py-12 justify-between ">
        
        {/* Header */}
        <div className="flex  justify-between items-center">
          <button onClick={onClose} className="p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all">
            <Minimize2 size={24} />
          </button>
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold tracking-widest text-white/60 uppercase">Playing From Playlist</span>
            <span className="text-sm font-semibold">Moody Favorites</span>
          </div>
          <button className="p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all">
            <MoreHorizontal size={24} />
          </button>
        </div>

        {/* Middle: Vinyl / Album Art & Mood */}
        <div className="flex-1 flex flex-col items-center justify-center gap-8">
          <motion.div
            className="relative w-52 h-52  rounded-full shadow-[0_0_60px_rgba(0,0,0,0.6)] border-4 border-white/5"
          >
            {/* Spinning Vinyl Effect */}
            <motion.img
              src={currentSong?.imageUrl}
              alt="Album Art"
              className="w-full h-full object-cover rounded-full"
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            {/* Inner Vinyl Hole */}
            <div className="absolute inset-0 m-auto w-12 h-12 bg-black rounded-full border-2 border-zinc-800 flex items-center justify-center">
                <div className="w-3 h-3 bg-zinc-900 rounded-full" />
            </div>
          </motion.div>

          {/* Song Details */}
          <div className="text-center space-y-2">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              className="text-4xl  font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400"
            >
              {currentSong?.title}
            </motion.h2>
            <p className="text-xl text-white/60 font-medium">{currentSong?.artist}</p>
          </div>
        </div>

        {/* Bottom: Glassmorphism Controls */}
        <div className="w-full max-w-3xl  mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl p-6 shadow-2xl">
          
          {/* Progress Bar */}
          <div className="mb-2 group">
            <div 
              className="relative h-1.5 bg-white/10 rounded-full cursor-pointer overflow-visible"
              onClick={onSeek}
            >
              <div 
                className="absolute top-0 left-0 h-full bg-indigo-500 rounded-full group-hover:bg-indigo-400 transition-all"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all" />
              </div>
            </div>
            <div className="flex justify-between mt-1 text-xs font-mono text-white/40">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Main Controls Row */}
          <div className="flex items-center justify-between">
            <button onClick={() => dispatch(toggleShuffle())} className={`${isShuffle ? "text-indigo-400" : "text-white/40"} hover:scale-110 transition`}>
              <Shuffle size={24} />
            </button>

            <div className="flex items-center gap-8">
              <button onClick={() => dispatch(prevSong())} className="text-white hover:text-indigo-400 transition hover:scale-110">
                <SkipBack size={24} fill="currentColor" />
              </button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => dispatch(togglePlay())}
                className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] transition-all"
              >
                {isPlaying ? <Pause size={32} fill="black" /> : <Play size={32} fill="black" className="ml-1" />}
              </motion.button>

              <button onClick={() => dispatch(nextSong())} className="text-white hover:text-indigo-400 transition hover:scale-110">
                <SkipForward size={24} fill="currentColor" />
              </button>
            </div>

            <button onClick={() => dispatch(toggleRepeat())} className={`${repeatMode !== 'off' ? "text-indigo-400" : "text-white/40"} hover:scale-110 transition`}>
              <Repeat size={24} />
            </button>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default FullScreenPlayer;