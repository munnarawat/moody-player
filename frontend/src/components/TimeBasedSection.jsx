import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Sunset, Coffee, Play, Music } from "lucide-react";

const TimeBasedSection = () => {
  const [timeState, setTimeState] = useState({
    greeting: "Hello",
    icon: Sun,
    label: "Day",
    playlists: [],
  });

  useEffect(() => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      setTimeState({
        greeting: "Good Morning",
        icon: Coffee,
        label: "Start your day right",
        playlists: [
          { title: "Morning Boost", subtitle: "Energy & Pop", color: "from-orange-400 to-red-500" },
          { title: "Coffee Jazz", subtitle: "Relaxing Instrumental", color: "from-amber-700 to-orange-900" },
          { title: "Meditation", subtitle: "Start Calm", color: "from-teal-400 to-emerald-600" },
        ],
      });
    } else if (hour >= 12 && hour < 17) {
      setTimeState({
        greeting: "Good Afternoon",
        icon: Sun,
        label: "Keep the flow going",
        playlists: [
          { title: "Deep Focus", subtitle: "Beats to work to", color: "from-blue-500 to-indigo-600" },
          { title: "Top Hits", subtitle: "Trending Global", color: "from-pink-500 to-rose-500" },
          { title: "Lo-Fi Beats", subtitle: "Chill Study", color: "from-violet-500 to-purple-600" },
        ],
      });
    } else if (hour >= 17 && hour < 21) {
      setTimeState({
        greeting: "Good Evening",
        icon: Sunset,
        label: "Unwind & Relax",
        playlists: [
          { title: "Sunset Chill", subtitle: "Acoustic Vibes", color: "from-purple-500 to-indigo-500" },
          { title: "Workout Mode", subtitle: "High Intensity", color: "from-red-500 to-orange-600" },
          { title: "Party Starters", subtitle: "Dance & Electronic", color: "from-fuchsia-500 to-pink-600" },
        ],
      });
    } else {
      setTimeState({
        greeting: "Good Night",
        icon: Moon,
        label: "Sleep tight",
        playlists: [
          { title: "Sleep Sounds", subtitle: "Rain & Thunder", color: "from-slate-700 to-slate-900" },
          { title: "Late Night Drive", subtitle: "Phonk & Trap", color: "from-blue-900 to-black" },
          { title: "Sad Hours", subtitle: "Slowed + Reverb", color: "from-indigo-900 to-blue-900" },
        ],
      });
    }
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
        {/* 'See all' button for realism */}
        <button className="text-xs text-white/40 hover:text-white uppercase tracking-widest transition-colors">
            See All
        </button>
      </div>
      {/* 🎵 Premium Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {timeState.playlists.map((playlist, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-2xl p-4 cursor-pointer transition-all duration-300"
          >
            {/* 🌟 Glow Effect on Hover (Background Light) */}
            <div className={`absolute inset-0 bg-gradient-to-br ${playlist.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500 blur-xl`} />

            <div className="flex items-center gap-4 relative z-10">
              
              {/* 🖼️ Album Art Placeholder (Dynamic Gradient) */}
              <div className={`relative w-20 h-20 rounded-xl bg-gradient-to-br ${playlist.color} shadow-lg overflow-hidden group-hover:scale-105 transition-transform duration-300`}>
                {/* Image Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <Music size={24} className="text-white/50" />
                </div>
                
                {/* ▶️ Play Button Overlay (Visible on Hover) */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
                   <motion.div
                     whileHover={{ scale: 1.1 }}
                     whileTap={{ scale: 0.9 }}
                     className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl"
                   >
                     <Play size={18} className="text-black ml-1" fill="black" />
                   </motion.div>
                </div>
              </div>
              {/* 📝 Text Info */}
              <div className="flex flex-col justify-center">
                <h3 className="text-white font-bold text-lg leading-tight group-hover:text-indigo-300 transition-colors">
                    {playlist.title}
                </h3>
                <p className="text-white/40 text-xs mt-1 font-medium tracking-wide uppercase">
                    {playlist.subtitle}
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