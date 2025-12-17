import { createBrowserRouter, Navigate } from 'react-router-dom';
import { flattenRoutes } from './utils';
import BasicLayout from '@/layout';
import Login from '@/views/Login';
import NotFound from '@/views/NotFound';

export function createDynamicRouter(menus: any[]) {
	// 多级菜单树形结构拍平
	const flatRoutes = flattenRoutes(menus);

	return createBrowserRouter([
		{
			path: '/',
			element: <BasicLayout></BasicLayout>,
			children: [
				{
					index: true, // 默认子路由
					element: <Navigate to="/dashboard" replace />,
				},
				...flatRoutes,
			],
		},
		{
			path: '/login',
			element: <Login></Login>,
		},
		{
			path: '/404',
			element: <NotFound></NotFound>,
		},
		{
			path: '*',
			element: <NotFound></NotFound>,
		},
	]);
}

export const staticRoutes = [
	{
		path: '/login',
		element: <Login></Login>,
	},
];
