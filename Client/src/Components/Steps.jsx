import React from "react";
import { motion } from "motion/react";
import { MdPersonAdd, MdTune, MdSchool, MdCode } from "react-icons/md";

const steps = [
  {
    num: "01",
    title: "Sign Up for Free",
    desc: "Continue with Google and create your assistant instantly. No credit card required.",
    icon: <MdPersonAdd size={20} />,
    color: "#7C5CFC",
  },
  {
    num: "02",
    title: "Customize Assistant",
    desc: "Set the name, tone, and personality of your AI voice agent to match your brand.",
    icon: <MdTune size={20} />,
    color: "#00D4FF",
  },
  {
    num: "03",
    title: "Train Your Agent",
    desc: "Add your business info, FAQs, and scripts so your agent speaks exactly like you.",
    icon: <MdSchool size={20} />,
    color: "#FF2D95",
  },
  {
    num: "04",
    title: "Embed Anywhere",
    desc: "Get a snippet to embed on your website, app, or connect via API in seconds.",
    icon: <MdCode size={20} />,
    color: "#34D399",
  },
];

const Steps = () => {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "#0B0B14" }}
    >
      <div className="relative max-w-6xl mx-auto px-6 py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-4"
              style={{ color: "#7C5CFC" }}
            >
              How It Works
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold leading-tight"
              style={{ color: "#fff" }}
            >
              Up and Running{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #7C5CFC, #00D4FF)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                in 4 Steps
              </span>
            </h2>
          </motion.div>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -6, borderColor: `${step.color}30` }}
              className="relative p-5 rounded-xl transition-all"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {/* Step number */}
              <span
                className="text-[40px] font-bold absolute top-4 right-4 leading-none"
                style={{ color: `${step.color}12` }}
              >
                {step.num}
              </span>

              {/* Icon */}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                style={{ background: `${step.color}12`, color: step.color }}
              >
                {step.icon}
              </div>

              {/* Content */}
              <h3 className="text-sm font-semibold mb-1.5" style={{ color: "#fff" }}>
                {step.title}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Steps;
