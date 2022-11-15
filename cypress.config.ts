import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'https://react-happy-form.onrender.com/',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
