import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
	base: './',
	plugins: [react()],
	resolve: {
		alias: {
			'@': new URL('./src', import.meta.url).pathname,
		}
	},
	server: {
		port: 3000,
	},
	build: {
		rollupOptions: {
			output: {
				entryFileNames: 'js/[name].js',
				chunkFileNames: 'js/[name]-[hash].js',
				assetFileNames(chunkInfo) {
					const imgExts = ['.jpg', '.png', '.jpeg', '.webp', '.svg', '.gif', '.ico']
					if (chunkInfo.name?.endsWith('.css')) {
						return 'css/[name]-[hash].css'
					} else if (imgExts.some(ext => chunkInfo.name?.endsWith(ext))) {
						return 'images/[name]-[hash][extname]'
					}
					return 'assets/[name]-[hash][extname]'
				},
			}
		},
	},
})
