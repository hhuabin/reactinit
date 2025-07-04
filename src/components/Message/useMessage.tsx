import React, { useRef, forwardRef, useImperativeHandle } from 'react'
import type { ForwardedRef } from 'react'

import { wrapPromiseFn } from './utils'
import type { ArgsProps, ConfigOptions, MessageType, MessageInstance, NoticeType, MessageMethods, TypeOpen } from './Message.d'

import useNotification from '@/components/Notification/useNotification'

type HolderProps = ConfigOptions & {
    onAllRemoved?: VoidFunction;
}

interface OpenConfig extends ArgsProps { }

interface HolderRef {
    open: (config: OpenConfig) => void;
    close: (key: React.Key) => void;
    destroy: () => void;
}

const DEFAULT_OFFSET = 8
const DEFAULT_DURATION = 3

let keyIndex = 0

// eslint-disable-next-line react-refresh/only-export-components
const Holder = forwardRef((props: HolderProps, ref: ForwardedRef<HolderRef>) => {
    const {
        top,
        prefixCls: staticPrefixCls,
        getContainer: staticGetContainer,
        maxCount,
        duration = DEFAULT_DURATION,
        rtl,
        transitionName,
        onAllRemoved,
    } = props

    const [api, holder] = useNotification({
        getContainer: staticGetContainer,
        duration,
    })

    useImperativeHandle(ref, () => ({
        ...api,
    }))

    return holder
})

export const useInternalMessage = (messageConfig?: HolderProps): readonly [MessageInstance, React.ReactElement] => {
    const holderRef = useRef<HolderRef>(null)

    const wrapAPI = ((): MessageInstance => {

        const close = (key: React.Key) => {
            holderRef.current?.close(key)
        }

        const open = (config: ArgsProps): MessageType => {
            console.log('useInternalMessage open', config)

            if (!holderRef.current) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const fakeResult: any = () => {}
                fakeResult.then = () => {}
                return fakeResult
            }

            const { key, onClose, ...restConfig } = config
            let mergedKey: React.Key = key!
            if (mergedKey === undefined || mergedKey === null) {
                keyIndex += 1
                mergedKey = `message-${keyIndex}`
            }
            console.warn('useInternalMessage mergedKey', mergedKey)
            // 根据 type 给 message 添加 icon
            /* const TypeContent: React.ReactNode = (<>
                {content}
            </>) */

            return wrapPromiseFn((resolve: VoidFunction) => {
                holderRef.current!.open({
                    ...restConfig,
                    key: mergedKey,
                    onClose: () => {
                        onClose?.()
                        resolve()
                    },
                })

                return () => {
                    close(mergedKey)
                }
            })
        }

        const destroy = (key?: React.Key) => {
            if (key !== undefined) {
                close(key)
            } else {
                holderRef.current?.destroy()
            }
        }

        const clone = {
            open,
            destroy,
        } as MessageInstance

        const keys: NoticeType[] = ['info', 'success', 'warning', 'error', 'loading']
        // 处理 'info', 'success', 'warning', 'error', 'loading'，转接到 open
        keys.forEach(type => {
            const typeOpen: TypeOpen = (jointContent, duration?: number | VoidFunction, onClose?: VoidFunction) => {
                console.log('useInternalMessage typeOpen', jointContent, duration, onClose)

                let config: ArgsProps
                // 判断 jointContent 是 React.ReactNode 还是 ArgsProps
                if (jointContent && typeof jointContent === 'object' && 'content' in jointContent) {
                    // jointContent 是 ArgsProps
                    config = jointContent
                } else {
                    config = {
                        content: jointContent,
                    }
                }
                // 合并配置
                let mergedDuration: number | undefined
                let mergedOnClose: VoidFunction | undefined
                if (typeof duration === 'function') {
                    mergedOnClose = duration
                } else {
                    mergedDuration = duration
                    mergedOnClose = onClose
                }

                return open({
                    onClose: mergedOnClose,
                    duration: mergedDuration,
                    ...config,        // onClose、duration以 config 为准
                    type,
                })
            }

            clone[type] = typeOpen
        })

        return clone
    })()

    return [
        wrapAPI,
        <Holder ref={holderRef} {...messageConfig} />,
    ]
}

const useMessage = (messageConfig?: ConfigOptions) => {
    return useInternalMessage(messageConfig)
}

export default useMessage
