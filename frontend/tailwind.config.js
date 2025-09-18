module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#f04299'
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'Inter', 'system-ui']
      }
    }
  },
  plugins: []
}
