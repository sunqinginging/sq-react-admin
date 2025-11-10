import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import UnoCSS from 'unocss/vite';
import path from 'path';
// https://vite.dev/config/
export default defineConfig({
	plugins: [UnoCSS(), react()],
	server: {
		port: 8888,
		open: true,
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
});
