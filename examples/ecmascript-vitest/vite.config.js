import { defineConfig } from 'vite'

export default defineConfig({
    test: {
        globals: true,
        include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}', "**/*.steps.js"],
        setupFiles: [
            './setupTests.js',
        ],
        watch: true,
    },
})