import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TabItem {
	key: string;
	path: string;
	title: string;
	closable: boolean;
}

interface TabsState {
	tabs: TabItem[];
	activeKey: string;
	addTab: (tab: TabItem) => void;
	removeTab: (key: string) => void;
	setActive: (key: string) => void;
	removeOthers: (key: string) => void;
}

export const useTabsStore = create(
	persist<TabsState>(
		(set) => ({
			tabs: [],
			activeKey: '',
			addTab: (tab) => {
				set((state) => {
					if (state.tabs.some((i) => i.key == tab.key)) {
						return { activeKey: tab.key };
					}
					return {
						tabs: [...state.tabs, tab],
						activeKey: tab.key,
					};
				});
			},
			removeTab: (key) => {
				set((state) => {
					const tabs = state.tabs.filter((t) => t.key !== key);
					let activeKey = state.activeKey;
					if (activeKey == key && tabs.length) {
						activeKey = tabs[tabs.length - 1].key;
					}
					return {
						tabs,
						activeKey,
					};
				});
			},
			setActive: (key) => {
				set({
					activeKey: key,
				});
			},
			removeOthers: (key) => {
				set((state) => ({
					tabs: state.tabs.filter((i) => i.key === key),
					activeKey: key,
				}));
			},
		}),
		{}
	)
);
