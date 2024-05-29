import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import store from '@/store/store'
import { Toast } from 'antd-mobile'

import { removeToken } from '@/store/slice/userSlice'
import formatDate from './formatDate'

export default class Axios {
	private service: AxiosInstance = axios.create({
		baseURL: import.meta.env.VITE_API_BASE_URL,
		timeout: 60000,
	});
	private timer: NodeJS.Timeout | null = null;
	private commonParams: {
		version: string;
		charset: string;
		req_source: string;
		system: string;
		requestSerial?: string;
		timestamp?: string | Date | number;
		token?: string;
	} = {
			version: '1.0',
			charset: 'UTF-8',
			req_source: 'PROJECT',
			system: 'H5',
		};

	constructor() {
		this.init()
	}

	// 异常拦截处理器
	private errorHandler = (error: AxiosError) => {
		if (this.timer) {
			clearTimeout(this.timer)
			Toast.clear()
			this.timer = null
		}
		if (error.code === "ERR_NETWORK") {
			Toast.show({
				content: "请检查网络",
			})
		} else if (error?.response) {
			if (error.response.status === 403) {
				console.error('Request error: 403 拒绝访问');
			} else if (error.response.status === 404) {
				console.error('Request error: 404 不存在该资源');
			} else if (error.response.status === 500) {
				console.error('Request error: 500 服务器端错误');
			} else if (error.response.status === 502) {
				console.error('Request error: 502 网络错误');
			}
		}
		return Promise.reject(error)
	}

	private init = () => {

		this.service.interceptors.request.use((config) => {
			const { data } = config
			if (data?.loading) {
				delete data.loading
				/**
				 * 防止上一个 loading 有值但是未 clear
				 * 适用于：阻止多个请求都有 loading 时，timer未清除导致的 loading一直存在
				 */
				if (this.timer) clearTimeout(this.timer)
				this.timer = setTimeout(() => {
					Toast.show({
						icon: 'loading',
						maskClickable: false,
						content: "loading...",
						duration: 0,
					})
				}, 1000)
			}
			// 深拷贝数据，令对象不被改变
			const commonParam = { ...this.commonParams }
			// requestSerial 请求序列号
			let requestSerial: string = new Date().getTime().toString()
			for (let i = 0; i < 6; i++) {
				requestSerial += Math.floor(Math.random() * 10)
			}
			commonParam.requestSerial = requestSerial
			// timestamp 请求时间
			const timestamp: string = formatDate(new Date(), 'YYYY-MM-DD hh:mm:ss')
			commonParam.timestamp = timestamp

			commonParam.token = store.getState().user.token
			config.data = { ...data, ...commonParam }
			return config
		}, this.errorHandler)

		this.service.interceptors.response.use((response: AxiosResponse) => {
			if (this.timer) {
				/**
				 * 这里会产生一个问题，在多个请求同时携带loading参数时
				 * 第一个请求成功，则会进入此函数。清空timer，关闭loadingToast，尽管后续请求失败也会造成关闭
				 * 故而如非特殊需要，请不要在多个请求中（如Promise.all中）同时携带loading参数
				 * 请自行在请求中处理
				 */
				clearTimeout(this.timer)
				Toast.clear()
				this.timer = null
			}
			// response.status === 200
			if (response.data.result_code === '0') {
				return response
			} else if (response.data.result_code === '1010007') {
				store.dispatch(removeToken())
				Toast.show({
					icon: 'fail',
					content: "登录已失效",
				})
				return Promise.reject(new Error("登录已失效"))
			} else {
				return Promise.reject(response)
			}
		}, this.errorHandler)
	}

	public getAxiosInstance = () => {
		return this.service
	}
}