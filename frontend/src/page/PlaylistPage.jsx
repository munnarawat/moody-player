import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Play,
  Clock,
  Heart,
  MoreHorizontal,
  Pause,
} from "lucide-react";
import { motion } from "framer-motion";

const PlaylistPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Home page se data receive kar rahe hain (State ke through)
  // Agar direct link se khula to fallback data use hoga
  const playlistData = location.state || {
    title: "Unknown Playlist",
    subtitle: "N/A",
    color: "from-gray-700 to-black",
    image: null,
  };

  // Dummy Songs Data (Baad mein API se replace hoga)
  const songs = [
    {
      id: 1,
      title: "Midnight City",
      artist: "M83",
      album: "Hurry Up, We're Dreaming",
      duration: "4:03",
    },
    {
      id: 2,
      title: "Starboy",
      artist: "The Weeknd",
      album: "Starboy",
      duration: "3:50",
    },
    {
      id: 3,
      title: "Sweater Weather",
      artist: "The Neighbourhood",
      album: "I Love You.",
      duration: "3:55",
    },
    {
      id: 4,
      title: "Heatline",
      artist: "Smoke Mood",
      album: "Single",
      duration: "2:45",
    },
    {
      id: 5,
      title: "Raanjhan",
      artist: "Parampara Thakur",
      album: "Raanjhan",
      duration: "3:12",
    },
    {
      id: 6,
      title: "Blinding Lights",
      artist: "The Weeknd",
      album: "After Hours",
      duration: "3:20",
    },
    {
      id: 7,
      title: "Levitating",
      artist: "Dua Lipa",
      album: "Future Nostalgia",
      duration: "3:23",
    },
  ];

  return (
    // pb-32 is VERY IMPORTANT to prevent overlap with Floating Player
    <div className="min-h-screen bg-black text-white  pb-32">
      {/* --- HERO SECTION (Gradient Background) --- */}
      <div
        className={`relative pt-30 pb-8 px-6  bg-linear-to-b ${playlistData.color} to-black/60`}>
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-18 left-6 p-2 bg-black/20 hover:bg-white/10 rounded-full backdrop-blur-md transition-colors z-20">
          <ArrowLeft size={24} />
        </button>

        <div className="flex flex-col md:flex-row items-end gap-6 max-w-7xl mx-auto">
          {/* Album Art with Shadow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-52 h-52 md:w-60 md:h-60 bg-white/10 shadow-2xl shadow-black/50 rounded-lg overflow-hidden shrink-0">
            
            <div
              className={`w-full h-full bg-linear-to-br ${playlistData.color}`}
            />
          </motion.div>

          {/* Text Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col gap-2 w-full">
            <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-white/80">
              Public Playlist
            </span>
            <h1 className="text-4xl md:text-7xl font-black tracking-tight mb-2">
              {playlistData.title}
            </h1>
            <p className="text-white/60 text-sm md:text-base font-medium">
              {playlistData.subtitle}
            </p>

            <div className="flex items-center gap-2 text-sm text-white/70 mt-2">
              <span className="font-bold text-white">Moody Player</span>
              <span>• {songs.length} songs, about 30 min</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* --- ACTION BAR (Play & Buttons) --- */}
      <div className="px-6 py-6 flex items-center gap-6 max-w-7xl mx-auto">
        {/* Big Play Button */}
        <button className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center hover:scale-105 hover:bg-purple-500 transition-all shadow-lg shadow-purple-900/40 text-white">
          <Play size={28} fill="white" className="ml-1" />
        </button>

        <button className="text-white/60 hover:text-white transition-colors">
          <Heart size={32} />
        </button>
        <button className="text-white/60 hover:text-white transition-colors">
          <MoreHorizontal size={32} />
        </button>
      </div>

      {/* --- SONG LIST SECTION --- */}
      <div className="px-4 md:px-8 max-w-7xl mx-auto mt-2">
        {/* Table Header */}
        <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[50px_2fr_1fr_50px] gap-4 text-white/40 text-sm border-b border-white/10 pb-2 mb-4 px-2 uppercase tracking-wider font-medium">
          <span className="text-center">#</span>
          <span>Title</span>
          <span className="hidden md:block">Album</span>
          <span className="flex justify-end">
            <Clock size={16} />
          </span>
        </div>

        {/* Songs Rows */}
        <div className="flex flex-col">
          {songs.map((song, index) => (
            <div
              key={song.id}
              className="group grid grid-cols-[auto_1fr_auto] md:grid-cols-[50px_2fr_1fr_50px] gap-4 items-center p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
              {/* Index / Play Icon Hover Effect */}
              <div className="w-6 text-center text-white/60 text-sm font-medium flex justify-center">
                <span className="group-hover:hidden">{index + 1}</span>
                <Play
                  size={16}
                  className="hidden group-hover:block text-white"
                  fill="white"
                />
              </div>

              {/* Title & Artist */}
              <div className="flex flex-col">
                <span className="font-medium text-white text-base group-hover:text-purple-400 transition-colors line-clamp-1">
                  {song.title}
                </span>
                <span className="text-sm text-white/40 group-hover:text-white/60">
                  {song.artist}
                </span>
              </div>

              {/* Album (Hidden on Mobile) */}
              <div className="hidden md:block text-sm text-white/40 line-clamp-1 group-hover:text-white/60">
                {song.album}
              </div>

              {/* Duration / Like Icon on Hover */}
              <div className="flex justify-end text-sm text-white/60 font-mono">
                <span className="group-hover:hidden">{song.duration}</span>
                <Heart
                  size={16}
                  className="hidden group-hover:block text-white hover:fill-purple-500 hover:text-purple-500 transition-colors"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlaylistPage;
