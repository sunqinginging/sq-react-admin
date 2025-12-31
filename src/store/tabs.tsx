import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useAliveController } from 'react-activation';
export interface TabItem {
	key: string;
	path: string;
	title: string;
	closable: boolean;
}

export interface AliveActions {
	drop?: (name: string) => void;
	refresh?: (name: string) => void;
	clear?: () => void;
}

interface TabsState {
	tabs: TabItem[];
	activeKey: string;
	alive: AliveActions;
	setAliveActios: (actions: AliveActions) => void;
	addTab: (tab: TabItem) => void;
	removeTab: (key: string) => void;
	setActive: (key: string) => void;
	removeOthers: (key: string) => void;
	removeRight: (key: string) => void;
	removeLeft: (key: string) => void;
	clearTabs: () => void;
}

export const useTabsStore = create<TabsState>()(
	persist(
		(set, get) => ({
			tabs: [],
			activeKey: '',
			alive: {},
			setAliveActios: (actions) => {
				set({
					alive: actions,
				});
			},
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
					state.alive.drop?.(key);
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
				set((state) => {
					const others = state.tabs.filter((i) => i.key !== key);
					others.forEach((i) => state.alive.drop?.(i.key));
					return {
						tabs: state.tabs.filter((i) => i.key === key),
						activeKey: key,
					};
				});
			},
			removeRight: (key) => {
				set((state) => {
					const { tabs } = state;
					const index = tabs.findIndex((i) => i.key == key);
					// 先drop 再改tabs状态
					tabs.slice(index + 1).forEach((i) => get().alive.drop?.(i.key));
					return {
						tabs: tabs.slice(0, index + 1),
						activeKey: key,
					};
				});
			},
			removeLeft: (key) => {
				set((state) => {
					const { tabs, alive } = state;
					const index = tabs.findIndex((i) => i.key == key);
					tabs.slice(0, index).forEach((i) => alive.drop?.(i.key));

					return {
						tabs: tabs.slice(index),
						activeKey: key,
					};
				});
			},
			clearTabs: () => {
				// 退出登录的时候 清sessionStorage 重置tabs
				useTabsStore.persist.clearStorage();
				set({
					tabs: [],
				});
			},
		}),
		{
			name: 'tabs-session',
			storage: createJSONStorage(() => sessionStorage),
			partialize: (state) => ({
				tabs: state.tabs,
			}),
		}
	)
);
