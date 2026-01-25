import { motion } from "framer-motion";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  UploadCloud,
  Music,
  Image as ImageIcon,
  CheckCircle,
  Loader,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminUpload = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  // react hook form
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();
  // submitHandler
  const onSubmit = async (data) => {
    setLoading(true);
    let token = localStorage.getItem("token");
    if (token) {
      token = token.replace(/^"|"$/g, "");
    }
    if (!token) {
      toast.warn("please login first");
      setSuccess(false);
      return;
    }
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("artist", data.artist);
      formData.append("genre", data.genre);
      formData.append("mood", data.mood);

      if (data.audio[0]) formData.append("audio", data.audio[0]);
      if (data.image[0]) formData.append("image", data.image[0]);
      //   api call

      await axios.post("http://localhost:3000/api/songs", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess(true);
      reset();
    } catch (error) {
      console.error("Upload Error:", error);
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        alert(
          "Permission Denied! Ya toh Token galat hai ya tum Admin nahi ho.",
        );
      } else {
        toast.error("Upload Failed!");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className=" min-h-screen w-full flex items-center justify-center bg-black  text-white px-4 pt-24 pb-10">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]" />
      </div>
      <motion.div
        className="relative z-10 w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-linear-to-r from-indigo-400 to-purple-400">
          Upload New Track
        </h2>
        <p className="text-white/40 mb-8 text-sm">
          Add music to your MoodyPlayer dataBase
        </p>
        {/* success */}
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl flex items-center gap-3 text-green-300">
            <CheckCircle size={20} />
            <span>Song uploaded successfully🎉</span>
          </motion.div>
        )}
        {/* from */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className=" grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* song title */}
            <div className=" space-y-2">
              <label className="text-sm font-medium text-white/60 ml-1">
                Song Title
              </label>
              <input
                {...register("title", { required: "title are required" })}
                type="text"
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="e.g. Blinding Lights"
              />
              {errors.title && (
                <span className="text-red-400 text-xs flex items-center gap-1">
                  <AlertCircle size={10} /> {errors.title.message}
                </span>
              )}
            </div>
            {/* song name */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/60 ml-1">
                Artist Name
              </label>
              <input
                {...register("artist", { required: "Artist is required" })}
                type="text"
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="e.g. The Weeknd"
              />
              {errors.artist && (
                <span className="text-red-400 text-xs flex items-center gap-1">
                  <AlertCircle size={10} /> {errors.artist.message}
                </span>
              )}
            </div>
            {/* Row 2: Mood & Genre */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/60 ml-1">
                  Mood Tags
                </label>
                <input
                  {...register("mood", {
                    required: "At least one mood is required",
                  })}
                  type="text"
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="happy, energetic, party"
                />
                {errors.mood && (
                  <span className="text-red-400 text-xs flex items-center gap-1">
                    <AlertCircle size={10} /> {errors.mood.message}
                  </span>
                )}
              </div>
            </div>
          </div>
          {/* genre */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-white/60 ml-1">
              Genre
            </label>
            <select
              {...register("genre", { required: "Genre is required" })}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none">
              <option value="" className="bg-black text-gray-500">
                Select Genre
              </option>
              <option value="Pop" className="bg-black">
                Pop
              </option>
              <option value="Rock" className="bg-black">
                Rock
              </option>
              <option value="Hip-Hop" className="bg-black">
                Hip-Hop
              </option>
              <option value="Electronic" className="bg-black">
                Electronic
              </option>
              <option value="Classical" className="bg-black">
                Classical
              </option>
              <option value="Lo-Fi" className="bg-black">
                Lo-Fi
              </option>
            </select>
            {errors.genre && (
              <span className="text-red-400 text-xs flex items-center gap-1">
                <AlertCircle size={10} /> {errors.genre.message}
              </span>
            )}
          </div>
          {/* Row 3: File Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Audio Upload */}
            <div className="relative group">
              <label className="block w-full h-32 border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-white/5 transition-all">
                <Music
                  size={24}
                  className="text-white/40 mb-2 group-hover:text-indigo-400"
                />
                <span className="text-sm text-white/60 group-hover:text-white">
                  Upload Audio (MP3)
                </span>

                {/* ✅ Register File Input */}
                <input
                  type="file"
                  accept="audio/*"
                  {...register("audio", { required: "Audio file is required" })}
                  className="hidden"
                />
              </label>
              {errors.audio && (
                <span className="text-red-400 text-xs mt-1 block text-center">
                  Audio is required
                </span>
              )}
            </div>

            {/* Image Upload */}
            <div className="relative group">
              <label className="block w-full h-32 border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-white/5 transition-all">
                <ImageIcon
                  size={24}
                  className="text-white/40 mb-2 group-hover:text-purple-400"
                />
                <span className="text-sm text-white/60 group-hover:text-white">
                  Upload Cover Art
                </span>
                {/* ✅ Register File Input */}
                <input
                  type="file"
                  accept="image/*"
                  {...register("image", {
                    required: "Cover image is required",
                  })}
                  className="hidden"
                />
              </label>
              {errors.image && (
                <span className="text-red-400 text-xs mt-1 block text-center">
                  Image is required
                </span>
              )}
            </div>
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? (
              <>
                <Loader size={20} className="animate-spin" /> Uploading to
                Cloud...
              </>
            ) : (
              <>
                <UploadCloud size={20} /> Publish Song
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminUpload;
