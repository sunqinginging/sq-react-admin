import type { TableColumnsType } from 'antd';
import type { ColumnGroupType } from 'antd/es/table';

interface NormalizeOptions {
	defaultWidth?: number;
	operateWidth?: number;
	enabledEllipsis: boolean;
}
function isColumnGroup<T>(column: any): column is ColumnGroupType<T> {
	return Array.isArray(column?.children);
}
/**
 * 规范化Table的列配置
 * - 自动补齐列的默认宽度width
 * - 统一处理ellipsis
 * @param columns 表格列配置
 * @param options 定义规划化配置项
 * @returns 处理后的表格列配置
 */
export function normalizeColumns<DataType = any>(
	columns: TableColumnsType<DataType>,
	options: NormalizeOptions = {
		defaultWidth: 160,
		operateWidth: 200,
		enabledEllipsis: true,
	}
): TableColumnsType<DataType> {
	const {
		defaultWidth = 160,
		operateWidth = 200,
		enabledEllipsis = true,
	} = options;

	return columns.map((item) => {
		if (isColumnGroup<DataType>(item)) {
			return {
				...item,
				children: normalizeColumns(item.children, options),
			};
		}
		const isOperationColumn =
			item.key == 'action' ||
			item.dataIndex == 'aciton' ||
			item.title == '操作';
		const width =
			item.width ?? (isOperationColumn ? operateWidth : defaultWidth);
		return {
			...item,
			width,
			ellipsis:
				enabledEllipsis && item.ellipsis !== false
					? (item.ellipsis ?? true)
					: item.ellipsis,
		};
	});
}

export function getColumnsTotalWidth<DataType = any>(
	columns: TableColumnsType<DataType>
) {
	return columns.reduce((total, item): number => {
		if (isColumnGroup<DataType>(item)) {
			return total + getColumnsTotalWidth(item.children);
		}
		return total + Number(item.width || 0);
	}, 0);
}

interface AutoScrollXOptions {
	buffer?: number;
	minScrollX?: number;
}

export function getAutoScrollX<DataType = any>(
	columns: TableColumnsType<DataType>,
	options: AutoScrollXOptions = {}
) {
	const { buffer = 36, minScrollX = 0 } = options;
	const totalWidth = getColumnsTotalWidth(columns);
	const scrollX = totalWidth + buffer;
	return scrollX > minScrollX ? scrollX : undefined;
}

export function getScrollBarSize() {
	const scrollDiv = document.createElement('div');
	scrollDiv.style.width = '100px';
	scrollDiv.style.height = '100px';
	scrollDiv.style.overflow = 'scroll';
	scrollDiv.style.position = 'absolute';
	scrollDiv.style.top = '-9999px';

	document.body.appendChild(scrollDiv);

	const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

	document.body.removeChild(scrollDiv);

	return scrollbarWidth;
}
