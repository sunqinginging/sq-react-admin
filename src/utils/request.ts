import type { IResult } from '@/types/api';
import axios from 'axios';
import { hideLoading, showLoading } from './loading/index';
import { message } from './AntdGlobal';
import { useAuthStore } from '@/store/auth';
const instance = axios.create({
	baseURL: '/api',
	timeout: 10000,
	timeoutErrorMessage: '请求超时，请稍后再试',
});

instance.interceptors.request.use(
	(config) => {
		const token = useAuthStore.getState().token;
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		if (config.showLoading) {
			showLoading();
		}
		return {
			...config,
		};
	},
	(err) => {
		return Promise.reject(err);
	}
);

instance.interceptors.response.use(
	(response) => {
		if (response.config.showLoading) {
			hideLoading();
		}
		const data: IResult = response.data;
		if (data.code == 401) {
			window.location.href = '/login';
			return Promise.reject(data);
		}
		if (data.code == 200) {
			return Promise.resolve(data.data);
		} else {
			// 报错信息
			return Promise.reject(data);
		}
	},
	(err) => {
		// 报错信息
		return Promise.reject(err.message);
	}
);

function createCancelRequest<T>(
	request: Promise<T>,
	controller: AbortController
): PromiseWithCancel<T> {
	(request as any).cancel = () => controller.abort();
	return request as PromiseWithCancel<T>;
}

type PromiseWithCancel<T> = Promise<T> & { cancel: () => void };

export default {
	get<T>(
		url: string,
		params?: object,
		options = { showLoading: true, showError: true }
	): PromiseWithCancel<T> {
		const controller = new AbortController();

		const request: Promise<T> = instance.get(url, {
			params,
			...options,
			signal: controller.signal,
		});

		return createCancelRequest<T>(request, controller);
	},
	post<T>(
		url: string,
		data: object,
		options = { showLoading: true, showError: true }
	): PromiseWithCancel<T> {
		const controller = new AbortController();

		const requet: Promise<T> = instance.post(url, data, {
			...options,
			signal: controller.signal,
		});

		return createCancelRequest<T>(requet, controller);
	},
};
