import { useQuery } from '@tanstack/react-query';
import { getUserList } from '@/api/user';
import type { PageResult } from '@/types/api';

export interface PaginationParams {
	pageNum: number;
	pageSize: number;
}
type WithoutPagination<T> = Omit<T, 'pageNum' | 'pageSize'>;
export type PageRequest<T = void> = PaginationParams &
	(T extends object ? WithoutPagination<T> : {});
export const useUserList = <T = any, P = any>(params: PageRequest<P>) => {
	const query = useQuery<PageResult<T>>({
		queryKey: ['userList', params.pageNum, params.pageSize],
		queryFn: () => getUserList(params),
	});
	console.log(query);
	return {
		tableData: query.data?.list ?? [],
		total: query.data?.total ?? 0,
		loading: query.isLoading || query.isFetching,
		raw: query,
	};
};
