import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Sunset, Coffee, Play } from "lucide-react";

const TimeBasedSection = () => {
  const [timeState, setTimeState] = useState({
    greeting: "Hello",
    icon: Sun,
    label: "Day",
    playlists: [],
  });

  useEffect(() => {
    const hour = new Date().getHours();
    // 🕒 Logic to determine time of day
    if (hour >= 5 && hour < 12) {
      setTimeState({
        greeting: "Good Morning",
        icon: Coffee,
        label: "Morning Vibes",
        playlists: [
          { title: "Morning Boost", subtitle: "Energy & Pop", img: "bg-orange-500" },
          { title: "Coffee Jazz", subtitle: "Relaxing Instrumental", img: "bg-amber-700" },
          { title: "Meditation", subtitle: "Start Calm", img: "bg-teal-600" },
        ],
      });
    } else if (hour >= 12 && hour < 17) {
      setTimeState({
        greeting: "Good Afternoon",
        icon: Sun,
        label: "Stay Focused",
        playlists: [
          { title: "Deep Focus", subtitle: "Beats to work to", img: "bg-blue-600" },
          { title: "Top Hits", subtitle: "Trending Now", img: "bg-pink-500" },
          { title: "Lo-Fi Beats", subtitle: "Chill Study", img: "bg-indigo-500" },
        ],
      });
    } else if (hour >= 17 && hour < 21) {
      setTimeState({
        greeting: "Good Evening",
        icon: Sunset,
        label: "Unwind & Relax",
        playlists: [
          { title: "Sunset Chill", subtitle: "Acoustic Vibes", img: "bg-purple-600" },
          { title: "Workout Mode", subtitle: "High Intensity", img: "bg-red-600" },
          { title: "Party Starters", subtitle: "Dance & Electronic", img: "bg-violet-600" },
        ],
      });
    } else {
      setTimeState({
        greeting: "Good Night",
        icon: Moon,
        label: "Sleepy Time",
        playlists: [
          { title: "Sleep Sounds", subtitle: "Rain & Thunder", img: "bg-slate-700" },
          { title: "Late Night Drive", subtitle: "Phonk & Trap", img: "bg-cyan-900" },
          { title: "Sad Hours", subtitle: "Slowed + Reverb", img: "bg-blue-900" },
        ],
      });
    }
  }, []);

  const Icon = timeState.icon;

  return (
    <div className="w-full px-4 mt-10">
      {/* 👋 Greeting Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-white/10 rounded-full backdrop-blur-md">
          <Icon size={24} className="text-yellow-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {timeState.greeting}
          </h2>
          <p className="text-white/50 text-sm">Suggested for {timeState.label}</p>
        </div>
      </div>

      {/* 🎵 Cards Grid/Scroll */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {timeState.playlists.map((playlist, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            whileHover={{ scale: 1.02 }}
            className="group relative h-24 bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-pointer flex items-center pr-4 hover:bg-white/10 transition-colors"
          >
            {/* Fake Image Placeholder (In future, replace with <img src={...} />) */}
            <div className={`h-full w-24 ${playlist.img} mr-4 flex items-center justify-center`}>
                <Icon className="text-white/50 opacity-50" />
            </div>

            {/* Text Content */}
            <div className="flex-1">
              <h3 className="font-bold text-white text-lg">{playlist.title}</h3>
              <p className="text-white/40 text-xs uppercase tracking-wider">
                {playlist.subtitle}
              </p>
            </div>

            {/* Play Button (Visible on Hover) */}
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 shadow-lg shadow-green-500/40">
              <Play size={20} fill="black" className="text-black ml-1" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TimeBasedSection;