import { useMutation, useQuery } from '@tanstack/react-query';
import { getUserList, addUser } from '@/api/user';
import type { PageResult } from '@/types/api';
import { queryClient } from '@/utils/queryClient';

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
		queryFn: () => getUserList<T>(params),
	});
	console.log(query);
	return {
		tableData: query.data?.list ?? [],
		total: query.data?.total ?? 0,
		loading: query.isLoading || query.isFetching,
		raw: query,
	};
};

export const useAddUser = (onClose?: () => void) => {
	return useMutation({
		mutationFn: addUser,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['userList'],
			});
			if (onClose) {
				onClose();
			}
		},
		onError: (error: any) => {
			console.log(error);
		},
	});
};
