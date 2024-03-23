/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      borderRadius: {
        'border-top-right-radius' : "border-top-right-radius: 999px"
      },
      colors: {
        primary: "#050816",
        secondary: "#aaa6c3",
        tertiary: "#151030",
        panel: "#E8F9F9",
        "black-100": "#100d25",
        "black-200": "#090325",
        "black-500": "#000000",
        "orange-500": "#C88625",
        "white-100": "#f3f3f3",
      },
      scale: {
        '-100': '-1',
      },
      boxShadow: {
        card: "0px 35px 120px -15px #211e35",
        button: "inset 0 5px 9px 0 rgb(0 0 0 / 0.3)",
        particleRed: "0 0 0 2px #9f1a1a, 0 0 0 3px #bb0000",
        particleBlue: "0 0 0 2px #1f13d4, 0 0 0 3px #90baff"
      },
      screens: {
        xs: "450px",
      },
      backgroundImage: {
        "hero-pattern": "url('/src/assets/herobg.png')",
      },
      fontFamily: {
        'pop': ['Orbitron', 'sans-serif'],
        'desc': ['Abel', 'sans-serif']
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
        wobble: 'wobble 3s ease-in-out infinite',
        loop: 'loop 5s linear infinite',
        elevate: 'elevate 3s ease-in-out infinite',
        particleFillSlow: 'particleFill 6s linear infinite',
        particleFillNormal: 'particleFill 4.5s linear infinite',
        particleFillFast: 'particleFillInvert 3s linear infinite',
        progressReset: 'progressReset 1s linear forwards',
        skillAvailable: 'skillAvailable 0.2s linear forwards',
        upgradeUp: 'upgradeUp 0.5s linear infinite',
        infiniteText: 'infiniteText 13.2s linear infinite' 
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-6deg)' },
          '50%': { transform: 'rotate(6deg)' },
        },
        loop: {
          '0%': { background: 'linear-gradient(#ff0,#000,#000)' },
          '50%': { background: 'linear-gradient(#000,#ff0d,#000)' },
          '100%': { background: 'linear-gradient(#000,#000,#ff0)' },
        },
        wobble: {
          '0%, 50%, 100%': { transform: 'translateX(-6px)' },
          '25%, 75%': { transform: 'translateX(-3px)' },
        },
        elevate: {
          '0%, 50%, 100%': { transform: 'translateY(10px)' },
          '25%, 75%': { transform: 'translateY(-10px)' },
        },
        particleFill: {
          '0%': { transform: 'translateX(-4px) scale(0.1)' },
          '15%': { transform: 'translateX(3px) scale(1)' },
          '100%': { transform: 'translateX(12rem) scale(0.3) rotate(360deg)' },
        },
        particleFillInvert: {
          '0%': { transform: 'translateX(-4px) scale(0.1)' },
          '15%': { transform: 'translateX(3px) scale(1.3)' },
          '100%': { transform: 'translateX(12rem) scale(0.3) rotate(-360deg)' },
        },
        progressReset: {
          '0%': { width: '75%' },
          '50%': { width: '100%' },
          '100%': { width: '10%' }
        },
        skillAvailable: {
          '100%': { transform: 'rotate(45deg) scaleX(1.2) scaleY(1.5)' },
        },
        upgradeUp: {
          '100%': { transform: 'translateX(-8px) translateY(-8px)' },
        },
        infiniteText: {
          '0%': { transform: 'translateX(-43.1%)' },
          '100%': { transform: 'translateX(0%) ' },
        }
      }
    },
  },
  plugins: [],
};
