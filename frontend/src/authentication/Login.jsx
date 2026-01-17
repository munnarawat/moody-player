import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { User, Lock, ArrowRight, Music2, AlertCircle } from "lucide-react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // error handling
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = async (data) => {
    setServerError("");
    setIsLoading(false);
    const payload = {
      identifier: data.identifier,
      password: data.password,
    };
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        payload,
        { withCredentials: true }
      );      
      if (response.data.user) {
        dispatch(setUser(response.data.user));
        localStorage.setItem("token", response.data.token)
        navigate("/");
      }
      
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong!";
      setServerError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center relative overflow-hidden pb-10 text-white">
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, -90, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px]"
      />

      <motion.div
        animate={{ scale: [1, 1.1, 1], x: [0, 20, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px]"
      />

      {/* GLASS FORM CARD */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md mt-20 p-8 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_40px_-10px_rgba(79,70,229,0.3)]">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-indigo-500/20 rounded-full text-indigo-400">
              <Music2 size={32} />
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome Back</h2>
          <p className="text-white/40 mt-2 text-sm">
            Resume your musical journey
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/*error handling print  */}
          {serverError && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle size={16} />
              <span>{serverError}</span>
            </div>
          )}
          {/* username and email Field */}
          <div>
            <div className="relative group">
              <User
                className="absolute left-4 top-3.5 text-white/40 group-focus-within:text-indigo-400 transition-colors"
                size={20}
              />
              <input
                {...register("identifier", {
                  required: "userName or email is required",
                })}
                placeholder="Email Address"
                className={`w-full bg-black/20 border rounded-xl py-3 pl-12 pr-4 focus:outline-none transition-all
                  ${
                    errors.identifier
                      ? "border-red-500/50 focus:border-red-500"
                      : "border-white/10 focus:border-indigo-500/50"
                  }
                `}
              />
            </div>
            {errors.identifier && (
              <p className="text-red-400 text-xs mt-1 ml-2 flex items-center gap-1">
                <AlertCircle size={10} /> {errors.identifier.message}
              </p>
            )}
          </div>
          {/* Password Field */}
          <div>
            <div className="relative group">
              <Lock
                className="absolute left-4 top-3.5 text-white/40 group-focus-within:text-indigo-400 transition-colors"
                size={20}
              />
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                })}
                placeholder="Password"
                className={`w-full bg-black/20 border rounded-xl py-3 pl-12 pr-4 focus:outline-none transition-all
                  ${
                    errors.password
                      ? "border-red-500/50 focus:border-red-500"
                      : "border-white/10 focus:border-indigo-500/50"
                  }
                `}
              />
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs mt-1 ml-2 flex items-center gap-1">
                <AlertCircle size={10} /> {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-indigo-600/40 transition-all flex items-center justify-center gap-2">
              {isLoading?"Logging in..":"Log IN"}
              {!isLoading && <ArrowRight size={18} />}
             
          </motion.button>
        </form>

        <p className="text-center text-white/40 text-sm mt-8">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
