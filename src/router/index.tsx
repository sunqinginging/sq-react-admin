import { createBrowserRouter, Navigate } from 'react-router-dom';
import type { RouteObjectWithMeta } from '@/types/router';
import { lazy, Suspense } from 'react';
// import PrivateRoute from './PrivateRoute';
import Layout from '@/layout/index';

const User = lazy(() => import('@/views/User'));
const Login = lazy(() => import('@/views/Login'));
const Welcome = lazy(() => import('@/views/Welcome'));

const routes: RouteObjectWithMeta[] = [
	{
		path: '/',
		element: <Navigate to="/welcome"></Navigate>,
	},
	{
		path: '/login',
		element: (
			<Suspense fallback={<div>Loading...</div>}>
				<Login></Login>
			</Suspense>
		),
		handle: {
			title: '登录',
			keepAlive: true,
		},
	},
	{
		element: <Layout />,
		children: [
			{
				path: '/user',
				element: (
					<Suspense fallback={<div>Loading....</div>}>
						<User></User>
					</Suspense>
				),
			},
			{
				path: '/welcome',
				element: (
					<Suspense fallback={<div>Loading...</div>}>
						<Welcome />
					</Suspense>
				),
			},
		],
	},
];

const router = createBrowserRouter(routes);

export default router;
