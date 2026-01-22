import { motion } from "framer-motion";
import React from "react";
import { Play, PlusCircle } from "lucide-react";

const SongsList = ({ handleSongClicked, songs, handleAddPlaylist }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-4 mb-30 gap-4">
      {songs.length > 0 &&
        songs.map((song, index) => (
          <motion.div
            key={song._id}
            whileHover={{ scale: 1.02 }}
            onClick={() => handleSongClicked(song)}
            className="bg-white/10 p-3 rounded-xl flex items-center justify-between gap-4 cursor-pointer hover:bg-white/20 transition-all group">
            {/* Song Image */}
            <div className="flex gap-2 relative  transition-all group">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                <img
                  src={song.imageUrl}
                  alt={song.title}
                  className="w-full h-full object-cover"
                />
                {/* Hover Play Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play size={20} fill="white" />
                </div>
              </div>
              {/* Song Info */}
              <div>
                <h3 className="font-bold">{song.title}</h3>
                <p className="text-sm text-white/60">{song.artist}</p>
              </div>
            </div>
            <button
              onClick={(e) => handleAddPlaylist(e, song._id)}
              className="p-2  right-0 mr-2 text-white/50 hover:text-indigo-400 transition-colors rounded-full hover:bg-white/10"
              title="Add to Playlist">
              <PlusCircle size={24} />
            </button>
          </motion.div>
        ))}
    </div>
  );
};

export default SongsList;
