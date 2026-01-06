import {
	Button,
	Table,
	type TableColumnsType,
	type TableProps,
	Tooltip,
} from 'antd';
import { createStyles } from 'antd-style';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useTableScrollbarStyle } from '@/hooks/useTableScrollbarStyle';
import {
	getColumnsTotalWidth,
	getScrollBarSize,
	normalizeColumns,
} from '@/components/CustomTable/untils';
import { useTableContainerWidth } from '@/components/CustomTable/useTableContainerWidth';
import { useUserList, useAddUser } from '@/queryHooks/useUser';
import { useModal } from '@/components/ModalProvider/index';
import { message } from '@/utils/AntdGlobal';

export interface DataType {
	key: React.Key;
	id: string;
	name: string;
	age: number;
	email: string;
	createTime: string;
	isTotal?: boolean;
}

const data: DataType[] = [
	{
		key: '1',
		name: '名字超级长不够放得下呜呜呜呜名字超级长不够放得下呜呜呜呜名字超级长不够放得下呜呜呜呜名字超级长不够放得下呜呜呜呜',
		age: 20,
		address: '地球',
	},
	{
		key: '2',
		name: 'wang',
		age: 25,
		address: '地球',
	},
	{
		key: '3',
		name: 'bbb',
		age: 125,
		address: '地球',
	},
	{
		key: '4',
		name: 'xxs',
		age: 66,
		address: '地球',
	},
	{
		key: '5',
		name: 'super man',
		age: 2222,
		address: '地球',
	},
];
// 表格行rowSpan/列colSpan合并
// 哪个单元格显示 哪个单元格就负责span，被合并掉的单元格必须返回colSpan: 0或rowSpan: 0

const totalRow = {
	key: 'total',
	isTotal: true,
	name: '总计',
	address: '',
	age: data.reduce((sum, i) => sum + i.age, 0),
};

const dataSource = [...data, totalRow];

const useStyle = createStyles(({ css, token, prefixCls }) => {
	const antCls = `.${prefixCls}`;

	return {
		customTable: css`
			${antCls}-table {
				${antCls}-table-container {
					${antCls}-table-body,
					${antCls}-table-content {
						scrollbar-width: thin;
						scrollbar-color: #eaeaea transparent;
						scrollbar-gutter: stable;

						&::-webkit-scrollbar {
							width: 6px;
							height: 6px;
						}

						&::-webkit-scrollbar-thumb {
							background-color: #eaeaea;
							border-radius: 4px;
						}
					}
				}
			}
		`,
	};
});

const AddUser: React.FC<{ close: () => void }> = ({ close }) => {
	const addUserMutation = useAddUser();
	console.log(addUserMutation);

	const handleSubmit = async () => {
		try {
			await addUserMutation.mutateAsync();
			message.success('新增用户成功');
			close();
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<div>
			模拟form
			<Button
				onClick={() => handleSubmit()}
				loading={addUserMutation.isPending}
			>
				提交
			</Button>
		</div>
	);
};

export default function DashBoard() {
	const { styles } = useTableScrollbarStyle();
	const columns: TableColumnsType<DataType> = [
		{
			title: '姓名',
			dataIndex: 'name',
			width: 120,
			ellipsis: {
				showTitle: false,
			},
			// render: (value, record) =>
			// 	record.isTotal ? (
			// 		<span>总计</span>
			// 	) : (
			// 		<Tooltip placement="topLeft" title={value}>
			// 			{value}
			// 		</Tooltip>
			// 	),
			// onCell: (record) => {
			// 	if (record.isTotal) {
			// 		return {
			// 			colSpan: 2,
			// 		};
			// 	}
			// 	return {};
			// },
		},
		{
			title: '邮箱',
			dataIndex: 'email',
			width: 200,
			// render: (value) => value,
			// onCell: (record) => {
			// 	if (record.isTotal) {
			// 		return {
			// 			colSpan: 0,
			// 		};
			// 	}
			// 	return {};
			// },
		},
		{
			title: '年龄',
			dataIndex: 'age',
			width: 300,
			// render: (value, record) => {
			// 	return (
			// 		<span style={{ fontWeight: record.isTotal ? 600 : 400 }}>{value}</span>
			// 	);
			// },
		},
		{
			title: '创建日期',
			dataIndex: 'createTime',
			width: 300,
			// render: (value, record) => {
			// 	return (
			// 		<span style={{ fontWeight: record.isTotal ? 600 : 400 }}>{value}</span>
			// 	);
			// },
		},
		{
			title: '操作',
			key: 'operate',
			fixed: 'right',
			width: 150,
			render: () => (
				<Button type="text" onClick={() => handleAdd()}>
					编辑
				</Button>
			),
		},
	];

	const handleAdd = () => {
		open({
			title: 'modal只负责ui 将footer的按钮交给content的内容组件',
			props: {
				width: '70%',
			},
			content: ({ close }) => <AddUser close={close}></AddUser>,
		});
	};

	const { ref, width: tableWidth } = useTableContainerWidth();
	const resColumns = normalizeColumns(columns);
	const totalWidth = getColumnsTotalWidth(resColumns);
	const scrollX = totalWidth > tableWidth ? tableWidth + 36 : undefined;

	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const selectedRow = (record: DataType) => {
		const selectList = [...selectedRowKeys];
		const idx = selectList.indexOf(record.id);
		if (idx >= 0) {
			selectList.splice(idx, 1);
		} else {
			selectList.push(record.id);
		}
		setSelectedRowKeys(selectList);
	};

	const handleSelectedRowKeysChange = (selectedRowKeys: React.Key[]) => {
		setSelectedRowKeys(selectedRowKeys);
	};

	// 清空选择
	const clearSelectedRowKeys = () => {
		setSelectedRowKeys([]);
	};

	const rowSelection: TableProps<DataType>['rowSelection'] = {
		selectedRowKeys,
		onChange: handleSelectedRowKeysChange,
		type: 'checkbox', //checkbox | radio,
		fixed: true,
		// getCheckboxProps // 选择框的默认属性配置
	};

	const [pageParams, setPageParams] = useState({
		pageNum: 1,
		pageSize: 20,
	});

	const { tableData, loading, total } = useUserList<DataType>(pageParams);

	const { open } = useModal()!;

	return (
		<div>
			<div ref={ref}>
				<Table
					bordered
					rowKey="id"
					columns={resColumns}
					dataSource={tableData}
					rowSelection={rowSelection}
					onRow={(record) => ({
						onClick: () => selectedRow(record),
					})}
					scroll={{
						y: 55 * 10,
						// x: 'max-content',
						x: scrollX,
					}}
					className={styles.customTable}
					pagination={{
						current: pageParams.pageNum,
						pageSize: pageParams.pageSize,
						total: total,
						onChange: (page, size) => {
							setPageParams({
								pageNum: page,
								pageSize: size,
							});
						},
					}}
					loading={loading}
				></Table>
			</div>

			<Button onClick={() => clearSelectedRowKeys()}>清空</Button>
			{/* <div style={{ height: '300px', overflow: 'auto' }}>
				<div style={{ height: '800px', background: 'red' }}></div>
			</div> */}
		</div>
	);
}
