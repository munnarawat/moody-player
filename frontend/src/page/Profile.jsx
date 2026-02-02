import React from "react";
import {
  LogOut,
  User,
  Mail,
  Heart,
  History,
  Calendar,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logOut } from "../store/authSlice";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    dispatch(logOut());
    localStorage.removeItem("token");
    toast.success("logOut successfully ");
    navigate("/login");
  };
  if (!user) return null;
  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  console.log(user?.fullName.firstName);

  return (
    <div className="min-h-screen bg-black w-full text-white relative overflow-hidden py-24 px-6 pb-10">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-900/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="max-w-2xl mx-auto z-20 relative">
        {/* Header section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center mb-10">
          {/* Avatar circle  */}
          <div className="w-28 h-28 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl font-bold shadow-2xl shadow-purple-500/20 mb-4 border-4 border-black">
            {getInitials(user?.fullName.firstName)}
            {getInitials(user?.fullName.lastName)}
          </div>
          <h1 className="text-3xl font-bold capitalize">{user.userName}</h1>
          <div className="flex items-center gap-2 text-white/50 mt-1 bg-white/5 px-3 py-1 rounded-full text-sm">
            <Mail size={14} />
            {user.email}
          </div>
        </motion.div>
        {/* stats grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-2 gap-4 mb-8">
          {/* like song stat */}
          <div
            className="bg-zinc-900/50 border border-white/5 p-5 rounded-2xl flex flex-col items-center justify-center hover:bg-white/5 transition-colors group cursor-pointer"
            onClick={() => navigate("/playlist/likes")}>
            <Heart
              className="mb-2 text-pink-500 group-hover:scale-110 transition-transform"
              size={28}
            />
            <span className="text-2xl font-bold">
              {user.likedSongs?.length || 0}
            </span>
            <span className="text-xs text-white/40 uppercase tracking-wider">
              Liked Songs
            </span>
          </div>
          {/* Member Since Stat */}
          <div className="bg-zinc-900/50 border border-white/5 p-5 rounded-2xl flex flex-col items-center justify-center">
            <Calendar className="mb-2 text-indigo-400" size={28} />
            <span className="text-xl font-bold">
              {new Date(user.createdAt || Date.now()).getFullYear()}
            </span>
            <span className="text-xs text-white/40 uppercase tracking-wider">
              Member Since
            </span>
          </div>
        </motion.div>
        {/* --- MENU ACTIONS --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3">
          {/* View Mood History */}
          <button
            onClick={() => navigate("/moods")}
            className="w-full flex items-center justify-between bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-all group">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400">
                <History size={20} />
              </div>
              <span className="font-medium">Mood History</span>
            </div>
            <ChevronRight
              className="text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all"
              size={20}
            />
          </button>

          {/* Account Status (Static for now) */}
          <div className="w-full flex items-center justify-between bg-white/5 border border-white/10 p-4 rounded-xl opacity-80">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                <ShieldCheck size={20} />
              </div>
              <span className="font-medium">Account Status</span>
            </div>
            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
              Active
            </span>
          </div>

          {/* LOGOUT BUTTON */}
          <button
            onClick={() => handleLogOut()}
            className="w-full flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 font-bold p-4 rounded-xl hover:bg-red-500 hover:text-white transition-all mt-8 shadow-lg shadow-red-900/20">
            <LogOut size={20} />
            Logout
          </button>
        </motion.div>
        <p className="text-center text-white/20 text-xs mt-10">
          Moody Player v1.0.0 • Made with ❤️ by You
        </p>
      </div>
    </div>
  );
};

export default Profile;
