import type { TabItem } from '@/store/tabs';
import { useContextMenu, type ContextMenuState } from './ContextMenuProvider';

export function ContextMenu() {
	const { state, hide } = useContextMenu();

	if (!state.visible) return null;

	const { x, y, items, payload } = state as ContextMenuState;

	const menus = items.filter((i) => !i.hidden);

	const width = 120;
	const safeX = Math.min(x, window.innerWidth - width);
	const safeY = Math.min(y, window.innerHeight - items.length * 36);

	return (
		<div
			style={{
				top: safeY,
				left: safeX,
				minWidth: width,
			}}
			className="fixed z-10000 bg-regular text-regular rounded-[6px] shadow-[0_6px_16px_rgba(0,0,0,0.12)] p-1 box-border"
		>
			{menus.map((item) => (
				<div
					key={item.key}
					onClick={() => {
						if (item.disabled) return;
						item.onClick?.(payload);
						hide();
					}}
					style={{
						padding: '6px 12px',
						fontSize: 13,
						cursor: item.disabled ? 'not-allowed' : 'pointer',
						opacity: item.disabled ? 0.5 : 1,
					}}
				>
					{item.label}
				</div>
			))}
		</div>
	);
}
