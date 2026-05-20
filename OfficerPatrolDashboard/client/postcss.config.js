const path = require('path');

// Explicitly reference the tailwind config that lives next to this file.
// Required because vite is invoked from the workspace root via `vite client/`,
// which means tailwind's default config-discovery (starts from CWD) misses it.
module.exports = {
  plugins: {
    tailwindcss: { config: path.join(__dirname, 'tailwind.config.js') },
    autoprefixer: {},
  },
};
