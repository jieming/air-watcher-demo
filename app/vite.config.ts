import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    envDir: resolve(__dirname, '..'),
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/test-setup.ts'],
        server: {
            deps: {
                inline: ['@mui/x-data-grid'],
            },
        },
    },
})
