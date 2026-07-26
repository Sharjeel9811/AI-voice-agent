import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FcGoogle } from "react-icons/fc";
import {
  signInWithPopup,
} from "firebase/auth";
import { auth, provider } from "../Configs/GoogleAuth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import theme from "../Configs/theme";

const Login = ({ setuser }) => {
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const registerWithBackend = async (name, email) => {
    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/user/register`,
      { name, email },
      { withCredentials: true }
    );
    return data;
  };

  // ── Google ───────────────────────────────────────────────
  const handleGoogle = async () => {
    setError("");
    setLoadingGoogle(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const data = await registerWithBackend(
        result.user.displayName,
        result.user.email
      );
      console.log("Google auth success:", data);
      setuser(data.user);
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Google sign-in failed.");
    } finally {
      setLoadingGoogle(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${theme.bg.primary} 0%, ${theme.bg.secondary} 100%)` }}
    >
      {/* Static bg blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-72 h-72 rounded-full -top-16 -left-16 opacity-20"
          style={{ background: `radial-gradient(circle, ${theme.accent.primary}, transparent 70%)` }}
        />
        <div
          className="absolute w-64 h-64 rounded-full -bottom-12 -right-12 opacity-15"
          style={{ background: `radial-gradient(circle, ${theme.accent.secondary}, transparent 70%)` }}
        />
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative w-full max-w-[320px] mx-4 rounded-2xl px-6 py-7"
        style={{
          background: theme.bg.card,
          border: `1px solid ${theme.border.light}`,
          backdropFilter: "blur(16px)",
        }}
      >
        {/* Top shimmer line */}
        <div
          className="absolute top-0 left-10 right-10 h-px rounded-full"
          style={{ background: `linear-gradient(90deg, transparent, ${theme.accent.primary}, ${theme.accent.secondary}, transparent)` }}
        />

        {/* Logo */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 20 }}
          className="flex justify-center mb-5"
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: theme.accent.gradient }}
          >
            <img src="/logo.svg" alt="Logo" className="w-9 h-9" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="text-center mb-6"
        >
          <h1 className="text-xl font-bold text-white tracking-tight">
            Welcome to VoiceAgent
          </h1>
          <p className="text-xs mt-1" style={{ color: theme.text.secondary }}>
            Sign in to continue to your AI assistant
          </p>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="text-[11px] rounded-lg px-3 py-2 mb-4 text-center"
              style={{ color: theme.error.text, background: theme.error.bg, border: `1px solid ${theme.error.border}` }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          {/* Google */}
          <motion.button
            onClick={handleGoogle}
            disabled={loadingGoogle}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.03, boxShadow: `0 0 24px ${theme.button.primary.glow}` }}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: theme.button.primary.background,
              color: theme.button.primary.text,
              boxShadow: `0 4px 20px rgba(124,92,252,0.25)`,
            }}
          >
            {loadingGoogle ? (
              <>
                <motion.span
                  className="w-4 h-4 rounded-full border-2 border-white/25 border-t-white inline-block"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                />
                <span className="text-xs">Signing in…</span>
              </>
            ) : (
              <>
                <FcGoogle size={18} />
                Continue with Google
              </>
            )}
          </motion.button>
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-[11px] mt-5 leading-relaxed"
          style={{ color: theme.text.muted }}
        >
          By continuing you agree to our{" "}
          <span style={{ color: `${theme.accent.primary}B3` }}>Terms of Service</span> and{" "}
          <span style={{ color: `${theme.accent.primary}B3` }}>Privacy Policy</span>
        </motion.p>

        {/* Bottom shimmer line */}
        <div
          className="absolute bottom-0 left-10 right-10 h-px rounded-full"
          style={{ background: `linear-gradient(90deg, transparent, ${theme.accent.secondary}, ${theme.accent.primary}, transparent)` }}
        />
      </motion.div>
    </div>
  );
};

export default Login;
