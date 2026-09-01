import { defineConfig } from 'vite'

export default defineConfig({
    test: {
        globals: true,
        include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}', "**/*.steps.js"],
        globalSetup: ['./vitest.global-setup.js'],
        setupFiles: [
            './setupTests.js',
        ],
    },
})