import { useTabsStore } from '@/store/tabs';
import { useEffect } from 'react';
import { useAliveController } from 'react-activation';

export function AliveBridge() {
	const controller = useAliveController();
	const setAliveActios = useTabsStore((s) => s.setAliveActios);

	useEffect(() => {
		setAliveActios({
			drop: controller.drop,
			refresh: controller.refresh,
			clear: controller.clear,
		});
	}, []);

	return null;
}
