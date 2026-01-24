import React, { useState, useEffect } from "react";

const SongDuration = ({ url }) => {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!url) return;
    
    const audio = new Audio(url);
    audio.onloadedmetadata = () => {
      setDuration(audio.duration);
    };
  }, [url]);

  const formatTime = (seconds) => {
    if (!seconds) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return <span className="text-sm text-white/50">{formatTime(duration)}</span>;
};

export default SongDuration;