import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import {
  MdCheck,
  MdStar,
  MdMic,
  MdBusiness,
  MdOutlineArrowForward,
  MdClose,
} from "react-icons/md";
import Navbar from "../Components/Navbar";
import theme from "../Configs/theme";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const plans = [
  {
    name: "Free",
    planKey: "free",
    price: "0",
    period: "forever",
    description: "Perfect for trying out VoiceAgent",
    priceId: null,
    features: [
      { text: "1 AI voice agent", included: true },
      { text: "100 minutes / month", included: true },
      { text: "Basic themes", included: true },
      { text: "Email support", included: true },
      { text: "Custom voice training", included: false },
      { text: "Priority support", included: false },
      { text: "API access", included: false },
    ],
    cta: "Get Started",
    icon: <MdMic size={20} />,
    popular: false,
  },
  {
    name: "Pro",
    planKey: "premium",
    price: "29",
    period: "/month",
    description: "For growing businesses that need more",
    priceId: "price_1TxRTZRl0idLvq4ibrGf7Jxx",
    features: [
      { text: "5 AI voice agents", included: true },
      { text: "2,000 minutes / month", included: true },
      { text: "All themes (Dark, Light, Glass, Neon)", included: true },
      { text: "Priority email support", included: true },
      { text: "Custom voice training", included: true },
      { text: "Analytics dashboard", included: true },
      { text: "API access", included: false },
    ],
    cta: "Upgrade to Pro",
    icon: <MdStar size={20} />,
    popular: true,
  },
  {
    name: "Enterprise",
    planKey: "enterprise",
    price: "99",
    period: "/month",
    description: "For teams that need full power",
    priceId: "price_1TxRTuRl0idLvq4iSregsnBw",
    features: [
      { text: "Unlimited AI voice agents", included: true },
      { text: "Unlimited minutes", included: true },
      { text: "All themes + custom branding", included: true },
      { text: "24/7 dedicated support", included: true },
      { text: "Advanced voice training", included: true },
      { text: "Full analytics + exports", included: true },
      { text: "Full API access", included: true },
    ],
    cta: "Go Enterprise",
    icon: <MdBusiness size={20} />,
    popular: false,
  },
];

const Billing = ({ user, setuser }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [usage, setUsage] = useState(null);

  useEffect(() => {
    if (!user) return;
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/usage`, { withCredentials: true })
      .then(({ data }) => setUsage(data))
      .catch(() => {});
  }, [user]);

  const handleCheckout = async (plan) => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user?.plan === plan.planKey) return;

    // Downgrade to Free
    if (plan.name.toLowerCase() === 'free') {
      setLoading('Free');
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/billing/cancel`,
          {},
          { withCredentials: true }
        );
        setuser(data.user);
        toast.success('Downgraded to Free plan');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to downgrade');
      } finally {
        setLoading(null);
      }
      return;
    }

    setError(null);
    setLoading(plan.name);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/billing/checkout`,
        { priceId: plan.priceId },
        { withCredentials: true }
      );
      window.location.href = data.url;
    } catch (err) {
      console.error("Checkout failed", err);
      setError(
        err.response?.status === 401
          ? "Please log in first to upgrade your plan."
          : err.response?.data?.message || "Something went wrong. Please try again."
      );
      setLoading(null);
    }
  };

  return (
    <div style={{ background: theme.bg.primary, minHeight: "100vh" }}>
      <Navbar user={user} setuser={setuser} />
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <div className="max-w-6xl mx-auto px-6 py-16 pt-24">
        {/* Error Toast */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-xl text-sm"
              style={{
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.25)",
                color: theme.error.text,
                backdropFilter: "blur(12px)",
              }}
            >
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-2 opacity-60 hover:opacity-100"
              >
                <MdClose size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-4"
              style={{ color: theme.accent.primary }}
            >
              Pricing
            </p>
            <h1
              className="text-3xl sm:text-4xl font-bold mb-4 leading-tight"
              style={{ color: theme.text.primary }}
            >
              Simple, Transparent{" "}
              <span
                style={{
                  background: theme.accent.gradient,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Pricing
              </span>
            </h1>
            <p
              className="text-sm max-w-md mx-auto leading-relaxed"
              style={{ color: theme.text.secondary }}
            >
              Start for free, upgrade when you're ready. No hidden fees.
            </p>
          </motion.div>
        </div>

        {/* Usage Meter */}
        {usage && user?.plan !== 'enterprise' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto mb-10 p-5 rounded-xl"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: `1px solid ${theme.border.light}`,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold" style={{ color: theme.text.primary }}>
                  Monthly Usage
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: theme.text.secondary }}>
                  {Math.round(usage.minutesUsed)} / {usage.limit === Infinity ? '∞' : usage.limit} minutes used
                </p>
              </div>
              {usage.percentage >= 80 && (
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: `0 0 20px ${theme.button.primary.glow}` }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => document.getElementById('pro-plan')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-4 py-2 rounded-lg text-[11px] font-semibold"
                  style={{
                    background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                    color: '#fff',
                  }}
                >
                  Upgrade to Pro
                </motion.button>
              )}
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: Math.min(usage.percentage, 100) + '%' }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{
                  background: usage.percentage >= 80
                    ? 'linear-gradient(90deg, #F59E0B, #EF4444)'
                    : usage.percentage >= 50
                    ? 'linear-gradient(90deg, #7C5CFC, #F59E0B)'
                    : 'linear-gradient(90deg, #7C5CFC, #00D4FF)',
                }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[10px]" style={{ color: theme.text.muted }}>0%</span>
              <span className="text-[10px]" style={{ color: theme.text.muted }}>50%</span>
              <span className="text-[10px]" style={{ color: theme.text.muted }}>100%</span>
            </div>
          </motion.div>
        )}

        {/* Plans */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => {
            const isCurrent = user?.plan === plan.planKey;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="relative flex flex-col rounded-2xl p-6 transition-all"
                id={plan.planKey === 'premium' ? 'pro-plan' : undefined}
                style={{
                  background: plan.popular
                    ? "rgba(124,92,252,0.06)"
                    : theme.bg.card,
                  border: plan.popular
                    ? `1px solid rgba(124,92,252,0.25)`
                    : `1px solid ${theme.border.light}`,
                }}
              >
                {plan.popular && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-semibold"
                    style={{
                      background: theme.accent.gradient,
                      color: "#fff",
                    }}
                  >
                    Most Popular
                  </div>
                )}

                <div className="mb-5">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                    style={{
                      background: plan.popular
                        ? "rgba(124,92,252,0.15)"
                        : "rgba(255,255,255,0.04)",
                      color: plan.popular
                        ? theme.accent.primary
                        : theme.text.secondary,
                    }}
                  >
                    {plan.icon}
                  </div>
                  <h3
                    className="text-lg font-bold mb-1"
                    style={{ color: theme.text.primary }}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className="text-xs"
                    style={{ color: theme.text.secondary }}
                  >
                    {plan.description}
                  </p>
                </div>

                <div className="flex items-baseline gap-1 mb-6">
                  <span
                    className="text-3xl font-bold"
                    style={{ color: theme.text.primary }}
                  >
                    ${plan.price}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: theme.text.muted }}
                  >
                    {plan.period}
                  </span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2.5">
                      <MdCheck
                        size={14}
                        className="mt-0.5 shrink-0"
                        style={{
                          color: f.included
                            ? theme.accent.primary
                            : theme.text.muted,
                        }}
                      />
                      <span
                        className="text-xs"
                        style={{
                          color: f.included
                            ? theme.text.secondary
                            : theme.text.muted,
                          textDecoration: f.included ? "none" : "line-through",
                          opacity: f.included ? 1 : 0.5,
                        }}
                      >
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={
                    !isCurrent
                      ? {
                          scale: 1.02,
                          boxShadow: `0 0 24px ${theme.button.primary.glow}`,
                        }
                      : {}
                  }
                  whileTap={!isCurrent ? { scale: 0.98 } : {}}
                  onClick={() => handleCheckout(plan)}
                  disabled={loading !== null || isCurrent}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold transition-all disabled:cursor-not-allowed"
                  style={{
                    background: plan.popular
                      ? theme.button.primary.background
                      : isCurrent
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(255,255,255,0.06)",
                    color: plan.popular
                      ? theme.button.primary.text
                      : isCurrent
                      ? theme.text.muted
                      : theme.text.secondary,
                    border:
                      !plan.popular && !isCurrent
                        ? `1px solid ${theme.border.light}`
                        : "none",
                    opacity: isCurrent ? 0.6 : 1,
                    boxShadow: plan.popular
                      ? `0 4px 20px rgba(124,92,252,0.25)`
                      : "none",
                  }}
                >
                  {loading === plan.name ? (
                    <motion.span
                      className="w-4 h-4 rounded-full border-2 border-white/25 border-t-white inline-block"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 0.7,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  ) : plan.name === 'Free' && user?.plan !== 'free' ? (
                    <span className="flex items-center justify-center gap-1.5">
                      Downgrade to Free
                      <MdOutlineArrowForward size={12} />
                    </span>
                  ) : isCurrent ? (
                    "Current Plan"
                  ) : (
                    <span className="flex items-center justify-center gap-1.5">
                      {plan.cta}
                      <MdOutlineArrowForward size={12} />
                    </span>
                  )}
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-2xl mx-auto text-center">
          <h2
            className="text-xl font-bold mb-8"
            style={{ color: theme.text.primary }}
          >
            Frequently Asked Questions
          </h2>
          <div className="space-y-4 text-left">
            {[
              {
                q: "Can I change plans later?",
                a: "Yes, you can upgrade or downgrade at any time. Changes take effect immediately.",
              },
              {
                q: "What happens when I exceed my minutes?",
                a: "Your agent will still work but at reduced quality. Upgrade for more minutes.",
              },
              {
                q: "Is there a free trial for paid plans?",
                a: "Yes, every paid plan comes with a 14-day free trial. No credit card required to start.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="p-4 rounded-xl"
                style={{
                  background: theme.bg.card,
                  border: `1px solid ${theme.border.light}`,
                }}
              >
                <p
                  className="text-sm font-semibold mb-1"
                  style={{ color: theme.text.primary }}
                >
                  {item.q}
                </p>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: theme.text.secondary }}
                >
                  {item.a}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
