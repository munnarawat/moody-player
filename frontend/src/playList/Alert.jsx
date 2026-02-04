import { AnimatePresence, motion } from "framer-motion";
import React from "react";

const Alert = ({onConfirm, onCancel}) => {
  return (
    <AnimatePresence>
      {/* background blur */}
      <div className=" fixed inset-0 z-50 p-4 flex items-center justify-center ">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className=" fixed  bg-black/80 inset-0 backdrop-blur-sm"
        />
        {/* main Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="px-4 py-8 mx-auto  text-white relative w-full md:max-w-md bg-[#12121283] border border-white/10 overflow-hidden rounded-2xl shadow-2xl shadow-purple-600/20 ">
          <h1 className="text-sm font-medium text-center">
            {" "}
            Are you sure you want to Delete your Playlist..
          </h1>
          <div className="flex  mt-4 justify-center items-center gap-4 ">
            <button onClick={onCancel} className="px-6 py-2.5 rounded-xl border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all cursor-pointer font-medium">
              Cancel
            </button>
            <button onClick={onConfirm} className="px-6 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 transition-all cursor-pointer font-medium active:scale-95">
              Yes, Delete
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Alert;
