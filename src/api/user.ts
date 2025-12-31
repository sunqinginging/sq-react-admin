import type { PageResult } from '@/types/api';
import http from '@/utils/request';

export const getUserList = <T = any>(data: any) => {
	return http.post<PageResult<T>>('/user/list', data);
};
