import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Music2,
  AlertCircle,
} from "lucide-react";
import axios from "axios";

const Register = () => {
  // RHF Setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  // form submit handler
  const onSubmit = async (data) => {
    const payload = {
      fullName: {
        firstName: data.firstName,
        lastName: data.lastName,
      },
      userName: data.userName,
      email: data.email,
      password: data.password,
    };
     console.log("PAYLOAD 👉", payload);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
         payload,{
          headers:{
            "Content-Type":"application/json",
          },
          withCredentials:true,
         }
      );
      if(response.data){
        navigate("/");
      }
      console.log("Registration Successful:", response.data);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center relative overflow-hidden text-white">
      {/* BACKGROUND ANIMATED CIRCLES */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[120px]"
      />
      {/* GLASS FORM CARD */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full  max-w-md p-8 mt-20 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_40px_-10px_rgba(129,140,248,0.3)]">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-indigo-500/20 rounded-full text-indigo-400">
              <Music2 size={32} />
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Create Account</h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="first-lastName-container flex gap-4">
            {/* firstName Field */}
            <div>
              <div
                className={`relative group ${
                  errors.firstName ? "text-red-400" : "text-white"
                }`}>
                <User
                  className="absolute left-4 top-3.5 text-white/40 group-focus-within:text-indigo-400"
                  size={20}
                />
                <input
                  {...register("firstName", {
                    required: "firstName is required",
                  })}
                  placeholder="firstName"
                  className={`w-full bg-black/20 border rounded-xl py-3 pl-12 pr-4 focus:outline-none transition-all
                    ${
                      errors.firstName
                        ? "border-red-500/50 focus:border-red-500"
                        : "border-white/10 focus:border-indigo-500/50"
                    }
                `}
                />
              </div>
              {/* Error Message */}
              {errors.firstName && (
                <p className="text-red-400 text-xs mt-1 ml-2 flex items-center gap-1">
                  <AlertCircle size={10} /> {errors.firstName.message}
                </p>
              )}
            </div>
            {/* lastName Field */}
            <div>
              <div
                className={`relative group ${
                  errors.lastName ? "text-red-400" : "text-white"
                }`}>
                <User
                  className="absolute left-4 top-3.5 text-white/40 group-focus-within:text-indigo-400"
                  size={20}
                />
                <input
                  {...register("lastName")}
                  placeholder=" lastName"
                  className={`w-full bg-black/20 border rounded-xl py-3 pl-12 pr-4 focus:outline-none transition-all
                    ${
                      errors.lastName
                        ? "border-red-500/50 focus:border-red-500"
                        : "border-white/10 focus:border-indigo-500/50"
                    }
                `}
                />
              </div>
              {/* Error Message */}
              {errors.lastName && (
                <p className="text-red-400 text-xs mt-1 ml-2 flex items-center gap-1">
                  <AlertCircle size={10} /> {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
          {/* userName field */}
          <div>
            <div
              className={`relative group ${
                errors.userName ? "text-red-400" : "text-white"
              }`}>
              <User
                className="absolute left-4 top-3.5 text-white/40 group-focus-within:text-indigo-400"
                size={20}
              />
              <input
                {...register("userName", { required: "User Name is required" })}
                placeholder="User Name"
                className={`w-full bg-black/20 border rounded-xl py-3 pl-12 pr-4 focus:outline-none transition-all
                    ${
                      errors.userName
                        ? "border-red-500/50 focus:border-red-500"
                        : "border-white/10 focus:border-indigo-500/50"
                    }
                `}
              />
            </div>
            {/* Error Message */}
            {errors.userName && (
              <p className="text-red-400 text-xs mt-1 ml-2 flex items-center gap-1">
                <AlertCircle size={10} /> {errors.userName.message}
              </p>
            )}
          </div>
          {/* Email Field */}
          <div>
            <div className="relative group">
              <Mail
                className="absolute left-4 top-3.5 text-white/40 group-focus-within:text-indigo-400"
                size={20}
              />
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Invalid email address",
                  },
                })}
                placeholder="Email Address"
                className={`w-full bg-black/20 border rounded-xl py-3 pl-12 pr-4 focus:outline-none transition-all
                    ${
                      errors.email
                        ? "border-red-500/50 focus:border-red-500"
                        : "border-white/10 focus:border-indigo-500/50"
                    }
                `}
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-xs mt-1 ml-2 flex items-center gap-1">
                <AlertCircle size={10} /> {errors.email.message}
              </p>
            )}
          </div>
          {/* Password Field */}
          <div>
            <div className="relative group">
              <Lock
                className="absolute left-4 top-3.5 text-white/40 group-focus-within:text-indigo-400"
                size={20}
              />
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Must be at least 6 chars" },
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

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-indigo-600/40 transition-all flex items-center justify-center gap-2">
            Sign Up <ArrowRight size={18} />
          </motion.button>
        </form>

        <p className="text-center text-white/40 text-sm mt-8">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
