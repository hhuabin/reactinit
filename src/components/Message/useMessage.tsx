import { wrapPromiseFn } from './utils'
import type { ArgsProps, MessageType, MessageInstance } from './Message.d'

export const useInternalMessage = (): readonly [MessageInstance, React.ReactElement] => {

    const wrapAPI = ((): MessageInstance => {
        const open = (config: ArgsProps): MessageType => {
            return wrapPromiseFn((resolve: VoidFunction) => {
                return () => {

                }
            })
        }

        const destroy = (key?: React.Key) => {

        }

        const clone = {
            open,
            destroy,
        } as MessageInstance

        return clone
    })()

    return [
        wrapAPI,
        <div key="message" />,
    ]
}

const useMessage = () => {
    return useInternalMessage()
}

export default useMessage
