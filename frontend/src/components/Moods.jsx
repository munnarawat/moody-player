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
} from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";
ChartJS.register(ArcElement, Tooltip, Legend);
const Moods = () => {
  const [mood, setMood] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMoodHistory();
  }, []);
  const fetchMoodHistory = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:3000/api/history/mood", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMood(res.data.history || []);
    } catch (error) {
      console.log("fetch error", error);
    } finally {
      setLoading(false);
    }
  };
  const chartData = useMemo(() => {
    const moodCount = {};

    mood.forEach((items) => {
      const mood = items.mood.charAt(0).toUpperCase() + items.mood.slice(1);
      moodCount[mood] = (moodCount[mood] || 0) + 1;
    });
    return {
      labels: Object.keys(moodCount),
      datasets: [
        {
          label: "# of Scans",
          data: Object.values(moodCount),
          backgroundColor: [
            "#FACC15",
            "#60A5FA",
            "#EF4444",
            "#EC4899",
            "#9CA3AF",
            "#8B5CF6",
          ],
          borderColor: "#000000",
          borderWidth: 2,
        },
      ],
    };
  }, [mood]);
  // chartOptions
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: { color: "white", font: { size: 12 } },
      },
    },
  };
  // Icon Helper
  const getMoodIcon = (mood) => {
    switch (mood.toLowerCase()) {
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
      <div className="text-center py-10">
        <Loader size={40} className=" animate-spin text-indigo-500 mx-auto" />
      </div>
    );

  return (
    <div className="space-y-8 w-full min-h-screen p-1 bg-black">
      {/* --- SECTION 1: MOOD ANALYTICS (CHART) --- */}
      {mood.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 border mt-20 border-white/10 p-6 rounded-2xl flex flex-col items-center">
          <h3 className="text-lg font-bold  text-white mb-4 flex items-center gap-2">
            <PieChart size={20} className="text-purple-400" />
            Mood Analytics
          </h3>
          <div className="h-48 w-full max-w-xs">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
          <p className="text-white/40 text-xs mt-4 text-center">
            Based on your last {mood.length} scans
          </p>
        </motion.div>
      )}
      {/* section-2 timeLine-list */}
      <div className="space-y-4 mt-20 pb-10 ">
        <h3 className="text-lg font-bold text-white mb-2">Recent timeLine</h3>
        {mood.length === 0 ? (
          <div className="text-center text-white/40 py-20">
            {" "}
            No mood History found yet!
          </div>
        ) : (
          mood.map((item, index) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              key={item._id || index}
              className="flex items-center justify-between bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-full group-hover:bg-white/10 transition">
                  {getMoodIcon(item.mood)}
                </div>
                <div>
                  <h3 className="text-white font-bold capitalize ">
                    {item.mood}
                  </h3>
                  <p className="text-xs text-white/50"> Detected via Camera</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-white/40 text-sm">
                  <Calendar size={14} />
                  {new Date(item.createdAt || Date.now()).toLocaleDateString()}
                </div>
                <p className="text-xs text-white/30 mt-1">
                  {new Date(item.createdAt || Date.now()).toLocaleTimeString(
                    [],
                    { hour: "2-digit", minute: "2-digit" },
                  )}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Moods;
