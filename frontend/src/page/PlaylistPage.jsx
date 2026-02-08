import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Play,
  Clock,
  Heart,
  MoreHorizontal,
  Pause,
  Loader,
  Music
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

const PlaylistPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [playlistData, setPlaylistData] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  const gradientColor = location.state?.color || "from-gray-700 to-black";
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/timePlaylist/${id}`,
        );
        console.log(response.data.data);

        setPlaylistData(response.data.data);
        setSongs(response.data.data.songs || []);
        setLoading(true);
      } catch (error) {
        console.error("Error fetching playlist details:", error);
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);
  // if (loading) {
  //   return (
  //     <div className="h-screen flex items-center justify-center bg-black text-white">
  //       <Loader className="animate-spin text-indigo-500" size={40} />
  //     </div>
  //   );
  // }
  if (!playlistData) {
    return (
      <div className="text-white p-10 flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold">Playlist Not Found 😕</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-white text-black px-4 py-2 rounded">
          Go Back
        </button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black text-white  pb-32">
      {/* --- HERO SECTION (Gradient Background) --- */}
      <div
        className={`relative w-full h-80 bg-linear-to-b ${gradientColor} p-6 flex flex-col justify-end`}>
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 p-2 bg-black/20 rounded-full hover:bg-black/40 transition">
          <ArrowLeft size={24} />
        </button>

        <div className="flex items-end gap-6 z-10">
          {/* Big Playlist Image */}
          <div className="w-48 h-48 shadow-2xl bg-white/20 rounded-md flex items-center justify-center">
            {playlistData.coverImage ? (
              <img
                src={playlistData.coverImage}
                alt="Cover"
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <Music size={64} className="text-white/50" />
            )}
          </div>

          <div className="flex flex-col gap-3 mb-2">
            <span className="uppercase text-xs font-bold tracking-widest">
              Playlist
            </span>
            <h1 className="text-6xl font-black tracking-tight">
              {playlistData.name}
            </h1>
            <p className="text-white/70 text-sm font-medium">
              {playlistData.description}
            </p>

            <div className="flex items-center gap-2 text-sm text-white/80 mt-1">
              <span className="font-bold">Made for You</span>
              <span>•</span>
              <span>{songs.length} songs</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-linear-to-t from-black to-transparent"></div>
      </div>
      <div className="px-8 py-6 flex items-center gap-6">
        <button className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center hover:scale-105 transition shadow-lg text-black">
          <Play size={28} fill="black" className="ml-1" />
        </button>
        <Heart
          size={32}
          className="text-white/50 hover:text-white cursor-pointer transition"
        />
        <MoreHorizontal
          size={32}
          className="text-white/50 hover:text-white cursor-pointer transition"
        />
      </div>

      {/* 3. Songs List */}
      <div className="px-8 mt-2">
        {/* Table Header */}
        <div className="grid grid-cols-[16px_4fr_3fr_1fr] gap-4 text-white/50 text-sm border-b border-white/10 pb-2 mb-4 px-4">
          <span>#</span>
          <span>Title</span>
          <span>Album</span>
          <span className="flex justify-end">
            <Clock size={16} />
          </span>
        </div>

        {/* Songs Mapping */}
        {songs.length > 0 ? (
          songs.map((song, index) => (
            <div
              key={song._id}
              className="group grid grid-cols-[16px_4fr_3fr_1fr] gap-4 items-center p-3 rounded-md hover:bg-white/10 cursor-pointer transition">
              <span className="text-white/50 group-hover:hidden">
                {index + 1}
              </span>
              <span className="hidden group-hover:block text-white">
                <Play size={12} fill="white" />
              </span>

              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 bg-white/10 shrink-0 rounded flex items-center justify-center">
                  <Music size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-medium truncate">
                    {song.name}
                  </span>
                  <span className="text-white/50 text-xs truncate">
                    {song.artist || "Unknown Artist"}
                  </span>
                </div>
              </div>

              <span className="text-white/50 text-sm truncate">Single</span>

              <span className="text-white/50 text-sm flex justify-end">
                {song.duration || "3:45"}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center text-white/40 py-10">
            No songs in this playlist yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistPage;
