import { useTabsStore, type TabItem } from '@/store/tabs';
import { useNavigate } from 'react-router-dom';
import type { ContextMenuFactory } from '@/components/ContextMenu/ContextMenuProvider';
import { ContextMenuTrigger } from '@/components/ContextMenu/ContextMenuTrigger';

export default function TagsView() {
	const navigate = useNavigate();
	const { tabs, activeKey, removeTab, setActive, removeOthers, removeRight } =
		useTabsStore();

	const handleTabClick = (item: TabItem) => {
		setActive(item.key);
		navigate(item.path);
	};

	const isActive = (item: TabItem) => {
		return item.key == activeKey;
	};
	const getTabMenu: ContextMenuFactory<{ tabKey: string }> = ({ tabKey }) => {
		console.log(tabKey);
		return [
			{
				key: 'close',
				label: '关闭当前',
				onClick: () => removeTab(tabKey),
			},
			{
				key: 'closeOthers',
				label: '关闭其他',
				onClick: () => removeOthers(tabKey),
			},
			{
				key: 'closeRight',
				label: '关闭右边',
				onClick: () => removeRight(tabKey),
			},
		];
	};

	return (
		<div className="flex">
			{tabs.map((item) => (
				<ContextMenuTrigger
					menu={getTabMenu}
					payload={{ tabKey: item.key }}
					key={item.key}
				>
					<div
						data-active={isActive(item)}
						onClick={() => handleTabClick(item)}
						className="p-2 flex-inline-center cursor-pointer data-[active=true]:text-primary text-regular"
					>
						{item.title}
					</div>
				</ContextMenuTrigger>
			))}
		</div>
	);
}
