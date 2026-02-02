import { motion, AnimatePresence } from "framer-motion";
import React, { useMemo } from "react";
import { Play, Plus, Clock, Music } from "lucide-react";
import LikedButton from "./LikedButton";

const SongsList = ({ handleSongClicked, songs, user, handleAddPlaylist }) => {
  const likedSongIds = useMemo(() => {
    return (
      user?.likedSongs?.map((item) =>
        typeof item === "string" ? item : item._id,
      ) || []
    );
  }, [user]);

  // Animation variants for Stagger Effect
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (!songs || songs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-white/30">
        <Music size={48} className="mb-4 opacity-50" />
        <p>No songs available right now.</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-2 pb-32">
      <AnimatePresence>
        {songs.map((song) => (
          <motion.div
            key={song._id}
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            onClick={() => handleSongClicked(song)}
            className="group relative bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 p-3 rounded-2xl cursor-pointer transition-all duration-300 backdrop-blur-sm overflow-hidden">
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-linear-to-r from-indigo-500/0 via-white/5 to-indigo-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
            <div className="flex items-center gap-4">
              {/* Left: Image & Play Button */}
              <div className="relative shrink-0 w-16 h-16 rounded-xl overflow-hidden shadow-lg shadow-black/40">
                <img
                  src={song.imageUrl}
                  alt={song.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                  <motion.div
                    initial={{ scale: 0.5 }}
                    whileHover={{ scale: 1.1 }}
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <Play size={14} className="text-black ml-0.5 fill-black" />
                  </motion.div>
                </div>
              </div>

              {/* Middle: Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                <h3 className="font-bold text-white text-base truncate pr-2 group-hover:text-indigo-400 transition-colors">
                  {song.title}
                </h3>
                <p className="text-xs text-white/50 truncate hover:text-white/80 transition-colors">
                  {song.artist}
                </p>

                {/* Duration & Genre Badge  */}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-white/40 border border-white/5">
                    {song.genre || "Pop"}
                  </span>
                </div>
              </div>

              {/* Right: Actions */}
              <div
                className="flex flex-col items-center gap-2"
                onClick={(e) => e.stopPropagation()}>
                {/* Heart Button */}
                <LikedButton
                  isAlreadyLiked={likedSongIds.includes(song._id)}
                  songId={song._id}
                />

                {/* Add Playlist Button */}
                <button
                  onClick={(e) => handleAddPlaylist(e, song._id)}
                  className="p-1.5 text-white/30 hover:text-white hover:bg-white/10 rounded-full transition-all active:scale-90"
                  title="Add to Playlist">
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default SongsList;
