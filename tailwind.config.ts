import type { Config } from 'tailwindcss'

const config: Config = {
  daisyui:{
    themes:[
      {
        myTheme: {
          "primary": "#F6DE58",
          "secondary": "#cc9955",
          "accent": "#4f46e5",
          "neutral": "#6b7280",
          "base-100": "#25282A",
          "info": "#3b82f6",
          "success": "#4ade80",
          "warning": "#eb810f",
          "error": "#f75058",
        }
      }
    ]
  },
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        "accent-background" : "#474B4F"
      }
    },
  },
  plugins: [require("daisyui")],
}
export default config
