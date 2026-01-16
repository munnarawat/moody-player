import React, { useEffect, useState } from "react";
import FaceExpression from "../components/FaceExpression";
import MoodSelection from "../components/MoodSelection";
import { MOOD_THEMES } from "../utils/moodConstants";
import { motion } from "framer-motion";
import TimeBasedSection from "../components/TimeBasedSection";
import { useDispatch } from "react-redux";
import axios from "axios";
import { playSong, setRecommendation } from "../store/songSlice";
import { Play } from "lucide-react";

const Home = () => {
  const dispatch = useDispatch();
  const [songs, setSongs] = useState([]);
  const [currentMood, setCurrentMood] = useState("default");
  const [loading, setLoading] = useState(false);

  // 🎵 Function to Fetch Songs from Backend
  const fetchSong = async (mood) => {
    try {
      setLoading(true);
      let url = "http://localhost:3000/api/songs";
      if (mood && mood !== "default") {
        url += `?mood=${mood}`;
      }
      const response = await axios.get(url);
      if (response.data.song && response.data.song.length > 0) {
        const fetchedSongs = response.data.song;
        setSongs(fetchedSongs);
        dispatch(setRecommendation(fetchedSongs));   
        if(mood && mood !== "default"){
          dispatch(playSong(fetchedSongs[0]));
        }     
      }
    } catch (error) {
      console.error("Error fetching songs:", error);
    } finally {
      setLoading(false);
    }
  };
  
  //  handleMoodChange
  const handleMoodChange = (mood) => {
    const moodKey = mood.toLowerCase();
    setCurrentMood(MOOD_THEMES[moodKey] ? moodKey : "default");
    fetchSong(moodKey);
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
      <FaceExpression onMoodDetected={handleMoodChange} />
      <MoodSelection onMoodSelect={handleMoodChange} />
      <TimeBasedSection />
      {/* dynamic song list */}
      <div className="mt-8 mb-24 px-2">
        <h2 className="text-xl font-bold mb-4 capitalize">
          {currentMood === "default" ? "All Songs" : `${currentMood} Vibes`}
        </h2>
        {loading ? (
          <p className="text-white/50">Loading songs...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-4 mb-30 gap-4">
            {songs.length > 0 && songs.map((song, index) => (
              <motion.div
                key={song._id} 
                whileHover={{ scale: 1.02 }}
                onClick={() => handleSongClicked(song)}
                className="bg-white/10 p-3 rounded-xl flex items-center gap-4 cursor-pointer hover:bg-white/20 transition-all group">
                {/* Song Image */}
                <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                  <img
                    src={song.imageUrl}
                    alt={song.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Hover Play Overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play size={20} fill="white" />
                  </div>
                </div>

                {/* Song Info */}
                <div>
                  <h3 className="font-bold">{song.title}</h3>
                  <p className="text-sm text-white/60">{song.artist}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Home;
