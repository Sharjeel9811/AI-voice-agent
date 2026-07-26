import React from "react";
import { motion } from "motion/react";

const Loading = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #0d0d1a 0%, #1a0533 100%)" }}
    >
      <div className="flex flex-col items-center gap-5">
        <div className="relative w-16 h-16">
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              border: "3px solid transparent",
              borderTopColor: "#6C63FF",
              borderRightColor: "#00D4FF",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-2 rounded-full"
            style={{
              border: "3px solid transparent",
              borderBottomColor: "#00D4FF",
              borderLeftColor: "#6C63FF",
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-0 m-auto w-3 h-3 rounded-full"
            style={{ background: "linear-gradient(135deg, #6C63FF, #00D4FF)" }}
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <motion.p
          className="text-xs text-white/40 tracking-widest uppercase"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          Loading
        </motion.p>
      </div>
    </div>
  );
};

export default Loading;
