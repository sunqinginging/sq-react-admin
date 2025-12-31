import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'virtual:uno.css';
import 'uno.css';
import './index.css';
import App from './App.tsx';
import { useThemeStore } from './store/theme.ts';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/utils/queryClient.ts';

dayjs.locale('zh-cn');
const { primary, setPrimary, mode, setMode } = useThemeStore.getState();

// 同步初始化主题 生成主题色对应的css变量
setPrimary(primary);
setMode(mode);

createRoot(document.getElementById('root')!).render(
	// <StrictMode>
	// 	<App></App>
	// </StrictMode>
	<QueryClientProvider client={queryClient}>
		<App></App>
	</QueryClientProvider>
);
