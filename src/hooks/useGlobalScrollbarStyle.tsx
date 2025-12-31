import { createStyles } from 'antd-style';

export const useGlobalScrollbarStyle = createStyles(({ css, token }) => {
	return {
		scrollbar: css`
			/* 默认所有滚动区域通用 */
			* {
				scrollbar-width: thin; /* Firefox */
				scrollbar-color: ${token.colorFillSecondary} transparent;
				scrollbar-gutter: stable;
			}

			/* Webkit 浏览器 */
			*::-webkit-scrollbar {
				width: 6px;
				height: 6px;
			}

			*::-webkit-scrollbar-track {
				background-color: transparent;
			}

			*::-webkit-scrollbar-thumb {
				background-color: ${token.colorFillSecondary};
				border-radius: 4px;
				transition: background-color 0.2s;

				&:hover {
					background-color: ${token.colorFillTertiary};
				}
			}
		`,
	};
});
