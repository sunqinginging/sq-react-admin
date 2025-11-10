import { message } from '@/utils/AntdGlobal';

export default function Welcome() {
	return <div onClick={() => message.success('哈哈哈')}>User</div>;
}
