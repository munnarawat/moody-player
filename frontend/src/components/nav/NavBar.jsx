import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  User,
  LogOut,
  Music2,
  ChevronDown,
  Search,
  LayoutDashboard,
} from "lucide-react";
import { logOut } from "../../store/authSlice";
import axios from "axios";

const NavBar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // UI States
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  
  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [location]);


  // Links Data
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Moods", path: "/moods" },
    { name: "Playlists", path: "/playlist" },
    {name:"Library" , path:"/library"}
  ];

  const handleLogOut = async () => {
    const token = localStorage.getItem("token");
    try {
      if (token) {
        await axios.post(
          "http://localhost:3000/api/auth/logout",
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        );
      }
    } catch (error) {
      console.log("logout failed", error);
    } finally {
      localStorage.removeItem("token");
      dispatch(logOut());
      navigate("/login");
    }
  };
  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-black/60 backdrop-blur-xl border-b border-white/10 shadow-lg py-3"
            : "bg-transparent py-4 md:py-6"
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* 1. LOGO */}
          <Link to="/" className="flex items-center gap-2 group z-50">
            <div className="p-2 bg-indigo-500/20 rounded-lg group-hover:bg-indigo-500/40 transition-all">
              <Music2 className="text-indigo-400" size={24} />
            </div>
            <div className="text-xl font-bold tracking-wider text-white">
              Moody
              <span className="text-indigo-400 group-hover:text-indigo-300 transition-colors">
                Player
              </span>
            </div>
          </Link>

          {/* 2. DESKTOP LINKS (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="relative group text-sm font-medium text-gray-300 hover:text-white transition-colors">
                {link.name}
                <span
                  className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-400 transition-all duration-300 group-hover:w-full ${
                    location.pathname === link.path ? "w-full" : ""
                  }`}></span>
              </Link>
            ))}
            {/* Admin Dashboard Link */}
            {user && user.role === "admin" && (
              <Link
                to="/admin/upload"
                className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
                <LayoutDashboard size={16} /> Dashboard
              </Link>
            )}
          </div>

          {/* 3. RIGHT SIDE ACTIONS */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* SEARCH BAR (Responsive Logic) */}

            {/* Desktop: Full Bar */}
            <div className="hidden md:flex group relative items-center bg-white/5 border border-white/10 rounded-full py-2 px-4 transition-all duration-300 w-48 focus-within:w-64 focus-within:bg-black/40 focus-within:border-indigo-500/50 focus-within:shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <Search className="text-white/40 group-focus-within:text-indigo-400 transition-colors w-4 h-4 mr-2" />
              <input
                type="text"
                className="bg-transparent border-none focus:outline-none text-white text-sm w-full placeholder-white/30"
                placeholder="Search..."
                onFocus={() => navigate("/search")}
              />
            </div>

            {/* AUTH BUTTONS / PROFILE (Desktop) */}
            <div className="hidden md:flex items-center gap-4">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="text-sm text-gray-300 hover:text-white transition">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2 text-sm font-semibold bg-white text-black rounded-full hover:bg-indigo-400 hover:text-white transition-all shadow-lg shadow-white/10 hover:shadow-indigo-500/20">
                    Register
                  </Link>
                </>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 p-1 pr-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition">
                    <div className="w-8 h-8 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                      {user?.userName?.[0]?.toUpperCase() || "U"}
                    </div>
                    <ChevronDown
                      size={14}
                      className={`text-gray-400 transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-56 bg-[#0a0a0c] border border-white/10 rounded-xl shadow-2xl backdrop-blur-3xl overflow-hidden ring-1 ring-white/5">
                        <div className="px-4 py-4 border-b border-white/5 bg-white/5">
                          <p className="text-sm text-white font-medium truncate">
                            {user?.userName || "User"}
                          </p>
                          <p className="text-xs text-gray-400 truncate mt-0.5">
                            {user?.email || "user@moody.com"}
                          </p>
                        </div>
                        <div className="p-1">
                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition">
                            <User size={16} className="text-indigo-400" /> My
                            Profile
                          </Link>
                          <button
                            onClick={handleLogOut}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition text-left">
                            <LogOut size={16} /> Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* MOBILE TOGGLE BUTTON */}
            <button
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
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
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl md:hidden pt-24 px-6 flex flex-col h-screen">
            {/* User Info Card in Mobile Menu */}
            {isAuthenticated && user && (
              <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-xl mb-8">
                <div className="w-12 h-12 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-lg font-bold text-white shadow-lg">
                  {user?.userName?.[0]?.toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <h3 className="text-white font-bold truncate">
                    {user.userName}
                  </h3>
                  <p className="text-white/50 text-sm truncate">{user.email}</p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-3xl font-light text-white/80 hover:text-white hover:pl-2 transition-all duration-300 flex items-center gap-3"
                  onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="w-1 h-8 bg-indigo-500 rounded-full opacity-0 hover:opacity-100 transition-opacity"></span>
                  {link.name}
                </Link>
              ))}

              {user && user.role === "admin" && (
                <Link
                  to="/admin/upload"
                  className="text-3xl font-light text-indigo-400 hover:text-indigo-300 hover:pl-2 transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}>
                  Dashboard
                </Link>
              )}

              <div className="h-px bg-white/10 my-4" />

              {!isAuthenticated ? (
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    to="/login"
                    className="py-3 text-center rounded-xl bg-white/5 text-white hover:bg-white/10 border border-white/10 transition">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="py-3 text-center rounded-xl bg-indigo-500 text-white font-bold hover:bg-indigo-600 transition">
                    Register
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-3 w-full rounded-xl bg-white/5 text-white hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 transition">
                    <User size={18} /> View Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="py-3 w-full rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white flex items-center justify-center gap-2 transition">
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;
