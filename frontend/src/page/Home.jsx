import React, { useEffect, useState } from 'react'
import FaceExpression from '../components/FaceExpression';
import SongPlayer from '../components/SongPlayer';
import SongsList from '../components/SongsList';
import MoodSelection from '../components/MoodSelection';
import { MOOD_THEMES } from '../utils/moodConstants';
import { motion } from 'framer-motion';
import TimeBasedSection from '../components/TimeBasedSection';

const Home = () => {
  const [songs, setSongs] = useState([]);
  const [currentMood, setCurrentMood] = useState("default")
  useEffect(() => {
    console.log("Songs in App:", songs);
  }, [songs]);
  const currentSong = songs.songs || songs;

  //  handleMoodChange
  const handleMoodChange =(detectedMood)=>{
    const moodKey = detectedMood.toLowerCase();
    if(MOOD_THEMES[moodKey]){
      setCurrentMood(moodKey)
    }else{
      setCurrentMood("default")
    }
  }
  
  return (
    < motion.div className=" relative w-full min-h-screen  text-white overflow-hidden  " animate={{background:MOOD_THEMES[currentMood] || MOOD_THEMES["default"]}} transition={{duration:1.2, ease:"easeInOut"}}>
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
      <FaceExpression setSongs={setSongs} />
      <MoodSelection onMoodSelect={handleMoodChange}/>
      <TimeBasedSection/>
    </motion.div>
  );
};

export default Home