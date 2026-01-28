import React, { use, useEffect, useState } from "react";
import { Plus, Music, PlayCircle, Loader, Heart, Layers } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import CreatePlaylist from "./CreatePlaylist";

const PlayList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [playlists, setPlayLists] = useState([]);
  const [openPlaylist, setIsOpenPlaylist] = useState(false);
  const [likedSongs, setLikedSongs] = useState([]);
  // Fetch Playlists
  const fetchPlaylist = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const response = await axios.get("http://localhost:3000/api/playlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPlayLists(response.data.playlists);
    } catch (error) {
      console.log("Error fetching playlist ", error);
    } finally {
      setIsLoading(false);
    }
  };
  // likedSongs fetching
  const fetchLikedSongs = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    try {
      const response = await axios.get("http://localhost:3000/api/likes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLikedSongs(response.data.likedSongs);
    } catch (error) {
      console.log("Error fetching liked songs ", error);
    }
  };
  useEffect(() => {
    fetchPlaylist();
    fetchLikedSongs();
  }, []);

  const handleOpenPlaylist = () => {
    setIsOpenPlaylist(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <Loader size={40} className="text-indigo-500 animate-spin" />
          <p className="text-white/50 text-sm">Loading your library</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black overflow-hidden text-white relative pt-28 px-6 pb-20">
      {/* --- Background Subtle Glows --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]" />
      </div>
      <CreatePlaylist
        isOpen={openPlaylist}
        refreshPlaylists={fetchPlaylist}
        isClose={() => setIsOpenPlaylist(false)}
      />
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header section */}
        <div className="header flex items-center justify-between ">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-400 to-purple-400 flex items-center gap-3">
              <Layers className=" text-indigo-400" />
              Your Playlist
            </h1>
            <p className="text-white/50 px-4 mt-2 text-sm">
              Your personal music collections
            </p>
          </div>
          {/* Create button */}
          {playlists && playlists.length > 0 && (
            <div className="create-btn">
              <button
                onClick={handleOpenPlaylist}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full transition-all group backdrop-blur-md cursor-pointer">
                <Plus
                  className="group-hover:rotate-90 transition-transform text-indigo-300 duration-500"
                  size={20}
                />
                <span className="hidden md:inline font-medium">Create new</span>
              </button>
            </div>
          )}
        </div>

        {/* Main Content */}
        {playlists && playlists.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col mt-2 items-center justify-center py-20 text-center bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md ">
            <div className="w-24 h-24 bg-indigo-500/40 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <Music size={40} className="text-white " />
            </div>
            <h2 className="text-2xl font-bold mb-2">No playlists yet</h2>
            <p className="text-white/50 max-w-md mb-8">
              Create your first playlist and start collecting your favorite
              tracks for every mood.
            </p>
            {/* Create Button (Empty State) */}
            <button
              onClick={handleOpenPlaylist}
              className="flex gap-2 items-center px-8 py-3 bg-linear-to-r from-indigo-400 to-purple-600 rounded-full font-bold shadow-lg shadow-indigo-500/30 hover:scale-105 duration-300 transition-transform cursor-pointer">
              <Plus size={20} /> Create Playlist
            </button>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {/* Create New Card */}
            <motion.div
              onClick={handleOpenPlaylist}
              variants={itemVariant}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="aspect-square flex flex-col items-center justify-center gap-4 bg-white/5 border-2 border-dashed border-white/20 rounded-2xl hover:bg-white/10 hover:border-indigo-400/50 transition-all group cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                <Plus
                  size={30}
                  className="text-white/50 group-hover:text-indigo-300 transition-colors"
                />
              </div>
              <span className="font-medium text-white/70 group-hover:text-white">
                Create New
              </span>
            </motion.div>
            {/* Render Playlists */}
            {playlists &&
              playlists.map((items) => (
                <motion.div
                  key={items._id}
                  variants={itemVariant}
                  className="group cursor-pointer">
                  <Link to={`/playlist/${items._id}`}>
                    <div className="relative aspect-square mb-4 rounded-2xl overflow-hidden shadow-lg bg-white/5">
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-center justify-center backdrop-blur-[2px]">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="bg-indigo-500/80 rounded-full p-3 pl-3.5 shadow-lg shadow-indigo-500/40">
                          <PlayCircle size={32} fill="white" />
                        </motion.div>
                      </div>

                      {/* ✅ FIX 2: Check 'coverImage' instead of 'cover' */}
                      {items.coverImage ? (
                        <img
                          src={items.coverImage}
                          alt={items.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#282828]">
                          {(!items.songs || items?.songs.length === 0) && (
                            <div
                              className={`w-full h-full bg-linear-to-br from-indigo-500 to-purple-900 flex items-center justify-center group-hover:scale-105 transition-transform duration-500`}>
                              <Music size={50} className="text-white/40" />
                            </div>
                          )}
                          {(items?.songs.length === 1 ||
                            items?.songs.length === 2 ||
                            items?.songs.length === 3) && (
                            <img
                              src={items?.songs[0].imageUrl}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          )}
                          {items?.songs.length >= 4 && (
                            <div className="grid grid-cols-2 grid-rows-2 h-full w-full">
                              <img
                                src={items?.songs[0].imageUrl}
                                className="w-full h-full object-cover"
                              />
                              <img
                                src={items?.songs[1].imageUrl}
                                className="w-full h-full object-cover"
                              />
                              <img
                                src={items?.songs[2].imageUrl}
                                className="w-full h-full object-cover"
                              />
                              <img
                                src={items?.songs[3].imageUrl}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {/* ✅ FIX 3: Use 'name' and 'songs.length' */}
                    <h3 className="font-bold text-lg truncate group-hover:text-indigo-300 transition-colors capitalize">
                      {items.name}
                    </h3>
                    <p className="text-sm text-white/50 flex items-center font-medium gap-1.5">
                      <Music size={14} />
                      {items.songs ? items.songs.length : 0} Songs
                    </p>
                  </Link>
                </motion.div>
              ))}
            {likedSongs && likedSongs?.length > 0 && (
              <Link to="/playlist/likes">
                <motion.div
                  variants={itemVariant}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="aspect-square flex flex-col items-center justify-center gap-4 bg-linear-to-r from-indigo-500 to-purple-900   rounded-2xl  hover:border-indigo-400/50 transition-all group cursor-pointer">
                  <Heart size={60} className=" fill-white  transition-colors" />
                </motion.div>
                <div className="pl-2">
                  <h2 className=" mt-4  font-bold  truncate text-lg">
                    Liked songs{" "}
                  </h2>
                  <p className="text-sm text-white/50 flex items-center font-medium gap-1.5">
                    <Music size={14} />
                    {likedSongs ? likedSongs.length : 0} Songs
                  </p>
                </div>
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PlayList;
