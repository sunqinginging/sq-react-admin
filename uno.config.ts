import {
	defineConfig,
	presetAttributify,
	presetMini,
	transformerVariantGroup,
	transformerDirectives,
	transformerAttributifyJsx,
} from 'unocss';
// import transformerDirectives from '@unocss/transformer-directives';
export default defineConfig({
	presets: [
		presetMini({
			dark: 'class',
		}),
		presetAttributify(),
	],

	theme: {
		extend: {
			colors: {
				// 修改/扩展 preset 已经识别的颜色 key
				// 不会自动生成 任意自定义颜色类 需要手动写 rules 或 shortcuts
				primary: 'var(--color-primary)',
				background: 'var(--color-background)',
				text: 'var(--color-text)',
			},
			// 定义字号类型 {lg: '20px'} text-lg -> font-size: 20px
			fontSize: {
				base: '16px',
				lg: '20px',
			},
			// 定义间距值，影响 p-*, m-*, gap-*
			// rem基于 HTML 根元素的font-size计算的
			spacing: {
				1: '0.25rem',
				2: '0.5rem',
				4: '1rem',
			},
		},
	},
	// 快捷类名别名
	shortcuts: {
		'text-primary': 'text-[var(--color-primary)]',
		'bg-background': 'bg-[var(--color-background)]',
		'text-text': 'text-[var(--color-text)]',
	},
	// 自定义新的原子规则
	rules: [
		// [/^m-(\d+)$/, ([, d]) => ({ margin: `${d}px` })],
		[
			'content-center',
			{ 'justify-content': 'center', 'align-items': 'center' },
		],
		// [/^text-(\w+)$/, ([, c]) => ({ color: `var(--color-${c})` })],
		// [/^bg-(\w+)$/, ([, c]) => ({ 'background-color': `var(--color-${c})` })],
		// 上面的通用规则会与unocss预设的比如text-red类似产生冲突和覆盖
		// [
		// 	/^text-(primary|background|text)$/,
		// 	([, c]) => ({ color: `var(--color-${c})` }),
		// ],
		// [
		// 	/^bg-(primary|background|text)$/,
		// 	([, c]) => ({ 'background-color': `var(--color-${c})` }),
		// ],
		[
			/^text-primary(?:-(\w+))?$/,
			([, variant]) => {
				const varMap: Record<string, string> = {
					hover: 'var(--color-primary-hover)',
					active: 'var(--color-primary-active)',
					disabled: 'var(--color-primary-disabled)',
					default: 'var(--color-primary)',
				};
				const color = varMap[variant || 'default'];
				return { color };
			},
		],

		// bg-primary / bg-primary-hover / bg-primary-disabled 等同理
		[
			/^bg-primary(?:-(\w+))?$/,
			([, variant]) => {
				const varMap: Record<string, string> = {
					hover: 'var(--color-primary-hover)',
					active: 'var(--color-primary-active)',
					disabled: 'var(--color-primary-disabled)',
					default: 'var(--color-primary)',
				};
				const color = varMap[variant || 'default'];
				return { 'background-color': color };
			},
		],
	],
	// 全局样式注入
	// 共享色彩定义 UnoCSS 与 Antd token 统一颜色
	preflights: [
		{
			layer: 'default',
			getCSS: () => `
        :root {
          --color-primary-light: #3bf664;
          --color-background-light: #ffffff;
          --color-text-light: #111827;
          --color-primary: var(--color-primary-light);
          --color-background: var(--color-background-light);
          --color-text: var(--color-text-light);
        }
        .dark {
          --color-primary-dark: #60a5fa;
          --color-background-dark: #111827;
          --color-text-dark: #f9fafb;
          --color-primary: var(--color-primary-dark);
          --color-background: var(--color-background-dark);
          --color-text: var(--color-text-dark);
        }
      `,
		},
	],
	transformers: [
		transformerDirectives({
			applyVariable: ['--at-apply', '--uno-apply', '--uno'],
		}), // 在css样式里通过@apply使用指令
		transformerAttributifyJsx(),
		transformerVariantGroup(), // 合并多个变体 hover:(bg-red text-white)
	],
	// unocss按需生成 只会生成在源码中真实出现的类
	// 比如动态生成的class、text-primary类似于这种在源码中不会直接出现 编译阶段无法被扫描到所以不会被生成
	// 需要告诉unocss不管有没有使用 都帮我预先生成这些类
	safelist: [
		// 'text-primary',
		// 'bg-primary',
		// (context) => {
		// 	const theme = context?.theme as { colors?: Record<string, any> };
		// 	const colorKeys = theme?.colors ? Object.keys(theme.colors) : ['primary'];
		// 	const classes = [];
		// 	for (const key of colorKeys) {
		// 		classes.push(`text-${key}`);
		// 	}
		// 	return classes;
		// },
		'text-primary',
		'text-primary-hover',
		'text-primary-active',
		'text-primary-disabled',
		'bg-primary',
		'bg-primary-hover',
		'bg-primary-active',
		'bg-primary-disabled',
	],
});
