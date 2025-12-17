import { useContextMenu } from './ContextMenuProvider';
import type { ContextMenuFactory } from './ContextMenuProvider';
export function ContextMenuTrigger<T>({
	menu,
	payload,
	children,
}: {
	menu: ContextMenuFactory<T>;
	payload: T;
	children: React.ReactNode;
}) {
	const { show } = useContextMenu();

	const onContextMenu = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		console.log('?????');
		const items = menu(payload);
		if (!items.length) return;

		show(e.clientX, e.clientY, items, payload);
	};

	return <div onContextMenu={onContextMenu}>{children}</div>;
}
