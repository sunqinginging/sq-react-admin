import 'axios';

declare module 'axios' {
	export interface AxiosRequestConfig {
		showLoading?: boolean;
		showError?: boolean;
	}

	export interface InternalAxiosRequestConfig<D = any> {
		showLoading?: boolean;
	}

	export interface AxiosResponse<T = any, D = any> {
		config: InternalAxiosRequestConfig<D> & {
			showLoading?: boolean;
		};
	}
}
