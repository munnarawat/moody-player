import React from "react";
import { Route, Router, Routes } from "react-router-dom";
import Moods from "../components/Moods";
import History from "../components/History";
import Login from "../authentication/Login";
import Register from "../authentication/Register";
import PlayList from "../playList/PlayList";
import Home from "../page/Home";
import AdminUpload from "../page/AdminUpload";
import PlaylistDetails from "../playList/PlaylistDetails";
import LikePlaylist from "../playList/LikePlaylist";
import SearchPage from "../page/SearchPage";
import Profile from "../page/Profile";
import PlaylistPage from "../page/PlaylistPage";
import ScrollTop from "../animation/ScrollTop";

const AppRouter = () => {
  return (
    <>
      <ScrollTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/moods" element={<Moods />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/playlist/:id" element={<PlaylistPage />} />
        <Route path="/admin/upload" element={<AdminUpload />} />
        <Route path="/library" element={<PlayList />} />
        <Route path="/library/Likes" element={<LikePlaylist />} />
        <Route path="/library/:id" element={<PlaylistDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
};

export default AppRouter;
