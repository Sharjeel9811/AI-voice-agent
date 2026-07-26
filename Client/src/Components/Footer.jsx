import React, { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { MdOutlineMail, MdOutlineArrowForward, MdCheck, MdErrorOutline } from "react-icons/md";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import axios from "axios";

const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // "success" | "error" | null
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setStatus(null);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/newsletter/subscribe`,
        { email }
      );
      setStatus("success");
      setMessage(data.message);
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const product = [
    { label: "Builder", path: "/builder" },
    { label: "Pricing", path: "/billing" },
    { label: "Features", path: "/" },
  ];

  const company = [
    { label: "About", path: "/" },
    { label: "Blog", path: "/" },
    { label: "Careers", path: "/" },
  ];

  const legal = [
    { label: "Privacy Policy", path: "/" },
    { label: "Terms of Service", path: "/" },
  ];

  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: "#08080F", borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      {/* Top gradient line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px"
        style={{ background: "linear-gradient(90deg, transparent, #7C5CFC40, #00D4FF40, transparent)" }}
      />

      <div className="max-w-6xl mx-auto px-6 pt-16 pb-8">
        {/* Top section */}
        <div className="flex flex-col lg:flex-row gap-12 mb-14">
          {/* Brand */}
          <div className="lg:max-w-xs">
            <div className="flex items-center gap-2.5 mb-4 cursor-pointer" onClick={() => navigate("/")}>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #7C5CFC, #00D4FF)" }}
              >
                <img src="/logo.svg" alt="Logo" className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold" style={{ color: "#fff" }}>
                VoiceAgent
              </span>
            </div>
            <p className="text-xs leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.35)" }}>
              Build intelligent AI voice agents that handle calls, answer questions,
              and represent your brand — all powered by AI.
            </p>

            {/* Newsletter */}
            <div className="flex items-center gap-2 mb-2">
              <div
                className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg text-[11px]"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${status === "error" ? "rgba(248,113,113,0.3)" : "rgba(255,255,255,0.06)"}`,
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                <MdOutlineMail size={13} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setStatus(null); }}
                  onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                  placeholder="Enter email"
                  className="bg-transparent outline-none flex-1 text-[11px] placeholder:text-[rgba(255,255,255,0.25)]"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubscribe}
                disabled={loading || !email.trim()}
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-opacity disabled:opacity-40"
                style={{
                  background: "linear-gradient(135deg, #7C5CFC, #5B8DEF)",
                  color: "#fff",
                }}
              >
                {loading ? (
                  <motion.span
                    className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white inline-block"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <MdOutlineArrowForward size={14} />
                )}
              </motion.button>
            </div>
            {/* Status message */}
            {status && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 text-[10px]"
                style={{ color: status === "success" ? "#34D399" : "#F87171" }}
              >
                {status === "success" ? <MdCheck size={11} /> : <MdErrorOutline size={11} />}
                {message}
              </motion.div>
            )}
          </div>

          {/* Links */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-wider mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
                Product
              </h4>
              <ul className="space-y-2.5">
                {product.map((item, i) => (
                  <li key={i}>
                    <button
                      onClick={() => navigate(item.path)}
                      className="text-xs transition-colors hover:text-white"
                      style={{ color: "rgba(255,255,255,0.35)" }}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-wider mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
                Company
              </h4>
              <ul className="space-y-2.5">
                {company.map((item, i) => (
                  <li key={i}>
                    <button
                      onClick={() => navigate(item.path)}
                      className="text-xs transition-colors hover:text-white"
                      style={{ color: "rgba(255,255,255,0.35)" }}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-wider mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
                Legal
              </h4>
              <ul className="space-y-2.5">
                {legal.map((item, i) => (
                  <li key={i}>
                    <button
                      onClick={() => navigate(item.path)}
                      className="text-xs transition-colors hover:text-white"
                      style={{ color: "rgba(255,255,255,0.35)" }}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          className="w-full h-px mb-6"
          style={{ background: "rgba(255,255,255,0.05)" }}
        />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>
            &copy; {new Date().getFullYear()} VoiceAgent. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {[FaGithub, FaTwitter, FaLinkedin].map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ scale: 1.15, color: "#7C5CFC" }}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  color: "rgba(255,255,255,0.3)",
                }}
              >
                <Icon size={12} />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
