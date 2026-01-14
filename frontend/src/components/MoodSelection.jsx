import { motion } from "framer-motion";
import React from "react";

const mood = [
  {
    id: 1,
    name: "happy",
    label: "Happy",
    emoji: "😊",
    color: "from-yellow-500 to-orange-600",
  },
  {
    id: 2,
    name: "sad",
    label: "Sad",
    emoji: "😔",
    color: "from-blue-600 to-indigo-700",
  },
  {
    id: 3,
    name: "angry",
    label: "Angry",
    emoji: "😤",
    color: "from-red-600 to-red-800",
  },
  {
    id: 4,
    name: "neutral",
    label: "Neutral",
    emoji: "😐",
    color: "from-teal-500 to-emerald-600",
  },
  {
    id: 5,
    name: "surprised",
    label: "Surprised",
    emoji: "😲",
    color: "from-purple-500 to-violet-600",
  },
  {
    id: 6,
    name: "romantic",
    label: "Romantic",
    emoji: "💖",
    color: "from-pink-500 to-rose-600",
  },
];
const MoodSelection = ({ onMoodSelect }) => {
  return (
    <div className="w-full  px-4 mt-8">
      <h2 className="text-xl font-bold text-white mb-4">
        Select Mood Manually
      </h2>
      <div className="flex gap-4 overflow-x-auto  px-2  py-4 hide-scrollbar">
        {mood.map((mood, index) => (
          <motion.div
            key={mood.id}
            onClick={() => onMoodSelect(mood.name)}
            initial={{ opacity: 0, x: 2 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="min-w-[120px] h-[140px] relative rounded-2xl cursor-pointer overflow-hidden group bg-white/5 border border-white/10">
            {/* Hover Gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${mood.color} opacity-0 group-hover:opacity-30 transition-opacity duration-500`}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <span className="text-4xl">{mood.emoji}</span>
              <span className="text-white font-medium capitalize">
                {mood.label}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MoodSelection;
