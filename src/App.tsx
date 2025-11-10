import { ConfigProvider, Button, theme } from 'antd';
import { App as AntdApp } from 'antd';
import { useTheme } from '@/hooks/useTheme';
import { RouterProvider } from 'react-router-dom';
import router from '@/router/index';
import AntdGlobal from './utils/AntdGlobal';
import { useThemeStore } from './store/theme';
import { ThemeSwitcher } from './components/ThemeSwitcher';
function App() {
	const { mode, primary } = useThemeStore();

	return (
		<>
			<ConfigProvider
				theme={{
					algorithm:
						mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
					token: {
						colorPrimary: primary,
						colorBgBase: mode === 'dark' ? '#141414' : '#ffffff',
						colorTextBase: mode === 'dark' ? '#f0f0f0' : '#1f1f1f',
					},
				}}
			>
				<AntdApp component={false}>
					<AntdGlobal></AntdGlobal>
					<RouterProvider router={router}></RouterProvider>
					<ThemeSwitcher />
					{/* <div className="text-[var(--color-primary)]" justify="center">
					当前模式: {isDark ? '暗黑' : '明亮'}
				</div>
				<Button type="primary" onClick={toggleTheme}>
					切换暗黑模式
				</Button>
				<Button>我是按钮</Button> */}
				</AntdApp>
			</ConfigProvider>
		</>
	);
}

export default App;
