import React from "react";

const nav = () => {
  return (
    <div className="w-full ">
      <nav
        className="fixed top-0 w-full z-50 
  bg-gradient-to-r from-[#050507]/80 via-[#101014]/80 to-[#050507]/80 
  backdrop-blur-md border-b border-white/10 
  flex items-center justify-between px-6 py-4">
        {/* Logo Area */}
        <div className="text-xl font-bold tracking-wider text-white">
          Moody<span className="text-indigo-400">Player</span>
        </div>

        {/* Menu Items (Example) */}
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
          <a href="#" className="hover:text-white transition-colors">
            Home
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Moods
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Playlists
          </a>
        </div>

        {/* User Profile / Button */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-teal-500"></div>
      </nav>
    </div>
  );
};

export default nav;
