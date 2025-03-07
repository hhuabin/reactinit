import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { Toast } from 'antd-mobile'

// import { navigate } from '@/hooks/router'
import store from '@/store/store'
import { removeToken, saveToken } from '@/store/slice/userSlice'
import formatDate from './formatDate'

type CommonParams = {
    version: string;
    charset: string;
    req_source: string;
    system: string;
    requestSerial?: string;
    timestamp: string | Date | number;
    token?: string;
}

export default class AxiosRequest {
    private instance: AxiosInstance = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
        timeout: 60000,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer <token>',
        },
    })
    private controller: AbortController
    private timerId: NodeJS.Timeout | null = null
    private commonParams: CommonParams = {
        version: '1.0',
        charset: 'UTF-8',
        req_source: 'PROJECT',
        system: 'H5',
        timestamp: '',
    }
    private refreshTokenPromise: Promise<void> | null = null

    constructor() {
        this.controller = new AbortController()
        this.init()
    }

    // 更新controller
    private updateController = () => {
        this.controller = new AbortController()
    }

    private init = () => {
        this.instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
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

            if (data.loading) {
                delete data.loading
                /**
                 * 防止上一个 loading 有值但是未 clear
                 * 适用于：阻止多个请求都有 loading 时，timerId未清除导致的 loading一直存在
                 */
                if (this.timerId) clearTimeout(this.timerId)
                this.timerId = setTimeout(() => {
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
            config.data = { ...commonParam, ...data }
            return config
        }, this.handleRequestError)

        this.instance.interceptors.response.use(async (response: AxiosResponse) => {
            if (this.timerId) {
                /**
                 * 这里会产生一个问题，在多个请求同时携带loading参数时
                 * 第一个请求成功，则会进入此函数。清空timerId，关闭loadingToast，尽管后续请求失败也会造成关闭
                 * 故而如非特殊需要，请不要在多个请求中（如Promise.all中）同时携带loading参数
                 * 请自行在请求中处理
                 */
                clearTimeout(this.timerId)
                Toast.clear()
                this.timerId = null
            }
            // response.status === 200
            if (response.data.result_code === '0') {
                return response
            } else if (response.data.result_code === '-1' && response.config.url !== '/user/refreshtoken') {
                // 无感刷新 token ，进入此逻辑的请求链接不能是无感刷新的 url ，避免逻辑死循环
                console.error(response)
                try {
                    await this.refreshToken()
                    return this.requestAgain({
                        ...response.config,
                        data: {
                            ...response.config.data,
                            token: store.getState().user.token,
                        },
                    })
                } catch (error) {
                    // 刷新 token 接口失败
                    console.error(error)
                    // 需返回原来接口的报错
                    return Promise.reject(response)
                }
            } else {
                console.error(response)
                return Promise.reject(response)
            }
        }, this.handleRequestError)
    }

    /**
     * 取消请求
     * @param controller AbortController
     * @returns void
     */
    public cancelRequest = (controller: AbortController) => {
        controller.abort()
    }

    /**
     * 请求重发
     * @param config InternalAxiosRequestConfig
     * @returns Promise<AxiosResponse<any, any>>
     */
    public requestAgain = (config: InternalAxiosRequestConfig) => {
        // 基于 response.cnofig === request 的 config
        return this.instance(config)
    }

    /**
     * 无感刷新 token 函数
     * @returns Promise<void>
     */
    public refreshToken = (): Promise<void> => {

        // 当多个请求同时触发时 refreshToken时，只会发起一次请求
        if (this.refreshTokenPromise) return this.refreshTokenPromise

        console.log("refresh-token")
        store.dispatch(removeToken())
        // 开发者自行修改
        const refreshToken = "refreshToken"

        this.refreshTokenPromise =  new Promise<void>((resolve, reject) => {
            // 发起刷新token请求
            this.instance({
                url: '/user/refreshtoken',
                method: "post",
                headers: {
                    Authorization: `Bearer ${refreshToken}`,
                },
            })
            .then((res) => {
                const newToken = res.data.token
                if (newToken) {
                    // 存储新的 token 到 store 中
                    store.dispatch(saveToken({
                        token: newToken,
                    }))
                    resolve()
                }
                return Promise.reject(res)
            })
            .catch((error) => {
                // 此处可做跳转至登录页
                // navigate("login")
                reject(error)
            })
            .finally(() => {
                this.refreshTokenPromise = null
            })
        })

        return this.refreshTokenPromise
    }

    // 异常拦截处理器
    private handleRequestError = (error: unknown): Promise<AxiosError> => {
        if (this.timerId) {
            clearTimeout(this.timerId)
            Toast.clear()
            this.timerId = null
        }

        let errorMessage = "请求失败，请稍后再试"
        if (axios.isCancel(error)) {
            console.warn('请求被取消', error.message)
            /**
             * 在返回 pendding 状态的时候，要确保请求函数的.catch没有什么必须要处理的逻辑
             * 比如清除组件的loading状态、以及函数防抖等
             * 若有此类逻辑，该接口不能使用取消请求功能，或者此处返回一个失败状态的 Promise
             */
            return new Promise(() => {})
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
        console.error(error)
        // err_msg 字段需要根据src/api/types/public.d 的 PublicAnswer进行自定义
        return Promise.reject({ ...(error as AxiosError), data: { err_msg: errorMessage } })
    }

    public getAxiosInstance = () => {
        return this.instance
    }
}
