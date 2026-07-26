const theme = {
  // Backgrounds
  bg: {
    primary: "#0B0B14",
    secondary: "#12121F",
    card: "rgba(255,255,255,0.03)",
  },

  // Accent colors
  accent: {
    primary: "#7C5CFC",    // Vivid purple
    secondary: "#00D4FF",  // Bright cyan
    gradient: "linear-gradient(135deg, #7C5CFC, #00D4FF)",
  },

  // Text
  text: {
    primary: "#FFFFFF",
    secondary: "rgba(255,255,255,0.55)",
    muted: "rgba(255,255,255,0.25)",
  },

  // Borders
  border: {
    light: "rgba(255,255,255,0.08)",
    focus: "rgba(124,92,252,0.5)",
  },

  // Buttons
  button: {
    primary: {
      background: "linear-gradient(135deg, #7C5CFC, #5B8DEF)",
      hover: "linear-gradient(135deg, #6A4AE8, #4A7CDF)",
      glow: "rgba(124,92,252,0.4)",
      text: "#FFFFFF",
    },
    secondary: {
      background: "rgba(255,255,255,0.05)",
      hover: "rgba(255,255,255,0.1)",
      border: "rgba(255,255,255,0.1)",
      text: "rgba(255,255,255,0.85)",
    },
  },

  // Status
  error: {
    text: "#F87171",
    bg: "rgba(248,113,113,0.08)",
    border: "rgba(248,113,113,0.2)",
  },

  success: {
    text: "#34D399",
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.2)",
  },
};

export default theme;
