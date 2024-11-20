import { AxiosPromise, AxiosRequestConfig } from 'axios'

import AxiosRequest from '@/utils/Request/AxiosRequest'
import {
    PublicParam,
    IpublicAnswer,
} from './indexType'

const service = new AxiosRequest().getAxiosInstance()

export const baseRequest = (params: PublicParam, config?: AxiosRequestConfig): AxiosPromise<IpublicAnswer> => {
    return service({
        url: 'url',
        method: 'post',
        ...config,
        data: {
            ...params,
        },
    })
}
