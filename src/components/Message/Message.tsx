import { createPortal } from 'react-dom'

import style from './Message.module.less'
import type { ArgsProps, NoticeType, MessageMethods, JointContent, MessageType, TypeOpen } from './Message.d'
import { getIcon } from './getIcon'
import { wrapPromiseFn } from './utils'

const messageContent = (noticeType: NoticeType = 'info', messages:  ArgsProps[]) => (
    <div className={style.message}>
        {
            messages.map((message, index) => (
                <div className={style['message-notice-wrapper']} key={index}>
                    <div className={style['message-notice']}>
                        <div className={style['ant-message-notice-content']}>
                            <div className={style['ant-message-custom-content']}>
                                <span className={style['message-icon']}>
                                    { getIcon(noticeType) }
                                </span>
                                <span>{message.content}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))
        }
    </div>
)

const info: TypeOpen = (content: JointContent, duration?: number | VoidFunction, onClose?: VoidFunction) => {
    /**
     * @description 将需要执行的代码，放入 Promise 中，同时提供 Promise 的 Fulfilled（成功）状态出口方法 resolve()
     *  1. 只需要调用 resolve() 即可触发 Promise 的 Fulfilled 状态
     *  2. 将 result 的 then() 方法改写为 Promise 的 then() 方法
     *  3. 返回的可执行函数中需要包含 resolve() 方法，作为 wrapPromiseFn 的出口函数
     */
    const result: MessageType = wrapPromiseFn((resolve: VoidFunction) => {
        const task = {
            resolve,
        }
        // 默认 3s 关闭
        setTimeout(() => {
            resolve()
        }, 3000)
        // 返回函数用于关闭info
        return () => {
            onClose?.()
            resolve()
        }
    })
    return result
}
const success = (): MessageType => {
    const result = wrapPromiseFn(resolve => {
        const task = {
            resolve,
        }
        return () => {
            resolve()
        }
    })
    return result
}
const error = (): MessageType => {
    const result = wrapPromiseFn(resolve => {
        const task = {
            resolve,
        }
        return () => {
            resolve()
        }
    })
    return result
}
const warning = (): MessageType => {
    const fn = function () {
    }
    fn.then = Promise.prototype.then.bind(fn)
    return fn
}
const loading = (): MessageType => {
    let resolveFn: ((value: boolean) => void) | null = null
    const promise = new Promise<boolean>((resolve) => {
        resolveFn = resolve
    })
    const messageFunc = function () {
        console.log('消息已关闭')
        resolveFn?.(true) // 调用者执行 msg() 后，我们将 promise resolve 掉
    }

    messageFunc.then = promise.then.bind(promise)

    return messageFunc
}

const messageInstance: MessageMethods = {
    info,
    success,
    error,
    warning,
    loading,
}

export default messageInstance
