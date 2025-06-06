import type { AxiosPromise, AxiosRequestConfig } from 'axios'

import AxiosRequest from '@/utils/request/AxiosRequest'
import type {
    PublicParam, PublicAnswer,
} from './types'

const axiosRequest = new AxiosRequest().getAxiosInstance()

export const baseRequest = (params: PublicParam, config?: AxiosRequestConfig): AxiosPromise<PublicAnswer> => {
    return axiosRequest({
        url: '/user/postlist',
        method: 'post',
        ...config,
        data: {
            ...params,
        },
    })
}

/**
 * 大文件上传
 * 监控上传进度
 */
export const largeFileUpload = (params: { file: FormData }, config?: AxiosRequestConfig) => {
    return axiosRequest({
        url: 'url',
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
            // 上传进度监控，此处可移至 config 中
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total!)
            console.log(`Upload Progress: ${progress}%`)
        },
        onDownloadProgress: (progressEvent) => {
            // 下载进度监控，此处可移至 config 中
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total!)
            console.log(`Download Progress: ${progress}%`)
        },
        ...config,
        data: params.file,
    })
}
