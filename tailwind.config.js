import { nextui } from '@nextui-org/react';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

    },
  },
  plugins: [nextui(
    {
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#0866fb",
            },
            focus: "#0866fb",
          },
        },
      },
    }
  )],
}

