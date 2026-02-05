import React, { useEffect, useState } from "react";
import AppRouter from "./router/AppRouter";
import NavBar from "./components/nav/NavBar";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "./store/authSlice";
import MusicPlayer from "./components/MusicPlayer";
import Footer from "./page/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MobileNav from "./components/nav/MobileNav";

const App = () => {
  const dispatch = useDispatch();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsCheckingAuth(false);
        return;
      }
      try {
        const response = await axios.get("http://localhost:3000/api/auth/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.user) {
          dispatch(setUser(response.data.user));
        }
      } catch (error) {
        console.log("token expired or Invalid❌");
        dispatch(setUser(null));
      } finally {
        setIsCheckingAuth(false);
      }
    };
    checkUser();
  }, [dispatch]);
  if (isCheckingAuth) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }
  return (
    <div className="w-full h-full bg-black">
      <NavBar />
      <AppRouter />
      <Footer />
      <div className=" z-999 fixed bottom-0 w-full">
        <MusicPlayer />
        <span className="block sm:hidden">
          <MobileNav />
        </span>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition:Bounce
      />
    </div>
  );
};

export default App;
