import { Spin } from 'antd';

export default function Loading({ tip = 'loading' }: { tip?: string }) {
	return <Spin tip={tip} />;
}
