import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateUserLikedSongs } from "../store/authSlice";

const LikedButton = ({ songId,isAlreadyLiked }) => {
  const [liked, setLiked] = useState(false);
  const dispatch = useDispatch()
  useEffect(()=>{
    setLiked(isAlreadyLiked)
  },[isAlreadyLiked])

  const handleLiked = async (e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to like Songs!");
        return;
      }
      const newStatus = !liked;
      setLiked(newStatus);
      dispatch(updateUserLikedSongs({songId, isLiked:newStatus}))
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/likes/toggle`,
        { songId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (res.data.isLiked) {
        toast.success("Added to Favorites ❤️");
      } else {
        toast.info("Removed from Favorites 💔");
      }
    } catch (error) {
      console.error("Like Error", error);
      setLiked(!liked);
      toast.error("Something went wrong");
    }
  };
  return (
    <button
      onClick={handleLiked}
      className="hover:scale-110 transition-transform cursor-pointer">
      <Heart
        size={20}
        className={
          liked ? "text-green-500 fill-green-500" : "text-white/60 hover:text-white"
        }
      />
    </button>
  );
};

export default LikedButton;
