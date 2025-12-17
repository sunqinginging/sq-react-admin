import {
	Button,
	Form,
	Input,
	Select,
	type FormInstance,
	type FormRule,
	type SelectProps,
} from 'antd';
import CustomPicker from './CustomPicker';
import { useEffect, useMemo, useState, useRef, type ReactNode } from 'react';
import type React from 'react';
export type FormItemType =
	| 'input'
	| 'textarea'
	| 'select'
	| 'custom'
	| 'date'
	| 'time'
	| 'datetime';
export type Option = { label: string; value: any };

type FieldName = string | number | (string | number)[];

export type FieldSchema = {
	name?: FieldName;
	label?: string;
	type: FormItemType;
	required?: boolean;
	rules?: FormRule[];
	placeholder?: string;
	defaultValue?: any;
	options?: Option[];
	computedOptions?: (values: any) => Option[];
	asyncOptions?: (values: any) => Promise<Option[]>;
	disabled?: boolean | ((values: any) => boolean);
	visible?: (values: any) => boolean;
	props?: Record<string, any>; // 每个formitem组件自己的属性
	render?: (form: FormInstance) => React.ReactNode; // 自定义插槽 form实例可以通过form.getFieldValue获取表单值 form.setFieldValue动态修改值
	deps?: string[];
	onChange?: (
		form: FormInstance,
		updateFormSchema: IUpdateFormSchema,
		registry: IRegistry
	) => void;
	onBlur?: (e: any) => void;
};

export interface ICustomFormProps {
	schema: FieldSchema[];
	initialValues?: Record<string, any>;
	onFinish?: (values: any) => void;
}

type IUpdateFormSchema = (name: string, config: Partial<FieldSchema>) => void;
type IRegistry = Record<string | number, any>;
function omit(obj: Record<string, any>, keysToRemove: string[]) {
	return Object.fromEntries(
		Object.entries(obj).filter(([key]) => !keysToRemove.includes(key))
	);
}

export default function CustomForm({
	schema,
	onFinish,
	initialValues,
}: ICustomFormProps) {
	const [form] = Form.useForm();
	const [schemaState, setSchemaState] = useState(schema);
	const registryRef = useRef<IRegistry>({});
	const registry = registryRef.current;

	useEffect(() => {
		const excludeList = schema
			.filter((item) => {
				return item.type == 'select' && item.asyncOptions;
			})
			.map((item) => item.name);

		if (initialValues) {
			form.setFieldsValue(omit(initialValues, excludeList as string[]));
		}
	});

	// 提供给字段的每一项去修改表单的配置
	const updateFormSchema: IUpdateFormSchema = (name, config) => {
		setSchemaState((prev) =>
			prev.map((item) => (item.name == name ? { ...item, ...config } : item))
		);
	};

	const onReset = () => {
		form.resetFields();
	};
	const renderSchema = useMemo(() => {
		return schemaState.map((item) => {
			const deps = item.deps || [];
			return (
				<Form.Item
					key={(item.name as string) || (item.label as string)}
					shouldUpdate={(prev, cur) => {
						return deps.some((key) => prev[key] !== cur[key]);
					}}
				>
					{({ getFieldsValue }) => {
						// getFieldsValue拿到表单所有值，提供给子组件的visible方法
						// Form.Item的children是渲染函数 需要shouldUpdate或者dependencies 不然默认不会更新 控制台会报错
						const values = getFieldsValue(true);
						if (typeof item.visible == 'function' && !item.visible(values)) {
							return null;
						}
						// 渲染自定义表单项
						if (item.render) {
							return (
								<Form.Item name={name} label={item.label}>
									{item.render(form)}
								</Form.Item>
							);
						}

						return (
							<RenderFormItem
								item={item}
								form={form}
								registry={registry}
							></RenderFormItem>
						);
					}}
				</Form.Item>
			);
		});
	}, [schemaState]);

	// 维护一个Map 方便根据每一项的name去找每一项的定义
	const nameItemMap = useMemo<Map<FieldName, FieldSchema>>(
		() => new Map(schemaState.map((item) => [item.name!, item])),
		[schemaState]
	);

	const handleFormValuesChange = (values: any) => {
		const key = Object.keys(values)[0] as string;
		const item = nameItemMap.get(key);

		if (item && item.onChange) {
			item.onChange(form, updateFormSchema, registry);
		}
		// item.onChange(form, updateFormSchema, registry);
	};

	return (
		<Form
			form={form}
			onFinish={onFinish}
			onValuesChange={handleFormValuesChange}
		>
			{renderSchema}
			<Form.Item>
				<Button type="primary" htmlType="submit">
					提交
				</Button>
				<Button htmlType="button" onClick={onReset}>
					Reset
				</Button>
			</Form.Item>
		</Form>
	);
}

// 设置shouldUpdate Form 的任意变化都会使该 Form.Item 重新渲染
// 通过React.memo 进行优化 props没有改变跳过渲染
const RenderFormItem: React.FC<{
	item: FieldSchema;
	form: FormInstance;
	registry: Record<string, any>;
}> = ({ item, form, registry }) => {
	const { name, label, type, props, onBlur } = item;
	// 组装校验规则
	const formItemRules = useMemo(() => {
		const list: FormRule[] = [];
		if (item.required) {
			list.push({ required: true, message: `${item.label}不能为空` });
		}
		if (item.rules) {
			list.push(...item.rules);
		}
		return list;
	}, [item.required, item.label, item.rules]);
	// 设置placeholder、disabled等
	console.log(props);
	const commonProps = {
		placeholder: item.placeholder,
		disabled:
			typeof item.disabled == 'function'
				? item.disabled(form.getFieldsValue())
				: item.disabled,
		...props,
	};
	if (type == 'select') {
		return (
			<SelectWidget
				props={commonProps}
				item={item}
				form={form}
				registry={registry}
			/>
		);
	}

	let Comp: ReactNode;
	switch (type) {
		case 'input':
			Comp = <Input {...commonProps} onBlur={() => onBlur()}></Input>;
			break;
		case 'textarea':
			Comp = <Input.TextArea {...commonProps} />;
			break;
		case 'datetime':
			Comp = <CustomPicker></CustomPicker>;
			break;
	}

	return (
		<Form.Item name={name} label={label} rules={formItemRules}>
			{Comp}
		</Form.Item>
	);
};

const SelectWidget: React.FC<{
	item: FieldSchema;
	props: Partial<SelectProps>;
	form: FormInstance;
	registry: Record<string, any>;
}> = ({ props, item, form, registry }) => {
	const [options, setOptions] = useState<Option[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const formItemRules = useMemo(() => {
		const list: FormRule[] = [];
		if (item.required) {
			list.push({ required: true, message: `${item.label}不能为空` });
		}
		if (item.rules) {
			list.push(...item.rules);
		}
		return list;
	}, [item.required, item.label, item.rules]);
	const loadOptions = async () => {
		const values = form.getFieldsValue(true);
		const { computedOptions, asyncOptions, options } = item;

		if (computedOptions) {
			const result = computedOptions(values);
			setOptions(result);
			return;
		}
		if (asyncOptions) {
			try {
				setLoading(true);
				const list = await asyncOptions(values);
				setOptions(list);
				const { name, defaultValue } = item;
				form.setFieldsValue({
					[name as string]: defaultValue,
				});
			} finally {
				setLoading(false);
			}
			return;
		}
		if (options) {
			setOptions(options);
		}
	};

	const disabled = useMemo(() => {
		return props.disabled || loading;
	}, [props, loading]);

	useEffect(() => {
		registry[item.name as string] = {
			refreshOptions: loadOptions,
		};
		loadOptions();

		return () => {
			const { name } = item;
			form.setFieldsValue({
				[name as string]: undefined,
			});
		};
	}, []);

	return (
		<Form.Item name={item.name} label={item.label} rules={formItemRules}>
			<Select
				{...props}
				options={options}
				loading={loading}
				disabled={disabled}
			/>
		</Form.Item>
	);
};

// 1
// 多字段之间交互的时候 通过deps字段实现声明式依赖 说明当前这个字段依赖哪些字段变化
// RenderFormItem外面包的Form.Item的shouldUpdate改成方法
// 性能最佳（只在依赖项变化重算）支持跨字段复杂联动

// 2
// 通过指定schema的每一项的onChange来实现字段级联动
// 在form的onValuesChange实现 setFieldsValue 不会触发 onFieldsChange 和 onValuesChange
