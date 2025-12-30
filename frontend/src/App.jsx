import React from "react";
import NavBar from "./components/NavBar";
import FaceExpression from "./components/FaceExpression";

const App = () => {
  return (
    <div className=" relative w-full min-h-screen bg-[#050507] text-white overflow-hidden selection:bg-indigo-500/30 ">
      {/* 1. Purple/Blue Glow (Left Side) */}
      <div
        className="absolute 
    top-[-5%] left-[-10%] 
    w-[80vw] h-[80vw]         /* Mobile: Screen width ke hisab se bada */
    md:w-[500px] md:h-[500px] /* Tablet: Fixed medium size */
    lg:w-[600px] lg:h-[600px] /* Desktop: Original large size */
    bg-indigo-900/30 rounded-full 
    blur-[80px] md:blur-[100px] lg:blur-[120px] /* Blur bhi adjust kiya */
    pointer-events-none mix-blend-screen animate-pulse-slow"
      />

      {/* 2. Teal/Cyan Glow (Right Side) */}
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
      <FaceExpression />
    </div>
  );
};

export default App;
