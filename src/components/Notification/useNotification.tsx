import { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import type { ForwardedRef } from 'react'
import { createPortal } from 'react-dom'
import type { NoticeType } from '../Message'
import getIcon from './getIcon'

import './Message.less'

interface NotificationConfig {
    duration?: number;
    getContainer?: () => HTMLElement;
}

interface OpenConfig {
    key: React.Key;
    icon?: React.ReactNode;
    type?: NoticeType;
    content?: React.ReactNode;
    duration?: number | null;
    onClose?: VoidFunction;
}

type OptionalConfig = Partial<OpenConfig>

interface OpenTask {
  type: 'open';
  config: OpenConfig;
}

interface CloseTask {
  type: 'close';
  key: React.Key;
}

interface DestroyTask {
  type: 'destroy';
}

type Task = OpenTask | CloseTask | DestroyTask

interface NotificationAPI {
    open: (config: OptionalConfig) => void;
    close: (key: React.Key) => void;
    destroy: () => void;
}

type NotificationsRef = NotificationAPI

interface NotificationsProps {
    container?: HTMLElement | ShadowRoot;
}

let uniqueKey = 0      // 唯一key

// eslint-disable-next-line react-refresh/only-export-components
const Notifications = forwardRef((props: NotificationsProps, ref: ForwardedRef<NotificationsRef>) => {
    const { container } = props

    const [configList, setConfigList] = useState<OptionalConfig[]>([])

    useImperativeHandle(ref, () => ({
        open: (config) => {
            console.log('Notifications open', config, configList)
            // 添加 config 进入队列
            setConfigList((configList) => {
                const clone = [...configList]

                // Replace if exist
                const configIndex = clone.findIndex((item) => item.key === config.key)
                if (configIndex >= 0) {
                    // configList 存在 config.key
                    clone[configIndex] = { ...config }
                } else {
                    // 添加进入队列
                    clone.push(config)
                }
                console.log('Notifications clone', clone)

                return clone
            })
        },
        close: (key: React.Key) => {
            onNoticeClose(key)
        },
        destroy: () => {
            setConfigList([])
        },
    }))

    const onNoticeClose = (key: React.Key) => {
        const config = configList.find((item) => item.key === key)
        config?.onClose?.()
        setConfigList((list) => list.filter((item) => item.key !== key))
    }

    if (!container) return null


    if (!!configList.length) {
        return createPortal(
            <div className='message'>
                {
                    configList.map((config, index) => (
                        <div className='message-notice-wrapper' key={index}>
                            <div className='message-notice'>
                                <div className='ant-message-notice-content'>
                                    <div className='ant-message-custom-content'>
                                        {
                                            config.icon
                                                ? config.icon
                                                : (
                                                    config.type && <span className='message-icon'>
                                                        { getIcon(config.type) }
                                                    </span>
                                                )
                                        }
                                        <span>{config.content}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>,
            container,
        )
    } else {
        return (<></>)
    }
})

const useNotification = (rootConfig: NotificationConfig = {}): [NotificationAPI, React.ReactElement] => {

    const {
        getContainer = () => document.body,
    } = rootConfig

    const [container, setContainer] = useState<HTMLElement | ShadowRoot>()
    const notificationsRef = useRef<NotificationsRef>(null)
    const [taskQueue, setTaskQueue] = useState<Task[]>([])

    const contextHolder = (
        <Notifications
            container={container}
            ref={notificationsRef}
        ></Notifications>
    )

    useEffect(() => {
        setContainer(getContainer())
    })

    useEffect(() => {
        if (notificationsRef.current && taskQueue.length) {
            taskQueue.forEach((task) => {
                switch (task.type) {
                case 'open':
                    notificationsRef.current!.open(task.config)
                    break
                case 'close':
                    notificationsRef.current!.close(task.key)
                    break

                case 'destroy':
                    notificationsRef.current!.destroy()
                    break
                }
            })
        }
    }, [taskQueue])

    const open: NotificationAPI['open'] = (config) => {
        console.log('useNotification open', config)

        let mergedKey: React.Key = config.key || ''
        if (!mergedKey) {
            mergedKey = `notification-${uniqueKey}`
            uniqueKey += 1
        }
        const mergedConfig: OpenConfig = { ...config, key: mergedKey }

        setTaskQueue((queue) => [...queue, { type: 'open', config: mergedConfig }])
    }

    const api = {
        open,
        close: (key: React.Key) => {
            notificationsRef.current?.close(key)
        },
        destroy: () => {
            notificationsRef.current?.destroy()
        },
    }

    return [api, contextHolder]
}

export default useNotification
