import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import svgr from "vite-plugin-svgr"

export default defineConfig(() => {
  return {
    build: {
      outDir: "build",
    },
    plugins: [
      react(),
      svgr(),
      nodePolyfills()
    ],
    resolve: {
      alias: {
        src: "/src",
      },
    },
  }
})