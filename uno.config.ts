import {
	defineConfig,
	presetAttributify,
	presetMini,
	transformerVariantGroup,
} from 'unocss';
import transformerDirectives from '@unocss/transformer-directives';
export default defineConfig({
	presets: [
		presetAttributify(),
		presetMini({
			dark: 'class',
		}),
	],

	theme: {
		extends: {
			colors: {
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
	shortcuts: {},
	// 自定义新的原子规则
	rules: [
		[/^m-(\d+)$/, ([, d]) => ({ margin: `${d}px` })],
		[
			'content-center',
			{ 'justify-content': 'center', 'align-items': 'center' },
		],
	],
	// 全局样式注入
	// 共享色彩定义 UnoCSS 与 Antd token 统一颜色
	preflights: [
		{
			getCSS: () => `
        :root {
          --color-primary: #3b82f6;
          --color-background: #ffffff;
          --color-text: #111827;
        }
        .dark {
          --color-primary: #60a5fa;
          --color-background: #111827;
          --color-text: #f9fafb;
        }
      `,
		},
	],
	transformers: [
		transformerDirectives(), // 在css样式里通过@apply使用指令
		transformerVariantGroup(), // 合并多个变体 hover:(bg-red text-white)
	],
});
