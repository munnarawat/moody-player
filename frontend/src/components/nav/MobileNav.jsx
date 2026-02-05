import React from "react";
import { Home, Search, ScanFace, Library, User } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
const MobileNav = () => {
  const Navigate = useNavigate();
  const location = useLocation();
  const navItems = [
    { path: "/", name: "Home", icon: Home },
    { path: "/search", name: "Search", icon: Search },
    { path: "/", name: "Mood", icon: ScanFace },
    { path: "/Playlist", name: "Library", icon: Library },
    { path: "/profile", name: "Profile", icon: User },
  ];
  return (
    <div className=" bottom-4 left-4 right-4 bg-black/90 backdrop-blur-md border border-gray-800 rounded-2xl h-16 flex items-center justify-between px-2 z-50 shadow-xl">
      {navItems.map((item) => (
        <NavLink key={item.name} to={item.path} className="relative">
          {({ isActive }) => (
            <motion.div
              layout
              className={`flex items-center justify-center h-10 px-4 rounded-full transition-colors duration-300 ${
                isActive
                  ? "bg-purple-600 text-white"
                  : "bg-transparent text-gray-500 hover:text-gray-300"
              }`}>
              {/* Icon Render */}
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />

              {/* Text Animation Logic */}
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                    animate={{ width: "auto", opacity: 1, marginLeft: 8 }}
                    exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden whitespace-nowrap text-sm font-medium">
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </NavLink>
      ))}
    </div>
  );
};

export default MobileNav;
