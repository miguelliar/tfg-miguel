import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "font-color": "var(--font-color)",
        "font-color-accent": "var(--font-colot-accent)",
        "font-color-disabled": "var(--font-color-disabled)",
        "special-color": "var(--special-color)",
        "highlight-color": "var(--highlight-color)",
        "background-color": "var(--background-color)",
        "highlight-background-color": "var(--highlight-background-color)",
        "error-color": "var(--error-color)",
        "error-color-accent": "var(--error-color-accent)",
        "warning-color": "var(--warning-color)",
        "success-color": "var(--success-color)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      gridTemplateColumns: {
        adaptable: "repeat( auto-fit, minmax(15rem, 1fr))",
        adaptable_big: "repeat( auto-fit, minmax(24rem, 1fr))",
      },
    },
  },
  plugins: [],
}
export default config
