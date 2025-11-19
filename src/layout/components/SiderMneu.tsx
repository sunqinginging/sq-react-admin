import { Menu } from 'antd';
import type { MenuProps } from 'antd';
type MenuItem = Required<MenuProps>['items'][number];
import type { IMenuItem } from '@/router/utils';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMemo, useState, useEffect, type Key } from 'react';
import { useAuthStore } from '@/store/auth';

function buildParentMap(tree: MenuItem[]) {
	const map = new Map();

	function walk(nodes: MenuItem[], parentKey: Key | null = null) {
		nodes.forEach((node) => {
			if (!node) {
				return;
			}
			if (parentKey) map.set(node!.key, parentKey);
			if (
				node.type !== 'divider' &&
				'children' in node &&
				node.children?.length
			) {
				walk(node.children, node.key);
			}
		});
	}

	walk(tree);
	return map;
}

function getMenuPathByParentMap(
	pathname: string,
	parentMap: Map<string, string>
) {
	const path = [pathname];
	let parent = parentMap.get(pathname);

	while (parent) {
		path.unshift(parent);
		parent = parentMap.get(parent);
	}

	return path;
}

export function generateMenuList(menus: IMenuItem[]): MenuItem[] {
	return menus.map((item) => {
		const menuItem: MenuItem = {
			key: item.path,
			label: item.name,
			icon: '',
		};
		if (item.children && item.children.length > 0) {
			(menuItem as any).children = generateMenuList(item.children);
		}
		return menuItem;
	});
}

export default function SiderMenu() {
	const navigater = useNavigate();
	const { menus } = useAuthStore();
	const items = useMemo(() => generateMenuList(menus), [menus]);

	const handleMenuItemClick: MenuProps['onClick'] = (e) => {
		navigater(e.key);
	};

	const { pathname } = useLocation();
	// 当前展开的 SubMenu 菜单项 key 数组
	const [openKeys, setOpenKeys] = useState<string[]>([]);

	const parentMap = buildParentMap(items);

	useEffect(() => {
		// 创建层级树
		const path = getMenuPathByParentMap(pathname, parentMap); // ['/system', '/system/user']
		setOpenKeys(path.slice(0, -1)); // 父级
	}, [pathname, items]);
	return (
		<Menu
			mode="inline"
			items={items}
			onClick={handleMenuItemClick}
			selectedKeys={[pathname]}
			openKeys={openKeys}
			onOpenChange={setOpenKeys}
		/>
	);
}
