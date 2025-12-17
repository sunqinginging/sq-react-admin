import { getMenuList } from '@/api/system';
import type { IMenuItem } from '@/router/utils';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
	token: string;
	menus: any[];
	router: any | null;
	getMenus: () => void;
	setRouter: (router: any) => void;
	clearToken: () => void;
	setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
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
			clearToken: () => {
				useAuthStore.persist.clearStorage();
				set({ token: '' });
			},
			setToken: (token) => {
				set({ token });
			},
		}),
		{
			name: 'auth-token',
			storage: createJSONStorage(() => sessionStorage),
			partialize: (state) => ({
				token: state.token,
			}),
		}
	)
);
