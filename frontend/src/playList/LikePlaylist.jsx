import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Play,
  Clock,
  Heart,
  MoreHorizontal,
  Music,
  Calendar,
  MoveLeft,
  Trash2,
  MinusCircle,
  ArrowLeft,
  Loader,
} from "lucide-react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import SongDuration from "../components/SongDuration";
import { playSong, setRecommendation } from "../store/songSlice";
import { useNavigate } from "react-router-dom";
const LikePlaylist = () => {
  const dispatch = useDispatch();
  const [likedSongs, setLikedSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
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
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchLikedSongs();
  }, []);

  //   handlePlaySong
  const handlePlaySong = (songId) => {
    dispatch(playSong(songId));
    if (likedSongs) {
      dispatch(setRecommendation(likedSongs));
    }
  };
  // handle big play button (stared from first song)
  const handlePlayAll = () => {
    if (likedSongs && likedSongs && likedSongs.length > 0) {
      dispatch(playSong(likedSongs[0]));
      dispatch(setRecommendation(likedSongs));
    }
  };
  if (loading) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <Loader size={40} className=" animate-spin" />
      </div>
    );
  }
  if (!likedSongs) {
    return (
      <div className="text-white text-center pt-20">LikeSong not found 😕</div>
    );
  }
  return (
    <div className="min-h-screen w-full bg-black pb-40">
      {/* navigation button */}
      <button
        onClick={() => navigate(-1)}
        className=" absolute text-white top-18 w-fit left-5 z-999 p-2 bg-black/30 rounded-full cursor-pointer hover:bg-white/10 hover:scale-110 duration-300  ">
        <ArrowLeft size={20} />
      </button>
      {/* top section */}
      <div className="relative w-full md:h-90 pt-20  overflow-hidden ">
        <div className="absolute bg-linear-to-b from-indigo-500 to-purple-900 inset-0 bg-cover  bg-center blur-3xl opacity-50 scale-110" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-black" />
        <div className="relative z-10 flex flex-col md:flex-row   gap-6 p-8 h-full max-w-7xl mx-auto">
          {/* Cover Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-48 h-48 md:w-60 md:h-60 shadow-2xl shadow-black/50 rounded-xl overflow-hidden shrink-0 bg-white/5">
            <div className="w-full h-full bg-linear-to-br from-indigo-500 to-purple-800 flex items-center justify-center">
              <Heart size={60} className="fill-white text-white" />
            </div>
          </motion.div>
          {/* Text Info */}
          <div className="mb-2 px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-white/80">
              Public Playlist
            </span>
            <h1 className="text-4xl md:text-7xl  font-bold mt-2 mb-4 text-white drop-shadow-lg ">
              Liked songs
            </h1>
            <p className="text-white/60 text-sm font-medium mb-4 max-w-xl line-clamp-2">
              My favorite songs
            </p>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold">
                {user?.userName?.[0]?.toUpperCase() || "U"}
              </div>
              <span className="font-bold hover:underline cursor-pointer">
                {user?.fullName.firstName}
              </span>
              <span>•</span>
              <span>{likedSongs?.length || 0} songs</span>
            </div>
          </div>
        </div>
      </div>
      {/* --- CONTROLS SECTION --- */}
      <div className="max-w-7xl mx-auto px-8 py-6  flex items-center gap-6">
        <button
          onClick={handlePlayAll}
          className="w-14 h-14 rounded-full bg-indigo-500 hover:bg-indigo-400 flex items-center justify-center hover:scale-105 transition shadow-lg shadow-indigo-500/30 text-black">
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
          <span className="mr-4">
            <Clock size={16} />
          </span>
        </div>

        {/* Songs List */}
        <div className="flex flex-col">
          {likedSongs && likedSongs.length > 0 ? (
            likedSongs.map((song, index) => (
              <div
                key={song._id || index}
                onClick={() => handlePlaySong(song)}
                className="group grid grid-cols-[auto_1fr_auto_auto] gap-4 items-center px-4 py-3 rounded-md hover:bg-white/10 transition cursor-pointer">
                {/* Number / Play Icon */}
                <div className="w-6 text-center text-white/50 font-medium group-hover:text-white">
                  <span className="group-hover:hidden">{index + 1}</span>
                  <Play
                    size={14}
                    fill="white"
                    className="hidden group-hover:block ml-1"
                  />
                </div>
                {/* Song Info */}
                <div className="flex items-center gap-4">
                  {/* Song Image */}
                  <div className="w-10 h-10 rounded overflow-hidden bg-white/5">
                    {song.imageUrl ? (
                      <img
                        src={song.imageUrl}
                        alt={song.title}
                        className="w-full h-full object-cover"
                      />
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
                <div className="flex items-center justify-end pr-4">
                  <span className="text-sm text-white/50 ">
                    {song.duration ? (
                      formatDuration(song.duration)
                    ) : (
                      <SongDuration url={song.audioUrl || song.url} />
                    )}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 text-white/30 flex flex-col items-center">
              <Music size={40} className="mb-4 opacity-50" />
              <p>This likedSongs is empty.</p>
              <p className="text-sm mt-2">Go to Home and liked some songs!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LikePlaylist;
