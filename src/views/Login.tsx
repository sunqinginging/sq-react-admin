import { useState } from 'react';

export default function Login() {
	console.log('login render');
	const [num, setNum] = useState(1);

	return (
		<div>
			login
			<div onClick={() => setNum(num + 1)}>{num}</div>
		</div>
	);
}
