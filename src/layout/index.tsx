import React, { useMemo, useState, type CSSProperties } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import type { AppRouteHandle } from '@/router/utils';
const { Header, Sider, Content } = Layout;

import { Breadcrumb } from 'antd';
import { useMatches, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import SiderMenu from './components/SiderMneu';

function GlobalBreadcrumb() {
	const matches = useMatches();
	const crumbs = matches
		.filter((item) => {
			const handle = item.handle as AppRouteHandle | undefined;
			return handle?.title;
		})
		.map((item) => {
			const handle = item.handle as AppRouteHandle;
			return {
				title: <Link to={item.pathname}>{handle.title}</Link>,
			};
		});

	return <Breadcrumb items={crumbs}></Breadcrumb>;
}

const App: React.FC = () => {
	const [collapsed, setCollapsed] = useState(false);

	const contentStyle: CSSProperties = {
		padding: '24px 24px',
		boxSizing: 'border-box',
	};

	const headerStyle: CSSProperties = {
		padding: '0 16px',
		boxSizing: 'border-box',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	};

	return (
		<Layout style={{ width: '100%', height: '100%' }}>
			<Sider trigger={null} collapsible collapsed={collapsed}>
				<SiderMenu></SiderMenu>
			</Sider>
			<Layout style={{ height: '100%', overflow: 'hidden' }}>
				<Header style={headerStyle}>
					<div className="flex-center">
						<Button
							type="text"
							icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
							onClick={() => setCollapsed(!collapsed)}
							style={{
								fontSize: '16px',
								width: 64,
								height: 64,
							}}
						/>
						<GlobalBreadcrumb></GlobalBreadcrumb>
					</div>
					<ThemeSwitcher></ThemeSwitcher>
				</Header>
				<Content style={contentStyle}>
					<motion.div
						key={location.pathname}
						initial={{ opacity: 0, x: 30 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -30 }}
						transition={{ duration: 0.25 }}
					>
						<Outlet />
					</motion.div>
				</Content>
			</Layout>
		</Layout>
	);
};

export default App;
