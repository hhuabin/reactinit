import { defineConfig } from 'vite'
import type { ConfigEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig((env: ConfigEnv) => ({
    base: './',
    plugins: [react()],
    resolve: {
        alias: { '@': new URL('./src', import.meta.url).pathname },
    },
    server: {
        port: 3000,
        open: true,
        headers: {
            'cache-control': 'no-cache, no-store, must-revalidate',
        },
    },
    build: {
        outDir: 'dist',
        sourcemap: env.mode === 'production' ? false : true,
        rollupOptions: {
            output: {
                entryFileNames: 'js/[name]-[hash].js',
                chunkFileNames: (chunkInfo) => {
                    if (chunkInfo.name === 'react-vendor') {
                        return 'js/[name].js'
                    }
                    return 'js/[name]-[hash].js'
                },
                assetFileNames: (chunkInfo) => {
                    const imgExts = ['.jpg', '.png', '.jpeg', '.webp', '.svg', '.gif', '.ico']
                    if (chunkInfo.name?.endsWith('.css')) {
                        return 'css/[name]-[hash].css'
                    } else if (imgExts.some(ext => chunkInfo.name?.endsWith(ext))) {
                        return 'images/[name]-[hash][extname]'
                    }
                    return 'assets/[name]-[hash][extname]'
                },
                manualChunks: {
                    'react-vendor': [
                        'react',
                        'react-dom',
                        'react-router-dom',
                        'react-redux',
                        '@reduxjs/toolkit',
                    ],
                },
            },
            plugins: [
                visualizer({ open: false, filename: 'stats.html' }),
            ],
        },
    },
    esbuild: {
        drop: ['debugger'],
        pure: env.mode === 'production' ? ['console.log'] : [],
    },
}))
