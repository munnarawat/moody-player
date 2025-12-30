import React, { useEffect } from "react";
import { FaPlay } from "react-icons/fa";
import { CiFaceSmile } from "react-icons/ci";
import { FaUser } from "react-icons/fa";
const SongsList = ({songs=[]}) => {
  return (
    <div className="mt-6 p-4 md:px-10 flex gap-4 overflow-x-auto overflow-y-hidden shrink-0">
      { songs.length !== 0 ? 
       songs.map((item, index) => (
        <div key={index} className="cards shrink-0 w-48 flex  flex-col justify-between   p-3 h-72   bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg">
          <div className="image-container  relative w-full h-32 rounded-xl ">
            <img
              className="w-full rounded-xl h-full object-cover"
              src="https://plus.unsplash.com/premium_photo-1676068243778-2652632e1f4c?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
            />
            {/* control music play and pause */}
            <div className="play-pause absolute -bottom-5 left-1/2 -translate-x-1/2 w-10 h-10  rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center  cursor-pointer hover:scale-105 transition-transform">
              <span>
                <FaPlay />
              </span>
            </div>
          </div>
          {/* artist name */}
          <div className="artist-name">
            <h3 className=" font-semibold">{item.artist}</h3>
            <p className="text-sm text-gray-300">{item.title}</p>
          </div>
          {/* mood */}
          <div className="mood flex justify-between">
            <span className="text-xl text-emerald-500">
              <CiFaceSmile />
            </span>
            <span className="text-lg text-zinc-400">
              <FaUser />
            </span>
          </div>
        </div>
      )):"Waiting for detected mood🤠" }
    </div>
  );
};

export default SongsList;
