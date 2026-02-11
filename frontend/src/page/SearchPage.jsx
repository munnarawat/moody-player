import React, { useEffect, useState } from "react";
import SongsList from "../components/SongsList";
import { Search, Loader, X, Music, Sparkles } from "lucide-react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { playSong, setRecommendation } from "../store/songSlice";
import { motion, AnimatePresence } from "framer-motion";

const SearchPage = () => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Quick Mood Tags for Suggestions
  const suggestionTags = ["Happy", "Sad", "Romantic", "Party", "Chill", "Arijit Singh", "lofi"];

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        fetchSearchResults(query);
      } else {
        setSongs([]);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const fetchSearchResults = async (searchTerm) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/songs/search?query=${searchTerm}`
      );
      setSongs(res.data.songs || []);
    } catch (error) {
      console.log("Search Error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSongClicked = (song) => {
    dispatch(playSong(song));
    dispatch(setRecommendation(songs));
  };
  const handleTagClick = (tag) => {
    setQuery(tag);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4 md:px-8 pb-32 relative overflow-hidden">
      
      {/* 🌟 Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-5xl font-extrabold mb-2 bg-linear-to-r from-white to-gray-500 bg-clip-text text-transparent">
            Find Your Vibe
          </h1>
          <p className="text-white/50 text-sm md:text-base">
            Search for artists, songs, or specific moods
          </p>
        </motion.div>

        {/* 🔍 Search Input Container */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="relative group mb-10"
        >
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="text-gray-400 group-focus-within:text-purple-400 transition-colors w-6 h-6" />
          </div>

          <input
            type="text"
            className="w-full bg-white/5 backdrop-blur-xl border border-white/10 text-white text-lg md:text-xl rounded-2xl py-5 pl-14 pr-12 
            shadow-lg shadow-purple-500/5 
            focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-white/10 focus:shadow-purple-500/20
            transition-all duration-300 placeholder-white/30"
            placeholder="What do you want to listen to?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />

          {/* Clear Button */}
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setSongs([]);
              }}
              className="absolute inset-y-0 right-5 flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          )}
        </motion.div>

        {/* 🏷️ Suggestions Tags */}
        {!query && !loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {suggestionTags.map((tag, index) => (
              <button
                key={index}
                onClick={() => handleTagClick(tag)}
                className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm md:text-base hover:bg-white/10 hover:border-purple-500/50 hover:text-white transition-all duration-300 hover:scale-105"
              >
                {tag}
              </button>
            ))}
          </motion.div>
        )}

        {/* 🎵 Results Section */}
        <div className="min-h-75">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader className="animate-spin text-purple-500 mb-4" size={40} />
              <p className="text-white/50 text-sm animate-pulse">Searching the universe...</p>
            </div>
          ) : songs.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Sparkles size={20} className="text-purple-400" />
                <h2 className="text-xl font-bold text-white">Top Results</h2>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-2xl p-2 md:p-4 backdrop-blur-sm">
                <SongsList songs={songs} handleSongClicked={handleSongClicked} />
              </div>
            </motion.div>
          ) : query.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Music size={32} className="text-white/20" />
              </div>
              <h3 className="text-lg font-medium text-white mb-1">No songs found</h3>
              <p className="text-white/40">Try searching for a different artist or mood.</p>
            </motion.div>
          ) : (
            // Default Empty State
            <div className="flex flex-col items-center justify-center text-white/20 py-10 opacity-50">
               <Search size={64} className="mb-4 stroke-1" />
               <p className="text-lg">Discover your next favorite song</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;