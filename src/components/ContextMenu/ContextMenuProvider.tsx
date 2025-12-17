import { createContext, useEffect, useState, useContext } from 'react';
import { ContextMenu } from './ContextMenu';

export interface ContextMenuItem<T = any> {
	key: string;
	label: React.ReactNode;
	onClick?: (payload: T) => void;
	disabled?: boolean;
	hidden?: boolean;
}

export type ContextMenuFactory<T = any> = (payload: T) => ContextMenuItem<T>[];

export interface ContextMenuState<T = any> {
	visible: boolean;
	x: number;
	y: number;
	items: ContextMenuItem<T>[];
	payload?: T;
}

const ContextMenuContext = createContext<any>(null);

export function ContextMenuProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [state, setState] = useState<ContextMenuState>({
		visible: false,
		x: 0,
		y: 0,
		items: [],
	});

	const show = (
		x: number,
		y: number,
		items: ContextMenuItem[],
		payload?: any
	) => {
		setState({
			visible: true,
			x,
			y,
			items,
			payload,
		});
	};
	const hide = () => {
		setState((s) => ({
			...s,
			visible: false,
		}));
	};

	useEffect(() => {
		if (!state.visible) {
			return;
		}
		const close = () => hide();
		window.addEventListener('click', close);
		window.addEventListener('contextmenu', close);
		window.addEventListener('scroll', close, true);

		const esc = (e: KeyboardEvent) => e.key === 'Escape' && hide();
		window.addEventListener('keydown', esc);

		return () => {
			window.removeEventListener('click', close);
			window.removeEventListener('contextmenu', close);
			window.removeEventListener('scroll', close, true);
			window.removeEventListener('keydown', esc);
		};
	}, [state.visible]);

	return (
		<ContextMenuContext.Provider value={{ state, show, hide }}>
			{children}
			<ContextMenu />
		</ContextMenuContext.Provider>
	);
}

export function useContextMenu() {
	return useContext(ContextMenuContext);
}
