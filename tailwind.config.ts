import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "accent-primary": "var(--accent-primary)",
        "accent-primary-strong": "var(--accent-primary-strong)",
        primary: "var(--primary)",
        "primary-disabled": "var(--primary-disabled)",
        "primary-strong": "var(--primary-strong)",
        secondary: "var(--secondary)",
        "secondary-soft": "var(--secondary-soft)",
        error: "var(--error)",
        "error-accent": "var(--error-accent)",
        warning: "var(--warning)",
        success: "var(--success)",
        "success-accent": "var(--success-accent)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      gridTemplateColumns: {
        adaptable: "repeat( auto-fit, minmax(15rem, 1fr))",
        "adaptable-big": "repeat( auto-fit, minmax(24rem, 1fr))",
        "adaptable-big-mobile": "repeat( auto-fit, minmax(15rem, 43rem))",
      },
      transitionProperty: {
        height: "height",
      },
    },
  },
  plugins: [],
}
export default config
