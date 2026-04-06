/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["'Share Tech Mono'", "monospace"],
        display: ["'VT323'", "monospace"],
      },
      colors: {
        terminal: "#0a0f0a",
        phosphor: "#39ff14",
        "phosphor-dim": "#1a7a08",
        "phosphor-glow": "#7fff5f",
        danger: "#ff4444",
        amber: "#ffb700",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1" },
          "92%": { opacity: "0.96" },
          "94%": { opacity: "0.85" },
          "96%": { opacity: "0.98" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      animation: {
        flicker: "flicker 4s infinite",
        blink: "blink 1s step-end infinite",
      },
    },
  },
  plugins: [],
};