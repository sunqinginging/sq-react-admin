import { useTheme } from '@/hooks/useTheme';
import { App, Button, ColorPicker } from 'antd';
import './User.css';
import { useState } from 'react';
import type { ColorPickerProps, GetProp } from 'antd';

type Color = GetProp<ColorPickerProps, 'value'>;

export default function User() {
	console.log('user render');
	const { message } = App.useApp();
	const showMsg = () => {
		console.log('???');
		message.success('成功');
	};

	const { toggleTheme, setPrimaryColorVar } = useTheme();

	const handleThemeChange = () => {
		toggleTheme();
	};
	const [color, setColor] = useState<Color>('#1677ff');

	const handleColorChange = (value: Color) => {
		setColor(value);
		setPrimaryColorVar(value);
	};

	return (
		<div>
			<div onClick={() => showMsg()} className="text-primary bg-amber">
				232323
			</div>
			<Button type="primary" onClick={() => toggleTheme()}>
				暗黑模式切换
			</Button>
			<ColorPicker
				value={color}
				onChange={(value) => handleColorChange(value)}
			/>
			<span className="text-primary">呵呵</span>
		</div>
	);
}
