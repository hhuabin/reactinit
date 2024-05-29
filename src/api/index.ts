import { AxiosPromise } from 'axios'

import Axios from '@/utils/Request/request'
import {
	IpublicAnswer,
} from './indexType'

const service = new Axios().getAxiosInstance()

// eslint-disable-next-line
export const baseRequest = (params: any): AxiosPromise<IpublicAnswer> => {
	return service({
		url: 'url',
		data: {
			...params,
		},
		method: 'post',
	})
}
