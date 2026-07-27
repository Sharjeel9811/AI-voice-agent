import React from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { MdMic, MdAutoAwesome, MdSpeed, MdSecurity } from "react-icons/md";
import theme from "../Configs/theme";

const features = [
  {
    icon: <MdAutoAwesome size={20} />,
    title: "AI-Powered",
    desc: "Smart voice agent trained on your business",
  },
  {
    icon: <MdSpeed size={20} />,
    title: "Instant Setup",
    desc: "Get started in minutes, no coding needed",
  },
  {
    icon: <MdSecurity size={20} />,
    title: "Secure & Private",
    desc: "Enterprise-grade security for your data",
  },
];

const Hero = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden pt-16"
      style={{ background: `linear-gradient(180deg, ${theme.bg.primary} 0%, ${theme.bg.secondary} 100%)` }}
    >
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[500px] h-[500px] rounded-full -top-40 left-1/2 -translate-x-1/2 opacity-15"
          style={{ background: `radial-gradient(circle, ${theme.accent.primary}, transparent 70%)` }}
        />
        <div
          className="absolute w-[300px] h-[300px] rounded-full bottom-10 -left-20 opacity-10"
          style={{ background: `radial-gradient(circle, ${theme.accent.secondary}, transparent 70%)` }}
        />
        <div
          className="absolute w-[200px] h-[200px] rounded-full top-1/3 -right-10 opacity-10"
          style={{ background: `radial-gradient(circle, ${theme.accent.primary}, transparent 70%)` }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(${theme.text.muted} 1px, transparent 1px), linear-gradient(90deg, ${theme.text.muted} 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center mt-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-medium mb-8"
          style={{
            background: "rgba(124,92,252,0.1)",
            border: `1px solid rgba(124,92,252,0.2)`,
            color: theme.accent.primary,
          }}
        >
          <MdMic size={12} />
          AI Voice Agent for Your Business
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5"
          style={{ color: theme.text.primary }}
        >
          Build Your Own{" "}
          <span style={{ background: theme.accent.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            AI Voice Agent
          </span>
          <br />
          in Minutes
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm sm:text-base max-w-xl mx-auto mb-10 leading-relaxed"
          style={{ color: theme.text.secondary }}
        >
          Create a intelligent voice assistant that handles calls, answers questions,
          and represents your brand — all powered by AI.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: `0 0 30px ${theme.button.primary.glow}` }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(user ? "/builder" : "/login")}
            className="px-7 py-3 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: theme.button.primary.background,
              color: theme.button.primary.text,
              boxShadow: `0 4px 24px rgba(124,92,252,0.3)`,
            }}
          >
            Build Your Assistant
          </motion.button>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4, borderColor: "rgba(124,92,252,0.3)" }}
              className="flex flex-col items-center gap-3 p-5 rounded-xl transition-all"
              style={{
                background: theme.bg.card,
                border: `1px solid ${theme.border.light}`,
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(124,92,252,0.1)", color: theme.accent.primary }}
              >
                {f.icon}
              </div>
              <p className="text-sm font-semibold" style={{ color: theme.text.primary }}>{f.title}</p>
              <p className="text-xs leading-relaxed" style={{ color: theme.text.secondary }}>{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
