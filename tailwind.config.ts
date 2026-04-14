import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 배경
        bg: {
          base: "#F5F4F0",
          surface: "#FFFFFF",
          hover: "#F9F8F5",
          muted: "#F0EFEC",
        },
        // 텍스트
        text: {
          primary: "#1C1C1C",
          secondary: "#5C5C5C",
          muted: "#9CA3AF",
          placeholder: "#BCBAB6",
        },
        // 테두리
        border: {
          DEFAULT: "#EDECE9",
          strong: "#E0DFDb",
        },
        // 어센트 - 코랄/살몬
        accent: {
          DEFAULT: "#E07B65",
          hover: "#CF6A55",
          light: "#FDF0ED",
          muted: "#F5C5BA",
        },
        // 호환용 glass 색상 유지
        glass: {
          bg: "#FFFFFF",
          border: "#EDECE9",
          hover: "#F9F8F5",
          strong: "#FFFFFF",
        },
        surface: {
          1: "#F9F8F5",
          2: "#F5F4F0",
          3: "#EDECE9",
        },
        muted: "#9CA3AF",
        subtle: "#EDECE9",
      },
      fontFamily: {
        sans: [
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "system-ui",
          "sans-serif",
        ],
        mono: ["ui-monospace", "'Fira Code'", "monospace"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "20px",
        "4xl": "24px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.04)",
        "card-md": "0 2px 8px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)",
        "card-lg": "0 4px 16px rgba(0,0,0,0.09), 0 2px 6px rgba(0,0,0,0.06)",
        "accent": "0 4px 14px rgba(224, 123, 101, 0.3)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.35s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.25s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-6px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
