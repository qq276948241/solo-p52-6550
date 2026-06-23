/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      screens: {
        DEFAULT: "100%",
        sm: "480px",
      },
    },
    extend: {
      colors: {
        primary: "#FF8C42",
        "primary-dark": "#E67329",
        "primary-light": "#FFA870",
        background: "#FFF8F0",
        surface: "#FFFFFF",
        muted: "#F5EDE0",
        text: "#2D2A26",
        "text-light": "#8A8580",
      },
      boxShadow: {
        card: "0 4px 20px rgba(255, 140, 66, 0.1)",
        "card-hover": "0 8px 30px rgba(255, 140, 66, 0.18)",
      },
      borderRadius: {
        card: "16px",
        button: "12px",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          '"Segoe UI"',
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
