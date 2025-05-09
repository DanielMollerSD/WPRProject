import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    css: {
        preprocessorOptions: {
            scss: {
                api: "modern-compiler",
                additionalData: `@use "/src/styles/variables.scss" as *;`,
            },
        },
    },
    optimizeDeps: {
        include: ['jwt-decode'], // Ensure that jwt-decode is included for optimization
    },
})
