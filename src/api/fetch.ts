import FetchRequest from "@/utils/Request/FetchRequest"

const fetchRequest = new FetchRequest()
import {
	PublicParam,
	IpublicAnswer,
} from './indexType'

export const baseRequest = (params: PublicParam, options?: RequestInit): Promise<IpublicAnswer> => {
	return fetchRequest.sendRequest(
		"http://localhost:5000/user/postlist",
		{
			...params,
		},
		{
			method: 'POST',
			...options,
		}
	)
}