import { AntdIcons } from './ant-icons';
import { CustomIcons } from './custom-icons';

export const Icons = {
	...AntdIcons,
	...CustomIcons,
};

export type IconType = keyof typeof Icons;
