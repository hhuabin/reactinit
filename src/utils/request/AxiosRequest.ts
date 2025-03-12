import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { message } from 'antd'

// import { navigate } from '@/hooks/useRouter'
import store from '@/store/store'
import { saveToken, removeToken } from '@/store/slice/userSlice'
import formatDate from '../stringUtils/formatDate'

/**
 * AxiosRequest
 * 1. cancelLastRequest：取消上次请求，适合用在请求数据接口，不适合在提交数据接口使用，以避免重复提交
 * 2. cancelLoading：默认开启loading，可使用cancelLoading取消loading
 * 3. refreshToken：配置token过期的result_code，配置新token请求的url
 * 4. requestRetry 存在间隔 loading 问题，建议修复为只有一个loading
 */

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
    timerId?: NodeJS.Timeout;
    requestRetryNumber?: number;
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
    private controller: AbortController | null = null
    private loadingMessage = new Map<symbol, () => void>()
    private refreshTokenPromise: Promise<void> | null = null
    private commonParams: CommonParams = {
        version: '1.0',
        charset: 'UTF-8',
        req_source: 'PROJECT',
        system: 'H5',
        timestamp: '',
    }

    constructor() {
        this.init()
    }

    private init = () => {
        this.instance.interceptors.request.use((config: CustomAxiosRequestConfig) => {
            const { data = {} } = config

            /**
             * 是否取消上次请求，适合用在请求数据接口，不适合在提交数据接口使用，以避免重复提交
             * 只有携带了 cancelLastRequest 参数的请求才允许被取消，避免取消必要的请求
             * attention：禁止多个并行请求（如Promise.all中）同时携带 cancelLastRequest 参数，会造成只有最后一个请求生效
             */
            if (data.cancelLastRequest) {
                delete data.cancelLastRequest
                this.cancelRequest(this.controller)
                this.updateController()
                config.signal ??= (this.controller as AbortController).signal
            }

            if (!data.cancelLoading) {
                if (data.cancelLoading === false) delete data.cancelLoading
                const loadingSymbol = Symbol('loading')
                let loadingHandler: () => void
                const timerId = setTimeout(() => {
                    loadingHandler = message.loading('loading...', 0)
                    this.loadingMessage.set(loadingSymbol, loadingHandler)
                }, 1000)
                config.loadingSymbol = loadingSymbol
                config.timerId = timerId
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
            // 默认使用POST方法
            config.method = config.method || 'POST'
            return config
        }, this.handleRequestError)

        this.instance.interceptors.response.use(async (response: AxiosResponse) => {
            const config: CustomAxiosRequestConfig = response.config
            this.clearTimeoutTimer(config)

            // response.status === 200
            if (response.data.result_code === '0') {
                return response
            } else if (response.data.result_code === '-1' && response.config.url !== '/user/refreshtoken') {
                // 无感刷新 token ，进入此逻辑的请求链接不能是无感刷新的 url ，避免逻辑死循环
                console.error(response)
                try {
                    await this.refreshToken()
                    // 重新发送请求，如果此时接口还是报token过期，则会继续请求
                    return this.requestRetry(
                        config,
                        { token: store.getState().user.token },
                        response,
                    )
                } catch (error) {
                    // 刷新 token 接口失败
                    console.error("refresh-token-error", error)
                    // 需返回原来接口的报错
                    return Promise.reject(response)
                }
            } else {
                console.error(response)
                return Promise.reject(response)
            }
        }, this.handleRequestError)
    }

    // 更新controller
    private updateController = () => {
        this.controller = new AbortController()
    }

    /**
     * 清除 loading 定时器
     */
    private clearTimeoutTimer = (config: CustomAxiosRequestConfig) => {
        clearTimeout(config.timerId)
        if (config.loadingSymbol) {
            const loadingHandler = this.loadingMessage.get(config.loadingSymbol)
            loadingHandler && loadingHandler()
            this.loadingMessage.delete(config.loadingSymbol)
        }
    }

    /**
     * 取消请求
     * @param controller AbortController
     * @returns void
     */
    private cancelRequest = (controller: AbortController | null) => {
        if (!controller) {
            console.warn("controller is null")
            return
        }
        /**
         * 取消请求是异步的，比较慢，会造成一些问题
         * 比如新的 request 中的 timerId 会被 handleRequestError() 清除掉，造成没有loading
         */
        controller.abort()
    }

    /**
     * 请求重发
     * 基于 response.cnofig === request 的 config
     * @param config InternalAxiosRequestConfig 无需解压 config.data
     * @param response AxiosResponse 错误响应
     * @param maxRetries 最大重试次数， 默认值为 2
     * @param retryDelay  重试延迟时间， 默认值为 0
     * @returns Promise<AxiosResponse<any, any>>
     */
    private requestRetry = (
        config: CustomAxiosRequestConfig,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: Record<any, any>,
        response: AxiosResponse,
        maxRetries = 3,
        retryDelay = 0,
    ): Promise<AxiosResponse<unknown>> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const requestRetryNumber = (config.requestRetryNumber || 0)
                if (+requestRetryNumber > maxRetries) {
                    console.error("请求重发次数过多", config)
                    reject(response)
                    return
                }
                // 每个data都需要解压
                config.data = {
                    ...JSON.parse(response.config.data),
                    ...data,
                }
                config.requestRetryNumber = requestRetryNumber + 1

                resolve(this.instance(config))
            }, retryDelay)
        })
    }

    /**
     * 无感刷新 token 函数
     * @returns Promise<void>
     */
    private refreshToken = (): Promise<void> => {

        // 当多个并发请求同时触发时 refreshToken时，只会发起一次请求
        if (this.refreshTokenPromise) return this.refreshTokenPromise

        console.log("refresh-token")
        store.dispatch(removeToken())
        // 开发者自行修改
        const refreshToken = "refreshToken"

        this.refreshTokenPromise = new Promise<void>((resolve, reject) => {
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
        const config = (error as AxiosError).config as CustomAxiosRequestConfig
        this.clearTimeoutTimer(config)

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
        console.error(error)
        // err_msg 字段需要根据src/api/types/public.d 的 PublicAnswer进行自定义
        return Promise.reject({ ...(error as AxiosError), data: { err_msg: errorMessage } })
    }

    // 获取实例，用于请求
    public getAxiosInstance = () => {
        return this.instance
    }
}
