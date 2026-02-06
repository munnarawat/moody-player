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
    { path: "/Playlist", name: "Library", icon: Library },
    { path: "/profile", name: "Profile", icon: User },
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
      <button onClick={handleScanClick} className=" relative -top-6 mx-1 group">
        <div className="p-4 rounded-full border-4 border-black bg-purple-600 shadow-lg shadow-purple-900/50 transition-transform duration-200 active:scale-95">
        <ScanFace size={28} color="white"/>
        </div>
      </button>
      {/* end to Items */}
      {navItems.slice(2).map((item)=>(
        <NavItem key={item.name} item={item}/>
      ))}
    </div>
  );
};
const NavItem = ({ item }) => (
  <NavLink to={item.path} className="relative">
    {({ isActive }) => (
      <motion.div
        layout
        className={`flex items-center justify-center h-10 px-3 rounded-full transition-colors duration-300 ${
          isActive
            ? "bg-purple-600 text-white"
            : "bg-transparent text-gray-500 hover:text-gray-300"
        }`}>
        <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />

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
);

export default MobileNav;
