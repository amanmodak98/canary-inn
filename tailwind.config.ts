import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", lg: "2rem" },
      screens: { "2xl": "1440px" },
    },
    extend: {
      colors: {
        ivory: "#FAF7F2",
        cream: "#F2EBE0",
        sand: "#E8DCC7",
        beige: "#D4C5A9",
        clay: "#A0826D",
        mocha: "#6B4F3A",
        espresso: "#3D2817",
        coal: "#1C1611",
        ember: "#C2724A",
        ash: "#8A7E6E",
        gold: "#B08A52",
        leaf: "#5C7A4F",
      },
      fontFamily: {
        serif: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        accent: ["var(--font-accent)", "cursive"],
      },
      fontSize: {
        "display-xl": ["clamp(3.5rem, 9vw, 8rem)", { lineHeight: "0.95", letterSpacing: "-0.04em" }],
        "display-lg": ["clamp(2.75rem, 6.5vw, 5.5rem)", { lineHeight: "1", letterSpacing: "-0.03em" }],
        "display-md": ["clamp(2rem, 4vw, 3.25rem)", { lineHeight: "1.05", letterSpacing: "-0.025em" }],
        "display-sm": ["clamp(1.5rem, 2.5vw, 2.25rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        eyebrow: ["0.72rem", { lineHeight: "1", letterSpacing: "0.22em" }],
      },
      letterSpacing: {
        tightest: "-0.045em",
        wider: "0.18em",
        widest: "0.28em",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
        luxury: "cubic-bezier(0.65, 0, 0.35, 1)",
      },
      transitionDuration: { 600: "600ms", 800: "800ms", 1000: "1000ms" },
      keyframes: {
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        floatSlow: "floatSlow 6s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      backgroundImage: {
        "paper-grain":
          "radial-gradient(circle at 25% 25%, rgba(193, 114, 74, 0.04), transparent 50%), radial-gradient(circle at 75% 75%, rgba(176, 138, 82, 0.04), transparent 50%)",
      },
    },
  },
  plugins: [],
};
export default config;