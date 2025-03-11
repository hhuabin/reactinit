import { Toast } from 'antd-mobile'

export default class FetchRequest {

    private baseURL = import.meta.env.VITE_API_BASE_URL
    private controller: AbortController
    private timerId: NodeJS.Timeout | null = null

    constructor() {
        this.controller = new AbortController()
    }

    private updateController = () => {
        this.controller = new AbortController()
    }

    // eslint-disable-next-line
    public sendRequest = async <T = any>(url: string, data: any = {}, options?: RequestInit): Promise<T> => {
        // 是否取消上次请求
        if (data.cancelLastRequest) {
            delete data.cancelLastRequest
            this.cancelFetch(this.controller)
            this.updateController()
        }

        if (!data.cancelLoading) {
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
        } else {
            delete data.cancelLoading
        }

        const body = data ? JSON.stringify({
            ...data,
        }) : undefined

        if (!url.startsWith('http')) {
            url = this.baseURL + url
        }

        return fetch(url, {
            signal: this.controller?.signal,
            headers: {
                'Content-Type': 'application/json',
            },
            ...options,
            body,
        })
        .then((response: Response) => {
            if (!response.ok) return Promise.reject(response)
            return response.json()
        })
        .then(data => {
            this.clearTimerId()

            if (data.result_code === '0') {
                return data
            }
            return Promise.reject(data)
        })
        .catch(error => {
            this.clearTimerId()

            if (error.name === 'AbortError') {
                console.warn('请求被取消', error.message)
                /**
                 * 在返回 pendding 状态的时候，要确保请求函数的.catch没有什么必须要处理的逻辑
                 * 比如清除组件的loading状态、以及函数防抖等
                 * 若有此类逻辑，该接口不能使用取消请求功能，或者此处返回一个失败状态的 Promise
                 */
                return new Promise(() => {})
            } else {
                return Promise.reject(error)
            }
        })
    }

    /**
     * 清除 loading 定时器
     */
    private clearTimerId = () => {
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
    }

    /**
     * 取消请求
     * @param controller AbortController
     * @returns void
     */
    private cancelFetch = (controller: AbortController) => {
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

    public getFetchInstance = () => {
        return this.sendRequest
    }
}
