import type { JSX } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface Props {
	children: JSX.Element;
}

export default function PrivateRoute({ children }: Props) {
	// 登录状态校验
	const isLogin = localStorage.getItem('token');
	const location = useLocation();
	if (!isLogin) {
		// 重定向到登录页并告诉来源路径
		return (
			<Navigate
				to="/login"
				replace
				state={{ from: location.pathname }}
			></Navigate>
		);
	}
	return children;
}
