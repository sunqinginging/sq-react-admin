import {
	defineConfig,
	presetAttributify,
	presetMini,
	transformerVariantGroup,
	transformerDirectives,
	transformerAttributifyJsx,
} from 'unocss';

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
				// primary: 'var(--color-primary)', // 这种写法text-primary不会生效
			},
			// 定义字号类型 {lg: '20px'} text-lg -> font-size: 20px
			fontSize: {
				base: '16px',
				lg: '20px',
			},
			// 定义间距值，影响 p-*, m-*, gap-*
			// rem基于 HTML 根元素的font-size计算的16px
			spacing: {
				1: '0.25rem',
				2: '0.5rem',
				4: '1rem',
			},
		},
	},
	// 快捷类名别名
	shortcuts: [
		// 自定义text-primary在快捷类名下声明也可以
		// 'text-primary': 'text-[var(--color-primary)]',
		{
			'flex-center': 'flex flex-justify-center flex-items-center',
		},
	],
	// 自定义新的原子规则
	rules: [
		// [/^text-(\w+)$/, ([, c]) => ({ color: `var(--color-${c})` })],
		// [/^bg-(\w+)$/, ([, c]) => ({ 'background-color': `var(--color-${c})` })],
		// 上面的通用规则会与unocss预设的比如text-red类似产生冲突和覆盖
		// [
		// 	/^text-(primary|background|text)$/,
		// 	([, c]) => ({ color: `var(--color-${c})` }),
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
	// 没使用主题色切换的时候，可以通过维护明亮模式跟暗黑模式下的css变量 从而实现两个模式下是同一套css变量
	preflights: [
		{
			layer: 'default',
			getCSS: () => `
        :root {
          --color-primary-light: #3bf664;
          --color-primary: var(--color-primary-light);
        }
        .dark {
          --color-primary-dark: #60a5fa;
          --color-primary: var(--color-primary-dark);
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
