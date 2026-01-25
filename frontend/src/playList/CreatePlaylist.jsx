import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  UploadCloud,
  Image as ImageIcon,
  Loader,
  X,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

const CreatePlaylist = ({ isOpen, isClose, refreshPlaylists }) => {
  const {
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  
  const [loading, setLoading] = useState(false);
  
  // Preview Logic
  const selectedFile = watch("coverImage");
  const previewUrl =
    selectedFile && selectedFile.length > 0
      ? URL.createObjectURL(selectedFile[0])
      : null;

  const onSubmit = async (data) => {
    let token = localStorage.getItem("token");
    if (!token) {
      toast.warn("Please login first");
      return;
    }
    
    try {
      setLoading(true);
      const formData = new FormData();
      
      // 🔥 FIX 1: Name append karna zaroori hai!
      formData.append("name", data.name); 
      formData.append("description", data.description);
      
      if (data.coverImage && data.coverImage[0]) {
        formData.append("coverImage", data.coverImage[0]);
      }

      await axios.post("http://localhost:3000/api/playlist", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Playlist created Successfully! 🎉");
      reset();
      refreshPlaylists();
      isClose();
    } catch (error) {
      console.log("create playlist error", error);
      toast.error("Failed to create playlist ❌");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={isClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
          
        {/* Background Glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
           <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-[100px]" />
           <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]" />
        </div>

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 w-full max-w-lg bg-[#121212] border border-white/10 p-8 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Close Btn */}
          <button
            onClick={isClose}
            className="absolute text-white/40 hover:text-white top-4 right-4 cursor-pointer transition-colors"
          >
            <X size={24} />
          </button>

          <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            Create Playlist
          </h2>
          <p className="text-sm text-white/40 mb-6">Create your own collection</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col gap-4">
              
              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/60 ml-1">
                  Playlist Name
                </label>
                <input
                  {...register("name", {
                    required: "Playlist name is required",
                  })}
                  type="text"
                  placeholder="e.g. Gym Motivation"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-white/20"
                />
                {errors.name && (
                  <span className="text-red-400 text-xs flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.name.message}
                  </span>
                )}
              </div>

              {/* Description Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/60 ml-1">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  rows="3"
                  placeholder="Describe your playlist..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none placeholder:text-white/20"
                />
              </div>

              {/* Cover Image Input */}
              <div className="relative group">
                <label className="block w-full h-32 border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-white/5 transition-all overflow-hidden">
                  {previewUrl ? (
                    <div className="w-full h-full relative">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <p className="text-white font-medium text-sm">
                          Change Image
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <ImageIcon
                        size={24}
                        className="text-white/40 mb-2 group-hover:text-indigo-400 transition-colors"
                      />
                      <span className="text-sm text-white/60 group-hover:text-white transition-colors">
                        Upload Cover Art
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    {...register("coverImage")}
                    className="hidden" 
                  />
                </label>
              </div>
            </div>
            
            {/* Submit Button */}
            <button
              disabled={loading}
              className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white font-bold cursor-pointer shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all rounded-xl px-4 py-3 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader className="animate-spin" size={22} /> : "Create Playlist"}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreatePlaylist;