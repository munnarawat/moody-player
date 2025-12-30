import React, { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import FaceExpression from "./components/FaceExpression";
import SongsList from "./components/SongsList";
import SongPlayer from "./components/SongPlayer";

const App = () => {
  const [songs, setSongs] = useState([]);
  useEffect(()=>{
    console.log("Songs in App:", songs);
  },[songs])
  const currentSong = songs.songs || songs
  return (
    <div className=" relative w-full min-h-screen bg-[#050507] text-white overflow-hidden selection:bg-indigo-500/30 ">
      <div
        className="absolute 
    top-[-5%] left-[-10%] 
    w-[80vw] h-[80vw]       
    md:w-[500px] md:h-[500px] 
    lg:w-[600px] lg:h-[600px]
    bg-indigo-900/30 rounded-full 
    blur-[80px] md:blur-[100px] lg:blur-[120px] /* Blur bhi adjust kiya */
    pointer-events-none mix-blend-screen animate-pulse-slow"
      />

      <div
      className="absolute 
    top-[15%] right-[-10%] 
    w-[70vw] h-[70vw]         /* Mobile sizing */
    md:w-[400px] md:h-[400px] /* Tablet sizing */
    lg:w-[500px] lg:h-[500px] /* Desktop sizing */
    bg-teal-900/20 rounded-full 
    blur-[60px] md:blur-[80px] lg:blur-[100px]
    pointer-events-none mix-blend-screen"
      />
      <NavBar />
      <FaceExpression setSongs={setSongs } />
      <SongsList songs={currentSong} />
      <SongPlayer songs={currentSong}/>
    </div>
  );
};

export default App;
