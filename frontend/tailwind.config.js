module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        'neon-green': '#00ff00',
        'neon-purple': '#ff00ff',
        'dark-bg': '#0a0a0a'
      },
      fontFamily: {
        'mono': ['Courier New', 'monospace']
      }
    }
  },
  plugins: []
}
