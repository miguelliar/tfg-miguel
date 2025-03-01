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
        "special-color": "var(--special-color)",
        "highlight-color": "var(--highlight-color)",
        "background-color": "var(--background-color)",
        "highlight-background-color": "var(--highlight-background-color)",
        "low-color": "var(--low-color)",
        "disabled-color": "var(--disabled-color)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      gridTemplateColumns: {
        adaptable: "repeat( auto-fit, minmax(15rem, 1fr))",
      },
    },
  },
  plugins: [],
}
export default config
