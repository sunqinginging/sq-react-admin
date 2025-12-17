// 自定义或第三方的表单控件，也可以与 Form 组件一起使用
// 提供受控属性 value 或其它与 valuePropName 的值同名的属性。
// 提供 onChange 事件或 trigger 的值同名的事件。
import { DatePicker, TimePicker } from 'antd';
import dayjs from 'dayjs';
import type React from 'react';
const FORMAT_MAP = {
	date: 'YYYY-MM-DD',
	time: 'HH:mm:ss',
	datetime: 'YYYY-MM-DD HH:mm:ss',
};
export interface ICustomPickerProps {
	value?: string | dayjs.Dayjs | null;
	onChange?: (val: string | null) => void;
	type?: 'date' | 'time' | 'datetime';
	format?: string;
	[key: string]: any;
}

const CustomPicker: React.FC<ICustomPickerProps> = ({
	value,
	onChange,
	type = 'date',
	format,
	...rest
}) => {
	const formatType = format || FORMAT_MAP[type];
	const initValue = value ? dayjs(value) : null;
	const handleChange = (val: dayjs.Dayjs | null) => {
		if (!val) {
			onChange?.(null);
			return;
		}
		onChange?.(val.format(formatType));
	};

	if (type == 'time') {
		return (
			<TimePicker
				value={initValue}
				format={formatType}
				onChange={handleChange}
				{...rest}
			></TimePicker>
		);
	}
	return (
		<DatePicker
			showTime={type === 'datetime'}
			value={initValue}
			format={formatType}
			onChange={handleChange}
			{...rest}
		></DatePicker>
	);
};

export default CustomPicker;
