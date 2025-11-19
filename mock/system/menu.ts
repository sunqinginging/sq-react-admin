import { MockMethod } from 'vite-plugin-mock';
import Mock from 'mockjs';

export default [
	{
		url: '/api/user/login',
		method: 'post',
		timeout: 1000,
		response: (req: { body: any }) => {
			const { body } = req;
			const { username, password } = body;
			if (username === 'admin' && password === '123456') {
				return { code: 200, message: 'Login success', token: 'fake-token' };
			} else {
				return { code: 400, message: 'Invalid credentials' };
			}
		},
	},
	{
		url: '/api/user/menus',
		method: 'get',
		response: () => {
			return {
				code: 200,
				data: [
					{
						path: '/dashboard',
						name: '仪表盘',
						type: 'page',
						component: 'Dashboard',
						meta: { icon: 'DashboardOutlined', keepAlive: true },
					},
					{
						path: '/system',
						name: '系统管理',
						type: 'page',
						children: [
							{
								path: '/system/user',
								name: '用户管理',
								type: 'page',
								component: 'System/User',
								meta: { keepAlive: true },
							},
							{
								path: '/system/role',
								name: '角色管理',
								type: 'page',
								component: 'System/Role',
								meta: { keepAlive: true },
								// children: [
								// 	{
								// 		path: '/system/role/detail/:id',
								// 		name: '角色详情',
								// 		type: 'page',
								// 		component: 'System/Role/Detail',
								// 	},
								// ],
							},
						],
					},
				],
			};
		},
	},
] as MockMethod[];
