import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import store from '@/store/store'
import { Toast } from 'antd-mobile'
import type { ToastHandler } from 'antd-mobile/es/components/toast'

import { removeToken } from '@/store/slice/userSlice'
import formatDate from './formatDate'

interface CommonParams {
    version: string;
    charset: string;
    req_source: string;
    system: string;
    requestSerial?: string;
    timestamp: string | Date | number;
    token?: string;
}

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    loadingSymbol?: symbol;
    timer?: NodeJS.Timeout;
}

export default class AxiosRequest {
    private service: AxiosInstance = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
        timeout: 60000,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer <token>',
        },
    })
    private controller: AbortController
    private loadingMessage = new Map()
    private commonParams: CommonParams = {
        version: '1.0',
        charset: 'UTF-8',
        req_source: 'PROJECT',
        system: 'H5',
        timestamp: '',
    }

    constructor() {
        this.controller = new AbortController()
        this.init()
    }

    // 更新controller
    private updateController = () => {
        this.controller = new AbortController()
    }

    private init = () => {
        this.service.interceptors.request.use((config: CustomAxiosRequestConfig) => {
            const { data = {} } = config

            // 是否取消上次请求
            if (data.cancelLastRequest) {
                delete data.cancelLastRequest
                this.cancelRequest(this.controller)
                /**
                 * 可以在这里更新请求 controller
                 * 但是这样会造成controller长期不更新
                 * 一旦取消请求，多个请求会被同时取消
                 * 甚至是请求不同组件的请求被取消，不推荐在这里更新
                 */
                // this.updateController()
            }
            // 不管是否取消上一次请求，都应该更新controller
            this.updateController()
            config.signal ??= this.controller.signal

            if (!data.cancelLoading) {
                const loadingSymbol = Symbol('loading')
                let loadingHandler: ToastHandler
                const timer = setTimeout(() => {
                    loadingHandler = Toast.show({
                        icon: 'loading',
                        maskClickable: false,
                        content: "loading...",
                        duration: 0,
                    })
                    this.loadingMessage.set(loadingSymbol, loadingHandler)
                }, 1000)
                config.loadingSymbol = loadingSymbol
                config.timer = timer
            } else {
                delete data.cancelLoading
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
            config.data = { ...commonParam, ...data }
            return config
        }, this.handleRequestError)

        this.service.interceptors.response.use((response: AxiosResponse) => {
            const config: CustomAxiosRequestConfig = response.config
            clearTimeout(config?.timer)
            if (config?.loadingSymbol) {
                const loadingHandler: ToastHandler = this.loadingMessage.get(config.loadingSymbol)
                loadingHandler?.close()
                this.loadingMessage.delete(config.loadingSymbol)
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
        }, this.handleRequestError)
    }

    // 取消请求
    public cancelRequest = (controller: AbortController) => {
        controller.abort()
    }

    // 异常拦截处理器
    private handleRequestError = (error: unknown): Promise<AxiosError> => {
        const config = (error as AxiosError).config as CustomAxiosRequestConfig
        clearTimeout(config?.timer)
        if (config?.loadingSymbol) {
            const loadingHandler: ToastHandler = this.loadingMessage.get(config.loadingSymbol)
            loadingHandler?.close()
            this.loadingMessage.delete(config.loadingSymbol)
        }

        let errorMessage = "请求失败，请稍后再试"
        if (axios.isCancel(error)) {
            console.warn('请求被取消', error.message)
            return new Promise(() => { })
        } else if (axios.isAxiosError(error)) {
            if (error.response?.status === 403) {
                errorMessage = "拒绝访问"
                console.error("Request error: 403 拒绝访问")
            } else if (error.response?.status === 404) {
                errorMessage = "请求资源不存在"
                console.error("Request error: 404 请求资源不存在")
            } else if (error.response?.status === 500) {
                errorMessage = "服务器错误，请稍后重试"
                console.error("Request error: 500 服务器错误")
            } else if (error.request) {
                errorMessage = "没有收到响应，请检查网络"
                console.error("没有收到响应，请检查网络")
            } else {
                errorMessage = "请求错误，请稍后再试"
                console.error('请求错误:', error.message)
            }
        }
        Toast.show({
            icon: 'fail',
            content: errorMessage,
        })
        return Promise.reject(error as AxiosError)
    }

    // 获取实例，用于请求
    public getAxiosInstance = () => {
        return this.service
    }
}
