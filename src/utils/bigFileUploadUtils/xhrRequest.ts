/* eslint-disable @typescript-eslint/no-explicit-any */
interface XhrRequestOptions {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
    headers?: Record<string, string>;
    timeout?: number;
    responseType?: XMLHttpRequestResponseType;
    // body?: Document | XMLHttpRequestBodyInit | null;
    body?: any;
    signal?: AbortSignal;
    onUploadProgress?: (percent: number, loaded: number, total: number) => void;
    onDownloadProgress?: (percent: number, loaded: number, total: number) => void;
}

/**
 * @description: 发起 xhr 请求
 * @param { XhrRequestOptions } options 请求配置
 * @return { Promise<T> }
 */
export const xhrRequest = <T = any>(options: XhrRequestOptions) => {

    const {
        url = '',
        method = 'GET',
        headers = { 'Content-Type': 'application/json' },
        timeout = 0,          // 无超时限制
        responseType = 'json',
        body,                 // 如果 body 改成 any，当 'Content-Type': 'application/json' 时，需要将 body 序列化，JSON.stringify(body)
        signal,
        onUploadProgress,
        onDownloadProgress,
    } = options

    let xhr = new XMLHttpRequest()

    return new Promise<T>((resolve, reject) => {
        xhr = new XMLHttpRequest()
        xhr.open(method, url)

        if (body instanceof FormData) {
            // FormData 不需要手动设置 Content-Type
            if ('Content-Type' in headers) {
                // FormData 不需要手动设置 Content-Type
                delete headers['Content-Type']
            }
        } else if (headers) {
            for (const [key, value] of Object.entries(headers)) {
                xhr.setRequestHeader(key, value)
            }
        }
        xhr.timeout = timeout
        xhr.responseType = responseType

        // 上传进度
        if (onUploadProgress) {
            /**
             * @instruction { boolean } e.lengthComputable 是否可以获取总字节数
             * @instruction { number } e.loaded 已传输的字节数（始终有）
             * @instruction { number } e.total 总字节数（只有在 lengthComputable = true 时才可信）
             */
            xhr.upload.onprogress = e => {
                if (e.lengthComputable) {
                    const percent = (e.loaded / e.total) * 100
                    onUploadProgress(percent, e.loaded, e.total)
                }
            }
        }
        // 下载进度
        if (onDownloadProgress) {
            xhr.onprogress = e => {
                if (e.lengthComputable) {
                    const percent = (e.loaded / e.total) * 100
                    onDownloadProgress(percent, e.loaded, e.total)
                }
            }
        }

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                // 请求成功
                if (xhr.responseType === '' || xhr.responseType === 'text') {
                    // 文本模式，返回字符串
                    try {
                        resolve(JSON.parse(xhr.response))
                    } catch {
                        resolve(xhr.response as unknown as T)
                    }
                } else {
                    // 其他模式：json / blob / arraybuffer / document
                    resolve(xhr.response as T)
                }
            } else {
                // 2xx 以外的返回码
                reject(new Error(`Request failed with status ${xhr.status}`))
            }
        }
        xhr.ontimeout = () => reject(new Error('Request timed out'))
        xhr.onerror = () => reject(new Error('Network error'))

        // 因为并发上传任务开启了请求重试机制，所以 xhr.onabort 不能抛出错误，不然请求重试依然会继续上传
        // xhr.onabort = () => reject(new Error('Request aborted'))
        if (signal) {
            if (signal.aborted) {
                xhr.abort()
            } else {
                signal.addEventListener('abort', () => xhr.abort())
            }
        }

        if (headers['Content-Type'] === 'application/json') {
            xhr.send(JSON.stringify(body))
        } else {
            xhr.send(body)
        }
    })
    /* // 请求成功完成时
    onload?: (event: ProgressEvent<XMLHttpRequestEventTarget>) => void;
    // 网络层面错误
    onerror?: (event: ProgressEvent<XMLHttpRequestEventTarget>) => void;
    // 请求超时
    ontimeout?: (event: ProgressEvent<XMLHttpRequestEventTarget>) => void;
    // 请求取消
    onabort?: (event: ProgressEvent<XMLHttpRequestEventTarget>) => void;
    // onProgress
    onprogress?: (event: ProgressEvent<XMLHttpRequestEventTarget>) => void;
    // 请求开始时触发
    onloadstart?: (event: ProgressEvent<XMLHttpRequestEventTarget>) => void;
    // 请求结束时触发（无论成功失败）
    onloadend?: (event: ProgressEvent<XMLHttpRequestEventTarget>) => void;
    // 当 readyState 属性发生变化时触发
    onreadystatechange?: (event: Event) => void; */
}
