import { useEffect, useState } from 'react';
import { theme as antdTheme } from 'antd';
export const useTheme = () => {
	const [isDark, setIsDark] = useState(false);
	useEffect(() => {
		const media = window.matchMedia('(prefers-color-scheme: dark)');
		setIsDark(media.matches);
		document.documentElement.classList.toggle('dark', media.matches);
		// 监听系统改变
		media.addEventListener('change', (e) => {
			document.documentElement.classList.toggle('dark', e.matches);
			setIsDark(e.matches);
		});
	}, []);

	const toggleTheme = () => {
		setIsDark(!isDark);
		document.documentElement.classList.toggle('dark');
	};

	const setPrimaryColorVar = (hex) => {
		if (isDark) {
			document.documentElement.style.setProperty('--color-primary-dark', hex);
		} else {
			document.documentElement.style.setProperty('--color-primary-light', hex);
		}
		document.documentElement.style.setProperty('--color-primary', hex);
	};

	// antd提供预设算法 定义ConfigProvider组件里面的theme属性对象的algorithm属性
	// 默认算法 theme.defaultAlgorithm
	// 暗色算法 theme.darkAlgorithm
	const algorithm = isDark
		? antdTheme.darkAlgorithm
		: antdTheme.defaultAlgorithm;

	return {
		algorithm,
		toggleTheme,
		isDark,
		setPrimaryColorVar,
	};
};
