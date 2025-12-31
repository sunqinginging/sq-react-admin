import { ConfigProvider, Button, theme, Spin } from 'antd';
import { App as AntdApp } from 'antd';
import { useEffect, useState } from 'react';

import AntdGlobal from './utils/AntdGlobal';
import { useThemeStore } from './store/theme';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { useAuthStore } from './store/auth';
import { createDynamicRouter } from './router';
import {
	createBrowserRouter,
	RouterProvider,
	Navigate,
} from 'react-router-dom';
import { AliveScope } from 'react-activation';
import { PageLoading } from './utils/loading/loading';
import { staticRoutes } from '@/router/index';

function App() {
	const { mode, primary } = useThemeStore();
	const { menus, getMenus, setRouter, router, token } = useAuthStore();

	const currentPath = window.location.pathname;
	// 应用首次加载时 请求菜单数据
	useEffect(() => {
		(async () => {
			if (!token) {
				const resultRouters = createBrowserRouter([
					...staticRoutes,
					{
						path: '/',
						element: <Navigate to="/login" replace></Navigate>,
					},
					{
						path: '*',
						element: (
							<Navigate
								to={`/login?redirect=${encodeURIComponent(currentPath)}`}
								replace
							></Navigate>
						),
					},
				]);
				setRouter(resultRouters);
			} else {
				await getMenus();
			}
		})();
	}, []);

	// 监听menus的变化
	useEffect(() => {
		console.log('你执行了几次啊');
		if (menus.length > 0) {
			const resultRouters = createDynamicRouter(menus);
			setRouter(resultRouters);
		}
	}, [menus]);

	if (!router) {
		return <PageLoading></PageLoading>;
	}
	const root = document.documentElement;
	// 获取 包含所有层级（内联、CSS、继承）后的真实值
	// const colorPrimary =
	// 	getComputedStyle(root).getPropertyValue('--color-primary');
	const colorHover = getComputedStyle(root).getPropertyValue(
		'--color-primary-hover'
	);
	const colorActive = getComputedStyle(root).getPropertyValue(
		'--color-primary-active'
	);

	return (
		<>
			<ConfigProvider
				theme={{
					algorithm:
						mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
					token: {
						colorPrimary: primary,
						colorBgBase: mode === 'dark' ? '#141414' : '#FAFAFA',
						colorTextBase: mode === 'dark' ? '#f0f0f0' : '#1f1f1f',
					},
					components: {
						Menu: {
							itemHoverBg: colorHover,
							itemSelectedBg: colorActive,
							itemSelectedColor: '#FAFAFA',
							itemBg: mode === 'dark' ? '#141414' : '#FAFAFA',
							itemColor: mode === 'dark' ? '#f0f0f0' : '#1f1f1f',
						},
						Layout: {
							// #001529
							siderBg: mode === 'dark' ? '#141414' : '#FAFAFA',
							headerBg: mode === 'dark' ? '#141414' : '#FAFAFA',
							// 主体部分背景色
							bodyBg: mode === 'dark' ? '#1F1F1F' : '#F5F5F5',
						},
					},
				}}
			>
				<AntdApp component={false}>
					<AntdGlobal></AntdGlobal>
					<AliveScope>
						{router ? (
							<RouterProvider router={router}></RouterProvider>
						) : (
							<div>loading</div>
						)}
					</AliveScope>

					{/* <ThemeSwitcher /> */}
				</AntdApp>
			</ConfigProvider>
		</>
	);
}

export default App;
