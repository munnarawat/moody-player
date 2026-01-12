import React, { useEffect, useState } from "react";
import AppRouter from "./router/AppRouter";
import NavBar from "./components/nav/NavBar";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "./store/authSlice";

const App = () => {
  const dispatch = useDispatch();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/auth/", {
          withCredentials: true,
        });
        if (response.data.user) {
          dispatch(setUser(response.data.user));
        }
      } catch (error) {
        console.log("User not logged in or session expired");
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
    <div className="w-full h-full ">
      <NavBar />
      <AppRouter />
    </div>
  );
};

export default App;
