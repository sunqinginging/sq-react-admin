import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import UnoCSS from 'unocss/vite';
import path from 'path';
import { viteMockServe } from 'vite-plugin-mock';

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
	plugins: [
		UnoCSS(),
		react(),
		viteMockServe({
			mockPath: 'mock',
			enable: command === 'serve', // 开发环境启用
			watchFiles: true, // 修改 mock 文件自动刷新
			logger: true, // 打印 mock 日志
		}),
	],
	server: {
		port: 8888,
		open: true,
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
}));
