import { defineConfig, type ConfigEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { visualizer } from 'rollup-plugin-visualizer'

import { version } from './package.json'

// https://vitejs.dev/config/
export default defineConfig((env: ConfigEnv) => ({
    base: './',
    plugins: [
        react(),
        {
            // 添加版本号等信息，用于网站检测更新
            name: 'inject-version',
            transformIndexHtml(html) {
                html = html.replace(/__VERSION__/g, version)
                    .replace(/__BUILD_TIME__/g, String(Date.now()))
                return html
            },
        },
    ],
    resolve: {
        alias: { '@': new URL('./src', import.meta.url).pathname },
    },
    server: {
        // 开发环境配置
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
                // 入口 JS（被 HTML 直接引用的模块）输出规则
                entryFileNames: 'js/[name]-[hash].js',
                chunkFileNames: (chunkInfo) => {
                    // 非入口 JS chunk（懒加载、manualChunks 拆分的 JS）输出规则
                    if (chunkInfo.name === 'react-vendor') {
                        return 'js/[name].js'
                    }
                    return 'js/[name]-[hash].js'
                },
                assetFileNames: (chunkInfo) => {
                    // 非 JS 资源（CSS、图片、字体、worker 等）输出规则
                    const imgExts = ['.jpg', '.png', '.jpeg', '.webp', '.svg', '.gif', '.ico']
                    if (chunkInfo.name?.endsWith('.css')) {
                        return 'css/[name]-[hash].css'
                    } else if (imgExts.some(ext => chunkInfo.name?.endsWith(ext))) {
                        return 'images/[name]-[hash][extname]'
                    }
                    return 'assets/[name]-[hash][extname]'
                },
                manualChunks: (id) => {
                    // 手动分包：手动控制 JS chunk 的拆分规则
                    const reactPkgs = [
                        '/react/', '/react-dom/',
                        '/react-router/', '/react-router-dom/',
                        '/react-redux/', '/@reduxjs/toolkit/', '/scheduler/', '/use-sync-external-store/',
                    ]
                    if (reactPkgs.some(pkg => id.includes(pkg))) {
                        // 将 React 及其相关生态依赖归并到 react-vendor chunk
                        return 'react-vendor'
                    }

                    // 一般不推荐，可能导致 chunk 过碎
                    /*  else if (id.includes('node_modules')) {
                        // console.log('node_modules', id)
                    } else if (id.includes('/src/components/')) {
                        const componentName = id.split('/src/components/')[1].split('/')[0]
                        return componentName
                    } else if (id.includes('/src/hooks/')) {
                        return 'hooks'
                    } else if (id.includes('/src/utils/')) {
                        return 'utils'
                    } */
                },
            },
            plugins: [
                visualizer({ open: false, filename: 'stats.html' }),
            ],
        },
    },
    esbuild: {
        drop: ['debugger'],             // 删除debugger
        pure: env.mode === 'production' ? ['console.log'] : [],        // 精细删除 console.log
        legalComments: 'inline',        // 默认值，只保留法律注释
    },
}))
