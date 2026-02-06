import React from "react";
import { Home, Search, ScanFace, Library, User, LogIn } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
const MobileNav = () => {
  const Navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const navItems = [
    { path: "/", name: "Home", icon: Home },
    { path: "/search", name: "Search", icon: Search },
    { path: "/Playlist", name: "Library", icon: Library },
    {
      path: user ? "profile" : "/login",
      name: user ? "profile" : "LogIn",
      icon: user ? User : LogIn,
    },  
  ];
  const handleScanClick = () => {
    const ScrollToScanner = () => {
      const element = document.getElementById("mood-scanner");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    if (location.pathname !== "/") {
      Navigate("/");
      setTimeout(ScrollToScanner, 100);
    } else {
      ScrollToScanner();
    }
  };
  return (
    <div className=" bottom-4 left-4 right-4 bg-black/90 backdrop-blur-md border border-gray-800 rounded-2xl h-16 flex items-center justify-between px-2 z-50 shadow-xl">
      {/* start two item */}
      {navItems.slice(0, 2).map((item) => (
        <NavItem key={item.name} item={item} />
      ))}
      {/* middle */}
      <button onClick={handleScanClick} className=" relative  mx-1 group">
        <div className="p-4 rounded-full border-4 border-black bg-purple-600 shadow-lg shadow-purple-900/50 transition-transform duration-200 active:scale-95">
          <ScanFace size={28} color="white" />
        </div>
      </button>
      {/* end to Items */}
      {navItems.slice(2).map((item) => (
        <NavItem key={item.name} item={item} />
      ))}
    </div>
  );
};
const NavItem = ({ item }) => (
  <NavLink to={item.path} className="relative">
    {({ isActive }) => (
      <motion.div
        layout
        className={`flex items-center flex-col gap-1 justify-center py-1.5 px-3 rounded-xl transition-colors duration-300 ${
          isActive
            ? "bg-purple-600 text-white"
            : "bg-transparent text-gray-500 hover:text-gray-300"
        }`}>
        <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
         <span className="text-xs ">{item.name}</span>
      </motion.div>
    )}
  </NavLink>
);

export default MobileNav;
