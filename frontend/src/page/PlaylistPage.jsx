import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Play,
  Clock,
  Heart,
  MoreHorizontal,
  Loader,
  Music,
  Pause,
} from "lucide-react";
import { playSong, setRecommendation } from "../store/songSlice";
import axios from "axios";
import SongDuration from "../components/SongDuration";
import { useDispatch, useSelector } from "react-redux";

const PlaylistPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Ref for scroll handling (optional visual effect)
  const containerRef = useRef(null);

  const [playlistData, setPlaylistData] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback for gradient if not passed
  const gradientColor =
    location.state?.color || "from-neutral-800 to-neutral-900";

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/timePlaylist/${id}`,
        );
        setPlaylistData(response.data.data);
        setSongs(response.data.data.songs || []);
        setLoading(true);
      } catch (error) {
        console.error("Error fetching playlist details:", error);
        setLoading(false);
      } finally {
        setLoading(false); // Ensure loading stops even on error
      }
    };
    fetchDetails();
  }, [id]);

  const handlePlaySong = (songId) => {
    dispatch(playSong(songId));
    if (songs) {
      dispatch(setRecommendation(songs));
    }
  };

  const handlePlayAll = () => {
    if (songs && songs.length > 0) {
      dispatch(playSong(songs[0]));
      dispatch(setRecommendation(songs));
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#121212] text-white">
        <Loader className="animate-spin text-green-500" size={40} />
      </div>
    );
  }

  if (!playlistData) {
    return (
      <div className="text-white p-10 flex flex-col items-center justify-center h-screen bg-[#121212]">
        <h2 className="text-2xl font-bold mb-4">Playlist Not Found 😕</h2>
        <button
          onClick={() => navigate(-1)}
          className="bg-white text-black px-6 py-2 rounded-full font-bold hover:scale-105 transition">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen relative bg-[#121212] text-white pb-32 font-sans">
      {/* --- TOP BAR (Sticky & Transparent/Blurred) --- */}
      <div className=" absolute top-12 md:top-15 z-10 -left-5 w-fit  px-6 py-4 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className=" backdrop-blur-md p-2 rounded-full hover:bg-black/60 transition">
          <ArrowLeft size={24} />
        </button>
      </div>
      {/* --- HERO SECTION --- */}
      <div
      style={{background:gradientColor}}
        className='relative w-full pt-25 md:pt-30 pb-8 px-6 md:px-10   flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8'>
        {/* Playlist Image */}
        <div className="shrink-0 shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
          {playlistData.coverImage? (
            <img
              src={playlistData.coverImage}
              alt="Cover"
              className="w-52 h-52 md:w-60 md:h-60 object-cover rounded-md shadow-2xl"
            />
          ) : (
            <div className="w-52 h-52 md:w-60 md:h-60 bg-linear-to-br from-gray-800 to-slate-800 rounded-md flex items-center justify-center shadow-2xl">
              <Music size={80} className="text-gray-400" />
            </div>
          )}
        </div>
        {/* Playlist Info */}
        <div className="flex flex-col text-center md:text-left z-10 w-full">
          <span className="uppercase text-xs font-bold tracking-widest hidden md:block mb-2">
            Playlist
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-4 leading-tight">
            {playlistData.name}
          </h1>
          <p className="text-white/70 text-sm md:text-base font-medium line-clamp-2 max-w-2xl">
            {playlistData.description}
          </p>

          <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-white/90 mt-4">
            <span className="font-bold">Made for You</span>
            <span className="w-1 h-1 bg-white rounded-full"></span>
            <span>{songs.length} songs</span>
          </div>
        </div>
      </div>

      {/* --- BACKGROUND GRADIENT FADE --- */}
      <div className="w-full h-32 bg-linear-to-b from-black/5 to-[#121212] -mt-32 relative z-0" />

      {/* --- ACTION BUTTONS --- */}
      <div className="px-6 md:px-10 pt-4 pb-8 flex items-center gap-6 relative z-10 bg-[#121212]">
        <button
          onClick={handlePlayAll}
          className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center hover:scale-105 hover:bg-green-400 transition shadow-lg text-black">
          <Play size={28} fill="black" className="ml-1" />
        </button>
        <div className="flex gap-4">
          <Heart
            size={32}
            className="text-gray-400 hover:text-white cursor-pointer transition"
          />
          <MoreHorizontal
            size={32}
            className="text-gray-400 hover:text-white cursor-pointer transition"
          />
        </div>
      </div>

      {/* --- SONGS LIST --- */}
      <div className="px-2 md:px-10 bg-[#121212]">
        {/* Table Header - Hidden on Mobile */}
        <div className="grid grid-cols-[16px_1fr_auto] md:grid-cols-[40px_1fr_1fr_auto] gap-4 text-gray-400 text-sm border-b border-white/10 pb-2 mb-4 px-4 sticky top-16 bg-[#121212] z-40 uppercase tracking-wider">
          <span className="text-center">#</span>
          <span>Title</span>
          <span className="hidden md:block">Artist</span>
          <span className="flex justify-end pr-2">
            <Clock size={16} />
          </span>
        </div>

        {/* Songs Mapping */}
        <div className="flex flex-col pb-10">
          {songs.length > 0 ? (
            songs.map((song, index) => (
              <div
                key={song._id}
                onClick={() => handlePlaySong(song)}
                className="group grid grid-cols-[16px_1fr_auto] md:grid-cols-[40px_1fr_1fr_auto] gap-4 items-center p-2 md:p-3 rounded-md hover:bg-white/10 cursor-pointer transition-colors duration-200">
                {/* 1. Index / Play Icon */}
                <div className="flex items-center justify-center text-gray-400 font-medium w-full">
                  <span className="group-hover:hidden text-sm md:text-base">
                    {index + 1}
                  </span>
                  <Play
                    size={14}
                    fill="white"
                    className="hidden group-hover:block text-white"
                  />
                </div>

                {/* 2. Title & Image */}
                <div className="flex items-center gap-4 overflow-hidden">
                  <img
                    className="w-10 h-10 md:w-12 md:h-12 rounded bg-gray-800 object-cover shrink-0"
                    src={song.imageUrl}
                    alt={song.title}
                  />
                  <div className="flex flex-col truncate">
                    <span className="text-white font-medium truncate text-sm md:text-base group-hover:text-green-400 transition-colors">
                      {song.title}
                    </span>
                    <span className="text-gray-400 text-xs md:hidden truncate">
                      {song.artist || "Unknown Artist"}
                    </span>
                  </div>
                </div>

                {/* 3. Artist (Desktop Only) */}
                <div className="hidden md:flex items-center text-gray-400 text-sm hover:text-white transition cursor-pointer truncate">
                  {song.artist || "Unknown Artist"}
                </div>

                {/* 4. Duration */}
                <div className="text-gray-400 text-sm flex justify-end items-center pr-2 font-mono">
                  <SongDuration url={song.audioUrl || "3:35"} />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-20 flex flex-col items-center">
              <Music size={48} className="mb-4 opacity-50" />
              <p>No songs added to this playlist yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistPage;
