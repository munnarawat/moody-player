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
import { togglePlay, nextSong, prevSong } from "../store/songSlice"; 

const MusicPlayer = () => {
  const dispatch = useDispatch();

  const { currentSong, isPlaying } = useSelector((state) => state.song);
  
  const audioRef = useRef(new Audio());
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // 1. 🎵 Jab Song Change ho
  useEffect(() => {
    if (currentSong) {
      console.log("💿 Playing Song:", currentSong);
    console.log("🔗 Audio URL:", currentSong.audioUrl);
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

  useEffect(() => {
    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => console.log("Play interrupted:", error));
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // ✅ Toggle Function
  const handleTogglePlay = () => {
    dispatch(togglePlay());
  };

  // ✅ Next/Prev Functions
  const handleNext = () => dispatch(nextSong());
  const handlePrev = () => dispatch(prevSong());

  if (!currentSong) return null;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-0 left-0 right-0 z-50 px-4 py-4 sm:px-6"
    >
      {/* 🎵 Player Container (Glass Effect) */}
      <div className="w-full h-20 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-between px-4 sm:px-8 shadow-2xl shadow-black/50">
        
        {/* LEFT: Song Info */}
        <div className="flex items-center gap-4 w-1/4">
          <motion.div
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 rounded-full border-2 border-white/10 overflow-hidden"
          >
            <img
              src={currentSong.imageUrl}
              alt="Album Art"
              className="w-full h-full object-cover"
            />
          </motion.div>

          <div className="hidden sm:block">
            <h4 className="text-white font-bold text-sm truncate">
              {currentSong.title}
            </h4>
            <p className="text-white/40 text-xs">{currentSong.artist}</p>
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
            <Shuffle size={16} className="text-white/40 hover:text-white cursor-pointer" />
            
            <SkipBack
              size={20}
              onClick={handlePrev}
              className="text-white hover:text-indigo-400 cursor-pointer fill-white"
            />

            {/* Play/Pause Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleTogglePlay} // ✅ Correct Function
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-white/20"
            >
              {isPlaying ? (
                <Pause size={20} className="text-black fill-black" />
              ) : (
                <Play size={20} className="text-black ml-1 fill-black" />
              )}
            </motion.button>

            <SkipForward
              size={20}
              onClick={handleNext}
              className="text-white hover:text-indigo-400 cursor-pointer fill-white"
            />
            
            <Repeat size={16} className="text-white/40 hover:text-white cursor-pointer" />
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md flex items-center gap-2 text-xs text-white/40 font-mono">
            <span>0:00</span>
            <div className="relative flex-1 h-1 bg-white/10 rounded-full cursor-pointer group">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full group-hover:from-indigo-400 group-hover:to-purple-400"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span>3:45</span>
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