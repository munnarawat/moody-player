import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Play, Camera } from "lucide-react";

const Hero = ({ onStartClick }) => {
  return (
    <div className="relative w-full min-h-125 flex items-center justify-center overflow-hidden bg-transparent pt-20">
      {/* 🌟 1. Animated Background Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-indigo-600/30 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* 🏷️ Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-sm font-medium mb-6 backdrop-blur-sm">
          <Sparkles size={14} />
          <span>AI Powered Music Experience</span>
        </motion.div>

        {/* 💥 Hero Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
          Music that{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400">
            feels you.
          </span>
        </motion.h1>

        {/* 📝 Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-white/50 mb-10 max-w-2xl mx-auto">
          Don't just listen—connect. Our AI scans your mood in real-time to
          curate the perfect playlist for your current vibe.
        </motion.p>

        {/* 🔘 Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Primary CTA (Scrolls to Camera) */}
          <button
            onClick={onStartClick}
            className="group relative px-8 py-4 bg-white text-black font-bold rounded-full text-lg flex items-center gap-2 hover:scale-105 transition-transform shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
            <Camera
              size={20}
              className="text-indigo-600 group-hover:rotate-12 transition-transform"
            />
            Scan My Mood
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
          {/* Secondary CTA */}
          <button className="px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-full text-lg hover:bg-white/10 transition-colors flex items-center gap-2">
            <Play size={18} className="fill-white" />
            Watch Demo
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
