import { MockMethod } from 'vite-plugin-mock';
import Mock from 'mockjs';

/**
 * 模拟数据库（内存）
 */
let userList = Mock.mock({
	'list|58': [
		{
			id: '@id',
			name: '@cname',
			age: '@integer(18, 45)',
			email: '@email',
			role: '@pick(["admin", "editor", "viewer"])',
			createTime: '@datetime',
		},
	],
}).list;

export default [
	/**
	 * 分页查询用户列表
	 * GET /api/user/list?page=1&pageSize=10
	 */
	{
		url: '/api/user/list',
		method: 'post',
		response: (req: { body: any }) => {
			const { body } = req;
			const page = Number(body.pageNum || 1);
			const pageSize = Number(body.pageSize || 10);

			const start = (page - 1) * pageSize;
			const end = start + pageSize;

			return {
				code: 200,
				message: 'success',
				data: {
					list: userList.slice(start, end),
					total: userList.length,
					page,
					pageSize,
				},
			};
		},
	},

	/**
	 * 新增用户
	 * POST /api/user/add
	 */
	{
		url: '/api/user/add',
		method: 'post',
		response: ({ body }) => {
			const newUser = {
				id: Mock.mock('@id'),
				createTime: Mock.mock('@datetime'),
				...body,
			};

			userList.unshift(newUser);

			return {
				code: 0,
				message: '新增成功',
				data: newUser,
			};
		},
	},

	/**
	 * 删除用户
	 * POST /api/user/delete
	 */
	{
		url: '/api/user/delete',
		method: 'post',
		response: ({ body }) => {
			const { id } = body;

			userList = userList.filter((item) => item.id !== id);

			return {
				code: 0,
				message: '删除成功',
			};
		},
	},
] as MockMethod[];
