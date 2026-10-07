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
        // Site palette: only these 5 colors (plus white) are used on the website.
        // cream = page bg, brand = teal, gold = accents/buttons, muted = secondary text.
        cream: {
          50: "#F6F1EC",
          100: "#F6F1EC", // Root background
          200: "#F6F1EC", // Card background
          300: "#CFAC64", // Border color
          400: "#CFAC64",
        },
        brand: {
          50: "#F6F1EC",
          100: "#F6F1EC",
          200: "#CFAC64",
          300: "#024F5F",
          400: "#024F5F",
          500: "#024F5F", // Deep teal
          600: "#00303A", // Hover
          700: "#00303A", // Footer dark
          800: "#00303A",
          900: "#00303A",
        },
        muted: {
          DEFAULT: "#024F5F", // Secondary text
          light: "#024F5F",
          dark: "#00303A",
        },
        gold: {
          light: "#F6F1EC",
          DEFAULT: "#CFAC64", // Gold buttons
          dark: "#B08F4F", // Hover
        },
      },
      backgroundImage: {
        "gold-metallic": "linear-gradient(135deg, #CFAC64 0%, #B08F4F 100%)",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Georgia", "serif"],
        body: ["var(--font-body)", "Montserrat", "sans-serif"],
        script: ["var(--font-script)", "Montserrat", "sans-serif"],
      },
      boxShadow: {
        luxury: "0 10px 30px -10px rgba(2, 79, 95, 0.10)",
        "luxury-lg": "0 20px 40px -15px rgba(2, 79, 95, 0.14)",
        "luxury-hover": "0 25px 50px -12px rgba(2, 79, 95, 0.20)",
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
        marqueeContinuous: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2.5s ease-in-out infinite",
        "marquee-infinite": "marqueeContinuous 30s linear infinite",
      },
    },
  },
  plugins: [],
};
