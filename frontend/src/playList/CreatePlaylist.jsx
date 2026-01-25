import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { UploadCloud, Image as ImageIcon,Loader, X, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
const CreatePlaylist = ({ isOpen, isClose, refreshPlaylists }) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    let token = localStorage.getItem("token");
    if (!token) {
      toast.warn("please login first ");
      return;
    }
    try {
      setLoading(true);
      const payload = {
        name: data.name,
        description: data.description,
      };
      await axios.post("http://localhost:3000/api/playlist", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      (toast.success("Playlist create Successfully! 🎉"), reset());
      refreshPlaylists();
      isClose();
    } catch (error) {
      console.log("create playlist error", error);
      toast.error("failed to create playlist❌");
    } finally {
      setLoading(false);
    }
  };
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <div className=" fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* backdrop-blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={isClose}
          className=" absolute inset-0 bg-black/80 backdrop-blur-sm">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]" />
          </div>
        </motion.div>
        {/* create-playlist*/}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
          {/* close btn */}
          <button
            onClick={isClose}
            className=" absolute text-indigo-400 hover:text-white  top-2 right-3 cursor-pointer">
            <X size={20} />
          </button>
          <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-linear-to-r from-indigo-400 to-purple-400">
            Create Playlist
          </h2>
          <p className="text-sm text-white/40 mb-6">Create your own playlist</p>

          <form onSubmit={handleSubmit(onSubmit)} className=" space-y-6">
            <div className="flex flex-col gap-2">
              {/* title name */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-white/60 ml-1">
                  Playlist name
                </label>
                <input
                  {...register("name", {
                    required: "playlist name are require",
                  })}
                  type="text"
                  placeholder="enter playlist name"
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
                {errors.name && (
                  <span className="text-red-400 text-xs flex items-center gap-1">
                    <AlertCircle size={10} /> {errors.name.message}
                  </span>
                )}
              </div>
              {/* description  */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-white/60 ml-1">
                  Playlist Description
                </label>
                <textarea
                  {...register("description")}
                  rows="3"
                  placeholder="Describe your playlist..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                />
              </div>
              {/* cover-image */}
              <div className="relative group">
                <label className="block w-full h-32 border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-white/5 transition-all">
                  <ImageIcon
                    size={24}
                    className="text-white/40 mb-2 group-hover:text-purple-400"
                  />
                  <span className="text-sm text-white/60 group-hover:text-white">
                    Upload Cover Art
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    {...register("coverImage")}
                    className="text-sm  pl-[30%] text-white/40"
                  />
                </label>
              </div>
            </div>
            <button className=" text-center w-full bg-linear-to-r from-indigo-600 to-purple-600  text-white font-bold cursor-pointer shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all  rounded-lg px-2 py-2">
              {loading ? <Loader className="animate-spin" size={20} /> : "Create Playlist"}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreatePlaylist;
