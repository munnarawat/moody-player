import React, { useEffect, useState } from "react";
import SongsList from "../components/SongsList";
import { Search, Loader, X } from "lucide-react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { playSong, setRecommendation } from "../store/songSlice";

const SearchPage = () => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        fetchSearchResults();
      } else {
        setSongs([]);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:3000/api/songs/search?query=${query}`,
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
  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6 pb-24">
      {/* Search bar container */}
      <div className="max-w-3xl max-auto mb-10">
        <h1 className="text-3xl font-bold mb-6">Search</h1>
        <div className="relative group ">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-gray-400 group-focus-within:text-white transition-colors" />
          </div>

          <input
            type="text"
            className="w-full bg-zinc-900 border border-zinc-800 text-white text-lg rounded-full py-4 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-zinc-800 transition-all placeholder-zinc-500 "
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
              className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          )}
        </div>
      </div>
      {/* Results Section */}
      <div className="max-w-5xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader className="animate-spin text-indigo-500" size={30} />
          </div>
        ) : songs.length > 0 ? (
          <div>
            <h2 className="text-xl font-bold mb-4 text-white/80">
              Top Results
            </h2>
            <SongsList songs={songs} handleSongClicked={handleSongClicked} />
          </div>
        ) : query.length > 0 && !loading ? (
          <div className="text-center text-white/40 py-10">
            No songs found for "{query}" 🤷‍♂️
          </div>
        ) : (
        
          <div className="text-center text-white/20 py-20">
            <Search size={48} className="mx-auto mb-4 opacity-50" />
            <p>Search for artists, songs, or moods</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
