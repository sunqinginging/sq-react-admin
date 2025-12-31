import { QueryCache, QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000,
			retry: 1,
			refetchOnWindowFocus: false,
		},
	},
	queryCache: new QueryCache({
		onError: (error, query) => {
			console.error('Query Error:', error);
		},
	}),
});
