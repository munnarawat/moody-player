import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { 
  Play, 
  Clock, 
  Heart, 
  MoreHorizontal, 
  Music, 
  Calendar,
  Loader
} from "lucide-react";
import { motion } from "framer-motion";

const PlaylistDetails = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Single Playlist
  useEffect(() => {
    const fetchPlaylistDetails = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`http://localhost:3000/api/playlist/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlaylist(response.data.playlist);
      } catch (error) {
        console.error("Error fetching playlist details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylistDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <Loader className="animate-spin text-indigo-500" size={40} />
      </div>
    );
  }

  if (!playlist) {
    return <div className="text-white text-center pt-20">Playlist not found 😕</div>;
  }

  return (
    <div className="min-h-screen bg-black   text-white pb-40">
      {/* --- HERO SECTION (Blur Background) --- */}
      <div className="relative w-full md:h-90 pt-20  overflow-hidden  ">
        {/* Blurred Background Image */}
        <div 
           className="absolute inset-0 bg-cover  bg-center blur-3xl opacity-50 scale-110"
           style={{ 
             backgroundImage: playlist.coverImage 
               ? `url(${playlist.coverImage})` 
               : 'linear-gradient(to bottom, #4f46e5, #000)' 
           }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-black" />

        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row items-end gap-6 p-8 h-full max-w-7xl mx-auto">
            {/* Cover Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-48 h-48 md:w-60 md:h-60 shadow-2xl shadow-black/50 rounded-xl overflow-hidden shrink-0 bg-white/5"
            >
              {playlist.coverImage ? (
                <img src={playlist.coverImage} alt={playlist.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-800 flex items-center justify-center">
                  <Music size={60} className="text-white/40" />
                </div>
              )}
            </motion.div>

            {/* Text Info */}
            <div className="mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white/80">Public Playlist</span>
              <h1 className="text-4xl md:text-7xl font-bold mt-2 mb-4 text-white drop-shadow-lg truncate">
                {playlist.name}
              </h1>
              <p className="text-white/60 text-sm font-medium mb-4 max-w-xl line-clamp-2">
                {playlist.description || "No description provided."}
              </p>
              
              <div className="flex items-center gap-2 text-sm text-white/80">
                <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold">
                   U
                </div>
                <span className="font-bold hover:underline cursor-pointer">Munna (Owner)</span>
                <span>•</span>
                <span>{playlist.songs?.length || 0} songs</span>
              </div>
            </div>
        </div>
      </div>

      {/* --- CONTROLS SECTION --- */}
      <div className="max-w-7xl mx-auto px-8 py-6  flex items-center gap-6">
        <button className="w-14 h-14 rounded-full bg-indigo-500 hover:bg-indigo-400 flex items-center justify-center hover:scale-105 transition shadow-lg shadow-indigo-500/30 text-black">
          <Play size={28} fill="currentColor" className="ml-1" />
        </button>
        <button className="text-white/50 hover:text-white transition">
          <Heart size={32} />
        </button>
        <button className="text-white/50 hover:text-white transition">
          <MoreHorizontal size={32} />
        </button>
      </div>

      {/* --- SONG LIST SECTION --- */}
      <div className="max-w-7xl mx-auto px-8">
        {/* Table Header */}
        <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 text-sm text-white/50 border-b border-white/10 pb-2 mb-4 px-4">
          <span>#</span>
          <span>Title</span>
          <span className="hidden md:block">Date Added</span>
          <span className="mr-4"><Clock size={16} /></span>
        </div>

        {/* Songs List */}
        <div className="flex flex-col">
          {playlist.songs && playlist.songs.length > 0 ? (
            playlist.songs.map((song, index) => (
              <div 
                key={song._id || index}
                className="group grid grid-cols-[auto_1fr_auto_auto] gap-4 items-center px-4 py-3 rounded-md hover:bg-white/10 transition cursor-pointer"
              >
                {/* Number / Play Icon */}
                <div className="w-6 text-center text-white/50 font-medium group-hover:text-white">
                  <span className="group-hover:hidden">{index + 1}</span>
                  <Play size={14} fill="white" className="hidden group-hover:block ml-1" />
                </div>

                {/* Song Info */}
                <div className="flex items-center gap-4">
                  {/* Song Image */}
                  <div className="w-10 h-10 rounded overflow-hidden bg-white/5">
                    {song.thumbnail ? (
                        <img src={song.thumbnail} alt={song.title} className="w-full h-full object-cover" />
                    ) : (
                        <Music className="p-2 w-full h-full text-white/40" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-white font-medium hover:underline truncate w-40 md:w-auto">
                      {song.title}
                    </h4>
                    <span className="text-sm text-white/50 hover:text-white hover:underline">
                      {song.artist}
                    </span>
                  </div>
                </div>

                {/* Date Added (Hidden on Mobile) */}
                <div className="hidden md:block text-sm text-white/50">
                  2 days ago
                </div>

                {/* Duration */}
                <div className="text-sm text-white/50 mr-4">
                  3:45
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 text-white/30 flex flex-col items-center">
              <Music size={40} className="mb-4 opacity-50" />
              <p>This playlist is empty.</p>
              <p className="text-sm mt-2">Go to Home and add some songs!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistDetails;