import { createStyles } from 'antd-style';

export const useTableScrollbarStyle = createStyles(
	({ css, token, prefixCls }) => {
		const antCls = `.${prefixCls}`;

		return {
			customTable: css`
				${antCls}-table {
					${antCls}-table-container {
						${antCls}-table-body,
						${antCls}-table-content {
							scrollbar-width: thin;
							scrollbar-color: ${token.colorFillSecondary} transparent;
							scrollbar-gutter: stable;

							&::-webkit-scrollbar {
								width: 6px;
								height: 6px;
							}

							&::-webkit-scrollbar-thumb {
								background-color: ${token.colorFillSecondary};
								border-radius: 4px;

								&:hover {
									background-color: ${token.colorFillTertiary};
								}
							}
						}
					}
				}
			`,
		};
	}
);
