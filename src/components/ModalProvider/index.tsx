import { Modal, Button, type ModalProps } from 'antd';
import React, { createContext, useContext, useState } from 'react';
import { modal } from '@/utils/AntdGlobal';

export interface ModalInstance {
	key: string;
	title?: React.ReactNode;
	content: (props: { close: () => void }) => React.ReactNode;
	props?: Omit<ModalProps, 'open' | 'onCancel'>;
	zIndex?: number;
}

export type OpenModalParams = Omit<ModalInstance, 'key'> & { key?: string };

const ModalContext = createContext<null | {
	open: (modal: Omit<ModalInstance, 'key'> & { key?: string }) => void;
	close: (key: string) => void;
	closeAll: () => void;
}>(null);
export const ModalProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const [modalStack, setModalStack] = useState<ModalInstance[]>([]);
	const [zIndex, setZIndex] = useState(1000);

	const open = (modal: Omit<ModalInstance, 'key'> & { key?: string }) => {
		const generateKey = (): string => {
			return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
		};
		// 时间戳生成唯一的key
		const key = generateKey();

		setModalStack((prevState) => [
			...prevState,
			{ ...modal, key, zIndex: zIndex + 1 },
		]);
		setZIndex(zIndex + 1);
	};

	const close = (key: string) => {
		setModalStack((prevState) =>
			prevState.filter((modal) => modal.key !== key)
		);
	};

	const closeAll = () => {
		setModalStack([]);
	};

	return (
		<ModalContext.Provider value={{ open, close, closeAll }}>
			{children}
			{modalStack.map((modal) => {
				return (
					<Modal
						key={modal.key}
						open
						style={{ zIndex: modal.zIndex }}
						title={modal.title}
						footer={null}
						destroyOnHidden
						{...modal.props}
						onCancel={() => {
							close(modal.key);
						}}
					>
						{modal.content({ close: () => close(modal.key) })}
					</Modal>
				);
			})}
		</ModalContext.Provider>
	);
};
export const useModal = () => useContext(ModalContext);

export {
	modal, // 简洁的确认框询问用户 可以使用 App.useApp 封装的语法糖方法
};

// 创建modal 自定义footer组件 比如提交等按钮
// 出现问题 命令式触发modal组件 footer的内容只渲染一次 想跟react-query的mutation结合控制pending
// 发现不成 尝试在modal维护一个loading状态 发现自定义的按钮等需要做好多modal里面的事情
// 尝试modal只做ui展示，将业务逻辑跟footer的按钮 做成单独组件 modal的footer不使用
