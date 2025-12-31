import { Icons, type IconType } from '@/icons';
import { AntdIcons } from '@/icons/ant-icons';
import { Spin } from 'antd';
import { div } from 'motion/react-client';
import { lazy, Suspense } from 'react';
import type React from 'react';
interface IconProps {
	type: IconType;
	className?: string;
	style?: React.CSSProperties;
}

export const Icon: React.FC<IconProps> = ({ type, className, style }) => {
	const IconComponent = Icons[type];
	if (!IconComponent) {
		return null;
	}
	// console.log(AntdIcons);
	// const isAntdIcon = Object.keys(AntdIcons).includes(type);
	// console.log(isAntdIcon);

	// const LazyIcon = lazy(() => Promise.resolve({ default: IconComponent }));
	return (
		<IconComponent
			className={className}
			style={{ color: 'red' }}
		></IconComponent>
	);
};
