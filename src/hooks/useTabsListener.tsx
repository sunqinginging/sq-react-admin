import type { AppRouteHandle } from '@/router/utils';
import { useTabsStore } from '@/store/tabs';
import { useEffect } from 'react';
import { useLocation, useMatches } from 'react-router-dom';

export function useTabsListener() {
	const location = useLocation();
	const matches = useMatches();
	const addTab = useTabsStore((s) => s.addTab);

	useEffect(() => {
		const match = matches[matches.length - 1];
		const title = (match.handle as AppRouteHandle).title!;
		addTab({
			title: title,
			key: location.pathname + location.search,
			path: location.pathname + location.search,
			closable: location.pathname !== '/dashboard',
		});
	}, [location.pathname, location.search]);
}
