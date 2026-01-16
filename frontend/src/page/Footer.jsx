import React from "react";
import {
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Music,
  Mail,
  Heart,
} from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  const socialMediaLink = [
    {sociolIcon: Github, link:"https://github.com/munnarawat"},
    {sociolIcon: Twitter, link:"https://x.com/MunnaRa28967550"},
    {sociolIcon: Linkedin, link:"https://www.linkedin.com/in/manoj-singh-rawat-3062a4268/"},
    {sociolIcon: Instagram, link:"https://www.instagram.com/munna.rawat26/"},
  ]
  return (
    <footer className="relative w-full overflow-hidden bg-black/90  backdrop-blur-lg border-t border-white/10 pt-16 pb-16 px-6 md:px-20 text-white z-0 ">
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
      {/* Grid Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* 1. Brand Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Music size={20} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-white/60">
              MoodyPlayer
            </h2>
          </div>
          <p className="text-white/50 text-sm leading-relaxed">
            Experience music that matches your emotions. AI-powered mood
            detection for the perfect vibe, anytime, anywhere.
          </p>
        </div>

        {/* 2. Quick Links */}
        <div>
          <h3 className="font-semibold text-lg mb-6 text-white/90">Discover</h3>
          <ul className="space-y-3 text-white/50 text-sm">
            {[
              "New Arrivals",
              "Featured Playlists",
              "Mood Scanning",
              "Artists",
            ].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="hover:text-indigo-400 transition-colors duration-300 flex items-center gap-2">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* 3. Support */}
        <div>
          <h3 className="font-semibold text-lg mb-6 text-white/90">Support</h3>
          <ul className="space-y-3 text-white/50 text-sm">
            {[
              "Help Center",
              "Privacy Policy",
              "Terms of Service",
              "Contact Us",
            ].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="hover:text-indigo-400 transition-colors duration-300">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* 4. Socials & Newsletter */}
        <div>
          <h3 className="font-semibold text-lg mb-6 text-white/90">Connect</h3>
          <div className="flex gap-4 mb-6">
            {socialMediaLink.map((Icon, index) => (
              <motion.a
                key={index}
                href={Icon.link}
                target="_blank"
                whileHover={{ y: -5, color: "#818cf8" }}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-white/70 transition-all hover:bg-white/10">
                <Icon.sociolIcon size={18} />
              </motion.a>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg border border-white/10">
            <Mail size={16} className="text-white/40 ml-2" />
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-white/30"
            />
          </div>
        </div>
      </div>
      {/* Divider */}
      <div className="h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent my-10" />

      {/* Copyright */}
      <div className="flex flex-col md:flex-row items-center justify-between text-white/40 text-xs text-center md:text-left">
        <p>
          &copy; {new Date().getFullYear()} MoodyPlayer. All rights reserved.
        </p>
        <p className="flex items-center gap-1 mt-2 md:mt-0">
          Made with <Heart size={12} className="text-red-500 fill-red-500" /> by
          Munna Rawat
        </p>
      </div>
    </footer>
  );
};

export default Footer;
