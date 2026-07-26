import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MdCheck, MdMic, MdMicOff, MdVolumeUp } from "react-icons/md";
import theme from "../Configs/theme";
import axios from "axios";

const themes = [
  {
    key: "dark",
    label: "Dark",
    bg: "#0B0B14",
    surface: "#16162A",
    accent: "#7C5CFC",
    text: "#FFFFFF",
    textSecondary: "rgba(255,255,255,0.5)",
    border: "rgba(255,255,255,0.08)",
  },
  {
    key: "light",
    label: "Light",
    bg: "#F8F9FC",
    surface: "#FFFFFF",
    accent: "#6C5CE7",
    text: "#1A1A2E",
    textSecondary: "rgba(26,26,46,0.5)",
    border: "rgba(0,0,0,0.08)",
  },
  {
    key: "glass",
    label: "Glass",
    bg: "linear-gradient(135deg, #0F0C29, #302B63, #24243E)",
    surface: "rgba(255,255,255,0.08)",
    accent: "#00D4FF",
    text: "#FFFFFF",
    textSecondary: "rgba(255,255,255,0.45)",
    border: "rgba(255,255,255,0.12)",
    glass: true,
  },
  {
    key: "neon",
    label: "Neon",
    bg: "#0A0A0F",
    surface: "#111118",
    accent: "#FF2D95",
    text: "#FFFFFF",
    textSecondary: "rgba(255,255,255,0.4)",
    border: "rgba(255,45,149,0.2)",
    glow: true,
  },
];

const voiceStates = [
  { label: "Listening", icon: <MdMic size={20} />, desc: "Hearing your voice..." },
  { label: "Speaking", icon: <MdVolumeUp size={20} />, desc: "Responding to you..." },
  { label: "Processing", icon: <MdMicOff size={20} />, desc: "Thinking..." },
];

const AgentPreview = ({ user, setuser }) => {
  const [activeTheme, setActiveTheme] = useState(user?.theme || "dark");
  const [switching, setSwitching] = useState(false);
  const [voiceIdx, setVoiceIdx] = useState(0);

  const t = themes.find((th) => th.key === activeTheme) || themes[0];
  const isGradient = t.bg.startsWith("linear");

  useEffect(() => {
    const interval = setInterval(() => {
      setVoiceIdx((prev) => (prev + 1) % voiceStates.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleThemeChange = async (key) => {
    if (key === activeTheme) return;
    setSwitching(true);
    try {
      const { data } = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/update`,
        { theme: key },
        { withCredentials: true }
      );
      setuser(data.user);
      setActiveTheme(key);
    } catch (err) {
      console.error("Theme update failed", err);
    } finally {
      setSwitching(false);
    }
  };

  const current = voiceStates[voiceIdx];

  return (
    <div className="relative">
      {/* Theme Switcher */}
      <div
        className="flex items-center gap-1.5 p-1.5 rounded-xl w-full sm:w-fit overflow-x-auto mb-4"
        style={{
          background: theme.bg.card,
          border: `1px solid ${theme.border.light}`,
        }}
      >
        {themes.map((th) => (
          <motion.button
            key={th.key}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleThemeChange(th.key)}
            disabled={switching}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all"
            style={{
              color: activeTheme === th.key ? theme.text.primary : theme.text.muted,
              background: activeTheme === th.key ? "rgba(124,92,252,0.15)" : "transparent",
            }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{
                background: th.accent,
                boxShadow: th.glow ? `0 0 6px ${th.accent}` : "none",
              }}
            />
            {th.label}
            {activeTheme === th.key && (
              <MdCheck size={10} style={{ color: theme.accent.primary }} />
            )}
          </motion.button>
        ))}
      </div>

      {/* Agent Preview Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTheme}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-sm rounded-2xl overflow-hidden"
          style={{
            background: isGradient ? t.bg : t.bg,
            border: `1px solid ${t.border}`,
            boxShadow: t.glow
              ? `0 0 40px ${t.accent}20, 0 8px 32px rgba(0,0,0,0.4)`
              : "0 8px 32px rgba(0,0,0,0.3)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-5 py-4"
            style={{
              background: t.glass ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.03)",
              borderBottom: `1px solid ${t.border}`,
              backdropFilter: t.glass ? "blur(12px)" : "none",
            }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{
                background: t.accent,
                color: "#fff",
                boxShadow: t.glow ? `0 0 12px ${t.accent}60` : "none",
              }}
            >
              {user?.assistantName?.charAt(0)?.toUpperCase() || "S"}
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: t.text }}>
                {user?.assistantName || "Shifra"}
              </p>
              <p className="text-[10px]" style={{ color: t.textSecondary }}>
                {user?.businessName || "Your AI Assistant"}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  background: "#34D399",
                  animation: "pulse 2s infinite",
                }}
              />
              <span className="text-[10px]" style={{ color: t.textSecondary }}>
                Active
              </span>
            </div>
          </div>

          {/* Voice Interaction Area */}
          <div className="px-4 sm:px-5 py-8 sm:py-10 flex flex-col items-center justify-center" style={{ minHeight: "260px" }}>
            {/* Animated voice rings */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 mb-5 sm:mb-6">
              {/* Outer ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  border: `2px solid ${t.accent}`,
                  opacity: 0.15,
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.15, 0, 0.15],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              {/* Middle ring */}
              <motion.div
                className="absolute inset-2 rounded-full"
                style={{
                  border: `2px solid ${t.accent}`,
                  opacity: 0.25,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.25, 0, 0.25],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.3,
                }}
              />
              {/* Center orb */}
              <motion.div
                className="absolute inset-5 rounded-full flex items-center justify-center"
                style={{
                  background: t.accent,
                  boxShadow: t.glow
                    ? `0 0 30px ${t.accent}60, 0 0 60px ${t.accent}20`
                    : `0 0 20px ${t.accent}30`,
                }}
                animate={{ scale: [1, 1.08, 1] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <MdMic size={28} color="#fff" />
              </motion.div>
            </div>

            {/* Voice state label */}
            <AnimatePresence mode="wait">
              <motion.div
                key={voiceIdx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="text-center"
              >
                <p className="text-sm font-semibold mb-1" style={{ color: t.text }}>
                  {current.label}
                </p>
                <p className="text-[11px]" style={{ color: t.textSecondary }}>
                  {current.desc}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Sound wave bars */}
            <div className="flex items-center gap-[3px] mt-5">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="rounded-full"
                  style={{
                    width: 3,
                    background: t.accent,
                  }}
                  animate={{
                    height: voiceIdx === 0
                      ? [8, 20 + Math.random() * 16, 8]
                      : voiceIdx === 1
                      ? [6, 14 + Math.random() * 10, 6]
                      : [4, 8, 4],
                    opacity: voiceIdx === 2 ? 0.3 : [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 0.8 + Math.random() * 0.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.06,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="px-5 py-3 flex items-center justify-between"
            style={{
              borderTop: `1px solid ${t.border}`,
              background: t.glass ? "rgba(255,255,255,0.03)" : "transparent",
            }}
          >
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: "#34D399" }}
              />
              <span className="text-[11px] font-medium" style={{ color: t.textSecondary }}>
                Connected
              </span>
            </div>
            <span className="text-[10px]" style={{ color: t.textSecondary }}>
              Voice Agent
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AgentPreview;
