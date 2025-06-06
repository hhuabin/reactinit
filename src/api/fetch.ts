import FetchRequest from '@/utils/request/FetchRequest'
import type {
    PublicParam, PublicAnswer,
} from './types'

const fetchRequest = new FetchRequest()

export const baseRequest = (params: PublicParam, options?: RequestInit): Promise<PublicAnswer> => {
    return fetchRequest.sendRequest(
        '/user/postlist',
        {
            ...params,
        },
        {
            method: 'POST',
            ...options,
        },
    )
}
