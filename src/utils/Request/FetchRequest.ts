import { Toast } from 'antd-mobile'
import type { ToastHandler } from 'antd-mobile/es/components/toast'

export default class FetchRequest {

    private baseURL = import.meta.env.VITE_API_BASE_URL
    private controller: AbortController
    private loadingMessage = new Map()

    constructor() {
        this.controller = new AbortController()
    }

    // 更新controller
    private updateController = () => {
        this.controller = new AbortController()
    }

    // eslint-disable-next-line
    public sendRequest = async <T = any>(url: string, data: any = {}, options?: RequestInit): Promise<T> => {
        // 是否取消上次请求
        if (data.cancelLastRequest) {
            delete data.cancelLastRequest
            this.cancelFetch(this.controller)
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

        // 处理loading逻辑
        let loadingMessage: ToastHandler
        let timer: NodeJS.Timeout
        if (!data.cancelLoading) {
            timer = setTimeout(() => {
                loadingMessage = Toast.show({
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
            signal: this.controller.signal,
            headers: {
                'Content-Type': 'application/json',
            },
            ...options,
            body,
        })
            .then((response: Response) => {
                return response.json()
            })
            .then(data => {
                if (data.result_code === '0') {
                    clearTimeout(timer)
                    loadingMessage?.close()
                    return data
                }
                return Promise.reject(data)
            })
            .catch(error => {
                clearTimeout(timer)
                loadingMessage?.close()

                if (error.name === 'AbortError') {
                    console.warn('请求被取消', error)
                    return new Promise(() => { })
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

/* interface RequestInit {
    method?: string
    keepalive?: boolean
    headers?: HeadersInit
    body?: BodyInit
    redirect?: RequestRedirect
    integrity?: string
    signal?: AbortSignal
    credentials?: RequestCredentials
    mode?: RequestMode
    referrer?: string
    referrerPolicy?: ReferrerPolicy
    window?: null
    dispatcher?: Dispatcher
    duplex?: RequestDuplex
} */

/* export declare class Response implements BodyMixin {
    constructor (body?: BodyInit, init?: ResponseInit)

    readonly headers: Headers
    readonly ok: boolean
    readonly status: number
    readonly statusText: string
    readonly type: ResponseType
    readonly url: string
    readonly redirected: boolean

    readonly body: ReadableStream | null
    readonly bodyUsed: boolean

    readonly arrayBuffer: () => Promise<ArrayBuffer>
    readonly blob: () => Promise<Blob>
    readonly formData: () => Promise<FormData>
    readonly json: () => Promise<unknown>
    readonly text: () => Promise<string>

    readonly clone: () => Response

    static error (): Response
    static json(data: any, init?: ResponseInit): Response
    static redirect (url: string | URL, status: ResponseRedirectStatus): Response
} */
