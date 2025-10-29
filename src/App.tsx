import './App.css';
import { ConfigProvider, Button } from 'antd';
import { useTheme } from './hooks/useTheme';

function App() {
	const { algorithm, toggleTheme, isDark } = useTheme();

	const root = document.documentElement;
	const cs = getComputedStyle(root);
	const primary =
		(cs.getPropertyValue('--color-primary') || '').trim() || '#1677ff';
	const bg =
		(cs.getPropertyValue('--color-background') || '').trim() ||
		(isDark ? '#141414' : '#ffffff');
	const text =
		(cs.getPropertyValue('--color-text') || '').trim() ||
		(isDark ? '#f5f5f5' : '#111827');

	return (
		<>
			<ConfigProvider
				theme={{
					algorithm,
					token: {
						colorPrimary: primary,
						colorBgBase: bg,
						colorTextBase: text,
					},
				}}
			>
				<div className="text-[var(--color-primary)]" justify="center">
					当前模式: {isDark ? '暗黑' : '明亮'}
				</div>
				<Button type="primary" onClick={toggleTheme}>
					切换暗黑模式
				</Button>
				<Button>我是按钮</Button>
			</ConfigProvider>
		</>
	);
}

export default App;
