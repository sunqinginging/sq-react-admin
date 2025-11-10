import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'virtual:uno.css';
import 'uno.css';
import './index.css';
import App from './App.tsx';
import { useThemeStore } from './store/theme.ts';

const { primary, setPrimary } = useThemeStore.getState();

// 同步初始化主题 生成主题色对应的css变量
setPrimary(primary);

createRoot(document.getElementById('root')!).render(
	// <StrictMode>
	// 	<App></App>
	// </StrictMode>
	<App></App>
);
