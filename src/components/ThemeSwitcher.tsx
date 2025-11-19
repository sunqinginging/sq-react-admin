import { Switch, ColorPicker } from 'antd';
import { useThemeStore } from '../store/theme';
import type { ColorPickerProps, GetProp } from 'antd';
import { useState } from 'react';

type Color = GetProp<ColorPickerProps, 'value'>;
export const ThemeSwitcher = () => {
	const { mode, primary, setMode, setPrimary } = useThemeStore();
	const [color, setColor] = useState<Color>(primary);
	// (value: Color, css: string) => void
	const handleThemeChange = (value: Color, css: string) => {
		setColor(value);
		setPrimary(css);
	};
	return (
		<div>
			<Switch
				checked={mode === 'dark'}
				onChange={(checked) => setMode(checked ? 'dark' : 'light')}
			/>

			<ColorPicker
				format="hex"
				value={color}
				onChange={(value, css) => handleThemeChange(value, css)}
			/>
		</div>
	);
};
