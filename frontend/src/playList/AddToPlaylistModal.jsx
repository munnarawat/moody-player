import React, { useEffect, useState } from "react";
import { X, Layers, Check, Plus } from "lucide-react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

const AddToPlaylistModal = ({isOpen, onClose, songId}) => {
    const dispatch = useDispatch();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) { 
      fetchPlaylist();
    }
  }, [isOpen]);
  const fetchPlaylist = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/playlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPlaylists(response.data.playlists);
    } catch (error) {
      console.error("Error fetching playlists", error);
    } finally {
      setLoading(false);
    }
  };
  const handleAddPlaylist = async (playlistId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/playlist/add-song`,
        {
          playlistId,
          songId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success("Song added to playlist! 🎵");
      onClose();
    } catch (error) {
      console.error("Add song error", error);
      if (error.response && error.response.status === 400) {
        toast.warning("Song is already in this playlist! ⚠️");
      } else {
        toast.error("Failed to add song. ❌");
      }
    }
  };

 
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative bg-[#121212] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Layers size={18} className="text-indigo-400" /> Add to Playlist
            </h3>
            <button
              onClick={onClose}
              className="text-white/50 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Playlist List */}
          <div className="max-h-80 overflow-y-auto p-2">
            {loading ? (
              <div className="text-center py-8 text-white/50">Loading...</div>
            ) : playlists?.length === 0 ? (
              <div className="text-center py-8 text-white/50">
                No playlists found. <br /> Create one first!
              </div>
            ) : (
              <div className="space-y-1">
                {playlists?.map((list) => (
                  <button
                    key={list._id}
                    onClick={() => handleAddPlaylist(list._id)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/10 transition group text-left">
                    <div className="flex items-center gap-3">
                      {/* Tiny Cover Image */}
                      <div className="w-10 h-10 rounded-md bg-white/5 overflow-hidden">
                        {list.coverImage ? (
                          <img
                            src={list.coverImage}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-indigo-500/20 flex items-center justify-center">
                            <Layers size={14} className="text-indigo-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white group-hover:text-indigo-300 transition">
                          {list.name}
                        </p>
                        <p className="text-xs text-white/40">
                          {list.songs?.length || 0} songs
                        </p>
                      </div>
                    </div>
                    <Plus
                      size={18}
                      className="text-white/30 group-hover:text-white"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddToPlaylistModal;
