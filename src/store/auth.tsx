import { getMenuList } from '@/api/system';
import type { IMenuItem } from '@/router/utils';
import { create } from 'zustand';

interface AuthState {
	token: string | null;
	menus: any[];
	router: any | null;
	getMenus: () => void;
	setRouter: (router: any) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
	token: '',
	menus: [],
	router: null,
	getMenus: async () => {
		const data = await getMenuList();
		set({ menus: data });
	},
	setRouter: (router) => {
		set({ router });
	},
}));
