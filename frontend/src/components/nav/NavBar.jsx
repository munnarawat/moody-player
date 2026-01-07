import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <div className="w-full ">
      <nav
        className="fixed top-0 w-full z-50 
  bg-linear-to-r from-[#050507]/80 via-[#101014]/80 to-[#050507]/80 
  backdrop-blur-md border-b border-white/10 
  flex items-center justify-between px-6 py-4">
        {/* Logo Area */}
        <div className="text-xl font-bold tracking-wider text-white">
          Moody<span className="text-indigo-400">Player</span>
        </div>

        {/* Menu Items (Example) */}
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
          <Link to="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <Link to="/moods" className="hover:text-white transition-colors">
            Moods
          </Link>
          <Link to="/palyList" className="hover:text-white transition-colors">
            Playlists
          </Link>
          <Link to="/history" className="hover:text-white transition-colors">
            History
          </Link>
        </div>

        {/* User Profile / Button */}
        <div className="w-8 h-8 rounded-full bg-linear-to-tr from-indigo-500 to-teal-500"></div>
      </nav>
    </div>
  );
};

export default NavBar;
