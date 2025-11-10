import { Switch, ColorPicker } from 'antd';
import { useThemeStore } from '../store/theme';
import type { ColorPickerProps, GetProp } from 'antd';
import { useState, useMemo } from 'react';

type Color = GetProp<ColorPickerProps, 'value'>;
export const ThemeSwitcher = () => {
	const { mode, primary, setMode, setPrimary } = useThemeStore();
	const [color, setColor] = useState<Color>(primary);

	const hexString = useMemo<string>(
		() => (typeof color === 'string' ? color : color?.toHexString()),
		[color]
	);

	const handleThemeChange = (value) => {
		setColor(value);
		setPrimary(hexString);
	};
	return (
		<div flex="~ col gap3" p4 border="~ base rounded-lg" shadow="md">
			<div flex="~ gap2 items-center">
				<span>🌗 暗黑模式：</span>
				<Switch
					checked={mode === 'dark'}
					onChange={(checked) => setMode(checked ? 'dark' : 'light')}
				/>
			</div>

			<div flex="~ gap2 items-center">
				<span>🎨 主题色：</span>
				<ColorPicker
					format="hex"
					value={color}
					onChange={(value) => handleThemeChange(value)}
				/>
			</div>
		</div>
	);
};
