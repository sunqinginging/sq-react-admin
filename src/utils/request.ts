import type { IResult } from '@/types/api';
import axios from 'axios';
import { hideLoading, showLoading } from './loading/index';
import { message } from './AntdGlobal';
const instance = axios.create({
	baseURL: '/api',
	timeout: 10000,
	timeoutErrorMessage: '请求超时，请稍后再试',
});

instance.interceptors.request.use(
	(config) => {
		const token = 'xxx';
		if (token) {
			config.headers.Authorization = `Bear ${token}`;
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

export default {
	get<T>(
		url: string,
		params?: object,
		options = { showLoading: true, showError: true }
	): Promise<T> {
		return instance.get(url, { params, ...options });
	},
	post(
		url: string,
		data: object,
		options = { showLoading: true, showError: true }
	) {
		return instance.post(url, data, options);
	},
};
