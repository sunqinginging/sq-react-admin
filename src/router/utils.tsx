import { useAuthStore } from '@/store/auth';
import { componentMap } from './componentMaps';
import { Navigate, Outlet, type RouteObject } from 'react-router-dom';
import { KeepAlive } from 'react-activation';
import type { ReactNode } from 'react';
import NotFound from '@/views/NotFound';
import { ErrorBoundary } from 'react-error-boundary';
import Fallback from '@/components/ErrorFallback';
import { Suspense } from 'react';

export interface IMenuItem {
	path: string;
	name: string;
	type: 'dir' | 'page' | 'button';
	children?: IMenuItem[];
	meta?: AppRouteHandle;
}

export interface AppRouteHandle {
	title?: string;
	icon?: string | React.ReactNode;
	isAuth?: boolean;
	keepAlive?: boolean;
	[key: string]: any;
}

export type AppRouteObject = RouteObject & {
	handle?: AppRouteHandle;
};

export function flattenRoutes(menus: IMenuItem[]): AppRouteObject[] {
	const routes: AppRouteObject[] = [];

	menus.forEach((menu) => {
		const route = convert(menu);
		if (route) {
			routes.push(route);
		}
	});

	return routes;
	// const result: any[] = [];
	// const loop = (list: any[]) => {
	// 	list.forEach((item) => {
	// 		console.log(item.path);
	// 		const Comp = componentMap[item.path];
	// 		result.push({
	// 			path: item.path,
	// 			element: <Comp />,
	// 			meta: item.meta || {},
	// 		});
	// 		if (item.children) {
	// 			loop(item.children);
	// 		}
	// 	});
	// };

	// loop(menus);

	// return result;
}

function convert(menu: IMenuItem, parentPath = ''): AppRouteObject | null {
	if (menu.type == 'button') {
		return null;
	}

	const fullPath = menu.path;
	const relativePath = extractPath(fullPath, parentPath);
	const hasChildren = Array.isArray(menu.children) && menu.children.length > 0;
	// 目录节点处理
	if (hasChildren) {
		const childrenRoutes: AppRouteObject[] = [];

		// 如果定义了type=="page" 说明当前目录既可以跳页面也可以目录
		if (menu.type == 'page') {
			// 使用index子路由 双节点模式
			childrenRoutes.push({
				index: true,
				element: getComponent(menu),
			});
		}
		// 递归处理子节点
		menu.children?.forEach((child) => {
			const childRoute = convert(child, fullPath);
			if (childRoute) {
				childrenRoutes.push(childRoute);
			}
		});

		return {
			path: relativePath,
			element: <Outlet />,
			children: childrenRoutes,
			handle: {
				title: menu.name,
				...menu.meta,
			},
		};
	}
	// 页面节点处理 无子级
	if (menu.type == 'page') {
		return {
			path: relativePath,
			element: getComponent(menu),
			handle: {
				title: menu.name,
				...menu.meta,
			},
		};
	}
	// 纯目录节点 没有page 也没有children
	if (menu.type == 'dir') {
		return {
			path: relativePath,
			element: <Outlet />,
		};
	}

	return null;
}

// 处理相对路径 去掉父级 path 的前缀
function extractPath(full: string, parent: string): string {
	if (!full) return '';

	// 确保都是 / 开头
	if (!full.startsWith('/')) full = '/' + full;
	if (!parent.startsWith('/')) parent = '/' + parent;

	// 去掉父路径
	if (full.startsWith(parent + '/')) {
		full = full.slice(parent.length + 1);
	}

	// 如果整条路径相同（父级 index）
	if (full === parent) return '';
	// 这一步path 做一次“父子结构矫正”
	// 如果父级一级是/system 子集二级是/sys/user
	// 这时候这一步 就能将patentPath不一样的子集转换成相对路径
	return full.replace(/^\//, ''); // 最后再保证没有 /
}

export function getComponent(menu: IMenuItem): ReactNode {
	// 1.从componentMap组件映射表获取
	const Comp = componentMap[menu.path] ?? <NotFound />;
	const element = <Comp />;

	return wrapWithKeepAlive(menu, element);
}

// KeepAlive和权限
export function wrapWithKeepAlive(route: IMenuItem, Element: ReactNode) {
	const { token } = useAuthStore.getState();
	if (route.meta?.isAuth && !token) {
		return <Navigate to="/404" replace></Navigate>;
	}

	if (route.meta?.keepAlive) {
		return (
			<KeepAlive name={route.path}>
				<ErrorBoundary FallbackComponent={Fallback}>
					<Suspense fallback={<div>Loading...</div>}> {Element}</Suspense>
				</ErrorBoundary>
			</KeepAlive>
		);
	}
	return (
		<ErrorBoundary FallbackComponent={Fallback}>
			<Suspense fallback={<div>Loading...</div>}> {Element}</Suspense>
		</ErrorBoundary>
	);
}
