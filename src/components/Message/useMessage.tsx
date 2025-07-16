/**
 * 参考源码：ant-design/components/message/useMessage.tsx
 */
import React, { useRef, forwardRef, useImperativeHandle } from 'react'
import type { ForwardedRef } from 'react'

import { wrapPromiseFn } from './utils'
import type { ArgsProps, ConfigOptions, MessageType, MessageInstance, NoticeType, MessageMethods, TypeOpen, OpenTask } from './Message.d'

import useNotification from './useNotification'
import type { NotificationsRef } from './useNotification'

type HolderProps = ConfigOptions & {
    onAllRemoved?: VoidFunction;
}

const DEFAULT_OFFSET = 8
const DEFAULT_DURATION = 3000

let keyIndex = 0      // message key

// eslint-disable-next-line react-refresh/only-export-components
const Holder = forwardRef((props: HolderProps, ref: ForwardedRef<NotificationsRef>) => {
    const {
        top,
        prefixCls,
        getContainer,
        maxCount,
        duration = DEFAULT_DURATION,
        rtl,
        transitionName,
        onAllRemoved,
    } = props

    const [notificationAPI, holder] = useNotification({
        getContainer,
        duration,
    })

    useImperativeHandle(ref, () => ({
        ...notificationAPI,    // 只有 open、close、destroy 三个方法
    }))

    return holder
})

/**
 * @description 创建 Message 实例
 * @param { HolderProps } messageConfig message全局配置；默认值：Message.tsx 的 getGlobalContext()
 * @attention message.open() / message.info()... 方法不会给 messageConfig 传值，而是直接调用 useInternalMessage().open()
 * @returns { readonly [MessageInstance, React.ReactElement] }
 */
export const useInternalMessage = (messageConfig?: HolderProps): readonly [MessageInstance, React.ReactElement] => {
    console.log('--------useInternalMessage----------', messageConfig);

    const holderRef = useRef<NotificationsRef>(null)

    const wrapAPI = ((): MessageInstance => {

        const close = (key: React.Key) => {
            holderRef.current?.close(key)
        }

        /**
         * @description 将 open 函数代理到 holderRef.current.open
         * @param { ArgsProps } config 传入 holderRef.current.open() 方法的参数
         * info、success...等方法都代理到 open ，故 ArgsProps 是 holderRef.current.open() 唯一参数类型
         * @returns { MessageType }
         */
        const open = (config: ArgsProps): MessageType => {
            // Holder 未注册成功时，返回一个空函数
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
        // 将 'info', 'success', 'warning', 'error', 'loading'方法，转接到 open
        keys.forEach((type: NoticeType) => {

            clone[type] = (jointContent, duration?: number | VoidFunction, onClose?: VoidFunction) => {

                let config: OpenTask['config']    // 即 ArgsProps
                // 判断 jointContent 是 React.ReactNode 还是 ArgsProps
                if (jointContent && typeof jointContent === 'object' && 'content' in jointContent) {
                    // jointContent 是 ArgsProps
                    config = jointContent
                } else {
                    config = { content: jointContent }
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
                    ...config,        // onClose、duration 以 config 里的为准
                    type,
                })
            }
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
