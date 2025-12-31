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
		url: '/api/test/selectOptions',
		method: 'get',
		timeout: 1200,
		response: () => {
			return {
				code: 200,
				message: '获取成功',
				data: [
					{
						value: 'a',
						label: '选项a',
					},
					{
						value: 'b',
						label: '选项b',
					},
				],
			};
		},
	},
	{
		url: '/api/user/menus',
		method: 'get',
		response: (req: any) => {
			const auth = req.headers?.authorization;
			const token = auth?.replace(/^Bearer\s+/i, '');
			if (!token) {
				return {
					code: 401,
					message: '请先登录',
				};
			}

			return {
				code: 200,
				data: [
					{
						path: '/dashboard',
						name: '仪表盘',
						type: 'page',
						component: 'Dashboard',
						meta: { icon: 'DashboardOutlined', keepAlive: true },
						buttons: [
							{
								code: 'add',
								name: '新增',
							},
							{
								code: 'export',
								name: '导出',
							},
						],
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
								meta: { keepAlive: true, title: '角色管理' },
								buttons: [
									{
										code: 'add',
										name: '新增',
									},
									{
										code: 'export',
										name: '导出',
									},
								],
							},
							{
								path: '/system/role',
								name: '角色管理',
								type: 'page',
								component: 'System/Role',
								meta: { keepAlive: true, title: '角色管理' },
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
