import React, { useEffect, useState } from "react";
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

const Home = () => {
  const dispatch = useDispatch();
  const {user} = useSelector((state)=>state.auth)
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
      const response = await axios.get("http://localhost:3000/api/songs");

      const fetchedSongs = response.data.song || [];

      if (fetchedSongs.length > 0) {
        setSongs(fetchedSongs);
        dispatch(setRecommendation(fetchedSongs));
      }
      // console.log(response.data.song);
    } catch (error) {
      console.error("Error fetching songs:", error);
    } finally {
      setLoading(false);
    }
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
        `http://localhost:3000/api/songs/mood/${mood}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (token) {
        try {
          await axios.post(
            "http://localhost:3000/api/history/mood",
            {
              mood: mood,
              source: source,
            },
            { headers: { Authorization: `Bearer ${token}` } },
          );
          
        } catch (historyError) {
          console.error("History save failed (Non-fatal)", historyError);
        }
      }
      const moodSongs = songRes.data.songs || songRes.data.song || [];
      if (moodSongs.length > 0) {
        setSongs(moodSongs); // Update List
        dispatch(playSong(moodSongs[0])); // Play First Song
        dispatch(setRecommendation(moodSongs)); // Update Queue
       
      } else {
        toast.warn(`No songs found for ${mood} mood 😕`);
      }
    } catch (error) {
      console.error("Mood Action Error:", error);
      toast.error("Failed to process mood request ❌");
    }
  };
  useEffect(() => {
    fetchSong();
  }, []);
  // song clicked handle
  const handleSongClicked = (song) => {
    dispatch(playSong(song));
  };

  return (
    <motion.div
      className=" relative w-full min-h-screen  text-white overflow-hidden  "
      animate={{
        background: MOOD_THEMES[currentMood] || MOOD_THEMES["default"],
      }}
      transition={{ duration: 1.2, ease: "easeInOut" }}>
      <div
        className="absolute 
    top-[-5%] left-[-10%] 
    w-[80vw] h-[80vw]       
    md:w-125 md:h-125 
    lg:w-150 lg:h-150
    bg-indigo-900/30 rounded-full 
    blur-[80px] md:blur-[100px] lg:blur-[120px] 
    pointer-events-none mix-blend-screen animate-pulse-slow"
      />
      <div
        className="absolute 
    top-[15%] right-[-10%] 
    w-[70vw] h-[70vw]
    md:w-100 md:h-100 
    lg:w-125 lg:h-125 
    bg-teal-900/20 rounded-full 
    blur-[60px] md:blur-[80px] lg:blur-[100px]
    pointer-events-none mix-blend-screen"
      />
      <FaceExpression
        onMoodDetected={(detectedMood) =>
          handleMoodAction(detectedMood, "camera")
        }
      />
      <MoodSelection
        onMoodSelect={(selectedMood) =>
          handleMoodAction(selectedMood, "manual")
        }
      />
      <TimeBasedSection />
      {/* dynamic song list */}
      <div className="mt-8 mb-24 px-2">
        <h2 className="text-xl font-bold mb-4 capitalize">
          {currentMood === "default" ? "All Songs" : `${currentMood} Vibes`}
        </h2>
        {loading ? (
          <p className="text-white/50">Loading songs...</p>
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
