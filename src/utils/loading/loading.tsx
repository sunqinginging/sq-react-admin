import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useThemeStore } from '@/store/theme';

export default function Loading() {
	const themeColor = useThemeStore.getState().primary;
	return (
		<div className="fixed inset-0 w-full h-full bg-[rgba(255,255,255,.5)] flex-center">
			<Spin
				indicator={
					<LoadingOutlined
						spin
						style={{ color: themeColor, fontSize: '48px' }}
					/>
				}
			/>
		</div>
	);
}

export function PageLoading() {
	const themeColor = useThemeStore.getState().primary;
	return (
		<div className="flex-center h-full">
			<Spin
				indicator={
					<LoadingOutlined
						spin
						style={{ color: themeColor, fontSize: '32px' }}
					/>
				}
			/>
		</div>
	);
}
