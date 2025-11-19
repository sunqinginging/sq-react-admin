import type { IMenuItem } from '@/router/utils';
import http from '@/utils/request';

export const login = (data: any) => {
	return http.post('/user/login', data);
};
export const getMenuList = () => {
	return http.get<IMenuItem[]>('/user/menus');
};
