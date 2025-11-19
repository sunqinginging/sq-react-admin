import { create } from 'zustand';
import { generate } from '@ant-design/colors';
import { persist, createJSONStorage } from 'zustand/middleware';
interface ThemeState {
	mode: 'light' | 'dark';
	primary: string;
	setMode: (mode: 'light' | 'dark') => void;
	setPrimary: (color: string) => void;
}

export const useThemeStore = create(
	persist<ThemeState>(
		(set, get) => ({
			mode: 'light',
			primary: '#1677ff',
			setMode: (mode) => {
				const root = document.documentElement;
				const isDark = mode === 'dark';
				root.classList.toggle('dark', isDark);
				set({ mode });
			},
			setPrimary: (color) => {
				const mode = get().mode;
				const isDark = mode === 'dark';
				const colors = generate(color, { theme: 'default' });
				const root = document.documentElement;
				if (isDark) {
					// 暗黑模式比明亮模式低一个色阶
					root.style.setProperty('--color-primary', colors[4]);
					root.style.setProperty('--color-primary-hover', colors[3]);
					root.style.setProperty('--color-primary-active', colors[5]);
					// 8 位 Hex 颜色格式结构 第七第八位表示透明度 66表示40%不透明
					root.style.setProperty('--color-primary-disabled', `${colors[5]}66`);
				} else {
					root.style.setProperty('--color-primary', colors[5]);
					root.style.setProperty('--color-primary-hover', colors[4]);
					root.style.setProperty('--color-primary-active', colors[6]);
					// 8 位 Hex 颜色格式结构 第七第八位表示透明度 80表示50%不透明
					root.style.setProperty('--color-primary-disabled', `${colors[5]}80`);
				}
				set({ primary: color });
			},
		}),
		{
			name: 'app-settings',
			storage: createJSONStorage(() => localStorage),
		}
	)
);
