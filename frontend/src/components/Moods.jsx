import React, { useEffect, useMemo, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import {
  Smile,
  Frown,
  Meh,
  Zap,
  Heart,
  Loader,
  Calendar,
  PieChart,
  Activity,
  Camera,
  MousePointer2,
} from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";

ChartJS.register(ArcElement, Tooltip, Legend);

const Moods = () => {
  const [mood, setMood] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMoodHistory();
  }, []);

  const fetchMoodHistory = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/history/mood`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMood(res.data.history || []);
    } catch (error) {
      console.log("fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Memoized Calculations for Chart & Stats
  const { chartData, topMood, totalScans } = useMemo(() => {
    const moodCount = {};
    let maxCount = 0;
    let dominant = "N/A";

    mood.forEach((items) => {
      const m = items.mood.charAt(0).toUpperCase() + items.mood.slice(1);
      moodCount[m] = (moodCount[m] || 0) + 1;

      // Calculate Top Mood
      if (moodCount[m] > maxCount) {
        maxCount = moodCount[m];
        dominant = m;
      }
    });

    return {
      totalScans: mood.length,
      topMood: dominant,
      chartData: {
        labels: Object.keys(moodCount),
        datasets: [
          {
            label: "# of Scans",
            data: Object.values(moodCount),
            backgroundColor: [
              "#FACC15", // Happy - Yellow
              "#60A5FA", // Sad - Blue
              "#EF4444", // Angry - Red
              "#EC4899", // Romantic - Pink
              "#9CA3AF", // Neutral - Gray
              "#8B5CF6", // Surprised - Purple
            ],
            borderColor: "#000000",
            borderWidth: 2,
          },
        ],
      },
    };
  }, [mood]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: { color: "white", font: { size: 12 }, padding: 20 },
      },
    },
  };

  const getMoodIcon = (moodName) => {
    switch (moodName.toLowerCase()) {
      case "happy":
        return <Smile className="text-yellow-400" />;
      case "sad":
        return <Frown className="text-blue-400" />;
      case "angry":
        return <Zap className="text-red-500" />;
      case "romantic":
        return <Heart className="text-pink-500" />;
      case "neutral":
        return <Meh className="text-gray-400" />;
      default:
        return <Smile className="text-indigo-400" />;
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <Loader size={40} className="animate-spin text-indigo-500" />
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4 md:px-8 pb-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8">
        <h1 className="text-3xl font-bold">Your Mood Journey</h1>
        <p className="text-white/50 text-sm">
          See how you've been feeling lately
        </p>
      </motion.div>

      {/* 📊 Quick Stats Cards */}
      <div className="grid grid-cols-2  gap-3 sm:gap-4 mb-8">
        <div className="bg-zinc-900/50 border border-white/5 p-2 sm:p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-indigo-500/20 rounded-full text-indigo-400">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-white/40 text-xs uppercase">Total Checks</p>
            <h3 className=" text-lg sm:text-2xl font-bold">{totalScans}</h3>
          </div>
        </div>
        <div className="bg-zinc-900/50 border border-white/5 p-2 sm:p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-pink-500/20 rounded-full text-pink-400">
            <Heart size={24} />
          </div>
          <div>
            <p className="text-white/40 text-xs uppercase">Top Mood</p>
            <h3 className=" text-lg sm:text-2xl  font-bold">{topMood}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* --- LEFT: CHART --- */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-zinc-900/30 border border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center min-h-75">
          <div className="flex items-center gap-2 mb-6">
            <PieChart size={20} className="text-purple-400" />
            <h3 className="text-lg font-bold">Analytics</h3>
          </div>

          {mood.length > 0 ? (
            <div className="h-64 w-full">
              <Doughnut data={chartData} options={chartOptions} />
            </div>
          ) : (
            <p className="text-white/30">No data available yet</p>
          )}
        </motion.div>

        {/* --- RIGHT: TIMELINE LIST --- */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-zinc-900/30 border border-white/10 rounded-2xl overflow-hidden flex flex-col max-h-100">
          <div className="p-4 border-b border-white/10 bg-white/5">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Calendar size={18} className="text-indigo-400" /> Recent History
            </h3>
          </div>
          <div data-lenis-prevent className="overflow-y-auto p-4 space-y-3 custom-scroll">
            {mood.length === 0 ? (
              <div className="text-center text-white/30 py-10">
                No mood history found!
              </div>
            ) : (
              mood.map((item, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={item._id || index}
                  className="flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/5 p-3 rounded-lg transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-black/40 rounded-full">
                      {getMoodIcon(item.mood)}
                    </div>
                    <div>
                      <h4 className="text-white font-medium capitalize text-sm md:text-base">
                        {item.mood}
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-white/40">
                        {item.source === "manual" ? (
                          <MousePointer2 size={10} />
                        ) : (
                          <Camera size={10} />
                        )}
                        {item.source ? `${item.source} scan` : "Camera scan"}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-white/60 font-mono">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-[10px] text-white/30">
                      {new Date(item.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Moods;
