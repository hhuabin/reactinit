import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { createRoot } from 'react-dom/client'
import type { ForwardedRef } from 'react'

import ConfigProvider from '@/components/ConfigProvider/ConfigProvider'

import style from './Message.module.less'
import type {
    NoticeType, ConfigOptions, GlobalMessage, ArgsProps, OpenTask, TypeTask, Task, MessageMethods, JointContent,
    MessageType, TypeOpen, MessageInstance, BaseMethods,
} from './Message.d'
import { getIcon } from './getIcon'
import useMessage, { useInternalMessage } from './useMessage'
import { unstableSetRender } from './reactRender'
import { wrapPromiseFn } from './utils'

interface GlobalHolderRef {
    instance: MessageInstance;
    sync: () => void;
}

let message: GlobalMessage | null = null

// 需要维护的消息队列
// eslint-disable-next-line prefer-const
let taskQueue: Task[] = []
let defaultGlobalConfig: ConfigOptions = {}

// 获取全局配置
const getGlobalContext = () => {
    const { getContainer, duration, rtl, maxCount, top } = defaultGlobalConfig
    const mergedContainer = getContainer?.() || document.body
    return { getContainer: () => mergedContainer, duration, rtl, maxCount, top }
}

// eslint-disable-next-line react-refresh/only-export-components
const GlobalHolder = forwardRef((props, ref: ForwardedRef<GlobalHolderRef>) => {
    const { messageConfig, sync } = props

    // 获取 Message 唯一实例
    const [api, holder] = useInternalMessage()

    useImperativeHandle(ref, () => {
        const instance = { ...api }
        return {
            instance,
            sync: () => { },
        }
    })

    return holder
})

// eslint-disable-next-line react-refresh/only-export-components
const GlobalHolderWrapper = forwardRef((props, ref: ForwardedRef<GlobalHolderRef>) => {
    const [messageConfig, setMessageConfig] = useState(getGlobalContext)

    const sync = () => { setMessageConfig(getGlobalContext) }

    const dom = React.createElement(GlobalHolder, {
        ref,
        sync,
        messageConfig,
    })

    return (
        <ConfigProvider theme='dark'>
            { dom }
        </ConfigProvider>
    )
})

const messageList = (messages: ArgsProps[]) => (
    <>
        {
            messages.map((message, index) => (
                <div className={style['message-notice-wrapper']} key={index}>
                    <div className={style['message-notice']}>
                        <div className={style['ant-message-notice-content']}>
                            <div className={style['ant-message-custom-content']}>
                                <span className={style['message-icon']}>
                                    {getIcon(message.type)}
                                </span>
                                <span>{message.content}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))
        }
    </>
)

const render = (messages: ArgsProps[]) => {
    const holderFragment = document.createDocumentFragment()
    const container = document.createElement('div')
    container.className = style['message']
    holderFragment.appendChild(container)
    document.body.appendChild(holderFragment)

    const root = createRoot(container)
    root.render(messageList(messages))

    return {
        render: root.render,
        unmount: root.unmount,
    }
}

// 刷新提示列表
const flushNotice = () => {
    // 如果此时 message 还没有挂载，挂载 message 最外层
    if (!message) {
        const holderFragment = document.createDocumentFragment()
        message = {
            fragment: holderFragment,
        }

        const reactRender = unstableSetRender()

        // TODO 写入 message.instance
        reactRender(<GlobalHolderWrapper ref={(node) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const { instance, sync } = node || {}

            // React 18 test env will throw if call immediately in ref
            if (!message!.instance && instance) {
                message!.instance = instance
                message!.sync = sync
                flushNotice()
            }
        }} />, holderFragment)
        /* reactRender(<div className={style['message']}>
            <div className={style['message-notice-wrapper']}>
                <div className={style['message-notice']}>
                    <div className={style['ant-message-notice-content']}>
                        <div className={style['ant-message-custom-content']}>
                            <span className={style['message-icon']}>
                                {getIcon('success')}
                            </span>
                            <span>nihao</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>, holderFragment) */

        return
    }

    if (!message.instance) return

    // 循环队列，渲染提示
    taskQueue.forEach(task => {
        const { type, skipped } = task
        // 当用户不跳过提示时，进行渲染
        if (!skipped) {
            switch (task.type) {
            case 'open': {
                const closeFn = message!.instance!.open({
                    // ...defaultGlobalConfig,
                    ...task.config,
                })
                closeFn?.then(task.resolve)
                task.setCloseFn(closeFn)
                break
            }
            case 'destroy': {
                message?.instance!.destroy(task.key)
                break
            }
            default: {
                const closeFn = message!.instance![type as NoticeType](...task.args)

                closeFn?.then(task.resolve)
                task.setCloseFn(closeFn)
            }
            }
        }
    })
}

// 设置全局配置
const setMessageGlobalConfig = (config: ConfigOptions) => {
    // 自定义全局配置
    defaultGlobalConfig = { ...defaultGlobalConfig, ...config }
    // Trigger sync for it
    message?.sync?.()
}

const open = (config: ArgsProps): MessageType => {
    const result: MessageType = wrapPromiseFn((resolve: VoidFunction) => {
        let closeFn: VoidFunction

        const task: OpenTask = {
            type: 'open',
            config,
            resolve,
            setCloseFn: (fn) => {
                closeFn = fn
            },
        }
        taskQueue.push(task)

        // 返回函数用于关闭info
        return () => {
            if (closeFn) {
                // 执行关闭函数
                closeFn()
            } else {
                /**
                 * 没有关闭函数时：message 还没真正挂载完成（比如还在队列中）
                 * 此时在未来跳过其渲染
                 */
                task.skipped = true
            }
        }
    })

    // 刷新队列
    flushNotice()

    return result
}

const typeOpen = (type: NoticeType, args: Parameters<TypeOpen>): MessageType => {
    /**
     * @description 将需要执行的代码，放入 Promise 中，同时提供 Promise 的 Fulfilled（成功）状态出口方法 resolve()
     *  1. 只需要调用 resolve() 即可触发 Promise 的 Fulfilled 状态
     *  2. 将 result 的 then() 方法改写为 Promise 的 then() 方法
     *  3. 返回的可执行函数中需要包含 resolve() 方法，作为 wrapPromiseFn 的出口函数
     */
    const result: MessageType = wrapPromiseFn((resolve: VoidFunction) => {
        let closeFn: VoidFunction

        const task: TypeTask = {
            type,
            args,
            resolve,
            setCloseFn: (fn) => {
                closeFn = fn
            },
        }
        taskQueue.push(task)

        // 默认 3s 关闭
        /* setTimeout(() => {
            resolve()
        }, 3000) */
        // 返回函数用于关闭info
        return () => {
            if (closeFn) {
                // 执行关闭函数
                closeFn()
            } else {
                /**
                 * 没有关闭函数时：message 还没真正挂载完成（比如还在队列中）
                 * 此时在未来跳过其渲染
                 */
                task.skipped = true
            }
        }
    })

    // 刷新队列
    flushNotice()

    return result
}

const destroy: BaseMethods['destroy'] = (key) => {
    taskQueue.push({
        type: 'destroy',
        key,
    })
    flushNotice()
}

const baseStaticMethods: BaseMethods = {
    open,
    destroy,
    config: setMessageGlobalConfig,
    useMessage,
}

const methods: (keyof MessageMethods)[] = ['success', 'info', 'warning', 'error', 'loading']

const messageMethods: MessageMethods = methods.reduce((prev, type) => {
    // 给 'success', 'info'... 等键添加 typeOpen 方法
    prev[type] = ((...args: Parameters<TypeOpen>) => typeOpen(type, args)) as TypeOpen
    return prev
}, {} as MessageMethods)

const staticMethods = { ...baseStaticMethods, ...messageMethods }

export default staticMethods
