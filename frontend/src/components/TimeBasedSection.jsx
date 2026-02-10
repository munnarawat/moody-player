import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Sun,
  Moon,
  Sunset,
  Coffee,
  Play,
  Music,
  Type,
  icons,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TimeBasedSection = () => {
  const [timeState, setTimeState] = useState({
    greeting: "Hello",
    icon: Sun,
    label: "Day",
    playlists: [],
  });
  const navigate = useNavigate();
  const getIconAndLabel = (category) => {
    switch (category) {
      case "morning":
        return { icon: Coffee, label: "start your day right" };
      case "afternoon":
        return { icon: Sun, label: "Keep the flow going" };
      case "evening":
        return { icon: Sunset, label: "Unwind & Relax" };
      case "night":
        return { icon: Moon, label: "Sleep tight" };
      default:
        return { icon: Music, label: "Listen to the best" };
    }
  };

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/timePlaylist/get-by-time",
        );
        const { greeting, category, data } = response.data;
        const mappedPlaylists = data.map((item) => ({
          _id: item._id,
          title: item.name,
          subtitle: item.description,
          color: item.gradient,
          image:item.coverImage
        }));
        const { icon, label } = getIconAndLabel(category);
        setTimeState  ({
          greeting: greeting,
          icon: icon,
          label: label,
          playlists: mappedPlaylists,
        });
      } catch (error) {
        console.error("Error fetching playlists:", error);
        setTimeState((prev) => ({
          ...prev,
          greeting: "Welcome Back",
          label: "Library",
        }));
      }
    };
    fetchPlaylist();
  }, []);
  const MainIcon = timeState.icon;  
 
  return (
    <div className="w-full px-4 mt-12 mb-8">
      {/* 👋 Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
            <MainIcon size={24} className="text-yellow-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {timeState.greeting}
            </h2>
            <p className="text-white/40 text-sm">{timeState.label}</p>
          </div>
        </div>
        <button className="text-xs text-white/40 hover:text-white uppercase tracking-widest transition-colors">
          See All
        </button>
      </div>
      {/* 🎵 Premium Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {timeState.playlists.map((playlist, index) => (
          <motion.div
            key={playlist._id||index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => navigate(`/playList/${playlist._id}`, { state: playlist })}
            className="group relative bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-2xl p-4 cursor-pointer transition-all duration-300">
            {/* 🌟 Glow Effect on Hover (Background Light) */}
            <div
            style={{background:playlist.color}}
              className='absolute inset-0 bg-linear-to-br ${playlist.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500 blur-xl'
            />
            <div className="flex items-center gap-4 relative z-10">
              {/* 🖼️ Album Art Placeholder (Dynamic Gradient) */}
              <div
              style={{background:playlist.color}}
                className='relative w-20 h-20 rounded-xl   shadow-lg overflow-hidden group-hover:scale-105 transition-transform duration-300'>
                {/* Image Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Music size={24} className="text-white/50" />
                </div>
                {/* ▶️ Play Button Overlay (Visible on Hover) */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl">
                    <Play size={18} className="text-black ml-1" fill="black" />
                  </motion.div>
                </div>
              </div>
              {/* 📝 Text Info */}
              <div className="flex flex-col  justify-center">
                <h3 className="text-white font-bold text-lg leading-tight group-hover:text-indigo-300 transition-colors">
                  {playlist.title}
                </h3>
                <p className="text-white/40 text-xs mt-1 font-medium tracking-wide uppercase">
                  {playlist.subtitle.slice(0,30)}...
                </p>
                {/* Fake 'Likes' count to make it look real */}
                <div className="flex items-center gap-1 mt-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  <span className="text-[10px] text-white/30">Active Now</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TimeBasedSection;
