export default class FetchRequest {

    private baseURL = import.meta.env.VITE_API_BASE_URL
    private controller: AbortController | null = null

    private updateController = () => {
        this.controller = new AbortController()
    }

    // eslint-disable-next-line
    public sendRequest = async <T = any>(url: string, data: any = {}, options?: RequestInit): Promise<T> => {
        // 是否取消上次请求
        if (data.cancelLastRequest) {
            delete data.cancelLastRequest
            this.controller && this.cancelFetch(this.controller)
            this.updateController()
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
            if (data.result_code === '0') {
                return data
            }
            return Promise.reject(data)
        })
        .catch(error => {
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

    // 取消请求
    public cancelFetch = (controller: AbortController) => {
        controller.abort()
    }

    public getFetchInstance = () => {
        return this.sendRequest
    }
}
