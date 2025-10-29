// uno-attributify.d.ts
import type { AttributifyAttributes } from 'unocss/preset-attributify';

declare module 'react' {
	// 扩展 React 的 HTML 属性定义
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface HTMLAttributes<T> extends AttributifyAttributes {}
}
