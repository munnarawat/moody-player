import React, { useEffect, useRef, useState } from "react";
import FaceExpression from "../components/FaceExpression";
import MoodSelection from "../components/MoodSelection";
import { MOOD_THEMES } from "../utils/moodConstants";
import { motion } from "framer-motion";
import TimeBasedSection from "../components/TimeBasedSection";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { playSong, setRecommendation } from "../store/songSlice";
import AddToPlaylistModal from "../playList/AddToPlaylistModal";
import SongsList from "../components/SongsList";
import { toast } from "react-toastify";
import Hero from "../components/Hero";
import { RefreshCcw } from "lucide-react"; 

const Home = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const cameraSectionRef = useRef(null);
  const [songs, setSongs] = useState([]);
  const [currentMood, setCurrentMood] = useState("default");
  const [loading, setLoading] = useState(false);
  const [selectedSongId, setSelectedSongId] = useState(null);

  // 🎵 Function to Fetch Songs from Backend
  useEffect(() => {
    fetchSong();
  }, []);

  const fetchSong = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/songs`);

      const fetchedSongs = response.data.song || [];

      if (fetchedSongs.length > 0) {
        setSongs(fetchedSongs);
        dispatch(setRecommendation(fetchedSongs));
      }
    } catch (error) {
      console.error("Error fetching songs:", error);
    } finally {
      setLoading(false);
    }
  };

  // 👇 2. Reset Function 
  const handleReset = () => {
    setCurrentMood("default"); // Mood reset
    fetchSong(); 
  };

  const handleAddToPlaylistClick = (e, songId) => {
    e.stopPropagation();
    setSelectedSongId(songId);
  };

  const handleMoodAction = async (mood, source) => {
    if (!mood) return;
    const moodKey = mood.toLowerCase();
    setCurrentMood(MOOD_THEMES[moodKey] ? moodKey : "default");
    try {
      const token = localStorage.getItem("token");
      const songRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/songs/mood/${mood}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // History save logic...
      if (token) {
        try {
          await axios.post(
            `${import.meta.env.VITE_API_URL}/api/history/mood`,
            { mood: mood, source: source },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (historyError) {
          console.error("History save failed", historyError);
        }
      }

      const moodSongs = songRes.data.songs || songRes.data.song || [];
      if (moodSongs.length > 0) {
        setSongs(moodSongs); 
        dispatch(playSong(moodSongs[0])); 
        dispatch(setRecommendation(moodSongs)); 
      } else {
        toast.warn(`No songs found for ${mood} mood 😕`);
      }
    } catch (error) {
      console.error("Mood Action Error:", error);
      toast.error("Failed to process mood request ❌");
    }
  };

  const scrollToCamera = () => {
    cameraSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSongClicked = (song) => {
    dispatch(playSong(song));
  };

  return (
    <motion.div
      className="relative w-full min-h-screen text-white overflow-hidden"
      animate={{
        background: MOOD_THEMES[currentMood] || MOOD_THEMES["default"],
      }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
    >
      {/* Background Blobs (Same as yours) */}
      <div className="absolute top-[-5%] left-[-10%] w-[80vw] h-[80vw] md:w-125 md:h-125 lg:w-150 lg:h-150 bg-indigo-900/30 rounded-full blur-[80px] md:blur-[100px] lg:blur-[120px] pointer-events-none mix-blend-screen animate-pulse-slow" />
      <div className="absolute top-[15%] right-[-10%] w-[70vw] h-[70vw] md:w-100 md:h-100 lg:w-125 lg:h-125 bg-teal-900/20 rounded-full blur-[60px] md:blur-[80px] lg:blur-[100px] pointer-events-none mix-blend-screen" />

      <Hero onStartClick={scrollToCamera} />

      {/* 🔥 CAMERA SECTION */}
      <div id="mood-scanner" ref={cameraSectionRef} className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-20">
        <div className="bg-zinc-900/40 border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-md shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Live Mood Detection</h2>
            <p className="text-white/50">Let AI see how you feel and play the perfect track.</p>
          </div>

          <FaceExpression
            onMoodDetected={(detectedMood) => handleMoodAction(detectedMood, "camera")}
          />
        </div>
      </div>

      <MoodSelection
        onMoodSelect={(selectedMood) => handleMoodAction(selectedMood, "manual")}
      />
      
      <TimeBasedSection />

      {/* 👇 3. Dynamic Song List with Reset Button */}
      <div className="mt-8 mb-24 px-4 md:px-8"> 
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold capitalize">
            {currentMood === "default" ? "All Songs" : `${currentMood} Vibes`}
          </h2>
          {currentMood !== "default" && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-sm font-medium transition-all hover:scale-105 active:scale-95 backdrop-blur-md"
            >
              <RefreshCcw size={16} />
              <span>Show All Songs</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20 text-white/50">Loading songs...</div>
        ) : (
          <SongsList
            songs={songs}
            user={user}
            handleAddPlaylist={handleAddToPlaylistClick}
            handleSongClicked={handleSongClicked}
          />
        )}
      </div>

      <AddToPlaylistModal
        isOpen={!!selectedSongId}
        songId={selectedSongId}
        onClose={() => setSelectedSongId(null)}
      />
    </motion.div>
  );
};

export default Home;