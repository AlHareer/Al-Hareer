/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FCFAF7",
          100: "#FAF6F0", // Root background
          200: "#F3ECE1", // Card background
          300: "#E2D7C7", // Border color
          400: "#D3C4AF",
        },
        brand: {
          50: "#F8F5F2",
          100: "#EFE8E0",
          200: "#DFCFC0",
          300: "#C6B09B",
          400: "#8B6B52",
          500: "#4A3525", // Accent brown
          600: "#36261A", // Accent hover
          700: "#2B231D", // Text primary
          800: "#1F1813",
          900: "#130E0B",
        },
        muted: {
          DEFAULT: "#655B53", // Text secondary
          light: "#8C8178",
          dark: "#4B423B",
        },
        gold: {
          light: "#F5E6BE",
          DEFAULT: "#D4AF37", // Gold accent
          dark: "#AA820A",
          metallic: "linear-gradient(135deg, #D4AF37 0%, #EDC967 50%, #B8860B 100%)",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Cormorant Garamond", "serif"],
        body: ["var(--font-body)", "Montserrat", "sans-serif"],
        script: ["var(--font-script)", "Caveat", "cursive"],
      },
      boxShadow: {
        luxury: "0 10px 30px -10px rgba(74, 53, 37, 0.08)",
        "luxury-lg": "0 20px 40px -15px rgba(74, 53, 37, 0.12)",
        "luxury-hover": "0 25px 50px -12px rgba(74, 53, 37, 0.18)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
