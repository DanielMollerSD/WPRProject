import { defineConfig } from "cypress";

export default defineConfig({
  projectId: 'eaurz2',

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },

  e2e: {
    baseUrl: 'http://localhost:5173', // Zorg voor een consistente base URL
    setupNodeEvents(on, config) {
      // Je kunt hier plugins en events configureren
    },
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}", // Welke bestanden als tests worden herkend
  },
});
