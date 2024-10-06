import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        paper: "-10px 16px 0px 4px #D66B5C;",
      },
      colors: {
        primary: "#E77F6C",
        surface: "#F7DECD",
        surfaceLight: "#F7F0EA",
        white: "#FFFFFF",
        text: "#000000",
      },
      fontSize: {
        "body-large": [
          "16px",
          {
            fontWeight: "normal",
            lineHeight: "1.5",
            letterSpacing: "0.5px",
          },
        ],
        "body-medium": [
          "14px",
          {
            fontWeight: "normal",
            lineHeight: "1.42",
            letterSpacing: "0.25px",
          },
        ],
        "body-small": [
          "12px",
          {
            fontWeight: "normal",
            lineHeight: "1.32",
            letterSpacing: "0.4px",
          },
        ],
        "display-large": [
          "56px",
          {
            fontWeight: "normal",
            lineHeight: "1.14",
            letterSpacing: "-0.25px",
          },
        ],
        "display-medium": [
          "42px",
          {
            fontWeight: "normal",
            lineHeight: "1.14",
            letterSpacing: "-0.2px",
          },
        ],
        "display-small": [
          "36px",
          {
            fontWeight: "normal",
            lineHeight: "1.11",
            letterSpacing: "normal",
          },
        ],
        "headline-large": [
          "32px",
          {
            fontWeight: "normal",
            lineHeight: "1.25",
            letterSpacing: "normal",
          },
        ],
        "headline-medium": [
          "28px",
          {
            fontWeight: "normal",
            lineHeight: "1.28",
            letterSpacing: "normal",
          },
        ],
        "headline-small": [
          "24px",
          {
            fontWeight: "normal",
            lineHeight: "1.33",
            letterSpacing: "normal",
          },
        ],
        "label-large": [
          "16px",
          {
            fontWeight: "500",
            lineHeight: "1.42",
            letterSpacing: "0.1px",
          },
        ],
        "label-medium": [
          "14px",
          {
            fontWeight: "500",
            lineHeight: "1.32",
            letterSpacing: "0.5px",
          },
        ],
        "label-small": [
          "12px",
          {
            fontWeight: "500",
            lineHeight: "1.42",
            letterSpacing: "0.5px",
          },
        ],
        "title-large": [
          "22px",
          {
            fontWeight: "500",
            lineHeight: "1.26",
            letterSpacing: "normal",
          },
        ],
        "title-medium": [
          "16px",
          {
            fontWeight: "500",
            lineHeight: "1.5",
            letterSpacing: "0.1px",
          },
        ],
        "title-small": [
          "14px",
          {
            fontWeight: "500",
            lineHeight: "1.42",
            letterSpacing: "0.1px",
          },
        ],
      },
    },
  },
  plugins: [],
};
export default config;
