import { createRoot } from 'react-dom/client';
import Loading from './loading';

let count = 0;
export const showLoading = () => {
	if (count == 0) {
		const loading = document.createElement('div');
		loading.setAttribute('id', 'loading');
		createRoot(loading).render(<Loading></Loading>);
	}
	count++;
};

export const hideLoading = () => {
	if (count < 0) {
		return;
	}
	count--;
	if (count == 0) {
		document.body.removeChild(document.getElementById('loading')!);
	}
};
