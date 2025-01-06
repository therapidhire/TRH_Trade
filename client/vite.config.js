import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import dotenv from "dotenv";

// dotenv.config();

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Replace 3001 with the port number you want
  },
});
