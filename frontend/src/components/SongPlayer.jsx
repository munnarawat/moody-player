import React, { useState, useRef, useEffect } from "react";
import { IoShuffle, IoRepeatOutline } from "react-icons/io5";
import { MdSkipPrevious, MdSkipNext } from "react-icons/md";
import { FaPlay, FaPause } from "react-icons/fa";

const SongPlayer = ({ songs }) => {
  // State variables
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [trackProgress, setTrackProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef(null);
  const intervalRef = useRef();

  const formatTime = (seconds) => {
    if (!seconds) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Check if songs data is available
  const currentSong =
    songs && songs.length > 0 ? songs[currentSongIndex] : null;

  // Handle Play/Pause
  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
      clearInterval(intervalRef.current);
    } else {
      audioRef.current.play();
      startTimer();
    }
    setIsPlaying(!isPlaying);
  };

  // Handle Next Song
  const handleNext = () => {
    if (currentSongIndex < songs.length - 1) {
      setCurrentSongIndex((prev) => prev + 1);
    } else {
      setCurrentSongIndex(0); // Loop back to start
    }
    setIsPlaying(true);
  };

  // Handle Previous Song
  const handlePrev = () => {
    if (currentSongIndex > 0) {
      setCurrentSongIndex((prev) => prev - 1);
    } else {
      setCurrentSongIndex(songs.length - 1); // Loop to end
    }
    setIsPlaying(true);
  };

  // Handle Progress Bar Drag
  const onScrub = (value) => {
    clearInterval(intervalRef.current);
    audioRef.current.currentTime = value;
    setTrackProgress(audioRef.current.currentTime);
  };

  const onScrubEnd = () => {
    if (!isPlaying) {
      setIsPlaying(true);
    }
    startTimer();
    audioRef.current.play();
  };

  // Timer to update progress bar
  const startTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        handleNext();
      } else {
        setTrackProgress(audioRef.current.currentTime);
      }
    }, 1000);
  };

  // autoplay song when user mood detected
  useEffect(()=>{
    if(songs && songs.length>0){
      setCurrentSongIndex(0);
      setIsPlaying(true)
    }
  },[songs])
  // Effect: Reset player when song changes
  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load(); // Load new source

      // Auto play if already playing 
      if (isPlaying) {
        audioRef.current.play().catch((e) => console.log("Play error:", e));
      }
    }
  }, [currentSongIndex, songs ]);

  // Effect: Set duration when metadata loads
  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  if (!currentSong) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-white">
        <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-bold">Waiting for Mood...</h2>
        <p className="text-zinc-400 text-sm">
          Please scan your face to generate a playlist.
        </p>
      </div>
    );
  }

  const progressPercent = duration ? (trackProgress / duration) * 100 : 0;

  return (
    <div className="w-full flex items-center justify-center p-4">
      <audio
        ref={audioRef}
        src={currentSong.audio}
        onLoadedMetadata={onLoadedMetadata}
      />
      <div className="player w-full md:w-[700px] p-5 bg-zinc-800/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="image-container w-20 h-20 rounded-xl overflow-hidden shadow-lg shadow-purple-500/20 flex-shrink-0">
            <img
              className={`w-full h-full object-cover transition-transform duration-500 ${
                isPlaying ? "animate-pulse" : ""
              }`}
              src={currentSong.image || "https://plus.unsplash.com/premium_photo-1676068243778-2652632e1f4c?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
              alt="Album Art"
            />
          </div>

          <div className="songs-details overflow-hidden">
            <h2 className="text-white font-bold text-lg leading-tight truncate w-32 md:w-40">
              {currentSong.title || "Unknown Title"}
            </h2>
            <h3 className="text-zinc-400 text-xs mt-1 uppercase tracking-wider">
              {currentSong.artist || "Unknown Artist"}
            </h3>
          </div>
        </div>

        {/* Center: Controls */}
        <div className="song-controls flex flex-col items-center flex-1 w-full">
          {/* Controller Buttons */}
          <div className="controllers flex gap-6 items-center mb-3">
            <button className="text-xl text-zinc-500 hover:text-white transition-colors cursor-pointer">
              <IoShuffle />
            </button>

            <button
              onClick={handlePrev}
              className="text-3xl text-zinc-300 hover:text-white hover:-translate-x-1 transition-all cursor-pointer">
              <MdSkipPrevious />
            </button>

            {/* Play/Pause Button */}
            <div
              onClick={handlePlayPause}
              className="play-pause w-12 h-12 rounded-full bg-white text-black flex items-center justify-center cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] hover:scale-105 transition-all">
              {isPlaying ? (
                <FaPause className="text-sm" />
              ) : (
                <FaPlay className="ml-1 text-sm" />
              )}
            </div>

            <button
              onClick={handleNext}
              className="text-3xl text-zinc-300 hover:text-white hover:translate-x-1 transition-all cursor-pointer">
              <MdSkipNext />
            </button>

            <button className="text-xl text-zinc-500 hover:text-white transition-colors cursor-pointer">
              <IoRepeatOutline />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="progress-bar w-full flex gap-3 items-center px-2 group">
            <span className="text-[10px] text-zinc-400 font-mono w-8 text-right">
              {formatTime(trackProgress)}
            </span>

            <div className="relative w-full h-1 bg-zinc-600 rounded-full cursor-pointer group-hover:h-1.5 transition-all duration-300">
              {/* Visual Progress */}
              <div
                className="absolute top-0 left-0 h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-100"
                style={{ width: `${progressPercent}%` }}></div>

              {/* Thumb */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ left: `${progressPercent}%` }}></div>

              {/* Interaction Input */}
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={trackProgress}
                onChange={(e) => onScrub(e.target.value)}
                onMouseUp={onScrubEnd}
                onKeyUp={onScrubEnd}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
            </div>

            <span className="text-[10px] text-zinc-400 font-mono w-8">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongPlayer;
