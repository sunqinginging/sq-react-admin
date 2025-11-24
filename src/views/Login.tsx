// import { useAuthStore } from '@/store/auth';
import { Button, message } from 'antd';
import CustomForm, {
	type FieldSchema,
} from '@/components/CustomForm/CustomForm';
import { getOptionsList } from '@/api/system';
export default function Login() {
	const handleClick = () => {};
	const schema: FieldSchema[] = [
		{
			name: 'userName',
			label: '用户名',
			type: 'input',
			required: true,
			rules: [
				({ getFieldValue }) => ({
					validator(_, value) {
						if (!value || getFieldValue('password') === value) {
							return Promise.resolve();
						}
						return Promise.reject(
							new Error('The new password that you entered do not match!')
						);
					},
				}),
			],
		},
		{
			name: 'password',
			label: '密码',
			type: 'input',
			required: true,
			// 字段级联动 可以去修改其他字段等
			onChange: (form, updateFormSchema, registry) => {
				console.log('怎么没用啊');
				form.setFieldValue('sex', undefined);
				registry.sex.refreshOptions();
			},
		},
		{
			type: 'custom',
			label: '自定义插槽',
			render: (form) => {
				const values = form.getFieldsValue();
				return (
					<div>
						自定义表单项目
						<div>用户名: {values.userName}</div>
					</div>
				);
			},
		},
		{
			name: 'sex',
			type: 'select',
			label: '性别',
			required: true,
			defaultValue: 'b',
			// visible: (values) => values.userName == 'aa',
			placeholder: '请选择',
			asyncOptions: getOptionsList,
			deps: ['password'],
			// options: [
			// 	{
			// 		value: 'a',
			// 		label: '选项a',
			// 	},
			// 	{
			// 		value: 'b',
			// 		label: '选项b',
			// 	},
			// ],
		},
	];

	const handleFormSubmit = (values: any) => {
		console.log(values);
	};

	return (
		<div>
			login
			<Button onClick={handleClick}>登录</Button>
			<CustomForm
				schema={schema}
				onFinish={handleFormSubmit}
				initialValues={{ sex: 'a', password: 'aaa' }}
			></CustomForm>
		</div>
	);
}
