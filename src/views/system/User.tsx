import { Button, Input } from 'antd';
import { useState } from 'react';
export default function User() {
	const [num, setNum] = useState(1);
	const handleAdd = () => {
		setNum(num + 1);
	};
	return (
		<div>
			<Input placeholder="Basic usage" />
			<span>{num}</span>
			<Button onClick={() => handleAdd()}>增加+1</Button>
		</div>
	);
}
