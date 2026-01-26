import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
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
  Loader,
} from "lucide-react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { playSong, setRecommendation } from "../store/songSlice";
import { toast } from "react-toastify";
import SongDuration from "../components/SongDuration";

const PlaylistDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  // Fetch Single Playlist
  useEffect(() => {
    const fetchPlaylistDetails = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `http://localhost:3000/api/playlist/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setPlaylist(response.data.playlist);
      } catch (error) {
        console.error("Error fetching playlist details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylistDetails();
  }, [id]);
  // handlePlay-song
  const handlePlaySong = (songId) => {
    dispatch(playSong(songId));
    if (playlist?.songs) {
      dispatch(setRecommendation(playlist.songs));
    }
  };
  // handle big play button (stared from first song)
  const handlePlayAll = () => {
    if (playlist && playlist.songs && playlist.songs.length > 0) {
      dispatch(playSong(playlist.songs[0]));
      dispatch(setRecommendation(playlist.songs));
    }
  };
  // handle delete playlist
  const handleDeletePlaylist = async () => {
    if (!window.confirm("Are you sure you want delete your play list")) return;
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/playlist/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success("Playlist delete Successfully 🗑️");
      navigate("/");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete playlist");
    }
  };
  // handleRemoveSong
  const handleRemoveSong = async (e, songId) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(
        "http://localhost:3000/api/playlist/remove-song",
        { playlistId: id, songId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setPlaylist(res.data.playlist);
      toast.info("Song removed from playlist");
    } catch (error) {
      console.error("Remove song error:", error);
      toast.error("Failed to remove song");
    }
  };
  
  const formatDuration =(seconds)=>{
    if(!seconds) return "0:00";
    const min = Math.floor(seconds/60);
    const sec = Math.floor(seconds%60);
    return `${min}:${sec < 10 ? "0" :""}${sec} `
  }
  
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <Loader className="animate-spin text-indigo-500" size={40} />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="text-white text-center pt-20">Playlist not found 😕</div>
    );
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
              : "linear-gradient(to bottom, #4f46e5, #000)",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-black" />

        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row   gap-6 p-8 h-full max-w-7xl mx-auto">
          {/* Cover Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-48 h-48 md:w-60 md:h-60 shadow-2xl shadow-black/50 rounded-xl overflow-hidden shrink-0 bg-white/5">
            {playlist.coverImage ? (
              <img
                src={playlist.coverImage}
                alt={playlist.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#282828]">
                {/* CASE 0: No Songs (Empty) */}
                {(!playlist.songs || playlist.songs.length === 0) && (
                  <div className="w-full h-full bg-linear-to-br from-indigo-500 to-purple-800 flex items-center justify-center">
                    <Music size={60} className="text-white/40" />
                  </div>
                )}

                {/* CASE 1: 1 Song (Full Image) */}
                {playlist.songs?.length === 1 && (
                  <img
                    src={playlist.songs[0].imageUrl}
                    alt="cover"
                    className="w-full h-full object-cover"
                  />
                )}

                {/* CASE 2 or 3: Show 2 Images (Split Vertical) */}
                {(playlist.songs?.length === 2 ||
                  playlist.songs?.length === 3) && (
                  <div className="grid grid-cols-2 h-full w-full">
                    <img
                      src={playlist.songs[0].imageUrl}
                      className="w-full h-full object-cover"
                    />
                    <img
                      src={playlist.songs[1].imageUrl}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* CASE 4+: Show 4 Images (2x2 Grid) */}
                {playlist.songs?.length >= 4 && (
                  <div className="grid grid-cols-2 grid-rows-2 h-full w-full">
                    <img
                      src={playlist.songs[0].imageUrl}
                      className="w-full h-full object-cover"
                    />
                    <img
                      src={playlist.songs[1].imageUrl}
                      className="w-full h-full object-cover"
                    />
                    <img
                      src={playlist.songs[2].imageUrl}
                      className="w-full h-full object-cover"
                    />
                    <img
                      src={playlist.songs[3].imageUrl}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Text Info */}
          <div className="mb-2 px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-white/80">
              Public Playlist
            </span>
            <h1 className="text-4xl md:text-7xl  font-bold mt-2 mb-4 text-white drop-shadow-lg ">
              {playlist.name}
            </h1>
            <p className="text-white/60 text-sm font-medium mb-4 max-w-xl line-clamp-2">
              {playlist.description || "No description provided."}
            </p>

            <div className="flex items-center gap-2 text-sm text-white/80">
              <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold">
                {user?.userName?.[0]?.toUpperCase() || "U"}
              </div>
              <span className="font-bold hover:underline cursor-pointer">
                {user?.fullName.firstName}
              </span>
              <span>•</span>
              <span>{playlist.songs?.length || 0} songs</span>
            </div>
            <button
              onClick={handleDeletePlaylist}
              className="flex items-center gap-2 mt-1 px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-full transition text-sm font-bold border border-red-500/30">
              <Trash2 size={16} /> Delete Playlist
            </button>
          </div>
        </div>
      </div>
      {/* navigate   */}
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
          {playlist.songs && playlist.songs.length > 0 ? (
            playlist.songs.map((song, index) => (
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

                {/* Date Added (Hidden on Mobile) */}
                <div className="hidden md:block text-sm text-white/50">
                  2 days ago
                </div>
                {/* 🔥 REMOVE SONG BUTTON (Visible on Hover) */}
                <div className="flex items-center justify-end pr-4">
                  <button
                    onClick={(e) => handleRemoveSong(e, song._id)} // Pass 'e' to stop propagation
                    className="text-white/30 cursor-pointer hover:text-red-500 opacity-0 group-hover:opacity-100 transition p-2"
                    title="Remove from playlist">
                    <MinusCircle size={20} />
                  </button>
                  <span className="text-sm text-white/50 group-hover:hidden">
                    {song.duration ?(formatDuration(song.duration)):(
                      <SongDuration url={song.audioUrl||song.url}/>
                    )}
                  </span>
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
