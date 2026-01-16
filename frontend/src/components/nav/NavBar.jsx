import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut, Music2, ChevronDown, Settings } from "lucide-react";
import { logOut } from "../../store/authSlice";
import axios from "axios";

const NavBar = () => {

  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  // States for UI interactions
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [location]);

  // Navigation Links Data
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Moods", path: "/moods" },
    { name: "Playlists", path: "/playlist" },
    { name: "History", path: "/history" },
    { name: "Dashboard", path: "/admin/upload" },
  ];
   const handleLogOut = async () =>{
    try {
      await axios.post("http://localhost:3000/api/auth/logout",{},{withCredentials:true})
      dispatch(logOut());
      navigate("/login")
    } catch (error) {
      console.log("logout failed", error);
    }
   }
  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-black/40 backdrop-blur-xl border-b border-white/10 shadow-lg py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* 1. LOGO AREA */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-indigo-500/20 rounded-lg group-hover:bg-indigo-500/40 transition-all">
                <Music2 className="text-indigo-400" size={24} />
            </div>
            <div className="text-xl font-bold tracking-wider text-white">
              Moody<span className="text-indigo-400 group-hover:text-indigo-300 transition-colors">Player</span>
            </div>
          </Link>

          {/* 2. DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className="relative group text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                {link.name}
                {/* Active/Hover Line Indicator */}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-400 transition-all duration-300 group-hover:w-full ${location.pathname === link.path ? 'w-full' : ''}`}></span>
              </Link>
            ))}
          </div>

          {/* 3. AUTH & PROFILE SECTION */}
          <div className="hidden md:flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors">
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-5 py-2 text-sm font-semibold bg-white text-black rounded-full hover:bg-indigo-400 hover:text-white transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.4)]"
                >
                  Register
                </Link>
              </>
            ) : (
              // User Dropdown
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 pr-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold">
                    {user?.userName?.[0]?.toUpperCase() || "U"}
                  </div>
                  <ChevronDown size={14} className={`text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-48 bg-[#0a0a0c] border border-white/10 rounded-xl shadow-2xl backdrop-blur-3xl overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-white/5">
                        <p className="text-sm text-white font-medium truncate">{user?.userName || "User"}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email || "user@moody.com"}</p>
                      </div>
                      <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition">
                        <User size={16} /> Profile
                      </Link>
                      <Link to="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition">
                        <Settings size={16} /> Settings
                      </Link>
                      <button 
                        onClick={() => handleLogOut()}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition text-left"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* 4. MOBILE TOGGLE BUTTON */}
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </motion.nav>

      {/* 5. MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl md:hidden pt-24 px-6"
          >
            <div className="flex flex-col gap-6 text-center">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className="text-2xl font-light text-white hover:text-indigo-400 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-white/10 my-4" />
              {!isAuthenticated ? (
                 <div className="flex flex-col gap-4">
                    <Link to="/login" className="text-white">Login</Link>
                    <Link to="/register" className="bg-white text-black py-3 rounded-full font-bold">Register</Link>
                 </div>
              ) : (
                <button onClick={()=>handleLogOut()} className="text-red-400 flex items-center justify-center gap-2">
                    <LogOut size={20} /> Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;